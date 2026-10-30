// Shapes exchanged with the RAG Studio backend (see src/services/api.ts for endpoints).

export type ModelOption = {
  id: string;
  label: string;
  provider: string;
  description: string;
  isDefault?: boolean;
};

export type ModelCatalog = {
  chat: ModelOption[];
  embedding: ModelOption[];
};

/** A file stored by POST /uploads, waiting to be attached to a chatbot. */
export type UploadedFile = {
  uploadId: string;
  name: string;
  type: string;
  sizeBytes: number;
};

/** Result of POST /sources/url-preview: the page was reachable and can be imported. */
export type UrlPreview = {
  url: string;
  host: string;
  title: string;
};

export type Tone = "Professional" | "Friendly" | "Casual" | "Formal";
export type AnswerLength = "Concise" | "Detailed";
export type Formatting = "Rich text" | "Plain text only";
export type SourceVisibility = "Full document" | "Name only" | "Hidden";
export type SearchMode = "Hybrid" | "Semantic" | "Keyword";

export type AdvancedSettings = {
  temperature: number;
  topK: number;
  searchMode: SearchMode;
  chunkSize: number;
  chunkOverlap: number;
  documentsOnly: boolean;
};

export type ChatbotSettings = {
  chatModel: string;
  embeddingModel: string;
  instructions: string;
  tone: Tone;
  answerLength: AnswerLength;
  formatting: Formatting;
  language: string;
  starterQuestions: string[];
  sourceVisibility: SourceVisibility;
  advanced: AdvancedSettings;
};

export type CreateChatbotRequest = {
  name: string;
  description: string;
  settings: ChatbotSettings;
  uploadIds: string[];
  urls: string[];
};

export type DocumentStatus = "queued" | "processing" | "ready" | "failed";

export type ChatbotDocument = {
  id: string;
  kind: "file" | "url";
  name: string;
  type: string;
  sizeBytes: number | null;
  status: DocumentStatus;
  error?: string;
};

export type ChatbotStatus = "draft" | "pending" | "active" | "paused";

export type Chatbot = {
  id: string;
  name: string;
  description: string;
  status: ChatbotStatus;
  createdAt: string;
  updatedAt: string;
  settings: ChatbotSettings;
  documents: ChatbotDocument[];
  channels: string[];
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
    public field?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type PublicLinkChannel = {
  configured: boolean;
  enabled: boolean;
  title: string;
  /** ISO timestamp, or null for a link that never expires. */
  expiresAt: string | null;
  themeColor: string;
  url: string | null;
  updatedAt: string | null;
  messagesThisWeek: number;
};

export type WidgetPosition = "bottom-right" | "bottom-left";

export type WidgetChannel = {
  configured: boolean;
  enabled: boolean;
  primaryColor: string;
  position: WidgetPosition;
  welcomeMessage: string;
  allowedDomains: string[];
  embedCode: string | null;
  updatedAt: string | null;
  messagesThisWeek: number;
};

export type TelegramChannel = {
  connected: boolean;
  botUsername: string | null;
  /** Last characters of the token; the full token is never sent back. */
  tokenHint: string | null;
  connectedAt: string | null;
  messagesThisWeek: number;
};

export type ChatbotChannels = {
  chatbotId: string;
  publicLink: PublicLinkChannel;
  widget: WidgetChannel;
  telegram: TelegramChannel;
};

export type SavePublicLinkRequest = Pick<PublicLinkChannel, "title" | "expiresAt" | "themeColor">;
export type SaveWidgetRequest = Pick<WidgetChannel, "primaryColor" | "position" | "welcomeMessage" | "allowedDomains">;
/** The widget settings that the embed code carries (data-color, data-position, data-welcome, data-domains). */
export type WidgetEmbed = SaveWidgetRequest;

/** Reply from POST /chatbots/:id/chat (playground) or POST /public/:token/chat (guest link). */
export type ChatAnswer = {
  answer: string;
  /** False when nothing in the knowledge base matched the question. */
  answered: boolean;
  sourcesSearched: number;
  /** Passages the answer was built from (empty when nothing matched). */
  sources: ChatSource[];
};

export type ChatSource = { documentId: string; name: string; type: string; snippet: string };

export type ChatMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "bot"; answer: ChatAnswer }
  | { id: string; role: "error"; text: string; question: string };

