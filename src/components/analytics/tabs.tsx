// "Answer quality" and "Usage and quota" tabs of the Analytics page, ported from the RAG Studio
// web app (features/analytics/components/{answer-quality-tab,usage-tab}.tsx).
import { useState, type ReactNode } from "react";
import { ArrowRight, FileText, MessageSquare, ThumbsUp, TriangleAlert } from "lucide-react";
import { useGo } from "../../lib/nav";
import type { Analytics, ReportReason, ReportStatus, ReportedAnswer } from "../../services/types";
import { QuotaCard } from "./cards";
import { Select } from "./Select";
import {
  CHANNEL_LABEL,
  CHATBOT_STATUS_TONE,
  REPORT_REASON_COLOR,
  REPORT_STATUS_TONE,
  formatBytes,
  formatDay,
  formatGigabytes,
  formatNumber,
  percentOf,
} from "./format";
import { DataTable, StatBadge, StatusPill, type DataTableColumn } from "./ui";

const ALL = "all";
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const statusOptions = [
  { value: ALL, label: "All" },
  ...(Object.keys(REPORT_STATUS_TONE) as ReportStatus[]).map((s) => ({ value: s, label: capitalize(s) })),
];
const reasonOptions = [
  { value: ALL, label: "All" },
  ...(Object.keys(REPORT_REASON_COLOR) as ReportReason[]).map((r) => ({ value: r, label: capitalize(r) })),
];

const reportColumns: DataTableColumn<ReportedAnswer>[] = [
  {
    key: "question",
    header: "Question",
    className: "min-w-56 whitespace-normal",
    cell: (row) => <span className="text-p4 text-ink font-bold">{row.question}</span>,
  },
  {
    key: "answer",
    header: "Bot answer",
    className: "min-w-56 whitespace-normal",
    cell: (row) => <span className="line-clamp-2">{row.botAnswer}</span>,
  },
  { key: "comment", header: "Comment", className: "min-w-52 whitespace-normal", cell: (row) => row.comment },
  {
    key: "reason",
    header: "Reason",
    cell: (row) => (
      <span className={`text-c2 font-mono tracking-widest uppercase ${REPORT_REASON_COLOR[row.reason]}`}>
        {row.reason}
      </span>
    ),
  },
  { key: "channel", header: "Channel", cell: (row) => CHANNEL_LABEL[row.channel] },
  { key: "date", header: "Date", cell: (row) => formatDay(row.reportedAt) },
  {
    key: "status",
    header: "Status",
    cell: (row) => <StatusPill tone={REPORT_STATUS_TONE[row.status]}>{row.status}</StatusPill>,
  },
];

