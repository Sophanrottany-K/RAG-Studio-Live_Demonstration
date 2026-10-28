// The "Create chatbot" wizard keeps one shared draft for all three steps.
// It is saved to localStorage so a reload doesn't lose the user's input,
// and it owns the file uploads / URL checks that run while the user keeps editing.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { api, errorMessage, isAbort } from "../services/api";
import { FILE_MAX_BYTES, SOURCES_MAX, fileTypeOf, normalizeUrl } from "../services/limits";
import type { AdvancedSettings, ChatbotSettings, CreateChatbotRequest } from "../services/types";

export type DraftSource = {
  localId: string;
  kind: "file" | "url";
  name: string;
  type: string;
  sizeBytes: number | null;
  /** uploading = file transfer or URL check in flight */
  state: "uploading" | "uploaded" | "failed";
  progress: number;
  uploadId?: string;
  url?: string;
  error?: string;
};

export type StarterQuestion = { id: string; text: string };

export type Draft = {
  name: string;
  description: string;
  settings: Omit<ChatbotSettings, "starterQuestions">;
  starterQuestions: StarterQuestion[];
  sources: DraftSource[];
  /** Furthest step the user has unlocked (1–3). */
  reachedStep: number;
};

export const DEFAULT_INSTRUCTIONS =
  "You are the support assistant for our customers. Answer only from the provided documents, keep answers short and cite the source.";

const emptyDraft = (): Draft => ({
  name: "",
  description: "",
  settings: {
    chatModel: "qwen3:8b",
    embeddingModel: "bge-m3",
    instructions: DEFAULT_INSTRUCTIONS,
    tone: "Professional",
    answerLength: "Concise",
    formatting: "Rich text",
    language: "Auto-detect",
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
  starterQuestions: [],
  sources: [],
  reachedStep: 1,
});

const STORAGE_KEY = "rag-studio-chatbot-draft";

function loadDraft(): Draft {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyDraft();
    const saved = JSON.parse(raw) as Draft;
    const base = emptyDraft();
    return {
      ...base,
      ...saved,
      settings: {
        ...base.settings,
        ...saved.settings,
        advanced: { ...base.settings.advanced, ...saved.settings?.advanced },
      },
      // Transfers in flight when the page closed can't resume.
      sources: (saved.sources ?? []).filter((s) => s.state !== "uploading"),
    };
  } catch {
    return emptyDraft();
  }
}

const localId = () => Math.random().toString(36).slice(2, 10);

type DraftContextValue = {
  draft: Draft;
  update: (patch: Partial<Pick<Draft, "name" | "description" | "starterQuestions">>) => void;
  updateSettings: (patch: Partial<Draft["settings"]>) => void;
  updateAdvanced: (patch: Partial<AdvancedSettings>) => void;
  reachStep: (step: number) => void;
  /** Validates and starts uploading; returns messages for files that were rejected. */
  addFiles: (files: File[]) => string[];
  /** Checks each link with the server; returns messages for lines that were rejected. */
  addUrls: (lines: string[]) => string[];
  retrySource: (id: string) => void;
  /** False for files picked before a page reload: the browser no longer has their bytes. */
  canRetry: (id: string) => boolean;
  removeSource: (id: string) => void;
  toRequest: () => CreateChatbotRequest;
  /** Clears the wizard. Pass true when abandoning it, so uploaded files are deleted too. */
  reset: (discardUploads?: boolean) => void;
};

const DraftContext = createContext<DraftContextValue | null>(null);

