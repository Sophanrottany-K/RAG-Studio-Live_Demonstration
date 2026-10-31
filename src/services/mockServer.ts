// In-browser stand-in for the RAG Studio backend, used when VITE_API_URL is not set.
// It answers the same endpoints as the real API (see api.ts), with network latency,
// server-side validation, upload progress and background document processing.
// State lives in localStorage so a created chatbot survives a page reload.
import {
  ALLOWED_DOMAINS_MAX,
  DESCRIPTION_MAX,
  FILE_MAX_BYTES,
  INSTRUCTIONS_MAX,
  NAME_MAX,
  NAME_MIN,
  SOURCES_MAX,
  STARTER_QUESTIONS_MAX,
  LINK_TITLE_MAX,
  WELCOME_MESSAGE_MAX,
  fileTypeOf,
  isHexColor,
  isTelegramToken,
  normalizeDomain,
  normalizeUrl,
} from "./limits";
import {
  ApiError,
  type Chatbot,
  type AddDocumentsRequest,
  type ChatAnswer,
  type ChatSource,
  type ChatbotChannels,
  type ChatbotDocument,
  type CreateChatbotRequest,
  type DocumentOriginal,
  type AnalyticsChannel,
  type AnalyticsGranularity,
  type ModelCatalog,
  type PublicChat,
  type SavePublicLinkRequest,
  type SaveWidgetRequest,
  type UploadedFile,
  type UrlPreview,
  type WidgetChat,
  type WidgetEmbed,
} from "./types";
import { DEMO_DOCUMENTS } from "./demoDocuments";
import { HR_DOCUMENTS, loadSeedFile } from "./hrDocuments";
import { fileStore } from "./documentStore";
import { extractText } from "./extractText";
import { computeAnalytics, computeUnanswered, type ChatEvent } from "./mockAnalytics";
import { siteStorage } from "./siteStorage";

const DB_KEY = "rag-studio-mock-db";

const MODELS: ModelCatalog = {
  chat: [
    {
      id: "qwen3:8b",
      label: "qwen3:8b",
      provider: "Ollama · self-hosted",
      description: "Fast, multilingual, good default",
      isDefault: true,
    },
    {
      id: "llama3.1:8b",
      label: "llama3.1:8b",
      provider: "Ollama · self-hosted",
      description: "Strong English reasoning",
    },
    {
      id: "gemma3:12b",
      label: "gemma3:12b",
      provider: "Ollama · self-hosted",
      description: "Longer, more detailed answers",
    },
    {
      id: "mistral-nemo:12b",
      label: "mistral-nemo:12b",
      provider: "Ollama · self-hosted",
      description: "128K context window",
    },
  ],
  embedding: [
    {
      id: "bge-m3",
      label: "bge-m3 (multilingual)",
      provider: "Ollama · self-hosted",
      description: "100+ languages incl. Khmer",
      isDefault: true,
    },
    {
      id: "nomic-embed-text",
      label: "nomic-embed-text",
      provider: "Ollama · self-hosted",
      description: "English, smaller index",
    },
  ],
};

// Per-document processing timeline, kept server-side only.
type StoredDocument = Omit<ChatbotDocument, "status"> & { startsAt: number; readyAt: number };
type StoredChatbot = Omit<Chatbot, "documents" | "status"> & {
  documents: StoredDocument[];
  /** Set by publish; pause/resume flips it. Unpublished chatbots derive draft/pending from their documents. */
  published?: "active" | "paused";
};
type Db = {
  chatbots: StoredChatbot[];
  uploads: Record<string, UploadedFile>;
  channels: Record<string, ChatbotChannels>;
  /** Chat log behind GET /analytics; the newest CHAT_LOG_MAX questions are kept. */
  events: ChatEvent[];
};
const CHAT_LOG_MAX = 5000;

/** The chatbot shown on the original demo screens. It is always present, already published. */
export const DEMO_CHATBOT_ID = "demo_billing";

const demoStoredDocuments = (): StoredDocument[] =>
  DEMO_DOCUMENTS.map(({ id, name, type, sizeBytes }) => ({
    id,
    kind: "file",
    name,
    type,
    sizeBytes,
    startsAt: 0,
    readyAt: 0,
  }));

const isDemoDocument = (docId: string) => docId.startsWith("doc_demo_");

/** A second built-in chatbot whose knowledge base is real files (see hrDocuments.ts). */
export const HR_CHATBOT_ID = "demo_hr";

const hrStoredDocuments = (): StoredDocument[] =>
  HR_DOCUMENTS.map(({ id, name, type, sizeBytes }) => ({
    id,
    kind: "file",
    name,
    type,
    sizeBytes,
    startsAt: 0,
    readyAt: 0,
  }));

function hrChatbot(): StoredChatbot {
  const created = "2026-10-20T09:00:00.000Z";
  return {
    id: HR_CHATBOT_ID,
    name: "HR Assistant",
    description: "Answers employee questions about leave, pay, benefits and remote work from the HR policies.",
    createdAt: created,
    updatedAt: created,
    published: "active",
    channels: [],
    settings: {
      chatModel: "qwen3:8b",
      embeddingModel: "bge-m3",
      instructions:
        "You are the HR assistant for Northwind employees. Answer only from the HR policy documents, keep answers short and cite the policy.",
      tone: "Friendly",
      answerLength: "Concise",
      formatting: "Rich text",
      language: "Auto-detect",
      starterQuestions: ["How many days of annual leave do I get?", "When is payday?", "Can I work from home?"],
      sourceVisibility: "Full document",
      advanced: {
        temperature: 0.3,
        topK: 5,
        searchMode: "Hybrid",
        chunkSize: 500,
        chunkOverlap: 50,
        documentsOnly: true,
      },
    },
    documents: hrStoredDocuments(),
  };
}

