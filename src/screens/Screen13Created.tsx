// Create chatbot · Chatbot created (documents keep processing on the server)
// Route: #/created?id=<chatbotId>
import { type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, CircleDashedCheck, CirclePlay, Link, Loader, Rocket, type LucideIcon } from "lucide-react";
import { CreateLayout } from "../components/create/CreateLayout";
import { Banner, Button, SectionLabel, Spinner, StatusPill } from "../components/create/ui";
import { initials } from "../lib/chatbotDraft";
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
              <div className="font-gabarito text-[16px] text-ink-secondary">Loading chatbot…</div>
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
          <div className="font-gabarito font-bold text-[26px] text-ink-primary">No chatbot created yet</div>
          <div className="font-gabarito text-[16px] text-ink-secondary">Go through the three steps to create one.</div>
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
          <h1 className="font-gabarito font-bold text-[30px] leading-[36px] tracking-[-0.01em] text-ink-primary">{`${bot.name} was created`}</h1>
          <StatusPill tone={bot.status === "pending" ? "info" : "neutral"}>
            {bot.status === "pending" ? "Pending" : "Draft"}
          </StatusPill>
        </div>
        <div
          className="max-w-156.5 text-center font-gabarito text-[18px] leading-[26px] text-ink-body"
          aria-live="polite"
        >
          {summary}
        </div>

        <div className="self-stretch flex flex-col items-start gap-2.5">
          <SectionLabel>Next steps</SectionLabel>
          <div className="self-stretch bg-bg-card border border-[#ECECEA] rounded-[16px] overflow-hidden flex flex-col">
            <NextStep
              icon={CircleDashedCheck}
              tile="bg-[#FFF3E6] text-[#D9822B]"
              title={docs.length ? "Wait for documents to finish processing" : "Add at least 1 document"}
              detail={docs.length ? <ProcessingStepper {...stageOf(docs)} count={docs.length} /> : undefined}
              focus={processing}
              status={
                docs.length ? (
                  <div className="shrink-0 flex items-center gap-5">
                    <div className="w-px h-9 bg-[#E4E4E0]" />
                    {processing ? (
                      <BigPill className="bg-[#FFF3E6] text-[#B86A1B]">
                        <Loader className="size-4 animate-spin [animation-duration:2s]" aria-hidden />
                        {"In progress"}
                      </BigPill>
                    ) : (
                      <BigPill className="bg-[#E3F5EA] text-[#1E8A4C]">
                        <Check className="size-4" strokeWidth={3} aria-hidden />
                        {"Done"}
                      </BigPill>
                    )}
                  </div>
                ) : (
                  <Action onClick={() => navigate("/dDraft")}>Add →</Action>
                )
              }
            />
            <NextStep
              icon={Link}
              tile="bg-[#E6F6F4] text-[#16968C]"
              title="Set up at least 1 channel"
              status={<Action onClick={() => navigate(`/ch0?bot=${bot.id}`)}>Set up →</Action>}
              dim={processing}
            />
            <NextStep
              icon={CirclePlay}
              tile="bg-[#E8F1FD] text-[#1A73E8]"
              title="Test answers in the playground"
              status={
                <Action onClick={() => navigate("/pg")} disabled={!ready} title="Available once a document is ready">
                  Open →
                </Action>
              }
              dim={processing}
            />
            <NextStep
              icon={Rocket}
              tile="bg-[#F1EAFD] text-[#7C3AED]"
              title="Publish your chatbot"
              status={
                <BigPill className="bg-[#F0F0EE] text-[#6B6B6B]">
                  <span className="size-2 rounded-full bg-[#8A8A86]" aria-hidden />
                  {"Not published"}
                </BigPill>
              }
              dim={processing}
              last
            />
          </div>
        </div>

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

