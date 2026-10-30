// Chatbot detail header and Overview tab, ported from the RAG Studio web app
// (features/chatbots/components/{chatbot-detail-header,chatbot-overview,messages-chart-card}.tsx).
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  ChevronDown,
  Cpu,
  ExternalLink,
  Pencil,
  FileText,
  Globe,
  Link2,
  MessageSquare,
  MessageSquareWarning,
  MoreHorizontal,
  Pause,
  Play,
  Send,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api, isAbort, watchChanges } from "../../services/api";
import { STARTER_QUESTIONS_MAX } from "../../services/limits";
import type { Analytics, Chatbot, ChatbotChannels, ChatbotDocument, ChatbotStatus } from "../../services/types";
import {
  CHATBOT_STATUS_TONE,
  DOCUMENT_STATUS_TONE,
  cn,
  formatBytes,
  formatDay,
  formatNumber,
  type PillTone,
} from "../analytics/format";
import { DataTable, StatusPill, type DataTableColumn } from "../analytics/ui";

// MOCK: the prototype has no sign-in; the owner is the user shown in the sidebar.
const OWNER_NAME = "Chann Sreypich";
const PREVIEW_ROWS = 3;

const formatShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

const pillButton =
  "rounded-pill text-p4 inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 px-5 font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0";

/** The three channels in the order the web app lists them, with what each one is doing now. */
export function channelRows(bot: Chatbot, channels: ChatbotChannels) {
  const live: Record<ChatbotStatus, { label: string; tone: PillTone }> = {
    active: { label: "Live", tone: "success" },
    paused: { label: "Paused", tone: "warning" },
    pending: { label: "Pending", tone: "info" },
    draft: { label: "Draft", tone: "neutral" },
  };
  const state = (connected: boolean, enabled: boolean) =>
    !connected
      ? { label: "Not connected", tone: "neutral" as const }
      : !enabled
        ? { label: "Disabled", tone: "danger" as const }
        : live[bot.status];
  const { publicLink: link, widget, telegram } = channels;
  return [
    {
      key: "widget",
      label: "Web widget",
      icon: Globe,
      connected: widget.configured,
      state: state(widget.configured, widget.enabled),
      detail: widget.configured
        ? `On ${widget.allowedDomains.join(", ")}`
        : "Not connected · embed a chat bubble on your website",
    },
    {
      key: "telegram",
      label: "Telegram",
      icon: Send,
      connected: telegram.connected,
      state: state(telegram.connected, true),
      detail: telegram.connected
        ? `${telegram.botUsername} · ${telegram.messagesThisWeek} messages this week`
        : "Not connected · answer inside a Telegram bot",
    },
    {
      key: "link",
      label: "Public link",
      icon: Link2,
      connected: link.configured,
      state: state(link.configured, link.enabled),
      detail: link.configured && link.url ? link.url : "Not connected · share a page guests can open in any browser",
    },
  ];
}

