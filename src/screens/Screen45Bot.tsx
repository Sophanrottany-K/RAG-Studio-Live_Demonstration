// Chatbot detail (status, publish / pause / resume, Overview and Knowledge base tabs)
// Route: #/bot?id=<chatbotId>&tab=knowledge  (also the old static detail routes: dDraft, dPend, active2, paused, …)
import { useEffect, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { CopyButton } from "../components/channels/parts";
import { ChatbotStatusPill } from "../components/chatbot/status";
import { DocumentViewer } from "../components/documents/DocumentViewer";
import { DocumentRows, KnowledgeTab } from "../components/knowledge/KnowledgeTab";
import { ConfirmDialog } from "../components/create/ConfirmDialog";
import { Banner, Button, Spinner, StatusPill } from "../components/create/ui";
import { Header8 } from "../components/shared/Header8";
import { Sidebar4 } from "../components/shared/Sidebar4";
import { useGo } from "../lib/nav";
import { useChatbot } from "../lib/useChatbot";
import { api, errorMessage, isAbort } from "../services/api";
import { DEMO_CHATBOT_ID } from "../services/mockServer";
import type { Chatbot, ChatbotChannels, ChatbotDocument } from "../services/types";

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { dateStyle: "medium" });

export default function Screen45Bot() {
  const go = useGo();
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

  const publicUrl = channels?.publicLink.configured ? channels.publicLink.url : null;

  return (
    <div className="relative w-full h-full bg-bg-card overflow-hidden flex items-start">
      <div className="flex-1 min-w-0 self-stretch bg-bg-card overflow-hidden flex items-start">
        <Sidebar4 />
        <div className="flex-1 min-w-0 self-stretch bg-bg-page overflow-hidden flex flex-col items-start">
          <Header8 />
          <div className="self-stretch flex-1 min-h-0 overflow-y-auto flex flex-col items-start gap-6 pt-7 pr-10 pb-10 pl-10">
            <button
              type="button"
              onClick={go("/list")}
              className="shrink-0 rounded-[8px] flex items-center gap-2 pt-1.5 pr-2.5 pb-1.5 pl-2 cursor-pointer hover:bg-bg-soft"
            >
              <img className="w-4 h-4 shrink-0" src="icons/arrow-left-property-linear.svg" alt="" />
              <span className="font-gabarito text-[14px] leading-[20px] text-ink-secondary">{"Chatbots"}</span>
              <span className="font-gabarito text-[14px] leading-[20px] text-ink-muted">{"/"}</span>
              <span className="font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">
                {bot?.name ?? "…"}
              </span>
            </button>

            {!bot ? (
              error ? (
                <Banner tone="danger">
                  <div className="flex items-center gap-3">
                    <span className="flex-1">{error}</span>
                    <Button onClick={reload}>Try again</Button>
                  </div>
                </Banner>
              ) : (
                <div className="self-stretch flex items-center justify-center gap-3 py-16 font-gabarito text-[14px] text-ink-secondary">
                  <Spinner /> Loading chatbot…
                </div>
              )
            ) : (
              <>
                <div className="self-stretch shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[20px] flex flex-col items-start gap-5 p-6">
                  <div className="self-stretch flex items-start gap-5">
                    <div className="flex-1 min-w-0 flex flex-col items-start gap-2">
                      <div className="flex items-center gap-3">
                        <h1 className="font-gabarito font-bold text-[28px] leading-normal text-[#111111]">
                          {bot.name}
                        </h1>
                        <ChatbotStatusPill status={bot.status} />
                      </div>
                      {bot.description && (
                        <div className="self-stretch font-gabarito text-[16px] leading-normal text-[#444444]">
                          {bot.description}
                        </div>
                      )}
                      <div className="font-gabarito text-[13px] leading-normal text-[#6B6B6B]">
                        {`Created ${formatDate(bot.createdAt)}   ·   Updated ${formatDate(bot.updatedAt)}`}
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-wrap justify-end items-center gap-2.5">
                      {bot.status === "pending" && (
                        <Button variant="primary" loading={busy} onClick={() => act(() => api.publishChatbot(bot.id))}>
                          Publish
                        </Button>
                      )}
                      {bot.status === "active" && (
                        <Button
                          icon="icons/pause-property-linear.svg"
                          loading={busy}
                          onClick={() => setConfirmPause(true)}
                        >
                          Pause
                        </Button>
                      )}
                      {bot.status === "paused" && (
                        <Button
                          variant="primary"
                          loading={busy}
                          onClick={() => act(() => api.setChatbotStatus(bot.id, "active"))}
                        >
                          Resume
                        </Button>
                      )}
                      {publicUrl && (
                        <Button onClick={() => window.open(publicUrl, "_blank", "noopener")}>Open public link ↗</Button>
                      )}
                      <Button
                        variant={bot.status === "pending" || bot.status === "paused" ? "secondary" : "primary"}
                        icon={bot.status === "pending" || bot.status === "paused" ? undefined : "icons/icon-play.svg"}
                        onClick={go(`/pg?bot=${bot.id}`)}
                      >
                        Open Playground
                      </Button>
                    </div>
                  </div>
                  {/* Config tiles, as in the Figma ConfigTiles component. */}
                  <div className="self-stretch shrink-0 flex items-start gap-3">
                    <Tile icon="icons/frame-6.svg" label="Chat model" value={bot.settings.chatModel} />
                    <Tile icon="icons/frame-7.svg" label="Language" value={bot.settings.language} />
                    <Tile icon="icons/frame-8.svg" label="Tone" value={bot.settings.tone} />
                    <Tile
                      icon="icons/frame-9.svg"
                      label="Knowledge base"
                      value={`${bot.documents.length} document${bot.documents.length === 1 ? "" : "s"}`}
                      onClick={() => setTab("knowledge")}
                    />
                    <Tile
                      icon="icons/frame-10.svg"
                      label="Channels"
                      value={channels ? channelSummary(channels) : "…"}
                      onClick={go(`/ch0?bot=${bot.id}`)}
                    />
                  </div>
                </div>

                {actionError && (
                  <Banner tone="danger" onDismiss={() => setActionError(null)}>
                    {actionError}
                  </Banner>
                )}
                {bot.status === "draft" && (
                  <Banner tone="info">
                    Documents are still processing. You can publish once every document is ready.
                  </Banner>
                )}
                {bot.status === "pending" && (
                  <Banner tone="info">
                    All documents are ready. Test it in the Playground, then publish to make its channels answer guests.
                  </Banner>
                )}
                {bot.status === "paused" && (
                  <Banner tone="warning">
                    This chatbot is paused. Guests opening its public link see “This chatbot is temporarily
                    unavailable”. You can still test it in the Playground.
                  </Banner>
                )}

                <div
                  role="tablist"
                  className="self-stretch shrink-0 border-b border-border-default flex items-start gap-1"
                >
                  <TabButton label="Overview" active={tab === "overview"} onClick={() => setTab("overview")} />
                  <TabButton label="Knowledge base" active={tab === "knowledge"} onClick={() => setTab("knowledge")} />
                  {/* Not part of this prototype yet, as in the Figma frames. */}
                  <TabButton label="Configuration" active={false} />
                </div>

                {tab === "overview" ? (
                  <>
                    <DocumentStats documents={bot.documents} />
                    <div className="self-stretch flex items-start gap-6">
                      <div className="flex-1 min-w-0 flex flex-col items-start gap-6">
                        <div className="self-stretch bg-bg-card border border-border-default rounded-[20px] flex flex-col items-start gap-3 p-5">
                          <div className="self-stretch flex justify-between items-center">
                            <div className="font-gabarito font-bold text-[18px] leading-[28px] text-ink-primary">
                              {"Knowledge base"}
                            </div>
                            <button
                              type="button"
                              onClick={() => setTab("knowledge")}
                              className="shrink-0 rounded-[6px] flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-bg-soft"
                            >
                              <span className="font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">
                                {"Manage documents"}
                              </span>
                              <img className="w-3.5 h-3.5 shrink-0" src="icons/icon-arrow-right.svg" alt="" />
                            </button>
                          </div>
                          <DocumentRows documents={bot.documents.slice(0, 4)} onView={setViewing} />
                          {bot.documents.length > 4 && (
                            <div className="font-gabarito text-[12px] leading-[16px] text-ink-secondary">
                              {`Showing 4 of ${bot.documents.length} documents`}
                            </div>
                          )}
                        </div>
                        <div className="self-stretch bg-bg-card border border-border-default rounded-[20px] flex flex-col items-start gap-3 p-5">
                          <div className="font-gabarito font-bold text-[18px] leading-[28px] text-ink-primary">
                            {"Starter questions"}
                          </div>
                          {bot.settings.starterQuestions.length ? (
                            <div className="flex flex-wrap gap-2">
                              {bot.settings.starterQuestions.map((q) => (
                                <span
                                  key={q}
                                  className="bg-[#FAFAF9] border border-[#ECECEA] rounded-full px-3.5 py-2 font-gabarito text-[14px] text-[#444444]"
                                >
                                  {q}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="font-gabarito text-[14px] text-ink-secondary">No starter questions.</div>
                          )}
                        </div>
                      </div>
                      <ChannelsBlock bot={bot} channels={channels} onManage={go(`/ch0?bot=${bot.id}`)} />
                    </div>
                  </>
                ) : (
                  <>
                    <DocumentStats documents={bot.documents} />
                    <KnowledgeTab bot={bot} onChange={update} onView={setViewing} onTest={go(`/pg?bot=${bot.id}`)} />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
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
    </div>
  );
}

const channelSummary = (channels: ChatbotChannels) => {
  const live = [
    channels.publicLink.enabled && "Public link",
    channels.widget.enabled && "Widget",
    channels.telegram.connected && "Telegram",
  ].filter(Boolean);
  return live.length ? live.join(", ") : "No channels";
};

/** A header config tile (Figma TilePrimaryModel / TileLanguage2 / … markup), with live values. */
function Tile({ icon, label, value, onClick }: { icon: string; label: string; value: string; onClick?: () => void }) {
  return (
    <div
      className={`flex-1 min-w-0 bg-[#FAFAF9] border border-[#ECECEA] rounded-[14px] flex items-center gap-3 px-4 py-3.5 ${onClick ? "cursor-pointer hover:bg-[#FFFFFF]" : ""}`}
      onClick={onClick}
    >
      <img className="w-9 h-9 shrink-0" src={icon} alt="" />
      <div className="flex-1 min-w-0 flex flex-col items-start gap-0.5">
        <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-normal text-[#8A8A86]">{label}</div>
        <div className="max-w-full truncate font-gabarito font-semibold text-[15px] leading-normal text-[#111111]">
          {value}
        </div>
      </div>
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

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      disabled={!onClick}
      onClick={onClick}
      className={`h-11 shrink-0 flex items-center px-3.5 font-gabarito text-[16px] leading-[24px] ${
        active ? "border-b-[2px] border-border-strong font-bold text-ink-primary" : "font-medium text-ink-secondary"
      } ${onClick ? "cursor-pointer hover:text-ink-primary" : "cursor-default"}`}
    >
      {label}
    </button>
  );
}

type RowState = { tone: "neutral" | "warning" | "success"; label: string };

function ChannelsBlock({
  bot,
  channels,
  onManage,
}: {
  bot: Chatbot;
  channels: ChatbotChannels | null;
  onManage: () => void;
}) {
  const paused = bot.status === "paused";
  // A connected channel only answers guests once the chatbot itself is published and running.
  const state = (connected: boolean, enabled = true): RowState =>
    !connected
      ? { tone: "neutral", label: "Not connected" }
      : !enabled
        ? { tone: "warning", label: "Disabled" }
        : paused
          ? { tone: "warning", label: "Paused" }
          : bot.status !== "active"
            ? { tone: "neutral", label: "Not published" }
            : { tone: "success", label: "Live" };

  const link = channels?.publicLink;
  const widget = channels?.widget;
  const telegram = channels?.telegram;
  const connected = channels ? [link!.enabled, widget!.enabled, telegram!.connected].filter(Boolean).length : 0;

  return (
    <div className="w-100 shrink-0 bg-bg-card border border-border-default rounded-[20px] flex flex-col items-start gap-3 p-5">
      <div className="self-stretch flex justify-between items-center">
        <div className="font-gabarito font-bold text-[18px] leading-[28px] text-ink-primary">
          {`Channels · ${connected} of 3 connected`}
        </div>
        <button
          type="button"
          onClick={onManage}
          className="shrink-0 rounded-[6px] flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-bg-soft"
        >
          <span className="font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">{"Manage"}</span>
          <img className="w-3.5 h-3.5 shrink-0" src="icons/icon-arrow-right.svg" alt="" />
        </button>
      </div>
      {!channels ? (
        <div className="self-stretch flex items-center gap-2 py-3 font-gabarito text-[13px] text-ink-secondary">
          <Spinner size={14} /> Loading channels…
        </div>
      ) : (
        <>
          <ChannelRow
            icon="icons/channel-icon.svg"
            title="Public link"
            state={state(link!.configured, link!.enabled)}
            detail={link!.configured ? null : "Not connected · share a page guests can open in any browser"}
          >
            {link!.url && (
              <div className="self-stretch flex flex-col gap-2">
                <div className="self-stretch truncate font-roboto-mono text-[12px] text-ink-secondary">{link!.url}</div>
                <div className="flex gap-2">
                  <CopyButton text={link!.url} label="Copy" variant="secondary" />
                  <Button onClick={() => window.open(link!.url!, "_blank", "noopener")}>Open ↗</Button>
                </div>
              </div>
            )}
          </ChannelRow>
          <ChannelRow
            icon="icons/channel-icon-2.svg"
            title="Web widget"
            state={state(widget!.configured, widget!.enabled)}
            detail={
              widget!.configured
                ? `On ${widget!.allowedDomains.join(", ")}`
                : "Not connected · embed a chat bubble on your website"
            }
          />
          <ChannelRow
            icon="icons/channel-icon-3.svg"
            title="Telegram"
            state={state(telegram!.connected)}
            detail={
              telegram!.connected
                ? `${telegram!.botUsername} · ${telegram!.messagesThisWeek} messages this week`
                : "Not connected · answer inside a Telegram bot"
            }
          />
        </>
      )}
    </div>
  );
}

function ChannelRow({
  icon,
  title,
  state,
  detail,
  children,
}: {
  icon: string;
  title: string;
  state: RowState;
  detail: string | null;
  children?: ReactNode;
}) {
  return (
    <div className="self-stretch border border-border-default rounded-[12px] flex flex-col gap-2.5 px-3 py-2.5">
      <div className="self-stretch flex items-center gap-3">
        <img className="w-9 h-9 shrink-0" src={icon} alt="" />
        <div className="flex-1 min-w-0 flex flex-col items-start gap-0.5">
          <div className="font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">{title}</div>
          {detail && (
            <div className="self-stretch font-gabarito text-[12px] leading-[16px] text-ink-secondary break-words">
              {detail}
            </div>
          )}
        </div>
        <StatusPill tone={state.tone}>{state.label}</StatusPill>
      </div>
      {children}
    </div>
  );
}