function Action({
  onClick,
  children,
  disabled,
  title,
}: {
  onClick: () => void;
  children: string;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={disabled ? title : undefined}
      className="shrink-0 font-gabarito font-semibold text-[18px] text-ink-primary hover:underline cursor-pointer disabled:text-ink-muted disabled:no-underline disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

function BigPill({ className, children }: { className: string; children: ReactNode }) {
  return (
    <span
      className={`shrink-0 rounded-full inline-flex items-center gap-1.5 px-3.5 py-1.5 font-gabarito font-semibold text-[15px] leading-[20px] tracking-[0.3px] uppercase ${className}`}
    >
      {children}
    </span>
  );
}

function NextStep({
  icon: Icon,
  tile,
  title,
  detail,
  status,
  focus,
  dim,
  last,
}: {
  icon: LucideIcon;
  /** Background and icon color of the square tile. */
  tile: string;
  title: string;
  detail?: ReactNode;
  status: ReactNode;
  /** The step happening right now: spotlighted so the audience follows it. */
  focus?: boolean;
  /** Faded while another step has the focus. */
  dim?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`relative self-stretch flex flex-col transition-all duration-500 ${
        focus ? "gap-5 px-6 py-6 bg-[#FFFAF3]" : "gap-3 px-5 py-4"
      } ${dim ? "opacity-45 grayscale-[60%]" : ""} ${last ? "" : "border-b border-[#F0F0EE]"}`}
    >
      {/* Accent bar on the left edge of the focused step. */}
      {focus && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D9822B]" aria-hidden />}
      <div className="self-stretch flex items-center gap-4">
        <div
          className={`shrink-0 rounded-[12px] flex items-center justify-center transition-all duration-500 ${tile} ${
            focus ? "size-13 ring-4 ring-[#FFE4C4]" : "size-11"
          }`}
        >
          <Icon className={focus ? "size-6.5" : "size-5.5"} aria-hidden />
        </div>
        <div
          className={`flex-1 min-w-0 font-gabarito text-ink-primary transition-all duration-500 ${
            focus ? "font-bold text-[22px] leading-[28px]" : "font-semibold text-[19px] leading-[26px]"
          }`}
        >
          {title}
        </div>
        {status}
      </div>
      {/* Under the title, across the full width of the row. */}
      {detail && <div className={`self-stretch ${focus ? "pl-0" : "pl-15"}`}>{detail}</div>}
    </div>
  );
}

const STAGES = [
  { label: "Uploading" },
  { label: "Extracting Text" },
  { label: "Splitting Content" },
  { label: "Generating Embeddings" },
  { label: "Storing Knowledge" },
];

/**
 * Where the knowledge base is: the stage running now (1–4, or 5 when every document is ready) and how far that
 * stage is (0–1). The files were already uploaded in step 3, so Uploading is done from the start and processing
 * begins at Extracting Text. Documents are processed one after another, so overall progress is their average.
 */
function stageOf(docs: Chatbot["documents"]) {
  const done = (d: Chatbot["documents"][number]) =>
    d.status === "ready" || d.status === "failed" ? 1 : d.status === "processing" ? (d.progress ?? 0.5) : 0;
  if (docs.every((d) => d.status === "ready" || d.status === "failed")) {
    return { stage: STAGES.length, within: 1, overall: 1 };
  }
  const overall = docs.reduce((sum, d) => sum + done(d), 0) / docs.length;
  const scaled = overall * (STAGES.length - 1); // the stages after Uploading
  const index = Math.min(STAGES.length - 2, Math.floor(scaled));
  return { stage: index + 1, within: scaled - index, overall };
}

/** Upload → extract → split → embed → store, like the ingestion pipeline (document-step.png). */
function ProcessingStepper({ stage, within, overall, count }: ReturnType<typeof stageOf> & { count: number }) {
  const finished = stage >= STAGES.length;
  return (
    <div className="self-stretch bg-white border border-[#ECECEA] rounded-[12px] overflow-hidden flex flex-col">
      <ol className="self-stretch flex flex-col py-1.5" aria-label="Document processing">
        {STAGES.map(({ label }, i) => {
          const state = i < stage ? "done" : i === stage ? "current" : "next";
          return (
            <li
              key={label}
              className={`self-stretch flex items-center gap-3 px-4 py-2.5 transition-colors duration-500 ${
                state === "current" ? "bg-[#F7FBF8]" : ""
              }`}
              aria-current={state === "current" ? "step" : undefined}
            >
              <div className="size-5 shrink-0 flex items-center justify-center">
                {state === "done" && (
                  <span className="size-5 rounded-full bg-[#219954] text-white flex items-center justify-center">
                    <Check className="size-3" strokeWidth={3.5} aria-hidden />
                  </span>
                )}
                {state === "current" && (
                  <Loader className="size-4.5 text-[#219954] animate-spin [animation-duration:1.6s]" aria-hidden />
                )}
                {state === "next" && <span className="size-4 rounded-full border-2 border-[#D6D6D2]" aria-hidden />}
              </div>
              <div
                className={`flex-1 min-w-0 font-gabarito text-[16px] leading-[22px] ${
                  state === "current"
                    ? "font-semibold text-ink-primary"
                    : state === "done"
                      ? "font-medium text-ink-primary"
                      : "font-medium text-ink-muted"
                }`}
              >
                {label}
              </div>
              <div
                className={`shrink-0 font-gabarito text-[14px] leading-[20px] tabular-nums ${
                  state === "current" ? "font-medium text-[#17653F]" : "text-ink-muted"
                }`}
              >
                {state === "done" ? "Done" : state === "current" ? `Running… ${Math.round(within * 100)}%` : ""}
              </div>
            </li>
          );
        })}
      </ol>
      <div className="self-stretch border-t border-[#F0F0EE] px-4 py-3 flex items-center gap-4">
        <div className="shrink-0 font-gabarito text-[14px] leading-[20px] text-ink-secondary" aria-live="polite">
          {finished
            ? `${count} document${count === 1 ? "" : "s"} ready`
            : `${count} document${count === 1 ? "" : "s"} · step ${stage + 1} of ${STAGES.length}`}
        </div>
        <div className="flex-1 h-1.5 rounded-full bg-[#ECECEA] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#219954] transition-[width] duration-700 ease-out"
            style={{ width: `${overall * 100}%` }}
          />
        </div>
        <div className="shrink-0 w-10 text-right font-gabarito font-semibold text-[14px] tabular-nums text-ink-primary">
          {`${Math.round(overall * 100)}%`}
        </div>
      </div>
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
        <div className="w-11 h-11 shrink-0 bg-bg-inverse rounded-[12px] flex justify-center items-center font-gabarito font-bold text-[18px] text-ink-on-dark">
          {initials(bot.name)}
        </div>
        <div className="min-w-0 flex flex-col items-start gap-1.5">
          <div className="max-w-full truncate font-gabarito font-bold text-[20px] leading-[30px] text-ink-primary">
            {bot.name}
          </div>
          <StatusPill tone={bot.status === "pending" ? "info" : "neutral"}>
            {bot.status === "pending" ? "Pending" : "Draft"}
          </StatusPill>
        </div>
      </div>
      <div
        className={`self-stretch font-gabarito text-[16px] leading-[22px] ${bot.description ? "text-ink-body" : "text-ink-muted"}`}
      >
        {bot.description || "No description"}
      </div>
      <div className="self-stretch flex flex-col">
        {rows.map(([label, value]) => (
          <div key={label} className="self-stretch border-t border-border-default flex justify-between gap-4 py-2">
            <div className="font-gabarito text-[14px] leading-[18px] text-ink-secondary">{label}</div>
            <div className="min-w-0 truncate text-right font-gabarito font-medium text-[14px] text-ink-primary">
              {value}
            </div>
          </div>
        ))}
      </div>
      <div className="self-stretch font-geist-mono text-[13px] text-ink-muted">{`ID ${bot.id}`}</div>
    </div>
  );
}
