// Analytics · Answer quality · All unanswered questions (live data; not a Figma frame)
// Route: #/analytics/unanswered
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppSidebar } from "../components/shared/AppSidebar";
import { Select } from "../components/analytics/Select";
import {
  AppBreadcrumb,
  DataTable,
  PageHeader,
  TablePagination,
  type DataTableColumn,
} from "../components/analytics/ui";
import { CHANNEL_LABEL, formatDay, formatNumber } from "../components/analytics/format";
import { api, isAbort, watchChanges } from "../services/api";
import type { Chatbot, UnansweredEntry } from "../services/types";

const ALL = "all";
const PAGE_SIZE = 10;
const DATE_OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

const columns: DataTableColumn<UnansweredEntry>[] = [
  {
    key: "question",
    header: "Question",
    className: "w-2/5 min-w-64 whitespace-normal",
    cell: (row) => <span className="text-p4 text-ink font-bold">{row.question}</span>,
  },
  {
    key: "reply",
    header: "Last bot reply",
    className: "min-w-64 whitespace-normal",
    cell: (row) => <span className="line-clamp-2">{row.lastReply}</span>,
  },
  { key: "channel", header: "Channel", cell: (row) => CHANNEL_LABEL[row.channel] },
  { key: "date", header: "Date", cell: (row) => formatDay(row.askedAt) },
];

export default function Screen47Unanswered() {
  const [params, setParams] = useSearchParams();
  const chatbotId = params.get("chatbot");
  const [days, setDays] = useState("30");
  const [page, setPage] = useState(1);
  const [bots, setBots] = useState<Chatbot[]>([]);
  const [rows, setRows] = useState<UnansweredEntry[] | null>(null);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => watchChanges(() => setReload((r) => r + 1)), []);

  useEffect(() => {
    const controller = new AbortController();
    api
      .listChatbots(controller.signal)
      .then(setBots)
      .catch((e) => !isAbort(e) && console.warn("Couldn't load chatbots", e));
    return () => controller.abort();
  }, [reload]);

  useEffect(() => {
    const controller = new AbortController();
    api
      .getUnanswered(Number(days), chatbotId, controller.signal)
      .then((result) => {
        setRows(result);
        setError(false);
      })
      .catch((e) => !isAbort(e) && setError(true));
    return () => controller.abort();
  }, [days, chatbotId, reload]);

  const all = rows ?? [];
  const pageCount = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const chatbotOptions = [{ value: ALL, label: "All chatbots" }, ...bots.map((b) => ({ value: b.id, label: b.name }))];

  return (
    <div className="relative w-full h-full bg-page overflow-hidden flex items-start font-gabarito">
      <AppSidebar active="analytics" links={{ playground: "/tpg", channels: "/tch" }} />
      <main className="flex-1 min-w-0 h-full overflow-y-auto bg-page p-8">
        <PageHeader title="Analytics" description="Messages, sessions and channel activity for your chatbot." />
        <div className="mt-6">
          <AppBreadcrumb
            items={[{ label: "Answer quality", to: "/?tab=answer-quality" }, { label: "All unanswered questions" }]}
          />
        </div>

        <section className="bg-card rounded-card-sm border-line shadow-subtle mt-6 border p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-h5 text-ink">{"All unanswered questions"}</h2>
              <p className="text-p3 text-ink-secondary">
                {`Questions your bot couldn't answer from the knowledge base · ${rows ? formatNumber(all.length) : "—"} total`}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Select
                label="Chatbot"
                valuePrefix="Chatbot:"
                options={chatbotOptions}
                value={chatbotId ?? ALL}
                onChange={(v) => {
                  setParams(v === ALL ? {} : { chatbot: v }, { replace: true });
                  setPage(1);
                }}
                className="w-64 max-w-full"
              />
              <Select
                label="Date"
                valuePrefix="Date:"
                options={DATE_OPTIONS}
                value={days}
                onChange={(v) => {
                  setDays(v);
                  setPage(1);
                }}
                className="w-64 max-w-full"
              />
            </div>
          </div>

          <DataTable
            className="mt-6"
            caption="Unanswered questions"
            columns={columns}
            rows={all.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)}
            rowKey={(row) => row.id}
            emptyText={
              error
                ? "Couldn't load unanswered questions."
                : rows
                  ? "No unanswered questions in this period."
                  : "Loading…"
            }
          />
          {all.length > 0 && (
            <TablePagination
              className="mt-6"
              page={current}
              pageSize={PAGE_SIZE}
              total={all.length}
              itemLabel="questions"
              onPageChange={setPage}
            />
          )}
        </section>
      </main>
    </div>
  );
}
