// Create chatbot · Chatbot created (documents keep processing on the server)
// Route: #/created?id=<chatbotId>
import { type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CreateLayout } from "../components/create/CreateLayout";
import { Banner, Button, SectionLabel, Spinner, StatusPill } from "../components/create/ui";
import { initials } from "../lib/chatbotDraft";
import { formatBytes } from "../services/limits";
import { DOC_PILL } from "../components/chatbot/status";
import { useChatbot } from "../lib/useChatbot";
import type { Chatbot } from "../services/types";

export default function Screen13Created() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { bot, error, loading } = useChatbot(params.get("id"));

  if (loading || (!bot && error)) {
    return (
      <CreateLayout step={4} aside={null}>
        <div className="self-stretch flex flex-col items-center gap-4 py-16">
          {loading ? (
            <>
              <Spinner size={28} />
              <div className="font-gabarito text-[14px] text-ink-secondary">Loading chatbot…</div>
            </>
          ) : (
            <>
              <Banner tone="danger">{error}</Banner>
              <Button onClick={() => navigate("/list")}>Back to chatbots</Button>
            </>
          )}
        </div>
      </CreateLayout>
    );
  }

  if (!bot) {
    return (
      <CreateLayout step={4} aside={null}>
        <div className="self-stretch flex flex-col items-center gap-4 py-16 text-center">
          <div className="font-gabarito font-bold text-[24px] text-ink-primary">No chatbot created yet</div>
          <div className="font-gabarito text-[14px] text-ink-secondary">Go through the three steps to create one.</div>
          <Button variant="primary" onClick={() => navigate("/s1e")}>
            Create chatbot
          </Button>
        </div>
      </CreateLayout>
    );
  }

  const docs = bot.documents;
  const ready = docs.filter((d) => d.status === "ready").length;
  const processing = docs.length > 0 && ready < docs.length;
  const summary = !docs.length
    ? `${bot.name} has no documents yet. Add at least one before you can publish.`
    : processing
      ? `Your ${docs.length} source${docs.length === 1 ? " is" : "s are"} processing. ${bot.name} stays in Draft until every source is ready — you can leave this page, it continues in the background.`
      : `All ${docs.length} source${docs.length === 1 ? " is" : "s are"} ready. Set up a channel, then publish.`;

  return (
    <CreateLayout step={4} aside={<BotSummary bot={bot} />}>
      <div className="self-stretch flex flex-col items-center gap-5 pt-4">
        <img className="w-18 h-18 shrink-0" src="icons/success-icon.svg" alt="" />
        <div className="flex flex-wrap justify-center items-center gap-2.5">
          <h1 className="font-gabarito font-bold text-[28px] leading-[34px] tracking-[-0.01em] text-ink-primary">{`${bot.name} was created`}</h1>
          <StatusPill tone={bot.status === "pending" ? "info" : "neutral"}>
            {bot.status === "pending" ? "Pending" : "Draft"}
          </StatusPill>
        </div>
        <div
          className="max-w-156.5 text-center font-gabarito text-[16px] leading-[24px] text-ink-body"
          aria-live="polite"
        >
          {summary}
        </div>

        <div className="self-stretch max-w-180 flex flex-col items-start gap-2.5">
          <SectionLabel>Next steps</SectionLabel>
          <div className="self-stretch bg-bg-card border border-[#ECECEA] rounded-[16px] overflow-hidden flex flex-col">
            <NextStep
              n={2}
              title={docs.length ? "Wait for documents to finish processing" : "Add at least 1 document"}
              detail={
                docs.length ? (
                  <div className="flex items-center gap-2">
                    <div className="w-30 h-1 bg-[#F0F0EE] rounded-[4px] overflow-hidden">
                      <div
                        className="h-full bg-[#219954] rounded-[4px] transition-[width] duration-500"
                        style={{ width: `${(ready / docs.length) * 100}%` }}
                      />
                    </div>
                    <span>{`${ready} of ${docs.length} ready`}</span>
                  </div>
                ) : (
                  "PDF, DOCX, TXT, MD, XLSX or web pages"
                )
              }
              status={
                docs.length ? (
                  processing ? (
                    <StatusPill tone="success" pulse>
                      In progress
                    </StatusPill>
                  ) : (
                    <StatusPill tone="success">Done</StatusPill>
                  )
                ) : (
                  <Action onClick={() => navigate("/dDraft")}>Add →</Action>
                )
              }
            />
            <NextStep
              n={3}
              title="Set up at least 1 channel"
              detail="Public link, web widget or Telegram"
              status={<Action onClick={() => navigate(`/ch0?bot=${bot.id}`)}>Set up →</Action>}
            />
            <NextStep
              n={4}
              title="Test answers in the playground"
              detail={ready ? "Ask questions against the ready documents" : "Available once a document is ready"}
              status={
                ready ? (
                  <Action onClick={() => navigate("/pg")}>Open →</Action>
                ) : (
                  <StatusPill tone="neutral">Optional</StatusPill>
                )
              }
            />
            <NextStep
              n={5}
              title="Publish your chatbot"
              detail="Goes live on all connected channels"
              status={<StatusPill tone="neutral">After setup</StatusPill>}
              last
            />
          </div>
        </div>

        {docs.length > 0 && (
          <div className="self-stretch max-w-180 flex flex-col items-start gap-2.5">
            <SectionLabel>{`Documents (${docs.length})`}</SectionLabel>
            <div className="self-stretch bg-bg-card border border-[#ECECEA] rounded-[16px] overflow-hidden flex flex-col">
              {docs.map((d) => (
                <div
                  key={d.id}
                  className="self-stretch border-b border-[#F0F0EE] last:border-b-0 flex items-center gap-3 px-4 py-3"
                >
                  <div className="w-11 h-6 shrink-0 bg-[#F3F3F1] rounded-[6px] flex justify-center items-center font-geist-mono text-[10px] text-[#525252]">
                    {d.kind === "url" ? "URL" : d.type}
                  </div>
                  <div className="flex-1 min-w-0 truncate font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">
                    {d.name}
                  </div>
                  <div className="w-18 shrink-0 font-gabarito text-[12px] text-ink-secondary">
                    {formatBytes(d.sizeBytes)}
                  </div>
                  <div className="w-24 shrink-0 flex justify-end">
                    <StatusPill tone={DOC_PILL[d.status].tone} pulse={d.status === "processing"}>
                      {DOC_PILL[d.status].label}
                    </StatusPill>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <Banner tone="warning">{`Lost connection while checking progress (${error}). Retrying…`}</Banner>}

        <div className="flex flex-wrap justify-center items-start gap-2.5 pt-2">
          <Button onClick={() => navigate("/list")}>Back to chatbots</Button>
          <Button icon="icons/link-2-property-linear-2.svg" onClick={() => navigate(`/ch0?bot=${bot.id}`)}>
            Set up a channel
          </Button>
          <Button variant="primary" onClick={() => navigate(`/bot?id=${bot.id}`)}>
            Open chatbot
          </Button>
        </div>
      </div>
    </CreateLayout>
  );
}

function Action({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 font-gabarito font-medium text-[12px] text-ink-primary hover:underline cursor-pointer"
    >
      {children}
    </button>
  );
}

function NextStep({
  n,
  title,
  detail,
  status,
  last,
}: {
  n: number;
  title: string;
  detail: ReactNode;
  status: ReactNode;
  last?: boolean;
}) {
  return (
    <div className={`self-stretch flex items-center gap-3.5 px-4 py-3.5 ${last ? "" : "border-b border-[#F0F0EE]"}`}>
      <img className="w-9 h-9 shrink-0" src={`icons/number-${n}.svg`} alt="" />
      <div className="flex-1 min-w-0 flex flex-col items-start gap-0.5">
        <div className="font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">{title}</div>
        <div className="font-gabarito text-[12px] leading-[16px] text-ink-muted">{detail}</div>
      </div>
      {status}
    </div>
  );
}

function BotSummary({ bot }: { bot: Chatbot }) {
  const { settings } = bot;
  const rows: [string, string][] = [
    ["Chat model", settings.chatModel],
    ["Embedding", settings.embeddingModel],
    ["Tone", `${settings.tone} · ${settings.answerLength}`],
    ["Language", settings.language],
    ["Starter questions", settings.starterQuestions.length ? `${settings.starterQuestions.length} of 4` : "None"],
    [
      "Documents",
      bot.documents.length
        ? `${bot.documents.filter((d) => d.status === "ready").length} of ${bot.documents.length} ready`
        : "None yet",
    ],
    ["Created", new Date(bot.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })],
  ];
  return (
    <div className="self-stretch bg-bg-card border border-border-default rounded-[20px] flex flex-col items-start gap-3.5 p-5">
      <SectionLabel>Chatbot</SectionLabel>
      <div className="self-stretch flex items-center gap-3">
        <div className="w-11 h-11 shrink-0 bg-bg-inverse rounded-[12px] flex justify-center items-center font-gabarito font-bold text-[16px] text-ink-on-dark">
          {initials(bot.name)}
        </div>
        <div className="min-w-0 flex flex-col items-start gap-1.5">
          <div className="max-w-full truncate font-gabarito font-bold text-[18px] leading-[28px] text-ink-primary">
            {bot.name}
          </div>
          <StatusPill tone={bot.status === "pending" ? "info" : "neutral"}>
            {bot.status === "pending" ? "Pending" : "Draft"}
          </StatusPill>
        </div>
      </div>
      <div
        className={`self-stretch font-gabarito text-[14px] leading-[20px] ${bot.description ? "text-ink-body" : "text-ink-muted"}`}
      >
        {bot.description || "No description"}
      </div>
      <div className="self-stretch flex flex-col">
        {rows.map(([label, value]) => (
          <div key={label} className="self-stretch border-t border-border-default flex justify-between gap-4 py-2">
            <div className="font-gabarito text-[12px] leading-[16px] text-ink-secondary">{label}</div>
            <div className="min-w-0 truncate text-right font-gabarito font-medium text-[12px] text-ink-primary">
              {value}
            </div>
          </div>
        ))}
      </div>
      <div className="self-stretch font-geist-mono text-[11px] text-ink-muted">{`ID ${bot.id}`}</div>
    </div>
  );
}