/**
 * The HR seed documents are loaded and read once, then kept in the file store like an upload.
 * Returns what is stored, or null if the file can't be loaded.
 */
async function ensureSeedFile(docId: string) {
  const seed = HR_DOCUMENTS.find((d) => d.id === docId);
  const stored = await fileStore.get(docId);
  if (stored || !seed) return stored;
  try {
    const blob = await loadSeedFile(seed);
    if (!blob.size) return null;
    const entry = { blob, text: await extractText(blob, seed.type) };
    await fileStore.put(docId, entry);
    return entry;
  } catch {
    return null;
  }
}

function demoChatbot(): StoredChatbot {
  const created = "2026-10-22T09:00:00.000Z";
  return {
    id: DEMO_CHATBOT_ID,
    name: "Billing Assistant",
    description: "Answers billing, refund and account questions using your help-center documents.",
    createdAt: created,
    updatedAt: created,
    published: "active",
    channels: [],
    settings: {
      chatModel: "qwen3:8b",
      embeddingModel: "bge-m3",
      instructions:
        "You are the billing support assistant. Answer only from the provided documents, keep answers short and cite the source.",
      tone: "Professional",
      answerLength: "Concise",
      formatting: "Rich text",
      language: "Auto-detect",
      starterQuestions: ["What is the refund policy?", "How do I reset my password?", "What plans do you offer?"],
      sourceVisibility: "Name only",
      advanced: {
        temperature: 0.4,
        topK: 5,
        searchMode: "Hybrid",
        chunkSize: 500,
        chunkOverlap: 50,
        documentsOnly: true,
      },
    },
    documents: demoStoredDocuments(),
  };
}

function loadDb(): Db {
  let db: Db = { chatbots: [], uploads: {}, channels: {}, events: [] };
  try {
    const raw = siteStorage.local.getItem(DB_KEY);
    if (raw) db = { ...db, ...(JSON.parse(raw) as Partial<Db>) };
  } catch {
    // storage unavailable or corrupt: start empty
  }
  const demo = db.chatbots.find((c) => c.id === DEMO_CHATBOT_ID);
  if (!demo) db.chatbots.push(demoChatbot());
  // Keep the built-in documents current; documents the owner added stay as they are.
  else demo.documents = [...demoStoredDocuments(), ...demo.documents.filter((d) => !isDemoDocument(d.id))];
  const hr = db.chatbots.find((c) => c.id === HR_CHATBOT_ID);
  if (!hr) db.chatbots.push(hrChatbot());
  else hr.documents = [...hrStoredDocuments(), ...hr.documents.filter((d) => !isDemoDocument(d.id))];
  return db;
}

/**
 * Calls `listener` when another tab changes the mock data (the browser fires `storage` only in the
 * other tabs). Stands in for the push a real server would send; returns an unsubscribe function.
 */
export function onMockChange(listener: () => void) {
  const handler = (e: StorageEvent) => {
    if (e.key === DB_KEY || e.key === null) listener();
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

function saveDb(db: Db) {
  try {
    siteStorage.local.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    // storage unavailable: data lives for this page load only
  }
}

const id = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

function latency(signal?: AbortSignal, min = 250, max = 650) {
  return new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, min + Math.random() * (max - min));
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("Request aborted", "AbortError"));
    });
  });
}

function toChatbot(stored: StoredChatbot, now = Date.now()): Chatbot {
  const documents: ChatbotDocument[] = stored.documents.map(({ startsAt, readyAt, ...doc }) => ({
    ...doc,
    status: now < startsAt ? "queued" : now < readyAt ? "processing" : "ready",
  }));
  const allReady = documents.length > 0 && documents.every((d) => d.status === "ready");
  const { published, ...rest } = stored;
  return { ...rest, documents, status: published ?? (allReady ? "pending" : "draft") };
}

function previewUrl(text: string): UrlPreview {
  const url = normalizeUrl(text);
  if (!url) throw new ApiError("Enter a full link, like https://help.example.com/page.", 422, "invalid_url", "url");
  const parsed = new URL(url);
  if (/(^|\.)(localhost|invalid|internal|local)$/.test(parsed.hostname)) {
    throw new ApiError("We couldn't reach this page. Check that it's public.", 422, "unreachable", "url");
  }
  if (/\b404\b|not-found/.test(parsed.pathname)) {
    throw new ApiError("This page returned 404 Not Found.", 422, "not_found", "url");
  }
  const slug = parsed.pathname.split("/").filter(Boolean).pop() ?? "";
  const words = slug
    .replace(/\.[a-z]+$/i, "")
    .split(/[-_]+/)
    .filter(Boolean);
  const title = words.length ? words.map((w) => w[0].toUpperCase() + w.slice(1)).join(" ") : "Home";
  return { url, host: parsed.hostname, title };
}

/**
 * Turns uploads and URLs into documents that the ingestion worker processes one after another,
 * starting after `startAfter` (a timestamp). Returns the stored files to re-key to the new documents.
 */
function queueSources(db: Db, uploadIds: string[], urls: string[], startAfter: number) {
  let cursor = Math.max(Date.now(), startAfter) + 1200;
  const documents: StoredDocument[] = [];
  const moves: [string, string][] = [];
  const queue = (doc: Omit<StoredDocument, "startsAt" | "readyAt">, workMs: number) => {
    documents.push({ ...doc, startsAt: cursor, readyAt: cursor + workMs });
    cursor += workMs;
  };
  for (const uploadId of uploadIds) {
    const upload = db.uploads[uploadId];
    if (!upload)
      throw new ApiError("An uploaded file expired. Please upload it again.", 410, "upload_expired", "sources");
    const docId = id("doc");
    queue(
      { id: docId, kind: "file", name: upload.name, type: upload.type, sizeBytes: upload.sizeBytes },
      2500 + Math.min(upload.sizeBytes / 2000, 6000),
    );
    moves.push([uploadId, docId]);
    delete db.uploads[uploadId];
  }
  for (const url of urls) {
    const preview = previewUrl(url);
    queue(
      {
        id: id("doc"),
        kind: "url",
        name: `${preview.host}${new URL(preview.url).pathname.replace(/\/$/, "")}`,
        type: "Web page",
        sizeBytes: null,
      },
      3000,
    );
  }
  return { documents, moves };
}

