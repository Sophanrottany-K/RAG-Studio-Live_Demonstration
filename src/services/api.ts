// RAG Studio API client.
//
// Set VITE_API_URL (e.g. in .env.local) to talk to a real backend. Without it, every
// call is answered by the in-browser mock server, which implements the same contract:
//
//   GET    /models                              -> ModelCatalog
//   POST   /uploads            (multipart file) -> UploadedFile
//   DELETE /uploads/:uploadId                   -> 204
//   POST   /sources/url-preview  { url }        -> UrlPreview
//   POST   /chatbots    CreateChatbotRequest    -> Chatbot  (documents start processing)
//   GET    /chatbots                            -> Chatbot[]
//   GET    /chatbots/:id                        -> Chatbot
//   POST   /chatbots/:id/publish                -> Chatbot  (pending -> active)
//   PATCH  /chatbots/:id  { status: "active"|"paused" } -> Chatbot
//   POST   /chatbots/:id/chat  { question }     -> ChatAnswer (playground; any status)
//   POST   /chatbots/:id/documents  AddDocumentsRequest -> Chatbot (new documents start processing)
//   DELETE /chatbots/:id/documents/:docId        -> Chatbot
//   GET    /chatbots/:id/documents/:docId/original -> DocumentOriginal metadata + text, with a
//                                                   fileUrl the client downloads the original from
//
//   GET    /chatbots/:id/channels                         -> ChatbotChannels
//   PUT    /chatbots/:id/channels/public-link  SavePublicLinkRequest -> ChatbotChannels
//   POST   /chatbots/:id/channels/public-link/regenerate  -> ChatbotChannels (old URL stops working)
//   PUT    /chatbots/:id/channels/widget   SaveWidgetRequest  -> ChatbotChannels
//   PATCH  /chatbots/:id/channels/public-link|widget  { enabled } -> ChatbotChannels
//   POST   /chatbots/:id/channels/telegram  { token }     -> ChatbotChannels (server sets the webhook)
//   DELETE /chatbots/:id/channels/telegram                -> ChatbotChannels
//
//   GET    /public/:token                        -> PublicChat (no auth; what a guest link shows)
//   POST   /public/:token/chat  { question }     -> ChatAnswer, or 503 chatbot_unavailable when paused
//   GET    /public/:token/documents/:docId/original -> as above; 403 unless sources are "Full document"
//
// Errors come back as { message, code, field? } with a 4xx/5xx status.
import { mockRequest, mockUpload, onMockChange } from "./mockServer";
import {
  ApiError,
  type AddDocumentsRequest,
  type ChatAnswer,
  type Chatbot,
  type ChatbotChannels,
  type CreateChatbotRequest,
  type DocumentOriginal,
  type ModelCatalog,
  type PublicChat,
  type SavePublicLinkRequest,
  type SaveWidgetRequest,
  type UploadedFile,
  type UrlPreview,
} from "./types";

const BASE_URL: string | undefined = import.meta.env.VITE_API_URL;

export const usingMockApi = !BASE_URL;

/**
 * Notifies when data may have changed elsewhere (e.g. the owner paused a chatbot in another tab).
 * The mock hears other tabs instantly; a real backend has no push channel here, so callers also poll.
 */
export const watchChanges = (listener: () => void): (() => void) => (BASE_URL ? () => {} : onMockChange(listener));

async function toApiError(res: Response) {
  const body = await res.json().catch(() => ({}));
  return new ApiError(body.message ?? `Request failed (${res.status})`, res.status, body.code ?? "error", body.field);
}

async function request<T>(method: string, path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  if (!BASE_URL) return mockRequest<T>(method, path, body, signal);
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      signal,
      credentials: "include",
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0, "network");
  }
  if (!res.ok) throw await toApiError(res);
  return (res.status === 204 ? undefined : await res.json()) as T;
}