/** Guest feedback, unanswered questions and reported answers. */
export function AnswerQualityTab({ data, chatbotId }: { data: Analytics; chatbotId: string | null }) {
  const go = useGo();
  const [status, setStatus] = useState(ALL);
  const [reason, setReason] = useState(ALL);
  const { helpful, notHelpful } = data.feedback;
  const rated = helpful + notHelpful;

  const countOf = (s: ReportStatus) => data.reports.filter((r) => r.status === s).length;
  const shownReports = data.reports.filter(
    (r) => (status === ALL || r.status === status) && (reason === ALL || r.reason === reason),
  );

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="bg-success-tint rounded-card-sm border-line flex flex-col border p-6">
          <CardHeading
            icon={<ThumbsUp className="text-success-text size-5" aria-hidden />}
            title="Answer feedback"
            subtitle={`Guest ratings · ${data.periodLabel}`}
          />
          <p className="mt-8 flex items-baseline gap-3">
            <span className="text-h1 text-ink tabular">{rated ? `${percentOf(helpful, rated)}%` : "—"}</span>
            <span className="text-p3 text-ink-secondary">{rated ? "helpful rate" : "no ratings yet"}</span>
          </p>
          <div className="mt-6 flex h-3 gap-1" aria-hidden>
            {rated ? (
              <>
                <span className="bg-success rounded-pill" style={{ flexGrow: helpful }} />
                <span className="bg-danger/50 rounded-pill" style={{ flexGrow: notHelpful }} />
              </>
            ) : (
              <span className="bg-card rounded-pill grow" />
            )}
          </div>
          <dl className="mt-auto grid grid-cols-2 gap-3 pt-8">
            {[
              { label: "Helpful", value: helpful },
              { label: "Not helpful", value: notHelpful },
            ].map((item) => (
              <div key={item.label} className="bg-card rounded-small flex flex-col-reverse px-4 py-3">
                <dt className="text-c1 text-ink-secondary">{item.label}</dt>
                <dd className="text-s1 text-ink tabular">{formatNumber(item.value)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="bg-warning-tint rounded-card-sm border-line flex flex-col border p-6">
          <div className="flex items-start gap-3">
            <CardHeading
              icon={<TriangleAlert className="text-warning-text size-5" aria-hidden />}
              title="Unanswered questions"
              subtitle={`Bot replied "I couldn't find that"`}
            />
            <span className="ml-auto shrink-0">
              <StatBadge>{`${formatNumber(data.unanswered.total)} questions`}</StatBadge>
            </span>
          </div>
          {data.unanswered.top.length ? (
            <ol className="mt-4 flex flex-col gap-2">
              {data.unanswered.top.map((q, i) => (
                <li
                  key={`${q.chatbotId}|${q.question}`}
                  className="bg-card rounded-small flex items-center gap-4 px-4 py-3"
                >
                  <span className="text-c1 text-ink-muted font-mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-p4 text-ink min-w-0 flex-1 truncate">{q.question}</span>
                  <span className="text-c2 text-ink shrink-0">{`${q.count} times`}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="bg-card rounded-small text-p3 text-ink-secondary mt-4 px-4 py-6 text-center">
              {`No unanswered questions ${data.periodLabel}.`}
            </p>
          )}
          <button
            type="button"
            className="text-p4 text-accent mt-auto ml-auto flex w-fit cursor-pointer items-center gap-1 pt-4 font-bold hover:underline"
            onClick={go(`/analytics/unanswered${chatbotId ? `?chatbot=${chatbotId}` : ""}`)}
          >
            {"View all unanswered questions"}
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </section>
      </div>

      <section className="bg-card rounded-card-sm border-line shadow-subtle mt-5 border p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-s1 text-ink">{"Reported answers"}</h2>
            <p className="text-p3 text-ink-secondary">
              {`Guest reports · ${countOf("open")} open, ${countOf("resolved")} resolved, ${countOf("dismissed")} dismissed`}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Select
              label="Status"
              valuePrefix="Status:"
              options={statusOptions}
              value={status}
              onChange={setStatus}
              className="w-56 max-w-full"
            />
            <Select
              label="Reason"
              valuePrefix="Reason:"
              options={reasonOptions}
              value={reason}
              onChange={setReason}
              className="w-56 max-w-full"
            />
          </div>
        </div>
        <DataTable
          className="mt-4"
          caption="Reported answers"
          columns={reportColumns}
          rows={shownReports}
          rowKey={(row) => row.id}
          emptyText={data.reports.length ? "No reported answers match these filters." : "No answers have been reported."}
        />
      </section>
    </>
  );
}

function CardHeading({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="bg-card rounded-small flex size-12 shrink-0 items-center justify-center">{icon}</span>
      <div>
        <h2 className="text-s1 text-ink">{title}</h2>
        <p className="text-p3 text-ink-secondary">{subtitle}</p>
      </div>
    </div>
  );
}

type UsageRow = Analytics["usage"]["perChatbot"][number];

/** Account-wide plan usage, then usage per chatbot. */
export function UsageTab({ data }: { data: Analytics }) {
  const go = useGo();
  const rows = data.usage.perChatbot;
  const { chatbots, chatbotLimit } = data.usage;
  const storageBytes = rows.reduce((n, r) => n + r.storageBytes, 0);
  const limitGb = data.knowledge.storageLimitBytes / 1024 ** 3;
  const usedGb = storageBytes / 1024 ** 3;
  const total = (pick: (r: UsageRow) => number) => rows.reduce((n, r) => n + pick(r), 0);

  const columns: DataTableColumn<UsageRow>[] = [
    {
      key: "chatbot",
      header: "Chatbot",
      className: "w-full",
      cell: (row) => (
        <span className="flex items-center gap-4">
          <span className="text-p4 text-ink font-bold">{row.name}</span>
          <StatusPill tone={CHATBOT_STATUS_TONE[row.status]}>{row.status}</StatusPill>
        </span>
      ),
      footer: "Total",
    },
    {
      key: "documents",
      header: "Documents",
      cell: (row) => formatNumber(row.documents),
      footer: formatNumber(total((r) => r.documents)),
    },
    {
      key: "storage",
      header: "Storage",
      cell: (row) => formatBytes(row.storageBytes),
      footer: formatBytes(storageBytes),
    },
    {
      key: "index",
      header: "Index size",
      cell: (row) => formatBytes(row.indexBytes),
      footer: formatBytes(total((r) => r.indexBytes)),
    },
    {
      key: "messages",
      header: "Messages",
      cell: (row) => formatNumber(row.messages),
      footer: formatNumber(total((r) => r.messages)),
    },
  ];

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-2">
        <QuotaCard
          title="Chatbots"
          icon={MessageSquare}
          tone="accent"
          used={chatbots}
          quota={chatbotLimit}
          usedLabel={String(chatbots)}
          quotaLabel={`/ ${chatbotLimit} chatbots`}
          note={
            chatbots > chatbotLimit
              ? `${chatbots - chatbotLimit} over your plan`
              : `${chatbotLimit - chatbots} remaining on your plan`
          }
          meter="segments"
        />
        <QuotaCard
          title="Storage"
          icon={FileText}
          tone="info"
          used={usedGb}
          quota={limitGb}
          usedLabel={usedGb >= 0.1 ? formatGigabytes(usedGb) : formatBytes(storageBytes)}
          quotaLabel={`/ ${formatGigabytes(limitGb)} GB`}
          note={`${formatGigabytes(Math.max(0, limitGb - usedGb))} GB free`}
          meter="bar"
        />
      </div>
      <section className="bg-card rounded-card-sm border-line shadow-subtle mt-5 border p-6">
        <h2 className="text-s1 text-ink">{"Usage by chatbot"}</h2>
        <p className="text-p3 text-ink-secondary">{`Documents, storage and messages per chatbot · ${data.periodLabel}`}</p>
        <DataTable
          className="mt-4"
          caption="Usage by chatbot"
          columns={columns}
          rows={rows}
          rowKey={(row) => row.chatbotId}
          onRowClick={(row) => go(`/bot?id=${row.chatbotId}`)()}
          emptyText="No chatbots yet."
        />
      </section>
    </>
  );
}