async function createChatbot(body: CreateChatbotRequest): Promise<Chatbot> {
  const db = loadDb();
  const name = body.name.trim();
  if (name.length < NAME_MIN || name.length > NAME_MAX)
    throw new ApiError(`Name must be ${NAME_MIN}–${NAME_MAX} characters.`, 422, "invalid", "name");
  if (body.description.length > DESCRIPTION_MAX)
    throw new ApiError("Description is too long.", 422, "invalid", "description");
  const { settings } = body;
  if (!MODELS.chat.some((m) => m.id === settings.chatModel))
    throw new ApiError("This chat model is not enabled.", 422, "invalid", "chatModel");
  if (!MODELS.embedding.some((m) => m.id === settings.embeddingModel))
    throw new ApiError("This embedding model is not enabled.", 422, "invalid", "embeddingModel");
  if (!settings.instructions.trim() || settings.instructions.length > INSTRUCTIONS_MAX)
    throw new ApiError("System instructions are required.", 422, "invalid", "instructions");
  if (settings.starterQuestions.length > STARTER_QUESTIONS_MAX)
    throw new ApiError("Too many starter questions.", 422, "invalid", "starterQuestions");
  if (body.uploadIds.length + body.urls.length > SOURCES_MAX)
    throw new ApiError(`At most ${SOURCES_MAX} sources per chatbot.`, 422, "invalid", "sources");

  const now = Date.now();
  const { documents, moves } = queueSources(db, body.uploadIds, body.urls, now);
  await Promise.all(moves.map(([from, to]) => fileStore.move(from, to)));

  const timestamp = new Date(now).toISOString();
  const stored: StoredChatbot = {
    id: id("bot"),
    name,
    description: body.description.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
    settings,
    documents,
    channels: [],
  };
  db.chatbots.unshift(stored);
  saveDb(db);
  return toChatbot(stored, now);
}

// ---- Channels -------------------------------------------------------------------------

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24)
    .replace(/-$/, "") || "chat";

const newLinkUrl = (name: string) =>
  `${location.origin}${location.pathname}#/s/${slugify(name)}-${Math.random().toString(36).slice(2, 8)}`;

function defaultChannels(chatbotId: string, name: string): ChatbotChannels {
  return {
    chatbotId,
    publicLink: {
      configured: false,
      enabled: false,
      title: name,
      expiresAt: null,
      themeColor: "#111111",
      url: null,
      updatedAt: null,
      messagesThisWeek: 0,
    },
    widget: {
      configured: false,
      enabled: false,
      primaryColor: "#111111",
      position: "bottom-right",
      welcomeMessage: "Hi! Ask me anything about our help center.",
      allowedDomains: [],
      embedCode: null,
      updatedAt: null,
      messagesThisWeek: 0,
    },
    telegram: { connected: false, botUsername: null, tokenHint: null, connectedAt: null, messagesThisWeek: 0 },
  };
}

/** Reads (and optionally changes) one chatbot's channels, keeping the chatbot's channel list in sync. */
function withChannels(chatbotId: string, change?: (c: ChatbotChannels, name: string) => void): ChatbotChannels {
  const db = loadDb();
  const bot = db.chatbots.find((b) => b.id === chatbotId);
  if (!bot) throw new ApiError("Chatbot not found.", 404, "not_found");
  const name = bot.name;
  const channels = db.channels[chatbotId] ?? defaultChannels(chatbotId, name);
  // Widgets generated before widget.js existed still carry the placeholder CDN address.
  if (channels.widget.embedCode?.includes("cdn.ragstudio.app"))
    channels.widget.embedCode = widgetSnippet(chatbotId, channels.widget);
  if (change) {
    change(channels, name);
    db.channels[chatbotId] = channels;
    bot.channels = [
      channels.publicLink.enabled && "Public link",
      channels.widget.enabled && "Web widget",
      channels.telegram.connected && "Telegram",
    ].filter(Boolean) as string[];
    bot.updatedAt = new Date().toISOString();
    saveDb(db);
  }
  return channels;
}

function savePublicLink(chatbotId: string, body: SavePublicLinkRequest) {
  const title = body.title.trim();
  if (!title || title.length > LINK_TITLE_MAX)
    throw new ApiError(`Page title must be 1–${LINK_TITLE_MAX} characters.`, 422, "invalid", "title");
  if (!isHexColor(body.themeColor)) throw new ApiError("Use a hex color like #111111.", 422, "invalid", "themeColor");
  if (body.expiresAt && new Date(body.expiresAt).getTime() <= Date.now())
    throw new ApiError("Pick an expiry date in the future.", 422, "invalid", "expiresAt");
  return withChannels(chatbotId, (c, name) => {
    const first = !c.publicLink.configured;
    c.publicLink = {
      ...c.publicLink,
      title,
      expiresAt: body.expiresAt,
      themeColor: body.themeColor,
      configured: true,
      // A brand-new link goes live right away; later saves keep the on/off state.
      enabled: first ? true : c.publicLink.enabled,
      url: c.publicLink.url ?? newLinkUrl(name),
      updatedAt: new Date().toISOString(),
    };
  });
}