/** What a guest sees when opening a public link (GET /public/:token). */
export type PublicChat = {
  title: string;
  themeColor: string;
  chatbotName: string;
  starterQuestions: string[];
  sourceVisibility: SourceVisibility;
  available: boolean;
  reason?: "paused" | "disabled" | "expired" | "not_published";
};

/** GET /widget/:chatbotId?host=: what the embedded web widget shows on the site at `host`. */
export type WidgetChat = {
  chatbotName: string;
  primaryColor: string;
  position: WidgetPosition;
  welcomeMessage: string;
  starterQuestions: string[];
  sourceVisibility: SourceVisibility;
  available: boolean;
  /** paused / not_published: the bubble shows "temporarily unavailable". The others hide the widget. */
  reason?: "paused" | "not_published" | "disabled" | "not_configured" | "domain_not_allowed";
};

/** Body of POST /chatbots/:id/documents: more sources for an existing chatbot. */
export type AddDocumentsRequest = { uploadIds: string[]; urls: string[] };

/** GET …/documents/:docId/original: the file as uploaded, for the original-format viewer. */
export type DocumentOriginal = {
  document: ChatbotDocument;
  /** The uploaded file; null for web pages and the built-in demo documents. */
  file: Blob | null;
  /** Text the knowledge base was built from. */
  text: string;
  /** Set for the demo chatbot's documents, which have a fixed Figma preview instead of a file. */
  demo?: "pdf" | "docx" | "xlsx" | "md";
  uploadedAt: string;
};

export type AnalyticsChannel = "public-link" | "widget" | "telegram" | "playground";
export type AnalyticsGranularity = "daily" | "weekly" | "monthly";

/** One bucket of the message trend (a day, a week or a month). */
export type AnalyticsPoint = {
  /** ISO date of the bucket's first day. */
  start: string;
  messages: number;
  sessions: number;
  answered: number;
};

/** GET /analytics — every figure on the Analytics screen, for one chatbot or all of them. */
export type Analytics = {
  generatedAt: string;
  granularity: AnalyticsGranularity;
  /** Human label of the period the totals cover, e.g. "last 14 days". */
  periodLabel: string;
  chatbotCount: number;
  totals: {
    messages: number;
    answered: number;
    unanswered: number;
    sessions: number;
    guests: number;
    /** % change in messages against the previous period of the same length; null with no earlier data. */
    messagesChangePct: number | null;
  };
  activeSessions: number;
  knowledge: {
    documents: number;
    readyDocuments: number;
    storageBytes: number;
    storageLimitBytes: number;
    indexBytes: number;
  };
  trend: AnalyticsPoint[];
  channels: { channel: AnalyticsChannel; messages: number; sessions: number }[];
  /** Guest thumbs up / down on answers in the period. */
  feedback: { helpful: number; notHelpful: number };
  /** Questions the bot couldn't answer in the period, most asked first. */
  unanswered: { total: number; top: { question: string; chatbotId: string; count: number }[] };
  /** Answers guests reported, newest first. */
  reports: ReportedAnswer[];
  usage: {
    chatbots: number;
    chatbotLimit: number;
    perChatbot: {
      chatbotId: string;
      name: string;
      status: ChatbotStatus;
      messages: number;
      documents: number;
      storageBytes: number;
      indexBytes: number;
    }[];
  };
};

/** Channels a guest can rate or report from; Playground answers can't be reported. */
export type GuestChannel = Exclude<AnalyticsChannel, "playground">;
export type ReportReason = "inaccurate" | "unhelpful";
export type ReportStatus = "open" | "resolved" | "dismissed";

export type ReportedAnswer = {
  id: string;
  chatbotId: string;
  question: string;
  botAnswer: string;
  comment: string;
  reason: ReportReason;
  channel: GuestChannel;
  reportedAt: string;
  status: ReportStatus;
};

/** GET /analytics/unanswered — one question the bot couldn't answer. */
export type UnansweredEntry = {
  id: string;
  chatbotId: string;
  question: string;
  lastReply: string;
  channel: AnalyticsChannel;
  askedAt: string;
};
