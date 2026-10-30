// Formats and labels used on the analytics screens.
import type { AnalyticsChannel, ChatbotStatus, DocumentStatus, ReportReason, ReportStatus } from "../../services/types";

export const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

export function formatNumber(value: number) {
  return Math.round(value).toLocaleString("en-US");
}

/** 1.8 → "1.8", 2 → "2". */
export function formatGigabytes(gb: number) {
  return String(Math.round(gb * 10) / 10);
}

/** 540 MB → "540 MB", 1.1 GB → "1.1 GB", small files in KB. */
export function formatBytes(bytes: number) {
  const mb = bytes / 1024 ** 2;
  if (mb >= 1000) return `${formatGigabytes(bytes / 1024 ** 3)} GB`;
  if (mb >= 1) return `${Math.round(mb)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

export function percentOf(part: number, whole: number) {
  return whole ? Math.round((part / whole) * 100) : 0;
}

export function formatAgo(iso: string, now = Date.now()) {
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (s < 45) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.round(h / 24)} d ago`;
}

/** "Oct 9" */
export const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export const CHANNEL_LABEL: Record<AnalyticsChannel, string> = {
  "public-link": "Public link",
  widget: "Web widget",
  telegram: "Telegram",
  playground: "Playground",
};

export type PillTone = "success" | "warning" | "danger" | "info" | "neutral";

export const CHATBOT_STATUS_TONE: Record<ChatbotStatus, PillTone> = {
  active: "success",
  paused: "warning",
  pending: "info",
  draft: "neutral",
};

export const DOCUMENT_STATUS_TONE: Record<DocumentStatus, PillTone> = {
  ready: "success",
  processing: "info",
  queued: "neutral",
  failed: "danger",
};

export const REPORT_STATUS_TONE: Record<ReportStatus, PillTone> = {
  open: "info",
  resolved: "success",
  dismissed: "neutral",
};

/** Text color for each reason in the reports table. */
export const REPORT_REASON_COLOR: Record<ReportReason, string> = {
  inaccurate: "text-danger-text",
  unhelpful: "text-warning-text",
};