function saveWidget(chatbotId: string, body: SaveWidgetRequest) {
  if (!isHexColor(body.primaryColor))
    throw new ApiError("Use a hex color like #111111.", 422, "invalid", "primaryColor");
  if (body.welcomeMessage.length > WELCOME_MESSAGE_MAX)
    throw new ApiError("Welcome message is too long.", 422, "invalid", "welcomeMessage");
  const domains = body.allowedDomains.map(normalizeDomain);
  if (!domains.length) throw new ApiError("Add at least one allowed domain.", 422, "invalid", "allowedDomains");
  if (domains.some((d) => !d)) throw new ApiError("One of the domains is not valid.", 422, "invalid", "allowedDomains");
  if (domains.length > ALLOWED_DOMAINS_MAX)
    throw new ApiError(`At most ${ALLOWED_DOMAINS_MAX} domains.`, 422, "invalid", "allowedDomains");
  const settings: SaveWidgetRequest = {
    primaryColor: body.primaryColor,
    position: body.position,
    welcomeMessage: body.welcomeMessage.trim(),
    allowedDomains: [...new Set(domains as string[])],
  };
  return withChannels(chatbotId, (c) => {
    const first = !c.widget.configured;
    c.widget = {
      ...c.widget,
      ...settings,
      configured: true,
      enabled: first ? true : c.widget.enabled,
      embedCode: widgetSnippet(chatbotId, settings),
      updatedAt: new Date().toISOString(),
    };
  });
}

const escapeAttr = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * The loader is public/widget.js, served by this app, so the snippet points at wherever the app runs. It also
 * carries the widget settings: on another site the widget's iframe gets its own (empty) browser storage, so
 * it can't read what was saved here and falls back to these (see `findWidget`).
 */
const widgetSnippet = (chatbotId: string, w: WidgetEmbed) =>
  `<script src="${location.origin}${location.pathname.replace(/[^/]*$/, "")}widget.js"\n` +
  `  data-chatbot-id="${chatbotId}"\n` +
  `  data-color="${escapeAttr(w.primaryColor)}" data-position="${w.position}"\n` +
  `  data-welcome="${escapeAttr(w.welcomeMessage)}"\n` +
  `  data-domains="${escapeAttr(w.allowedDomains.join(","))}" async></script>`;

/** The settings from the embed code, checked like a save; null when missing or not valid. */
function embeddedWidget(embed?: Partial<WidgetEmbed>): WidgetEmbed | null {
  if (!embed?.primaryColor || !isHexColor(embed.primaryColor)) return null;
  const domains = (embed.allowedDomains ?? []).map(normalizeDomain);
  if (!domains.length || domains.some((d) => !d)) return null;
  return {
    primaryColor: embed.primaryColor,
    position: embed.position === "bottom-left" ? "bottom-left" : "bottom-right",
    welcomeMessage: (embed.welcomeMessage ?? "").slice(0, WELCOME_MESSAGE_MAX),
    allowedDomains: domains as string[],
  };
}

/** Whether the site at `host` (e.g. "localhost:3000", "shop.example.com") is one of the allowed domains. */
function hostAllowed(host: string, allowed: string[]) {
  const full = host.toLowerCase();
  const name = full.replace(/:\d+$/, "");
  return allowed.some((d) =>
    d.startsWith("*.") ? name === d.slice(2) || name.endsWith(d.slice(1)) : d === full || d === name,
  );
}

function findWidget(chatbotId: string, host: string, embed?: Partial<WidgetEmbed>) {
  const db = loadDb();
  const stored = db.chatbots.find((b) => b.id === chatbotId);
  if (!stored) throw new ApiError("Chatbot not found.", 404, "not_found");
  const bot = toChatbot(stored);
  let widget = (db.channels[chatbotId] ?? defaultChannels(chatbotId, bot.name)).widget;
  // Saved settings win (same browser storage, e.g. a test site on localhost); otherwise use the embed code's.
  const embedded = !widget.configured && embeddedWidget(embed);
  if (embedded) widget = { ...widget, ...embedded, configured: true, enabled: true };
  const reason: WidgetChat["reason"] = !widget.configured
    ? "not_configured"
    : !widget.enabled
      ? "disabled"
      : !hostAllowed(host, widget.allowedDomains)
        ? "domain_not_allowed"
        : bot.status === "paused"
          ? "paused"
          : bot.status !== "active"
            ? "not_published"
            : undefined;
  const chat: WidgetChat = {
    chatbotName: bot.name,
    primaryColor: widget.primaryColor,
    position: widget.position,
    welcomeMessage: widget.welcomeMessage,
    starterQuestions: bot.settings.starterQuestions,
    sourceVisibility: bot.settings.sourceVisibility,
    available: !reason,
    ...(reason && { reason }),
  };
  return { bot, chat };
}

function connectTelegram(chatbotId: string, token: string) {
  const trimmed = token.trim();
  if (!isTelegramToken(trimmed))
    throw new ApiError(
      "This doesn't look like a bot token. It should look like 123456789:AAH…",
      422,
      "invalid",
      "token",
    );
  // Mock rule: bot ids starting with 000 stand in for tokens Telegram rejects (revoked or mistyped).
  if (trimmed.startsWith("000"))
    throw new ApiError(
      "Telegram rejected this token. Copy it again from @BotFather.",
      401,
      "telegram_unauthorized",
      "token",
    );
  return withChannels(chatbotId, (c, name) => {
    c.telegram = {
      connected: true,
      botUsername: `@${slugify(name).replace(/-/g, "_")}_bot`,
      tokenHint: trimmed.slice(-4),
      connectedAt: new Date().toISOString(),
      messagesThisWeek: 0,
    };
  });
}

