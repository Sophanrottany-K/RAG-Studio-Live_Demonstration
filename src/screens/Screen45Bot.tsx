// Chatbot detail (status, publish / pause / resume / delete, Overview and Knowledge base tabs)
// Route: #/bot?id=<chatbotId>&tab=knowledge  (also the old static detail routes: dDraft, dPend, active2, paused, …)
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppBreadcrumb, PageHeader } from "../components/analytics/ui";
import {
  ChannelsCard,
  ChatbotHeader,
  ChatbotTabs,
  ConfigurationCard,
  DangerZoneCard,
  KnowledgeBaseCard,
  MessagesChartCard,
  OverviewStats,
  StarterQuestionsCard,
} from "../components/chatbot/overview";
import { EditDetailsDialog } from "../components/chatbot/EditDetailsDialog";
import { DocumentViewer } from "../components/documents/DocumentViewer";
import { KnowledgeTab } from "../components/knowledge/KnowledgeTab";
import { ConfirmDialog } from "../components/create/ConfirmDialog";
import { Banner, Button, Spinner } from "../components/create/ui";
import { Sidebar4 } from "../components/shared/Sidebar4";
import { useGo } from "../lib/nav";
import { useChatbot } from "../lib/useChatbot";
import { api, errorMessage, isAbort } from "../services/api";
import { DEMO_CHATBOT_ID } from "../services/mockServer";
import type { Chatbot, ChatbotChannels, ChatbotDocument } from "../services/types";

