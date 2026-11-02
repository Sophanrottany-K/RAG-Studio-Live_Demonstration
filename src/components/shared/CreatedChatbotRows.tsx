import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, isAbort } from "../../services/api";
import type { Chatbot, ChatbotStatus } from "../../services/types";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

type RowStatus = ChatbotStatus | "disabled";

// "disabled" (by an admin) has no ChatbotStatus yet, so only static rows use its pill for now.
const STATUS_PILL: Record<RowStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-neutral-tint border-[#8A8A86] text-neutral-text" },
  pending: { label: "Pending", className: "bg-info-tint border-info-text text-info-text" },
  active: { label: "Active", className: "bg-[#2E9E664D] border-success-solid text-success-text" },
  paused: { label: "Paused", className: "bg-warning-tint border-warning-solid text-warning-text" },
  disabled: { label: "Disabled", className: "bg-danger-tint border-danger-solid text-danger-text" },
};

type Row = {
  key: string;
  name: string;
  description: string;
  status: RowStatus;
  total: number;
  ready: number;
  /** Overrides the knowledge base caption worked out from `ready` and `total`. */
  note?: string;
  channels: string[];
  messages: string;
  created: string;
  updated: string;
  /** Rows with no id are display-only: they have no detail page to open. */
  id?: string;
};

// Display-only rows. With the two demo chatbots (both active) they add up to the Figma stat cards:
// 8 total, 3 active, 4 not live, 1 disabled.
const STATIC_ROWS: Row[] = [
  {
    key: "static_admission",
    name: "Admission Assistant",
    description: "Programs, fees and application deadlines",
    status: "draft",
    total: 0,
    ready: 0,
    channels: [],
    messages: "0",
    created: "Oct 9, 2026",
    updated: "Oct 9, 2026",
  },
  {
    key: "static_finance",
    name: "Finance Bot",
    description: "Expense claims and invoice questions",
    status: "disabled",
    total: 8,
    ready: 8,
    channels: [],
    messages: "2,146",
    created: "Sep 3, 2026",
    updated: "Sep 28, 2026",
  },
  {
    key: "static_it",
    name: "IT Helpdesk",
    description: "Password resets, VPN and device setup",
    status: "active",
    total: 31,
    ready: 29,
    note: "2 processing",
    channels: ["Web widget", "Telegram"],
    messages: "7,630",
    created: "Aug 28, 2026",
    updated: "Oct 7, 2026",
  },
  {
    key: "static_onboarding",
    name: "Onboarding Guide",
    description: "Walks new staff through their first week",
    status: "paused",
    total: 14,
    ready: 14,
    channels: ["Public link"],
    messages: "1,904",
    created: "Aug 15, 2026",
    updated: "Oct 2, 2026",
  },
  {
    key: "static_ops",
    name: "Ops Guide",
    description: "Runbooks and shift handover procedures",
    status: "draft",
    total: 5,
    ready: 3,
    channels: [],
    messages: "0",
    created: "Oct 6, 2026",
    updated: "Oct 8, 2026",
  },
  {
    key: "static_faq",
    name: "Product FAQ (Khmer)",
    description: "Khmer-language product questions",
    status: "pending",
    total: 6,
    ready: 6,
    note: "Ready to publish",
    channels: [],
    messages: "0",
    created: "Oct 3, 2026",
    updated: "Oct 9, 2026",
  },
];

const toRow = (bot: Chatbot): Row => ({
  key: bot.id,
  id: bot.id,
  name: bot.name,
  description: bot.description,
  status: bot.status,
  total: bot.documents.length,
  ready: bot.documents.filter((d) => d.status === "ready").length,
  channels: bot.channels,
  messages: "0",
  created: fmtDate(bot.createdAt),
  updated: fmtDate(bot.updatedAt),
});

/** The stat cards count every chatbot; `shown` is how many are left after the search and status filter. */
export type ChatbotStats = { total: number; active: number; notLive: number; disabled: number; shown: number };
export type StatusFilter = RowStatus | "all";
export type NameSort = "az" | "za";