function channelsRoute(method: string, chatbotId: string, rest: string, body: unknown) {
  const route = `${method} ${rest}`;
  if (route === "GET ") return withChannels(chatbotId);
  if (route === "PUT /public-link") return savePublicLink(chatbotId, body as SavePublicLinkRequest);
  if (route === "POST /public-link/regenerate")
    return withChannels(chatbotId, (c, name) => {
      if (!c.publicLink.configured) throw new ApiError("Save the link settings first.", 409, "not_configured");
      c.publicLink.url = newLinkUrl(name);
      c.publicLink.updatedAt = new Date().toISOString();
    });
  if (route === "PUT /widget") return saveWidget(chatbotId, body as SaveWidgetRequest);
  const toggle = route.match(/^PATCH \/(public-link|widget)$/);
  if (toggle)
    return withChannels(chatbotId, (c) => {
      const channel = toggle[1] === "widget" ? c.widget : c.publicLink;
      if (!channel.configured) throw new ApiError("Save the settings first.", 409, "not_configured");
      channel.enabled = (body as { enabled: boolean }).enabled;
      channel.updatedAt = new Date().toISOString();
    });
  if (route === "POST /telegram") return connectTelegram(chatbotId, (body as { token: string }).token);
  if (route === "DELETE /telegram")
    return withChannels(chatbotId, (c) => {
      c.telegram = { connected: false, botUsername: null, tokenHint: null, connectedAt: null, messagesThisWeek: 0 };
    });
  return null;
}

// ---- Lifecycle and chat ---------------------------------------------------------------

function updateChatbot(chatbotId: string, change: (bot: StoredChatbot, current: Chatbot) => void) {
  const db = loadDb();
  const bot = db.chatbots.find((b) => b.id === chatbotId);
  if (!bot) throw new ApiError("Chatbot not found.", 404, "not_found");
  change(bot, toChatbot(bot));
  bot.updatedAt = new Date().toISOString();
  saveDb(db);
  return toChatbot(bot);
}

const publishChatbot = (chatbotId: string) =>
  updateChatbot(chatbotId, (bot, current) => {
    if (current.status === "draft")
      throw new ApiError("Wait until every document is ready, then publish.", 409, "documents_processing");
    if (current.status !== "pending")
      throw new ApiError("This chatbot is already published.", 409, "already_published");
    bot.published = "active";
  });

const setChatbotStatus = (chatbotId: string, status: unknown) =>
  updateChatbot(chatbotId, (bot) => {
    if (status !== "active" && status !== "paused")
      throw new ApiError("Status must be active or paused.", 422, "invalid", "status");
    if (!bot.published) throw new ApiError("Publish the chatbot first.", 409, "not_published");
    bot.published = status;
  });

/** Renames a chatbot or changes its description; the same rules as when it was created. */
const editChatbotDetails = (chatbotId: string, body: { name?: unknown; description?: unknown }) =>
  updateChatbot(chatbotId, (bot) => {
    if (typeof body.name !== "string" || typeof body.description !== "string")
      throw new ApiError("Send a name and a description.", 422, "invalid");
    const name = body.name.trim();
    if (name.length < NAME_MIN || name.length > NAME_MAX)
      throw new ApiError(`Name must be ${NAME_MIN}–${NAME_MAX} characters.`, 422, "invalid", "name");
    if (body.description.length > DESCRIPTION_MAX)
      throw new ApiError("Description is too long.", 422, "invalid", "description");
    bot.name = name;
    bot.description = body.description.trim();
  });

// ---- Knowledge base ---------------------------------------------------------------------

async function addDocuments(chatbotId: string, body: AddDocumentsRequest) {
  const db = loadDb();
  const bot = db.chatbots.find((b) => b.id === chatbotId);
  if (!bot) throw new ApiError("Chatbot not found.", 404, "not_found");
  if (!body.uploadIds.length && !body.urls.length)
    throw new ApiError("Add at least one file or link.", 422, "invalid", "sources");
  if (bot.documents.length + body.uploadIds.length + body.urls.length > SOURCES_MAX)
    throw new ApiError(`At most ${SOURCES_MAX} sources per chatbot.`, 422, "invalid", "sources");
  // New documents wait for any that are still processing.
  const busyUntil = Math.max(0, ...bot.documents.map((d) => d.readyAt));
  const { documents, moves } = queueSources(db, body.uploadIds, body.urls, busyUntil);
  await Promise.all(moves.map(([from, to]) => fileStore.move(from, to)));
  bot.documents.push(...documents);
  bot.updatedAt = new Date().toISOString();
  saveDb(db);
  return toChatbot(bot);
}

async function removeDocument(chatbotId: string, docId: string) {
  const db = loadDb();
  const bot = db.chatbots.find((b) => b.id === chatbotId);
  if (!bot) throw new ApiError("Chatbot not found.", 404, "not_found");
  if (isDemoDocument(docId)) throw new ApiError("Built-in demo documents can't be removed.", 403, "forbidden");
  if (!bot.documents.some((d) => d.id === docId)) throw new ApiError("Document not found.", 404, "not_found");
  bot.documents = bot.documents.filter((d) => d.id !== docId);
  bot.updatedAt = new Date().toISOString();
  saveDb(db);
  await fileStore.remove(docId);
  return toChatbot(bot);
}

async function documentOriginal(bot: Chatbot, docId: string): Promise<DocumentOriginal> {
  const document = bot.documents.find((d) => d.id === docId);
  if (!document) throw new ApiError("Document not found.", 404, "not_found");
  const demo = DEMO_DOCUMENTS.find((d) => d.id === docId);
  if (demo) return { document, file: null, text: demo.text, demo: demo.preview, uploadedAt: demo.uploadedAt };
  const stored = await ensureSeedFile(docId);
  const seededAt = HR_DOCUMENTS.find((d) => d.id === docId)?.uploadedAt;
  const startsAt = loadDb()
    .chatbots.find((b) => b.id === bot.id)
    ?.documents.find((d) => d.id === docId)?.startsAt;
  return {
    document,
    file: stored?.blob ?? null,
    text: stored?.text ?? "",
    uploadedAt: seededAt ?? new Date(startsAt ?? Date.now()).toISOString(),
  };
}

