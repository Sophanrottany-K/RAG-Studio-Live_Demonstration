import type { ChatbotStatus, DocumentStatus } from "../../services/types";
import { StatusPill } from "../create/ui";

type PillTone = "neutral" | "warning" | "success" | "danger" | "info";

export const DOC_PILL: Record<DocumentStatus, { tone: PillTone; label: string }> = {
  queued: { tone: "neutral", label: "Queued" },
  processing: { tone: "warning", label: "Processing" },
  ready: { tone: "success", label: "Ready" },
  failed: { tone: "danger", label: "Failed" },
};

export const CHATBOT_PILL: Record<ChatbotStatus, { tone: PillTone; label: string }> = {
  draft: { tone: "neutral", label: "Draft" },
  pending: { tone: "info", label: "Pending" },
  active: { tone: "success", label: "Active" },
  paused: { tone: "warning", label: "Paused" },
};

export function ChatbotStatusPill({ status }: { status: ChatbotStatus }) {
  return <StatusPill tone={CHATBOT_PILL[status].tone}>{CHATBOT_PILL[status].label}</StatusPill>;
}