/** Every chatbot on the list: the API's plus the static ones, narrowed by the table's search, filter and sort. */
export function CreatedChatbotRows({
  search,
  status,
  sort,
  onStats,
}: {
  search: string;
  status: StatusFilter;
  sort: NameSort;
  onStats?: (stats: ChatbotStats) => void;
}) {
  const navigate = useNavigate();
  const [bots, setBots] = useState<Chatbot[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Held back until the first load so the static rows don't reshuffle when the API's arrive.
  const all = loaded ? [...bots.map(toRow), ...STATIC_ROWS] : [];
  const count = all.length;
  const active = all.filter((r) => r.status === "active").length;
  const disabled = all.filter((r) => r.status === "disabled").length;

  const query = search.trim().toLowerCase();
  const rows = all
    .filter((r) => (status === "all" || r.status === status) && r.name.toLowerCase().includes(query))
    .sort((a, b) => (sort === "az" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
  const shown = rows.length;

  useEffect(() => {
    if (loaded) onStats?.({ total: count, active, disabled, notLive: count - active - disabled, shown });
  }, [onStats, loaded, count, active, disabled, shown]);

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    const load = () =>
      api
        .listChatbots(controller.signal)
        .then((list) => {
          setBots(list);
          setLoaded(true);
          if (list.some((b) => b.documents.some((d) => d.status !== "ready"))) timer = setTimeout(load, 2000);
        })
        .catch((e) => {
          if (isAbort(e)) return;
          console.warn("Couldn't load chatbots", e);
          setLoaded(true);
        });
    load();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {loaded && !shown && (
        <div className="self-stretch h-18 shrink-0 bg-[#FFFFFF] border-b border-[#E4E4E0] flex justify-center items-center font-gabarito text-[14px] leading-[20px] text-[#6B6B6B]">
          {"No chatbots match your search or filter"}
        </div>
      )}
      {rows.map((row) => {
        const { id, ready, total } = row;
        const pill = STATUS_PILL[row.status];
        return (
          <div
            key={row.key}
            onClick={id ? () => navigate(`/bot?id=${id}`) : undefined}
            className={`self-stretch h-18 shrink-0 bg-[#FFFFFF] border-b border-[#E4E4E0] flex items-center gap-5 px-4 py-3.5 ${id ? "cursor-pointer hover:bg-bg-page" : ""}`}
          >
            <div className="flex-1 min-w-0 flex flex-col items-start gap-0.5">
              <div className="max-w-full truncate font-gabarito font-bold text-[14px] leading-[20px] text-[#111111]">
                {row.name}
              </div>
              <div className="max-w-full truncate font-gabarito text-[12px] leading-[16px] text-[#6B6B6B]">
                {row.description || "No description"}
              </div>
            </div>
            <div className="w-37.5 shrink-0 flex items-center">
              <div
                className={`w-24 border rounded-[99px] flex justify-center items-center px-2.5 py-1 font-geist-mono font-bold text-[11px] leading-[16px] tracking-[0.01em] uppercase ${pill.className}`}
              >
                {pill.label}
              </div>
            </div>
            <div className="w-47.5 shrink-0 flex flex-col items-start gap-1.5">
              <div className="flex items-center gap-1.5">
                <div className="font-gabarito font-medium text-[14px] leading-[20px] text-[#111111]">{`${total} doc${total === 1 ? "" : "s"}`}</div>
                <div className="font-gabarito text-[12px] leading-[16px] text-[#8A8A86]">
                  {row.note ??
                    (!total ? "Add documents" : ready === total ? "All ready" : `${ready} of ${total} ready`)}
                </div>
              </div>
              <div className="w-35 h-1 bg-[#F0F0EE] rounded-[20px] overflow-hidden">
                <div
                  className={`h-full rounded-[20px] transition-[width] duration-500 ${ready === total ? "bg-[#2E9E66]" : "bg-[#E0A100]"}`}
                  style={{ width: total ? `${(ready / total) * 100}%` : 0 }}
                />
              </div>
            </div>
            <div
              className={`w-37.5 shrink-0 truncate font-gabarito text-[12px] leading-[16px] ${row.channels.length ? "text-[#111111]" : "text-[#9A9A96]"}`}
            >
              {row.channels.length ? row.channels.join(" · ") : "Not connected"}
            </div>
            <div className="w-27.5 shrink-0 text-right font-gabarito font-medium text-[14px] leading-[20px] text-[#111111]">
              {row.messages}
            </div>
            <div className="w-32.5 shrink-0 font-gabarito font-medium text-[13px] leading-[16px] text-[#444444]">
              {row.created}
            </div>
            <div className="w-32.5 shrink-0 font-gabarito font-medium text-[13px] leading-[16px] text-[#444444]">
              {row.updated}
            </div>
          </div>
        );
      })}
    </>
  );
}