// ---- Answer engine ------------------------------------------------------------------------
// A small keyword retriever standing in for embeddings + an LLM: it finds the paragraphs that
// share the most words with the question and answers from them, or admits it doesn't know.

const STOPWORDS = new Set(
  (
    "a an the is are was were be been am do does did can could would should will shall may might must i you he she " +
    "we they it its my your our their me us them what which who whom whose how when where why there here this that " +
    "these those of to in on for with at by from about as or and if any some please tell know have has had get got " +
    "want need like just also than then so not no yes hi hello thanks thank much many more most very"
  ).split(" "),
);

const terms = (text: string) =>
  new Set(
    (text.toLowerCase().match(/[a-z0-9]+/g) ?? [])
      .filter((w) => w.length > 2 && !STOPWORDS.has(w))
      .map((w) => (w.length > 5 ? w.replace(/(ies)$/, "y").replace(/(ing|ed|es|s)$/, "") : w.replace(/s$/, ""))),
  );

/**
 * Splits a document into passages: a blank line or a heading-like line (short, no closing
 * punctuation) starts a new one, and the heading stays with the text under it. Title lines and
 * other fragments too short to answer anything are dropped.
 */
function chunk(text: string) {
  const passages: string[] = [];
  let current: string[] = [];
  const flush = () => {
    if (current.length) passages.push(current.join(" "));
    current = [];
  };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) flush();
    else if (line.length < 60 && !/[.!?:;,]$/.test(line)) {
      flush();
      current.push(`${line}.`);
    } else current.push(line);
  }
  flush();
  return passages.filter((p) => p.length >= 60);
}

const trim = (text: string, max = 420) => {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max).replace(/\s+\S*$/, "")}…`;
};

async function answerFor(bot: Chatbot, question: unknown): Promise<ChatAnswer> {
  if (typeof question !== "string" || !question.trim())
    throw new ApiError("Type a question first.", 422, "invalid", "question");
  if (question.length > 2000) throw new ApiError("The question is too long.", 422, "invalid", "question");
  const ready = bot.documents.filter((d) => d.status === "ready");
  if (!ready.length)
    return {
      answered: false,
      sourcesSearched: 0,
      sources: [],
      answer:
        "I don't have any knowledge yet — none of my documents have finished processing. Please try again shortly.",
    };

  const asked = [...terms(question)];
  type Hit = { doc: (typeof ready)[number]; paragraph: string; coverage: number; score: number };
  const hits: Hit[] = [];
  for (const doc of ready) {
    const text = DEMO_DOCUMENTS.find((d) => d.id === doc.id)?.text ?? (await ensureSeedFile(doc.id))?.text ?? "";
    const nameTerms = terms(doc.name.replace(/\.[a-z0-9]+$/i, ""));
    const paragraphs = chunk(text);
    // A document without readable text (a scanned PDF, a web page) can still match on its name.
    for (const paragraph of paragraphs.length ? paragraphs : [""]) {
      const paraTerms = terms(paragraph);
      const inPara = asked.filter((t) => paraTerms.has(t));
      const inName = asked.filter((t) => nameTerms.has(t));
      const matched = new Set([...inPara, ...inName]);
      if (!asked.length || (!inPara.length && paragraphs.length)) continue;
      hits.push({ doc, paragraph, coverage: matched.size / asked.length, score: inPara.length + inName.length * 0.5 });
    }
  }
  const confident = hits.filter((h) => h.coverage >= 0.5).sort((a, b) => b.coverage - a.coverage || b.score - a.score);

  if (!confident.length) {
    const names = ready.map((d) => d.name.replace(/\.[a-z0-9]+$/i, ""));
    const covered =
      names.length > 3 ? `${names.slice(0, 3).join(", ")} and ${names.length - 3} more` : names.join(", ");
    return {
      answered: false,
      sourcesSearched: ready.length,
      sources: [],
      answer: `I don't have specific knowledge related to that question. My documents cover ${covered}, but nothing that answers it. Try rephrasing, or ask about one of those topics.`,
    };
  }

  // Best passage per document, up to 3 documents.
  const sources: ChatSource[] = [];
  for (const hit of confident) {
    if (sources.length === 3) break;
    if (sources.some((s) => s.documentId === hit.doc.id)) continue;
    sources.push({
      documentId: hit.doc.id,
      name: hit.doc.name,
      type: hit.doc.kind === "url" ? "URL" : hit.doc.type,
      snippet: trim(hit.paragraph || `“${hit.doc.name}” covers this topic.`, 220),
    });
  }
  // Up to two passages: the best one, then the next best — from the same document when it has one.
  const [best] = confident;
  const second =
    confident.find((h) => h !== best && h.doc.id === best.doc.id && h.coverage >= best.coverage) ??
    confident.find((h) => h.doc.id !== best.doc.id && h.coverage >= best.coverage);
  const lead = best.paragraph
    ? trim(best.paragraph)
    : `“${best.doc.name}” covers this topic — open the source below for the details.`;
  const extra = !second?.paragraph
    ? ""
    : second.doc.id === best.doc.id
      ? `\n\n${trim(second.paragraph, 300)}`
      : `\n\nAlso from ${second.doc.name.replace(/\.[a-z0-9]+$/i, "")}: ${trim(second.paragraph, 260)}`;
  return {
    answered: true,
    sourcesSearched: ready.length,
    sources,
    answer: `According to ${best.doc.name.replace(/\.[a-z0-9]+$/i, "")}: ${lead}${extra}`,
  };
}