// fetch() can't report upload progress, so real uploads use XMLHttpRequest.
function upload(file: File, onProgress: (fraction: number) => void, signal?: AbortSignal): Promise<UploadedFile> {
  if (!BASE_URL) return mockUpload(file, onProgress, signal);
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE_URL}/uploads`);
    xhr.withCredentials = true;
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => {
      const body = JSON.parse(xhr.responseText || "{}");
      if (xhr.status >= 200 && xhr.status < 300) resolve(body as UploadedFile);
      else reject(new ApiError(body.message ?? `Upload failed (${xhr.status})`, xhr.status, body.code ?? "error"));
    };
    xhr.onerror = () => reject(new ApiError("Upload failed. Check your connection and try again.", 0, "network"));
    xhr.onabort = () => reject(new DOMException("Upload cancelled", "AbortError"));
    signal?.addEventListener("abort", () => xhr.abort());
    const form = new FormData();
    form.append("file", file);
    xhr.send(form);
  });
}

/** Document metadata comes as JSON; the original file is a separate download. */
async function original(path: string, signal?: AbortSignal): Promise<DocumentOriginal> {
  if (!BASE_URL) return mockRequest<DocumentOriginal>("GET", path, undefined, signal);
  const { fileUrl, ...meta } = await request<Omit<DocumentOriginal, "file"> & { fileUrl: string | null }>(
    "GET",
    path,
    undefined,
    signal,
  );
  const res = fileUrl ? await fetch(fileUrl, { credentials: "include", signal }) : null;
  return { ...meta, file: res?.ok ? await res.blob() : null };
}

export const api = {
  getModels: (signal?: AbortSignal) => request<ModelCatalog>("GET", "/models", undefined, signal),
  uploadFile: upload,
  deleteUpload: (uploadId: string) => request<void>("DELETE", `/uploads/${uploadId}`),
  previewUrl: (url: string, signal?: AbortSignal) =>
    request<UrlPreview>("POST", "/sources/url-preview", { url }, signal),
  createChatbot: (body: CreateChatbotRequest) => request<Chatbot>("POST", "/chatbots", body),
  listChatbots: (signal?: AbortSignal) => request<Chatbot[]>("GET", "/chatbots", undefined, signal),
  getChatbot: (id: string, signal?: AbortSignal) => request<Chatbot>("GET", `/chatbots/${id}`, undefined, signal),
  publishChatbot: (id: string) => request<Chatbot>("POST", `/chatbots/${id}/publish`),
  setChatbotStatus: (id: string, status: "active" | "paused") =>
    request<Chatbot>("PATCH", `/chatbots/${id}`, { status }),
  askPlayground: (id: string, question: string, signal?: AbortSignal) =>
    request<ChatAnswer>("POST", `/chatbots/${id}/chat`, { question }, signal),
  addDocuments: (id: string, body: AddDocumentsRequest) => request<Chatbot>("POST", `/chatbots/${id}/documents`, body),
  removeDocument: (id: string, docId: string) => request<Chatbot>("DELETE", `/chatbots/${id}/documents/${docId}`),
  getDocumentOriginal: (id: string, docId: string, signal?: AbortSignal) =>
    original(`/chatbots/${id}/documents/${docId}/original`, signal),
  getPublicDocumentOriginal: (token: string, docId: string, signal?: AbortSignal) =>
    original(`/public/${token}/documents/${docId}/original`, signal),
  getPublicChat: (token: string, signal?: AbortSignal) =>
    request<PublicChat>("GET", `/public/${token}`, undefined, signal),
  askPublic: (token: string, question: string, signal?: AbortSignal) =>
    request<ChatAnswer>("POST", `/public/${token}/chat`, { question }, signal),

  getChannels: (id: string, signal?: AbortSignal) =>
    request<ChatbotChannels>("GET", `/chatbots/${id}/channels`, undefined, signal),
  savePublicLink: (id: string, body: SavePublicLinkRequest) =>
    request<ChatbotChannels>("PUT", `/chatbots/${id}/channels/public-link`, body),
  regeneratePublicLink: (id: string) =>
    request<ChatbotChannels>("POST", `/chatbots/${id}/channels/public-link/regenerate`),
  saveWidget: (id: string, body: SaveWidgetRequest) =>
    request<ChatbotChannels>("PUT", `/chatbots/${id}/channels/widget`, body),
  setChannelEnabled: (id: string, channel: "public-link" | "widget", enabled: boolean) =>
    request<ChatbotChannels>("PATCH", `/chatbots/${id}/channels/${channel}`, { enabled }),
  connectTelegram: (id: string, token: string) =>
    request<ChatbotChannels>("POST", `/chatbots/${id}/channels/telegram`, { token }),
  disconnectTelegram: (id: string) => request<ChatbotChannels>("DELETE", `/chatbots/${id}/channels/telegram`),
};

export function isAbort(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

export function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  return "Something went wrong. Please try again.";
}