export default function Screen45Bot() {
  const go = useGo();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const id = params.get("id") ?? DEMO_CHATBOT_ID;
  const tab = params.get("tab") === "knowledge" ? "knowledge" : "overview";
  const setTab = (next: "overview" | "knowledge") =>
    setParams({ id, ...(next === "knowledge" && { tab: next }) }, { replace: true });
  const { bot, setBot, error, reload } = useChatbot(id);
  const [viewing, setViewing] = useState<ChatbotDocument | null>(null);
  /** Takes a chatbot returned by the API and resumes polling if documents are processing again. */
  const update = (next: Chatbot) => {
    setBot(next);
    if (next.documents.some((d) => d.status === "queued" || d.status === "processing")) reload();
  };
  const [channels, setChannels] = useState<ChatbotChannels | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmPause, setConfirmPause] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    api
      .getChannels(id, controller.signal)
      .then(setChannels)
      .catch((e) => !isAbort(e) && setChannels(null));
    return () => controller.abort();
  }, [id]);

  const act = async (call: () => Promise<Chatbot>) => {
    setBusy(true);
    setActionError(null);
    try {
      update(await call());
    } catch (e) {
      setActionError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const saveDetails = async (values: { name: string; description: string }) => {
    setBusy(true);
    setEditError(null);
    try {
      update(await api.editChatbotDetails(id, values));
      setEditing(false);
    } catch (e) {
      setEditError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setConfirmDelete(false);
    setBusy(true);
    setActionError(null);
    try {
      await api.deleteChatbot(id);
      navigate("/list");
    } catch (e) {
      setActionError(errorMessage(e));
      setBusy(false);
    }
  };

  return (
    <div className="relative w-full h-full bg-page overflow-hidden flex items-start font-gabarito">
      <Sidebar4 />
      <main className="flex-1 min-w-0 h-full overflow-y-auto bg-page p-8">
        <PageHeader title="Chatbots" description="Create, manage, and configure your AI assistants." />
        <div className="mt-6 space-y-6">
          <AppBreadcrumb items={[{ label: "Chatbots", to: "/list" }, { label: bot?.name ?? "…" }]} />

          {!bot ? (
            error ? (
              <Banner tone="danger">
                <div className="flex items-center gap-3">
                  <span className="flex-1">{error}</span>
                  <Button onClick={reload}>Try again</Button>
                </div>
              </Banner>
            ) : (
              <div className="flex items-center justify-center gap-3 py-16 text-p3 text-ink-secondary">
                <Spinner /> Loading chatbot…
              </div>
            )
          ) : (
            <>
              <ChatbotHeader
                bot={bot}
                channels={channels}
                busy={busy}
                onPublish={() => act(() => api.publishChatbot(bot.id))}
                onPause={() => setConfirmPause(true)}
                onResume={() => act(() => api.setChatbotStatus(bot.id, "active"))}
                onPlayground={go(`/pg?bot=${bot.id}`)}
                onKnowledge={() => setTab("knowledge")}
                onChannels={go(`/ch0?bot=${bot.id}`)}
                onEdit={() => {
                  setEditError(null);
                  setEditing(true);
                }}
                onDelete={() => setConfirmDelete(true)}
              />

              {actionError && (
                <Banner tone="danger" onDismiss={() => setActionError(null)}>
                  {actionError}
                </Banner>
              )}

              <ChatbotTabs
                tabs={[
                  { label: "Overview", active: tab === "overview", onClick: () => setTab("overview") },
                  { label: "Knowledge base", active: tab === "knowledge", onClick: () => setTab("knowledge") },
                  // Not part of this prototype yet, as in the Figma frames.
                  { label: "Configuration", active: false },
                ]}
              />

              {tab === "overview" ? (
                <div className="space-y-6">
                  <OverviewStats bot={bot} channels={channels} />
                  <div className="grid grid-cols-[1.6fr_1fr] gap-6">
                    <div className="min-w-0 space-y-6">
                      <MessagesChartCard chatbotId={bot.id} />
                      <KnowledgeBaseCard
                        documents={bot.documents}
                        onManage={() => setTab("knowledge")}
                        onView={setViewing}
                      />
                      <StarterQuestionsCard questions={bot.settings.starterQuestions} />
                    </div>
                    <div className="min-w-0 space-y-6">
                      <ChannelsCard bot={bot} channels={channels} onManage={go(`/ch0?bot=${bot.id}`)} />
                      <ConfigurationCard settings={bot.settings} />
                      <DangerZoneCard bot={bot} onDelete={() => setConfirmDelete(true)} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start gap-6">
                  <DocumentStats documents={bot.documents} />
                  <KnowledgeTab bot={bot} onChange={update} onView={setViewing} onTest={go(`/pg?bot=${bot.id}`)} />
                </div>
              )}
            </>
          )}
        </div>
      </main>
      {bot && viewing && (
        <DocumentViewer
          name={viewing.name}
          load={(signal) => api.getDocumentOriginal(bot.id, viewing.id, signal)}
          onClose={() => setViewing(null)}
        />
      )}
      {bot && (
        <ConfirmDialog
          open={confirmPause}
          title={`Pause ${bot.name}?`}
          confirmLabel="Pause chatbot"
          cancelLabel="Cancel"
          onCancel={() => setConfirmPause(false)}
          onConfirm={() => {
            setConfirmPause(false);
            act(() => api.setChatbotStatus(bot.id, "paused"));
          }}
        >
          The chatbot stops answering on every channel. Guests see “temporarily unavailable”. You can resume anytime.
        </ConfirmDialog>
      )}
      {bot && (
        <EditDetailsDialog
          open={editing}
          bot={bot}
          saving={busy}
          error={editError}
          onSave={saveDetails}
          onCancel={() => setEditing(false)}
        />
      )}
      {bot && (
        <ConfirmDialog
          open={confirmDelete}
          title={`Delete ${bot.name}?`}
          confirmLabel="Delete chatbot"
          cancelLabel="Cancel"
          danger
          onCancel={() => setConfirmDelete(false)}
          onConfirm={remove}
        >
          {`This permanently removes ${bot.name}, its ${bot.documents.length} documents and its conversation logs. Guest channels will show “This chatbot is no longer available!”. This can't be undone.`}
        </ConfirmDialog>
      )}
    </div>
  );
}

/** Documents / Ready / Indexing / Failed cards (Figma Stats component), counted from the live documents. */
function DocumentStats({ documents }: { documents: ChatbotDocument[] }) {
  const count = (...statuses: ChatbotDocument["status"][]) =>
    documents.filter((d) => statuses.includes(d.status)).length;
  const ready = count("ready");
  return (
    <div className="self-stretch shrink-0 flex items-start gap-4">
      <StatCard
        bg="bg-[#ECE7FB]"
        icon="icons/icon-tile-accent-2.svg"
        label="Documents"
        value={documents.length}
        note={`${ready} ready`}
      />
      <StatCard
        bg="bg-[#E3F3E7]"
        icon="icons/icon-tile-success-2.svg"
        label="Ready"
        value={ready}
        note="Used to answer questions"
      />
      <StatCard
        bg="bg-[#FCEFD9]"
        icon="icons/icon-tile-warning-2.svg"
        label="Indexing"
        value={count("queued", "processing")}
        note="Queued or processing"
      />
      <StatCard
        bg="bg-[#FBE6E4]"
        icon="icons/icon-tile-danger.svg"
        label="Failed"
        value={count("failed")}
        note="Needs your attention"
      />
    </div>
  );
}

function StatCard({
  bg,
  icon,
  label,
  value,
  note,
}: {
  bg: string;
  icon: string;
  label: string;
  value: number;
  note: string;
}) {
  return (
    <div className={`flex-1 min-w-0 self-stretch ${bg} rounded-[24px] flex flex-col items-start gap-3.5 p-5`}>
      <div className="self-stretch shrink-0 overflow-hidden flex items-center gap-3">
        <img className="w-11 h-11 shrink-0" src={icon} alt="" />
        <div className="flex-1 min-w-0 font-gabarito font-medium text-[15px] leading-normal text-[#171A2B]">
          {label}
        </div>
      </div>
      <div className="self-stretch shrink-0 flex flex-col items-start gap-1">
        <div className="font-gabarito font-bold text-[36px] leading-[40px] tracking-[-1px] text-[#171A2B]">{value}</div>
        <div className="self-stretch font-gabarito text-[13px] leading-[16px] text-[#5B6072]">{note}</div>
      </div>
    </div>
  );
}