function findPublic(token: string) {
  const db = loadDb();
  for (const channels of Object.values(db.channels)) {
    const link = channels.publicLink;
    if (!link.configured || !link.url?.endsWith(`/s/${token}`)) continue;
    const stored = db.chatbots.find((b) => b.id === channels.chatbotId);
    if (!stored) break;
    const bot = toChatbot(stored);
    const reason: PublicChat["reason"] = !link.enabled
      ? "disabled"
      : link.expiresAt && new Date(link.expiresAt).getTime() <= Date.now()
        ? "expired"
        : bot.status === "paused"
          ? "paused"
          : bot.status !== "active"
            ? "not_published"
            : undefined;
    const chat: PublicChat = {
      title: link.title,
      themeColor: link.themeColor,
      chatbotName: bot.name,
      starterQuestions: bot.settings.starterQuestions,
      sourceVisibility: bot.settings.sourceVisibility,
      available: !reason,
      ...(reason && { reason }),
    };
    return { bot, chat };
  }
  throw new ApiError("This link doesn't exist or was replaced by a new one.", 404, "link_not_found");
}

/** A stable id for this browser, so a guest's questions group into sessions. */
function guestId() {
  try {
    let guest = siteStorage.local.getItem("rag-studio-guest-id");
    if (!guest) siteStorage.local.setItem("rag-studio-guest-id", (guest = id("guest")));
    return guest;
  } catch {
    return "guest";
  }
}

function logChat(chatbotId: string, channel: AnalyticsChannel, visitor: string, question: unknown, answer: ChatAnswer) {
  const db = loadDb();
  db.events.push({
    chatbotId,
    channel,
    visitor,
    at: Date.now(),
    question: typeof question === "string" ? question.slice(0, 300) : "",
    answered: answer.answered,
    sources: answer.sources.length,
    reply: answer.answer.slice(0, 300),
  });
  db.events = db.events.slice(-CHAT_LOG_MAX);
  saveDb(db);
}

/** Removes a chatbot with its channels and chat log. The two built-in demo chatbots stay. */
function deleteChatbot(id: string) {
  const db = loadDb();
  if (!db.chatbots.some((c) => c.id === id)) throw new ApiError("Chatbot not found.", 404, "not_found");
  if (id === DEMO_CHATBOT_ID || id === HR_CHATBOT_ID)
    throw new ApiError("The built-in demo chatbots can't be deleted.", 409, "conflict");
  db.chatbots = db.chatbots.filter((c) => c.id !== id);
  delete db.channels[id];
  db.events = db.events.filter((e) => e.chatbotId !== id);
  saveDb(db);
}

const GRANULARITIES: AnalyticsGranularity[] = ["daily", "weekly", "monthly"];

function analytics(params: URLSearchParams) {
  const granularity = (params.get("granularity") ?? "daily") as AnalyticsGranularity;
  if (!GRANULARITIES.includes(granularity))
    throw new ApiError("granularity must be daily, weekly or monthly.", 422, "invalid", "granularity");
  const db = loadDb();
  const chatbotId = params.get("chatbotId");
  if (chatbotId && !db.chatbots.some((c) => c.id === chatbotId))
    throw new ApiError("Chatbot not found.", 404, "not_found");
  const days = Number(params.get("days") ?? 14);
  if (!Number.isInteger(days) || days < 1 || days > 90)
    throw new ApiError("days must be a whole number from 1 to 90.", 422, "invalid", "days");
  const now = Date.now();
  return computeAnalytics(
    db.chatbots.map((c) => toChatbot(c, now)),
    db.events,
    granularity,
    chatbotId,
    now,
    days,
  );
}

function unanswered(params: URLSearchParams) {
  const days = Number(params.get("days") ?? 30);
  if (!Number.isInteger(days) || days < 1 || days > 365)
    throw new ApiError("days must be a whole number from 1 to 365.", 422, "invalid", "days");
  const db = loadDb();
  const chatbotId = params.get("chatbotId");
  if (chatbotId && !db.chatbots.some((c) => c.id === chatbotId))
    throw new ApiError("Chatbot not found.", 404, "not_found");
  const now = Date.now();
  return computeUnanswered(
    db.chatbots.map((c) => toChatbot(c, now)),
    db.events,
    chatbotId,
    days,
    now,
  );
}

