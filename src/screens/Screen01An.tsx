// Demo 01 · [an] A1 · Analytics overview
// Route: #/
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, FileText, FlaskConical, MessagesSquare, RotateCw, SquareActivity } from "lucide-react";
import { useGo } from "../lib/nav";
import { AppSidebar } from "../components/shared/AppSidebar";
import { ChannelBreakdown, MessageTrendChart, StatCard } from "../components/analytics/cards";
import { AnswerQualityTab, UsageTab } from "../components/analytics/tabs";
import { Select } from "../components/analytics/Select";
import { PageHeader, StatBadge } from "../components/analytics/ui";
import { formatAgo, formatBytes, formatNumber } from "../components/analytics/format";
import { api, isAbort, watchChanges } from "../services/api";
import type { Analytics, AnalyticsGranularity, Chatbot } from "../services/types";

type Tab = "overview" | "answer-quality" | "usage";
const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "answer-quality", label: "Answer quality" },
  { id: "usage", label: "Usage and quota" },
];
const ALL = "all";
/** The dashboard refreshes itself this often. */
const REFRESH_MS = 60_000;

export default function Screen01An() {
  const go = useGo();
  const [params, setParams] = useSearchParams();
  const tabParam = params.get("tab");
  const tab: Tab = tabParam === "answer-quality" || tabParam === "usage" ? tabParam : "overview";
  const setTab = (t: Tab) => setParams(t === "overview" ? {} : { tab: t }, { replace: true });

  const [granularity, setGranularity] = useState<AnalyticsGranularity>("daily");
  const [chatbotId, setChatbotId] = useState<string | null>(null);
  const [bots, setBots] = useState<Chatbot[]>([]);
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  const refresh = () => setReload((r) => r + 1);

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
    setLoading(true);
    api
      .getAnalytics(granularity, chatbotId, controller.signal)
      .then((result) => {
        setData(result);
        setError(false);
        setLoading(false);
      })
      .catch((e) => {
        if (isAbort(e)) return;
        setError(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, [granularity, chatbotId, reload]);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 15_000);
    const poll = setInterval(refresh, REFRESH_MS);
    const unwatch = watchChanges(refresh);
    return () => {
      clearInterval(tick);
      clearInterval(poll);
      unwatch();
    };
  }, []);

  const selectedBot = bots.find((b) => b.id === chatbotId);
  const scope = selectedBot ? selectedBot.name : `all ${data?.chatbotCount ?? bots.length} chatbots`;
  const chatbotOptions = [
    { value: ALL, label: "All chatbots" },
    ...bots.map((b) => ({ value: b.id, label: b.name })),
  ];
  const periodLabel = data?.periodLabel ?? "last 14 days";
  const change = data?.totals.messagesChangePct ?? null;
  const pending = data ? data.knowledge.documents - data.knowledge.readyDocuments : 0;
  const show = (pick: (d: Analytics) => string) => (data ? pick(data) : "—");

  return (
    <div className="relative w-full h-full bg-page overflow-hidden flex items-start font-gabarito">
      <AppSidebar active="analytics" links={{ playground: "/tpg", channels: "/tch" }} />
      <main className="flex-1 min-w-0 h-full overflow-y-auto bg-page p-8">
        <PageHeader
          title="Analytics"
          description={
            tab === "usage"
              ? "Account-wide usage and quota across all your chatbots."
              : "Messages, sessions and channel activity for your chatbot."
          }
        />

        <div role="tablist" aria-label="Analytics sections" className="border-line mt-8 flex gap-8 border-b">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`text-p1 -mb-px cursor-pointer border-b-2 pb-3 transition-colors ${
                tab === t.id ? "border-line-strong text-ink font-bold" : "text-ink-secondary hover:text-ink border-transparent"
              }`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab !== "usage" && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <Select
              label="Chatbot"
              valuePrefix="Chatbot:"
              options={chatbotOptions}
              value={chatbotId ?? ALL}
              onChange={(v) => setChatbotId(v === ALL ? null : v)}
              className="w-80 max-w-full"
            />
            <button
              type="button"
              className={`text-p3 flex cursor-pointer items-center gap-2 hover:text-ink ${error ? "text-danger-text" : "text-ink-muted"}`}
              onClick={refresh}
              title="Refresh now"
            >
              {error
                ? "Couldn't load analytics · Retry"
                : !data
                  ? "Loading…"
                  : tab === "answer-quality"
                    ? `Showing reports for ${scope}`
                    : `Showing data for ${scope} · Updated ${loading ? "now…" : formatAgo(data.generatedAt, now)}`}
              <RotateCw className={`size-4 ${loading ? "animate-spin" : ""}`} aria-hidden />
            </button>
          </div>
        )}

        <div className={`mt-6 transition-opacity ${loading && data ? "opacity-60" : ""}`}>
          {tab === "overview" && (
            <>
              <div className="grid gap-5 lg:grid-cols-3">
                <StatCard
                  title="Total messages"
                  icon={MessagesSquare}
                  tone="info"
                  badge={
                    change !== null && (
                      <StatBadge className={change < 0 ? "text-danger-text" : "text-success-text"}>
                        {`${change < 0 ? "↘" : "↗"} ${Math.abs(change).toFixed(1)}%`}
                      </StatBadge>
                    )
                  }
                  value={show((d) => formatNumber(d.totals.messages))}
                  unit={periodLabel}
                  details={[
                    { label: "Answered", value: show((d) => formatNumber(d.totals.answered)) },
                    {
                      label: "Unanswered replies",
                      value: show((d) => formatNumber(d.totals.unanswered)),
                      onClick: () => setTab("answer-quality"),
                    },
                  ]}
                />
                <StatCard
                  title="Active chat sessions"
                  icon={SquareActivity}
                  tone="success"
                  badge={
                    <StatBadge>
                      <span className="bg-success size-2 animate-pulse rounded-full" aria-hidden />
                      {"Live"}
                    </StatBadge>
                  }
                  value={show((d) => formatNumber(d.activeSessions))}
                  unit="chatting right now"
                  details={[
                    { label: "Sessions", value: show((d) => formatNumber(d.totals.sessions)) },
                    { label: "Guests", value: show((d) => formatNumber(d.totals.guests)) },
                  ]}
                />
                <StatCard
                  title="Knowledge base"
                  icon={FileText}
                  tone="accent"
                  badge={
                    data && (
                      <StatBadge className={pending ? "text-warning-text" : "text-success-text"}>
                        {pending ? `Indexing ${pending}` : (
                          <>
                            <Check className="size-3.5" aria-hidden />
                            {"Indexed"}
                          </>
                        )}
                      </StatBadge>
                    )
                  }
                  value={show((d) => formatNumber(d.knowledge.documents))}
                  unit="documents"
                  details={[
                    {
                      label: "Storage used",
                      value: data ? (
                        <>
                          {formatBytes(data.knowledge.storageBytes)}
                          <span className="text-ink-secondary">{` / ${formatBytes(data.knowledge.storageLimitBytes)}`}</span>
                        </>
                      ) : (
                        "—"
                      ),
                      onClick: () => setTab("usage"),
                    },
                    { label: "Index size", value: show((d) => formatBytes(d.knowledge.indexBytes)) },
                  ]}
                />
              </div>
              <div className="mt-5 grid gap-5 xl:grid-cols-3">
                <div className="xl:col-span-2">
                  <MessageTrendChart
                    points={data?.trend ?? []}
                    granularity={data?.granularity ?? granularity}
                    periodLabel={periodLabel}
                    onGranularity={setGranularity}
                  />
                </div>
                <ChannelBreakdown channels={data?.channels ?? []} periodLabel={periodLabel} />
              </div>
            </>
          )}

          {tab === "answer-quality" && data && (
            <>
              {selectedBot && data.totals.messages === 0 && (
                <div className="bg-card rounded-card-sm border-line shadow-subtle mb-5 flex flex-wrap items-center gap-4 border p-6">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-s1 text-ink">{`${selectedBot.name} hasn't answered any questions yet`}</h2>
                    <p className="text-p3 text-ink-secondary">
                      {"Ratings, unanswered questions and reports show up here once guests start chatting."}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="bg-inverse text-on-inverse rounded-pill text-btn-sm flex h-11 cursor-pointer items-center gap-2 px-5"
                    onClick={go(`/pg?bot=${selectedBot.id}`)}
                  >
                    <FlaskConical className="size-4" aria-hidden />
                    {"Try it in the Playground"}
                  </button>
                </div>
              )}
              <AnswerQualityTab data={data} chatbotId={chatbotId} />
            </>
          )}

          {tab === "usage" && data && <UsageTab data={data} />}
        </div>
      </main>
    </div>
  );
}