/** Card above the tabs: who the chatbot is, what it runs on, and the actions its status allows. */
export function ChatbotHeader({
  bot,
  channels,
  busy,
  onPublish,
  onPause,
  onResume,
  onPlayground,
  onKnowledge,
  onChannels,
  onEdit,
  onDelete,
}: {
  bot: Chatbot;
  channels: ChatbotChannels | null;
  busy: boolean;
  onPublish: () => void;
  onPause: () => void;
  onResume: () => void;
  onPlayground: () => void;
  onKnowledge: () => void;
  onChannels: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const connected = channels ? channelRows(bot, channels).filter((c) => c.connected).length : null;
  const docs = bot.documents.length;
  const chips: { icon: LucideIcon; label: string; value: string; tone: string; onClick?: () => void }[] = [
    { icon: Cpu, label: "Chat model", value: bot.settings.chatModel, tone: "bg-accent-tint text-accent" },
    { icon: Globe, label: "Language", value: bot.settings.language, tone: "bg-info-tint text-info-text" },
    { icon: MessageSquare, label: "Tone", value: bot.settings.tone, tone: "bg-success-tint text-success-text" },
    {
      icon: Link2,
      label: "Knowledge base",
      value: `${docs} document${docs === 1 ? "" : "s"}`,
      tone: "bg-warning-tint text-warning-text",
      onClick: onKnowledge,
    },
    {
      icon: Send,
      label: "Channels",
      value:
        connected === null
          ? "…"
          : connected === 0
            ? "No channels"
            : `${connected} channel${connected === 1 ? "" : "s"}`,
      tone: "bg-danger-tint text-danger-text",
      onClick: onChannels,
    },
  ];

  // One button whose meaning follows the status. A draft has nothing to publish until a document is ready.
  const primary = {
    draft: { label: "Publish", icon: Send, onClick: onPublish },
    pending: { label: "Publish", icon: Send, onClick: onPublish },
    active: { label: "Pause", icon: Pause, onClick: onPause },
    paused: { label: "Resume", icon: Play, onClick: onResume },
  }[bot.status];
  const PrimaryIcon = primary.icon;
  const publicUrl = channels?.publicLink.configured ? channels.publicLink.url : null;

  return (
    <section className="rounded-card border-line bg-card shadow-subtle border p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-h3 text-ink">{bot.name}</h1>
            <StatusPill tone={CHATBOT_STATUS_TONE[bot.status]}>{bot.status}</StatusPill>
          </div>
          {bot.description && <p className="text-p3 text-ink-body mt-2">{bot.description}</p>}
          <p className="text-c1 text-ink-secondary mt-2">
            {`Created ${formatShortDate(bot.createdAt)} · Updated ${formatShortDate(bot.updatedAt)} · Owner: ${OWNER_NAME}`}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            disabled={busy || bot.status === "draft"}
            title={bot.status === "draft" ? "Wait until a document is ready before you publish" : undefined}
            className={cn(pillButton, "border-line bg-card text-ink hover:bg-subtle border")}
            onClick={primary.onClick}
          >
            <PrimaryIcon aria-hidden />
            {primary.label}
          </button>
          <button type="button" className={cn(pillButton, "bg-inverse text-on-inverse")} onClick={onPlayground}>
            <Play aria-hidden />
            {"Open Playground"}
          </button>
          <MoreMenu name={bot.name} publicUrl={publicUrl} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-5 gap-3">
        {chips.map(({ icon: Icon, label, value, tone, onClick }) => (
          <div
            key={label}
            className={cn(
              "rounded-small border-line flex min-w-0 items-center gap-3 border px-4 py-3",
              onClick && "hover:bg-subtle cursor-pointer transition-colors",
            )}
            onClick={onClick}
          >
            <span className={cn("rounded-small flex size-9 shrink-0 items-center justify-center", tone)}>
              <Icon aria-hidden className="size-4" />
            </span>
            <span className="min-w-0">
              <dt className="text-c1 text-ink-secondary">{label}</dt>
              <dd className="text-p4 text-ink truncate font-bold">{value}</dd>
            </span>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** "…" button with the less common actions. */
function MoreMenu({
  name,
  publicUrl,
  onEdit,
  onDelete,
}: {
  name: string;
  publicUrl: string | null;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const item =
    "rounded-small text-p3 flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-left [&_svg]:size-4";
  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-label={`More actions for ${name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        className="rounded-pill border-line text-ink-secondary hover:bg-subtle hover:text-ink flex size-11 cursor-pointer items-center justify-center border transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <MoreHorizontal aria-hidden className="size-4" />
      </button>
      {open && (
        <div
          role="menu"
          className="rounded-small border-line bg-card shadow-elevated absolute top-full right-0 z-30 mt-2 w-60 border p-1.5"
        >
          {publicUrl && (
            <button
              type="button"
              role="menuitem"
              className={cn(item, "text-ink-body hover:bg-subtle hover:text-ink")}
              onClick={() => {
                setOpen(false);
                window.open(publicUrl, "_blank", "noopener");
              }}
            >
              <ExternalLink aria-hidden />
              {"Open public link"}
            </button>
          )}
          <button
            type="button"
            role="menuitem"
            className={cn(item, "text-ink-body hover:bg-subtle hover:text-ink")}
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
          >
            <Pencil aria-hidden />
            {"Edit name & description"}
          </button>
          <button
            type="button"
            role="menuitem"
            className={cn(item, "text-danger-text hover:bg-danger-tint")}
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
          >
            <Trash2 aria-hidden />
            {"Delete chatbot"}
          </button>
        </div>
      )}
    </div>
  );
}

/** Underlined tab bar under the chatbot header. Tabs without `onClick` aren't built yet. */
export function ChatbotTabs({ tabs }: { tabs: { label: string; active: boolean; onClick?: () => void }[] }) {
  return (
    <nav aria-label="Chatbot sections" className="border-line flex gap-8 overflow-x-auto border-b">
      {tabs.map(({ label, active, onClick }) => (
        <button
          key={label}
          type="button"
          aria-current={active ? "page" : undefined}
          disabled={!onClick}
          title={onClick ? undefined : "Not part of this prototype yet"}
          onClick={onClick}
          className={cn(
            "text-p1 -mb-px shrink-0 border-b-2 pb-3 transition-colors",
            active ? "border-line-strong text-ink font-bold" : "text-ink-secondary border-transparent",
            onClick && !active && "hover:text-ink cursor-pointer",
          )}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

/** Messages, sessions and unanswered questions of one chatbot over the last `days` days. */
function useBotAnalytics(chatbotId: string, days: number) {
  const [data, setData] = useState<Analytics | null>(null);
  const [reload, setReload] = useState(0);
  useEffect(() => watchChanges(() => setReload((r) => r + 1)), []);
  useEffect(() => {
    const controller = new AbortController();
    api
      .getAnalytics("daily", chatbotId, controller.signal, days)
      .then(setData)
      .catch((e) => !isAbort(e) && console.warn("Couldn't load chatbot analytics", e));
    return () => controller.abort();
  }, [chatbotId, days, reload]);
  return data;
}

const STATS_DAYS = 30;

/** The four counts in one bordered row. */
export function OverviewStats({ bot, channels }: { bot: Chatbot; channels: ChatbotChannels | null }) {
  const data = useBotAnalytics(bot.id, STATS_DAYS);
  const docs = bot.documents.length;
  const ready = bot.documents.filter((d) => d.status === "ready").length;
  const connected = channels ? channelRows(bot, channels).filter((c) => c.connected).length : null;
  const messages = data?.totals.messages ?? null;
  const change = data?.totals.messagesChangePct ?? null;

  const channelHint =
    connected === null
      ? "…"
      : connected === 0
        ? "Not connected"
        : {
            active: "All live",
            paused: "Paused – not answering",
            pending: "Waiting to be published",
            draft: "Not published",
          }[bot.status];

  const cards = [
    {
      icon: MessageSquare,
      tone: "text-accent",
      label: "Messages",
      value: messages,
      hint:
        messages === null
          ? "…"
          : messages === 0
            ? "No messages yet"
            : `Last ${STATS_DAYS} days${change === null ? "" : ` · ${change < 0 ? "" : "+"}${change.toFixed(0)}% vs before`}`,
    },
    {
      icon: FileText,
      tone: "text-accent",
      label: "Documents",
      value: docs,
      hint: docs === 0 ? "None yet" : ready === docs ? "All ready" : `${ready} ready`,
    },
    { icon: Link2, tone: "text-info-text", label: "Channels", value: connected, hint: channelHint },
    {
      icon: MessageSquareWarning,
      tone: "text-warning-text",
      label: "Unanswered",
      value: data?.totals.unanswered ?? null,
      hint: !data
        ? "…"
        : data.totals.messages === 0
          ? "No questions yet"
          : `${((data.totals.unanswered / data.totals.messages) * 100).toFixed(1)}% of questions`,
    },
  ];

  return (
    <section className="rounded-card border-line bg-card shadow-subtle border">
      <dl className="grid grid-cols-4">
        {cards.map(({ icon: Icon, tone, label, value, hint }, index) => (
          <div key={label} className={cn("border-line p-7", index > 0 && "border-l")}>
            <dt className="text-p4 text-ink flex items-center gap-2">
              <Icon aria-hidden className={cn("size-4", tone)} />
              {label}
            </dt>
            <dd className="text-h2 text-ink tabular mt-3">{value === null ? "—" : formatNumber(value)}</dd>
            <p className="text-c1 text-ink-secondary mt-1">{hint}</p>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** White rounded card with a title row ("Title" + "Label →" link) and its content. */
function Card({
  title,
  action,
  onAction,
  children,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-card border-line bg-card text-ink-body shadow-subtle border py-7">
      <div className="flex items-center justify-between gap-3 px-7">
        <h2 className="text-s1 text-ink">{title}</h2>
        {action && onAction && (
          <button
            type="button"
            className="text-p4 text-ink hover:text-accent flex shrink-0 cursor-pointer items-center gap-1.5 transition-colors"
            onClick={onAction}
          >
            {action}
            <ArrowRight aria-hidden className="size-4" />
          </button>
        )}
      </div>
      <div className="mt-5 px-7">{children}</div>
    </section>
  );
}

const RANGES = [7, 14, 30] as const;
const axisTick = { fill: "var(--ink-muted)", fontSize: 12 };

/** Messages over time, with a 7D / 14D / 30D switch. */
export function MessagesChartCard({ chatbotId }: { chatbotId: string }) {
  const [days, setDays] = useState<(typeof RANGES)[number]>(14);
  const data = useBotAnalytics(chatbotId, days);
  const gradientId = useId();

  const points = (data?.trend ?? []).map((p) => ({ label: formatDay(p.start), messages: p.messages }));
  const xTicks = [
    points[0]?.label,
    points[Math.floor((points.length - 1) / 2)]?.label,
    points[points.length - 1]?.label,
  ].filter((label): label is string => Boolean(label));
  const total = data?.totals.messages ?? 0;
  const peak = points.reduce<(typeof points)[number] | null>(
    (best, p) => (!best || p.messages > best.messages ? p : best),
    null,
  );
  const change = data?.totals.messagesChangePct ?? null;
  const first = data?.trend[0]?.start;
  const last = data?.trend[data.trend.length - 1]?.start;
  const year = last ? new Date(last).getFullYear() : "";

  return (
    <section className="rounded-card border-line bg-card text-ink-body shadow-subtle border py-7">
      <div className="flex flex-wrap items-start justify-between gap-3 px-7">
        <div>
          <h2 className="text-s1 text-ink">{"Messages"}</h2>
          <p className="text-c1 text-ink-secondary mt-1">
            {first && last
              ? `Last ${days} days · ${formatDay(first)} – ${formatDay(last)}, ${year}`
              : `Last ${days} days`}
          </p>
        </div>
      </div>
      <div className="mt-3 px-7">
        <div
          role="radiogroup"
          aria-label="Date range"
          className="rounded-input border-line bg-card inline-flex h-10 items-center gap-1 border p-1"
        >
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={days === r}
              className={cn(
                "rounded-small text-p4 h-full cursor-pointer px-3 transition-colors",
                days === r ? "bg-inverse text-on-inverse" : "text-ink-secondary hover:bg-subtle hover:text-ink",
              )}
              onClick={() => setDays(r)}
            >
              {`${r}D`}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 px-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2">
              <span className="text-h2 text-ink tabular">{data ? formatNumber(total) : "—"}</span>
              {change !== null && (
                <span
                  className={cn(
                    "rounded-pill text-c1 px-2 py-0.5",
                    change < 0 ? "bg-danger-tint text-danger-text" : "bg-success-tint text-success-text",
                  )}
                >
                  {`${change < 0 ? "↓" : "↑"} ${change < 0 ? "" : "+"}${change.toFixed(0)}%`}
                </span>
              )}
            </p>
            <p className="text-c1 text-ink-secondary mt-1">{`Total messages · vs previous ${days} days`}</p>
          </div>
          <dl className="flex gap-8">
            <Stat label="Avg / day" value={data ? formatNumber(Math.round(total / days)) : "—"} />
            <Stat label="Peak" value={peak ? `${formatNumber(peak.messages)} · ${peak.label}` : "—"} />
            <Stat label="Today" value={points.length ? formatNumber(points[points.length - 1].messages) : "—"} />
          </dl>
        </div>

        <div className="mt-8 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 4, right: 24, bottom: 0, left: -16 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--ink-primary)" stopOpacity={0.14} />
                  <stop offset="100%" stopColor="var(--ink-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border-default)" vertical={false} />
              <XAxis dataKey="label" ticks={xTicks} interval={0} tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} width={48} allowDecimals={false} />
              <Tooltip
                cursor={{ stroke: "var(--border-default)", strokeDasharray: "4 4" }}
                contentStyle={{
                  background: "var(--bg-inverse)",
                  border: "none",
                  borderRadius: 12,
                  color: "var(--ink-inverse)",
                  fontSize: 12,
                }}
                labelStyle={{ color: "var(--ink-inverse)", opacity: 0.7 }}
                itemStyle={{ color: "var(--ink-inverse)" }}
                formatter={(value) => [`${formatNumber(Number(value))} messages`, ""]}
                separator=""
              />
              <Area
                type="monotone"
                dataKey="messages"
                stroke="var(--ink-primary)"
                strokeWidth={2}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-c1 text-ink-secondary">{label}</dt>
      <dd className="text-p4 text-ink tabular mt-1 font-bold">{value}</dd>
    </div>
  );
}

const DOCUMENT_STATUS_LABEL: Record<ChatbotDocument["status"], string> = {
  ready: "Ready",
  processing: "Processing",
  queued: "Queued",
  failed: "Failed",
};

/** First few documents, with a link to the Knowledge base tab. */
export function KnowledgeBaseCard({
  documents,
  onManage,
  onView,
}: {
  documents: ChatbotDocument[];
  onManage: () => void;
  onView: (doc: ChatbotDocument) => void;
}) {
  const rows = documents.slice(0, PREVIEW_ROWS);
  const columns: DataTableColumn<ChatbotDocument>[] = [
    {
      key: "name",
      header: "Name",
      className: "w-full max-w-0",
      cell: (doc) => <span className="text-ink block truncate">{doc.name}</span>,
    },
    { key: "type", header: "Type", cell: (doc) => (doc.kind === "url" ? "URL" : doc.type) },
    { key: "size", header: "Size", cell: (doc) => (doc.sizeBytes === null ? "—" : formatBytes(doc.sizeBytes)) },
    {
      key: "status",
      header: "Status",
      cell: (doc) => (
        <StatusPill tone={DOCUMENT_STATUS_TONE[doc.status]} plain>
          <span className="rounded-pill size-1.5 bg-current" aria-hidden />
          {DOCUMENT_STATUS_LABEL[doc.status]}
        </StatusPill>
      ),
    },
  ];

  return (
    <Card title="Knowledge base" action="Manage documents" onAction={onManage}>
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(doc) => doc.id}
        caption="Documents in this knowledge base"
        emptyText="No documents yet."
        onRowClick={onView}
      />
      {documents.length > rows.length && (
        <p className="text-c1 text-ink-secondary mt-4">{`Showing ${rows.length} of ${documents.length} documents`}</p>
      )}
    </Card>
  );
}

/** The questions a guest sees before they type anything. */
export function StarterQuestionsCard({ questions }: { questions: string[] }) {
  return (
    <Card title="Starter questions">
      {questions.length === 0 ? (
        <p className="text-p4 text-ink-muted">{"No starter questions yet."}</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {questions.map((question) => (
            <li
              key={question}
              className="rounded-pill bg-subtle text-p4 text-ink-body flex items-center gap-2 px-4 py-2.5"
            >
              <MessageSquare aria-hidden className="text-ink-muted size-3.5 shrink-0" />
              {question}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/** One row per channel, whether it is connected or not; the arrow on each row shows its details. */
export function ChannelsCard({
  bot,
  channels,
  onManage,
}: {
  bot: Chatbot;
  channels: ChatbotChannels | null;
  onManage: () => void;
}) {
  const rows = channels ? channelRows(bot, channels) : [];
  const connected = rows.filter((r) => r.connected).length;
  // Each row shows its details only after its arrow is clicked.
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const idPrefix = useId();
  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  return (
    <Card
      title={channels ? `Channels · ${connected} of ${rows.length} connected` : "Channels"}
      action="Manage"
      onAction={onManage}
    >
      {!channels ? (
        <p className="text-p4 text-ink-muted">{"Loading channels…"}</p>
      ) : (
        <div className="space-y-3">
          {rows.map(({ key, label, icon: Icon, state, detail }) => {
            const open = expanded.has(key);
            const detailId = `${idPrefix}-${key}`;
            return (
              <div key={key} className="rounded-small border-line border p-4">
                <div className="flex items-center gap-3">
                  <span className="bg-subtle rounded-small text-ink-secondary flex size-9 shrink-0 items-center justify-center">
                    <Icon aria-hidden className="size-4" />
                  </span>
                  <span className="text-p4 text-ink min-w-0 flex-1 truncate font-bold">{label}</span>
                  <StatusPill tone={state.tone} className="shrink-0">
                    {state.label}
                  </StatusPill>
                  <button
                    type="button"
                    aria-label={`${open ? "Hide" : "Show"} ${label} details`}
                    aria-expanded={open}
                    aria-controls={detailId}
                    className="rounded-tag text-ink-muted hover:bg-subtle hover:text-ink flex size-8 shrink-0 cursor-pointer items-center justify-center transition-colors"
                    onClick={() => toggle(key)}
                  >
                    <ChevronDown aria-hidden className={cn("size-4 transition-transform", open && "rotate-180")} />
                  </button>
                </div>
                {open && (
                  <p id={detailId} className="text-c1 text-ink-secondary mt-3 pl-12 break-words">
                    {detail}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

/** Read-only summary of the chatbot's settings. */
export function ConfigurationCard({ settings }: { settings: Chatbot["settings"] }) {
  const { advanced } = settings;
  const rows = [
    { label: "Chat model", value: settings.chatModel },
    { label: "Embedding model", value: `${settings.embeddingModel} · locked` },
    { label: "Tone", value: settings.tone },
    { label: "Answer length", value: settings.answerLength },
    { label: "Formatting", value: settings.formatting },
    { label: "Language", value: settings.language },
    { label: "Temperature", value: advanced.temperature.toFixed(2) },
    { label: "Top K · Search", value: `${advanced.topK} · ${advanced.searchMode}` },
    { label: "Chunk size / overlap", value: `${advanced.chunkSize} / ${advanced.chunkOverlap} tokens` },
    { label: "Sources shown to guests", value: settings.sourceVisibility },
    { label: "Answer from documents only", value: advanced.documentsOnly ? "Yes" : "No" },
    { label: "Starter questions", value: `${settings.starterQuestions.length} of ${STARTER_QUESTIONS_MAX}` },
  ];
  return (
    <Card title="Configuration">
      <dl className="-mt-1">
        {rows.map(({ label, value }) => (
          <div
            key={label}
            className="border-line flex items-center justify-between gap-4 border-b py-3.5 last:border-b-0"
          >
            <dt className="text-p4 text-ink-body">{label}</dt>
            <dd className="text-p4 text-ink truncate font-bold">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

/** Red card at the end of the right column. Deleting cannot be undone. */
export function DangerZoneCard({ bot, onDelete }: { bot: Chatbot; onDelete: () => void }) {
  return (
    <section className="rounded-card border-danger-text/20 bg-danger-tint border p-7">
      <h2 className="text-s1 text-danger-text">{"Danger zone"}</h2>
      <p className="text-p4 text-ink-body mt-3 leading-6">
        {`Deleting permanently removes ${bot.name}, its ${bot.documents.length} documents, vector chunks and conversation logs. Guest channels will show “This chatbot is no longer available!”`}
      </p>
      <button
        type="button"
        className={cn(pillButton, "bg-danger hover:bg-danger/90 mt-5 text-white")}
        onClick={onDelete}
      >
        <Trash2 aria-hidden />
        {"Delete chatbot"}
      </button>
    </section>
  );
}