/** Handles a JSON request the way the real server would. */
export async function mockRequest<T>(method: string, path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  await latency(signal);
  const url = new URL(path, "http://mock");
  const route = `${method} ${url.pathname}`;
  let match: RegExpMatchArray | null;

  if (route === "GET /models") return MODELS as T;
  if (route === "POST /sources/url-preview") return previewUrl((body as { url: string }).url) as T;
  if (route === "POST /chatbots") return (await createChatbot(body as CreateChatbotRequest)) as T;
  if (route === "GET /chatbots") return loadDb().chatbots.map((c) => toChatbot(c)) as T;
  if (route === "GET /analytics") return analytics(url.searchParams) as T;
  if (route === "GET /analytics/unanswered") return unanswered(url.searchParams) as T;
  if ((match = url.pathname.match(/^\/chatbots\/([\w-]+)\/channels(\/.*)?$/))) {
    const result = channelsRoute(method, match[1], match[2] ?? "", body);
    if (result) return result as T;
  }
  if ((match = route.match(/^POST \/chatbots\/([\w-]+)\/publish$/))) return publishChatbot(match[1]) as T;
  if ((match = route.match(/^PATCH \/chatbots\/([\w-]+)$/)))
    return (
      body && typeof body === "object" && "name" in body
        ? editChatbotDetails(match[1], body as { name?: unknown; description?: unknown })
        : setChatbotStatus(match[1], (body as { status?: unknown })?.status)
    ) as T;
  if ((match = route.match(/^POST \/chatbots\/([\w-]+)\/chat$/))) {
    const found = loadDb().chatbots.find((c) => c.id === match![1]);
    if (!found) throw new ApiError("Chatbot not found.", 404, "not_found");
    await latency(signal, 700, 1400); // "thinking"
    const question = (body as { question?: unknown })?.question;
    const answer = await answerFor(toChatbot(found), question);
    logChat(found.id, "playground", "owner", question, answer);
    return answer as T;
  }
  if ((match = route.match(/^POST \/chatbots\/([\w-]+)\/documents$/)))
    return (await addDocuments(match[1], body as AddDocumentsRequest)) as T;
  if ((match = route.match(/^DELETE \/chatbots\/([\w-]+)\/documents\/([\w-]+)$/)))
    return (await removeDocument(match[1], match[2])) as T;
  if ((match = route.match(/^GET \/chatbots\/([\w-]+)\/documents\/([\w-]+)\/original$/))) {
    const found = loadDb().chatbots.find((c) => c.id === match![1]);
    if (!found) throw new ApiError("Chatbot not found.", 404, "not_found");
    return (await documentOriginal(toChatbot(found), match[2])) as T;
  }
  if ((match = route.match(/^GET \/public\/([\w-]+)\/documents\/([\w-]+)\/original$/))) {
    const { bot } = findPublic(match[1]);
    if (bot.settings.sourceVisibility !== "Full document")
      throw new ApiError("The owner doesn't share source documents.", 403, "forbidden");
    return (await documentOriginal(bot, match[2])) as T;
  }
  if ((match = route.match(/^GET \/widget\/([\w-]+)$/))) {
    const q = url.searchParams;
    const embed: Partial<WidgetEmbed> = {
      primaryColor: q.get("color") ?? undefined,
      position: (q.get("position") ?? undefined) as WidgetEmbed["position"] | undefined,
      welcomeMessage: q.get("welcome") ?? undefined,
      allowedDomains: q.get("domains")?.split(",").filter(Boolean),
    };
    return findWidget(match[1], q.get("host") ?? "", embed).chat as T;
  }
  if ((match = route.match(/^POST \/widget\/([\w-]+)\/chat$/))) {
    const { question, host, embed } = (body ?? {}) as { question?: unknown; host?: unknown; embed?: unknown };
    const { bot, chat } = findWidget(
      match[1],
      typeof host === "string" ? host : "",
      embed && typeof embed === "object" ? (embed as Partial<WidgetEmbed>) : undefined,
    );
    if (!chat.available) throw new ApiError("This chatbot is temporarily unavailable.", 503, "chatbot_unavailable");
    await latency(signal, 700, 1400);
    const answer = await answerFor(bot, question);
    logChat(bot.id, "widget", guestId(), question, answer);
    return answer as T;
  }
  if ((match = route.match(/^GET \/public\/([\w-]+)$/))) return findPublic(match[1]).chat as T;
  if ((match = route.match(/^POST \/public\/([\w-]+)\/chat$/))) {
    const { bot, chat } = findPublic(match[1]);
    if (!chat.available) throw new ApiError("This chatbot is temporarily unavailable.", 503, "chatbot_unavailable");
    await latency(signal, 700, 1400);
    const question = (body as { question?: unknown })?.question;
    const answer = await answerFor(bot, question);
    logChat(bot.id, "public-link", guestId(), question, answer);
    return answer as T;
  }
  if ((match = route.match(/^GET \/chatbots\/([\w-]+)$/))) {
    const found = loadDb().chatbots.find((c) => c.id === match![1]);
    if (!found) throw new ApiError("Chatbot not found.", 404, "not_found");
    return toChatbot(found) as T;
  }
  if ((match = route.match(/^DELETE \/chatbots\/([\w-]+)$/))) return deleteChatbot(match[1]) as T;
  if ((match = route.match(/^DELETE \/uploads\/([\w-]+)$/))) {
    const db = loadDb();
    delete db.uploads[match[1]];
    saveDb(db);
    return undefined as T;
  }
  throw new ApiError(`No mock handler for ${route}`, 404, "not_found");
}

/** Handles POST /uploads (multipart) with simulated transfer progress. */
export function mockUpload(
  file: File,
  onProgress: (fraction: number) => void,
  signal?: AbortSignal,
): Promise<UploadedFile> {
  return new Promise((resolve, reject) => {
    const type = fileTypeOf(file.name);
    // Throughput ~3 MB/s, so bigger files visibly take longer.
    const duration = Math.max(900, (file.size / (3 * 1024 * 1024)) * 1000);
    const started = performance.now();
    const timer = setInterval(() => {
      const fraction = Math.min(1, (performance.now() - started) / duration);
      onProgress(fraction);
      if (fraction < 1) return;
      clearInterval(timer);
      if (!type) return reject(new ApiError("This file type isn't supported.", 415, "unsupported_type"));
      if (file.size > FILE_MAX_BYTES) return reject(new ApiError("File is larger than 20 MB.", 413, "too_large"));
      if (file.size === 0) return reject(new ApiError("This file is empty.", 422, "empty_file"));
      const upload: UploadedFile = { uploadId: id("upl"), name: file.name, type, sizeBytes: file.size };
      // The server keeps the original file and reads its text for indexing.
      extractText(file, type)
        .catch(() => null)
        .then(async (text) => {
          if (text === null)
            return reject(
              new ApiError("We couldn't read this file. It may be damaged or password-protected.", 422, "unreadable"),
            );
          await fileStore.put(upload.uploadId, { blob: file, text });
          const db = loadDb();
          db.uploads[upload.uploadId] = upload;
          saveDb(db);
          resolve(upload);
        });
    }, 120);
    signal?.addEventListener("abort", () => {
      clearInterval(timer);
      reject(new DOMException("Upload cancelled", "AbortError"));
    });
  });
}
