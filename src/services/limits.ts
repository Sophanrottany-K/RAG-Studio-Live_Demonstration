// Limits enforced by the backend. The UI checks them up front for instant feedback,
// and the server (or the mock server) checks them again.

export const NAME_MIN = 2;
export const NAME_MAX = 50;
export const DESCRIPTION_MAX = 200;
export const INSTRUCTIONS_MAX = 2000;
export const STARTER_QUESTIONS_MAX = 4;
export const STARTER_QUESTION_MAX = 80;

export const FILE_TYPES = ["PDF", "DOCX", "TXT", "MD", "XLSX"] as const;
export const FILE_ACCEPT = ".pdf,.docx,.txt,.md,.xlsx";
export const FILE_MAX_BYTES = 20 * 1024 * 1024;
export const SOURCES_MAX = 20;
export const URLS_PER_IMPORT_MAX = 10;

export function fileTypeOf(name: string) {
  const ext = name.includes(".") ? name.split(".").pop()!.toUpperCase() : "";
  return (FILE_TYPES as readonly string[]).includes(ext) ? ext : null;
}

export function formatBytes(bytes: number | null) {
  if (bytes === null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Returns a normalized http(s) URL, or null when the text is not a usable link. */
export function normalizeUrl(text: string) {
  const raw = text.trim();
  if (!raw) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (!["http:", "https:"].includes(url.protocol) || !url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export const LINK_TITLE_MAX = 60;
export const WELCOME_MESSAGE_MAX = 120;
export const ALLOWED_DOMAINS_MAX = 20;

export const isHexColor = (value: string) => /^#[0-9a-f]{6}$/i.test(value);

/** "https://Shop.Example.com/path" -> "shop.example.com"; wildcards like *.example.com are allowed. Null when invalid. */
export function normalizeDomain(text: string) {
  const host = text
    .trim()
    .toLowerCase()
    .replace(/^[a-z]+:\/\//, "")
    .split(/[/?#]/)[0];
  if (/^localhost(:\d{1,5})?$/.test(host)) return host;
  return /^(\*\.)?([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(:\d{1,5})?$/.test(host) ? host : null;
}

/** Bot tokens from @BotFather look like 123456789:AAH... (numeric id, colon, 35-character secret). */
export const isTelegramToken = (value: string) => /^\d{6,12}:[A-Za-z0-9_-]{35}$/.test(value.trim());