export function ChatbotDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<Draft>(loadDraft);
  const draftRef = useRef(draft);
  draftRef.current = draft;
  const files = useRef(new Map<string, File>());
  const controllers = useRef(new Map<string, AbortController>());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // storage unavailable: the draft lives for this page load only
    }
  }, [draft]);

  const patchSource = useCallback((id: string, patch: Partial<DraftSource>) => {
    setDraft((d) => ({ ...d, sources: d.sources.map((s) => (s.localId === id ? { ...s, ...patch } : s)) }));
  }, []);

  const startUpload = useCallback(
    (id: string, file: File) => {
      const controller = new AbortController();
      controllers.current.set(id, controller);
      patchSource(id, { state: "uploading", progress: 0, error: undefined });
      api
        .uploadFile(file, (progress) => patchSource(id, { progress }), controller.signal)
        .then((uploaded) => patchSource(id, { state: "uploaded", progress: 1, uploadId: uploaded.uploadId }))
        .catch((error) => !isAbort(error) && patchSource(id, { state: "failed", error: errorMessage(error) }))
        .finally(() => controllers.current.delete(id));
    },
    [patchSource],
  );

  const startUrlCheck = useCallback(
    (id: string, url: string) => {
      const controller = new AbortController();
      controllers.current.set(id, controller);
      patchSource(id, { state: "uploading", error: undefined });
      api
        .previewUrl(url, controller.signal)
        .then((preview) =>
          patchSource(id, {
            state: "uploaded",
            progress: 1,
            name: `${preview.host}${new URL(preview.url).pathname.replace(/\/$/, "")}`,
            url: preview.url,
          }),
        )
        .catch((error) => !isAbort(error) && patchSource(id, { state: "failed", error: errorMessage(error) }))
        .finally(() => controllers.current.delete(id));
    },
    [patchSource],
  );

  const addFiles = useCallback(
    (picked: File[]) => {
      const rejected: string[] = [];
      const current = draftRef.current.sources;
      const accepted: DraftSource[] = [];
      for (const file of picked) {
        const type = fileTypeOf(file.name);
        if (!type) rejected.push(`${file.name}: only PDF, DOCX, TXT, MD or XLSX files.`);
        else if (file.size > FILE_MAX_BYTES) rejected.push(`${file.name}: larger than 20 MB.`);
        else if (
          [...current, ...accepted].some((s) => s.kind === "file" && s.name === file.name && s.sizeBytes === file.size)
        )
          rejected.push(`${file.name}: already added.`);
        else if (current.length + accepted.length >= SOURCES_MAX)
          rejected.push(`${file.name}: a chatbot can have at most ${SOURCES_MAX} sources.`);
        else {
          const source: DraftSource = {
            localId: localId(),
            kind: "file",
            name: file.name,
            type,
            sizeBytes: file.size,
            state: "uploading",
            progress: 0,
          };
          files.current.set(source.localId, file);
          accepted.push(source);
        }
      }
      if (accepted.length) {
        setDraft((d) => ({ ...d, sources: [...d.sources, ...accepted] }));
        accepted.forEach((s) => startUpload(s.localId, files.current.get(s.localId)!));
      }
      return rejected;
    },
    [startUpload],
  );

  const addUrls = useCallback(
    (lines: string[]) => {
      const rejected: string[] = [];
      const current = draftRef.current.sources;
      const accepted: DraftSource[] = [];
      for (const line of lines.map((l) => l.trim()).filter(Boolean)) {
        const url = normalizeUrl(line);
        if (!url) rejected.push(`${line}: not a valid link.`);
        else if ([...current, ...accepted].some((s) => s.url === url)) rejected.push(`${line}: already added.`);
        else if (current.length + accepted.length >= SOURCES_MAX)
          rejected.push(`${line}: a chatbot can have at most ${SOURCES_MAX} sources.`);
        else
          accepted.push({
            localId: localId(),
            kind: "url",
            name: url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
            type: "Web page",
            sizeBytes: null,
            state: "uploading",
            progress: 0,
            url,
          });
      }
      if (accepted.length) {
        setDraft((d) => ({ ...d, sources: [...d.sources, ...accepted] }));
        accepted.forEach((s) => startUrlCheck(s.localId, s.url!));
      }
      return rejected;
    },
    [startUrlCheck],
  );

  const retrySource = useCallback(
    (id: string) => {
      const source = draftRef.current.sources.find((s) => s.localId === id);
      if (!source) return;
      if (source.kind === "url") startUrlCheck(id, source.url!);
      else if (files.current.has(id)) startUpload(id, files.current.get(id)!);
    },
    [startUpload, startUrlCheck],
  );

  const removeSource = useCallback((id: string) => {
    controllers.current.get(id)?.abort();
    const source = draftRef.current.sources.find((s) => s.localId === id);
    if (source?.uploadId) api.deleteUpload(source.uploadId).catch(() => {});
    files.current.delete(id);
    setDraft((d) => ({ ...d, sources: d.sources.filter((s) => s.localId !== id) }));
  }, []);

  const value = useMemo<DraftContextValue>(
    () => ({
      draft,
      update: (patch) => setDraft((d) => ({ ...d, ...patch })),
      updateSettings: (patch) => setDraft((d) => ({ ...d, settings: { ...d.settings, ...patch } })),
      updateAdvanced: (patch) =>
        setDraft((d) => ({ ...d, settings: { ...d.settings, advanced: { ...d.settings.advanced, ...patch } } })),
      reachStep: (step) => setDraft((d) => ({ ...d, reachedStep: Math.max(d.reachedStep, step) })),
      addFiles,
      addUrls,
      retrySource,
      canRetry: (id) =>
        draftRef.current.sources.some((s) => s.localId === id && (s.kind === "url" || files.current.has(id))),
      removeSource,
      toRequest: () => {
        const d = draftRef.current;
        const ready = d.sources.filter((s) => s.state === "uploaded");
        return {
          name: d.name.trim(),
          description: d.description.trim(),
          settings: {
            ...d.settings,
            instructions: d.settings.instructions.trim(),
            starterQuestions: d.starterQuestions.map((q) => q.text.trim()).filter(Boolean),
          },
          uploadIds: ready.filter((s) => s.kind === "file").map((s) => s.uploadId!),
          urls: ready.filter((s) => s.kind === "url").map((s) => s.url!),
        };
      },
      reset: (discardUploads = false) => {
        if (discardUploads)
          draftRef.current.sources.forEach((s) => s.uploadId && api.deleteUpload(s.uploadId).catch(() => {}));
        controllers.current.forEach((c) => c.abort());
        controllers.current.clear();
        files.current.clear();
        setDraft(emptyDraft());
      },
    }),
    [draft, addFiles, addUrls, retrySource, removeSource],
  );

  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}

export function useChatbotDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useChatbotDraft must be used inside <ChatbotDraftProvider>");
  return ctx;
}

export function displayName(name: string) {
  return name.trim() || "Untitled chatbot";
}

export function initials(name: string) {
  const letters = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((t) => t[0].toUpperCase())
    .join("");
  return letters || "?";
}

export function sourceCounts(sources: DraftSource[]) {
  return {
    total: sources.length,
    ready: sources.filter((s) => s.state === "uploaded").length,
    busy: sources.filter((s) => s.state === "uploading").length,
    failed: sources.filter((s) => s.state === "failed").length,
  };
}
