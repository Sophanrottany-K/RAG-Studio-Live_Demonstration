// Chat conversation shared by the Playground (owner testing) and the guest public link.
import { useEffect, useRef, useState } from "react";
import { FileCode, FileSpreadsheet, FileText, Globe, type LucideIcon } from "lucide-react";
import { errorMessage, isAbort } from "../../services/api";
import { isLightColor } from "../../services/limits";
import type { ChatAnswer, ChatMessage, ChatSource } from "../../services/types";
import { MarkdownAnswer, fadingWords } from "./MarkdownAnswer";

const QUESTION_MAX = 2000;
// Answers arrive in uneven bursts of 1–3 words, like tokens from a model. The mock server sends them whole.
const STREAM_MIN_DELAY_MS = 25;
const STREAM_DELAY_RANGE_MS = 50;
/** A long answer speeds up so that it never takes much longer than this. */
const STREAM_MAX_MS = 8000;
const newId = () => Math.random().toString(36).slice(2, 10);

export function ChatThread({
  botName,
  ask,
  starterQuestions,
  emptyTitle,
  emptySubtitle,
  placeholder,
  accent = "#111111",
  onError,
  footer,
  sources = "clickable",
  onOpenSource,
}: {
  botName: string;
  ask: (question: string, signal: AbortSignal) => Promise<ChatAnswer>;
  starterQuestions: string[];
  emptyTitle: string;
  emptySubtitle: string;
  placeholder: string;
  /** Color of the guest's own bubbles and the send button. */
  accent?: string;
  /** Lets the host react to an error (e.g. switch to "unavailable"); return true to swallow it. */
  onError?: (error: unknown) => boolean | void;
  footer?: React.ReactNode;
  /** How answers show their sources: clickable chips, names only, or not at all. */
  sources?: "clickable" | "names" | "hidden";
  onOpenSource?: (source: ChatSource) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [thinking, setThinking] = useState(false);
  /** The answer still being revealed, and how many characters of it are showing. */
  const [stream, setStream] = useState<{ id: string; text: string; length: number } | null>(null);
  /** True when there is more of the conversation below what is on screen. */
  const [awayFromBottom, setAwayFromBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const controller = useRef<AbortController | null>(null);
  const streamId = stream?.id;
  const busy = thinking || !!stream;

  const questionCount = messages.filter((m) => m.role === "user").length;

  const scrollToEnd = () => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  const measure = () => {
    const el = scrollRef.current;
    if (el) setAwayFromBottom(el.scrollHeight - el.scrollTop - el.clientHeight > 40);
  };

  useEffect(() => () => controller.current?.abort(), []);
  // Only a new question scrolls the view. The answer then grows on its own, without moving the page.
  useEffect(() => {
    if (questionCount) scrollToEnd();
  }, [questionCount]);
  // Growing text fires no scroll event, so check again whenever the content changes.
  useEffect(measure, [messages, thinking, stream?.length]);
  useEffect(() => {
    if (!streamId || !stream) return;
    const { text } = stream;
    const pace = Math.min(1, STREAM_MAX_MS / (text.split(/\s+/).length * 25));
    let length = 0;
    let timer: number;
    const nextBurst = () => {
      const words = 1 + Math.floor(Math.random() * 3);
      const burst = text.slice(length).match(new RegExp(`^(?:\\s*\\S+){1,${words}}`))?.[0];
      if (!burst || length + burst.length >= text.length) {
        setStream(null);
        return;
      }
      length += burst.length;
      const shown = length;
      setStream((s) => s && { ...s, length: shown });
      // A little longer at the end of a sentence.
      const delay = (STREAM_MIN_DELAY_MS + Math.random() * STREAM_DELAY_RANGE_MS) * (/[.!?:]$/.test(burst) ? 2 : 1);
      timer = window.setTimeout(nextBurst, delay * pace);
    };
    timer = window.setTimeout(nextBurst, STREAM_MIN_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamId]);

  /** Stops the answer where it is, keeping the words already shown. */
  const stop = () => {
    controller.current?.abort();
    if (!stream) return;
    const shown = stream.text.slice(0, stream.length);
    setMessages((list) =>
      list.map((m) => (m.id === stream.id && m.role === "bot" ? { ...m, answer: { ...m.answer, answer: shown } } : m)),
    );
    setStream(null);
  };

  const send = async (raw: string, retryOf?: string) => {
    const question = raw.trim();
    if (!question || busy) return;
    setText("");
    setMessages((list) => [
      ...list.filter((m) => m.id !== retryOf),
      ...(retryOf ? [] : [{ id: newId(), role: "user" as const, text: question }]),
    ]);
    setThinking(true);
    controller.current = new AbortController();
    try {
      const answer = await ask(question, controller.current.signal);
      const id = newId();
      setMessages((list) => [...list, { id, role: "bot", answer }]);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        setStream({ id, text: answer.answer, length: 0 });
    } catch (e) {
      if (isAbort(e) || onError?.(e)) return;
      setMessages((list) => [...list, { id: newId(), role: "error", text: errorMessage(e), question }]);
    } finally {
      setThinking(false);
    }
  };

  const initial = botName.trim()[0]?.toUpperCase() ?? "B";

  return (
    <div className="self-stretch flex-1 min-h-0 flex flex-col">
      <div ref={scrollRef} onScroll={measure} className="self-stretch flex-1 min-h-0 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center gap-3 p-7 text-center">
            <div className="font-gabarito font-bold text-[24px] leading-normal text-[#111111]">{emptyTitle}</div>
            <div className="font-gabarito text-[15px] leading-normal text-[#6B6B6B]">{emptySubtitle}</div>
            {starterQuestions.length > 0 && (
              <div className="flex flex-wrap justify-center items-start gap-2.5 pt-3">
                {starterQuestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="bg-[#FFFFFF] border border-[#E4E4E0] rounded-full px-4 py-2.5 font-gabarito font-medium text-[14px] leading-normal text-[#444444] hover:bg-bg-soft cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full max-w-[1000px] mx-auto flex flex-col items-start gap-6 px-7 py-7">
            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="self-stretch flex justify-end">
                  <div
                    className="max-w-[75%] rounded-tl-[16px] rounded-tr-[16px] rounded-br-[4px] rounded-bl-[16px] px-4 py-3 font-gabarito text-[15px] leading-[24px] text-white whitespace-pre-wrap break-words"
                    style={{ background: accent, color: isLightColor(accent) ? "#111111" : "#FFFFFF" }}
                  >
                    {m.text}
                  </div>
                </div>
              ) : m.role === "bot" ? (
                <div key={m.id} className="self-stretch flex flex-col items-start gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 shrink-0 bg-bg-sidebar-dark rounded-[7.78px] flex justify-center items-center font-gabarito font-bold text-[10px] text-ink-on-dark">
                      {initial}
                    </div>
                    <div className="font-jet-brains-mono font-medium text-[11px] leading-[16px] tracking-[0.06em] uppercase text-ink-muted-2">
                      {m.answer.answered
                        ? `Retrieved ${m.answer.sources.length} source${m.answer.sources.length === 1 ? "" : "s"} · Answer found`
                        : `Searched ${m.answer.sourcesSearched} source${m.answer.sourcesSearched === 1 ? "" : "s"} · No answer found`}
                    </div>
                  </div>
                  {m.answer.markdown ? (
                    <MarkdownAnswer
                      markdown={stream?.id === m.id ? m.answer.answer.slice(0, stream.length) : m.answer.answer}
                    />
                  ) : (
                    <div className="max-w-[85%] font-gabarito text-[15px] leading-[24px] text-ink-body-2 whitespace-pre-wrap [overflow-wrap:anywhere]">
                      {fadingWords(stream?.id === m.id ? m.answer.answer.slice(0, stream.length) : m.answer.answer)}
                    </div>
                  )}
                  {stream?.id !== m.id && sources !== "hidden" && m.answer.sources.length > 0 && (
                    <div className="max-w-[85%] flex flex-col items-start gap-2">
                      <div className="font-gabarito font-medium text-[13px] text-ink-secondary">
                        {`Retrieved sources (${m.answer.sources.length})`}
                      </div>
                      <div className="max-w-full flex flex-wrap gap-2">
                        {m.answer.sources.map((s) =>
                          sources === "clickable" && onOpenSource ? (
                            <button
                              key={s.documentId}
                              type="button"
                              title={s.snippet}
                              onClick={() => onOpenSource(s)}
                              className="max-w-full flex items-center gap-2 bg-[#FFFFFF] border border-[#E4E4E0] rounded-full pl-1.5 pr-3 py-1 hover:bg-bg-soft cursor-pointer"
                            >
                              <SourceBadge type={s.type} />
                              <span className="min-w-0 truncate font-gabarito font-medium text-[13px] text-[#111111]">
                                {s.name}
                              </span>
                              <span className="text-[12px] text-ink-muted">↗</span>
                            </button>
                          ) : (
                            <span
                              key={s.documentId}
                              title={s.name}
                              className="max-w-full flex items-center gap-2 bg-[#FAFAF9] border border-[#ECECEA] rounded-full pl-1.5 pr-3 py-1"
                            >
                              <SourceBadge type={s.type} />
                              <span className="min-w-0 truncate font-gabarito text-[13px] text-[#444444]">{s.name}</span>
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  key={m.id}
                  role="alert"
                  className="self-stretch flex items-center gap-3 bg-danger-tint border border-danger-border rounded-[12px] px-4 py-3 font-gabarito text-[14px] text-danger-text"
                >
                  <span className="flex-1">{m.text}</span>
                  <button
                    type="button"
                    className="font-bold underline cursor-pointer"
                    onClick={() => send(m.question, m.id)}
                  >
                    Try again
                  </button>
                </div>
              ),
            )}
            {busy && (
              <div role="status" aria-label={`${botName} is responding`} className="h-6 flex items-center">
                <TypingDots />
              </div>
            )}
          </div>
        )}
      </div>
      <form
        className="relative self-stretch shrink-0 border-t border-border-default bg-bg-card flex flex-col items-center gap-2 px-5 pt-4 pb-4"
        onSubmit={(e) => {
          e.preventDefault();
          send(text);
        }}
      >
        {messages.length > 0 && awayFromBottom && (
          <button
            type="button"
            aria-label={busy ? "Still responding. Scroll to the latest text" : "Scroll to the latest message"}
            onClick={scrollToEnd}
            className="absolute -top-12 left-1/2 -translate-x-1/2 min-w-9 h-9 px-2.5 rounded-full bg-[#FFFFFF] border border-[#E4E4E0] shadow-[0px_1px_6px_0px_#1111111A] flex justify-center items-center text-[16px] leading-none text-[#444444] hover:bg-bg-soft cursor-pointer"
          >
            {/* Three dots while the answer is still coming below; the arrow once it is done. */}
            {busy ? <TypingDots /> : "↓"}
          </button>
        )}
        <div className="w-full max-w-[1000px] bg-bg-card border border-border-default rounded-[28px] shadow-[0px_5px_20px_0px_#1111111A,0px_1px_6px_0px_#1111110A] flex items-end gap-3 pl-6 pr-2 py-2">
          <textarea
            aria-label="Your question"
            rows={1}
            value={text}
            maxLength={QUESTION_MAX}
            placeholder={placeholder}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send(text);
              }
            }}
            className="flex-1 min-w-0 max-h-32 self-center resize-none bg-transparent border-0 py-2 font-gabarito text-[16px] leading-[24px] text-ink-primary placeholder:text-ink-muted focus:outline-none"
          />
          {busy ? (
            <button
              key="stop"
              type="button"
              aria-label="Stop the answer"
              onClick={stop}
              className="w-11 h-11 shrink-0 rounded-full flex justify-center items-center cursor-pointer"
              style={{ background: accent }}
            >
              <span
                className="w-3.5 h-3.5 rounded-[3px]"
                style={{ background: isLightColor(accent) ? "#111111" : "#FFFFFF" }}
              />
            </button>
          ) : (
            <button
              key="send"
              type="submit"
              aria-label="Send question"
              disabled={!text.trim()}
              className="w-11 h-11 shrink-0 rounded-full flex justify-center items-center text-white text-[20px] leading-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: accent, color: isLightColor(accent) ? "#111111" : "#FFFFFF" }}
            >
              ↑
            </button>
          )}
        </div>
        {footer}
      </form>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="typing-dots" aria-hidden>
      <span />
      <span />
      <span />
    </span>
  );
}

const SOURCE_ICONS: Record<string, { Icon: LucideIcon; className: string; label: string }> = {
  PDF: { Icon: FileText, className: "bg-[#FDECEC] text-[#D93025]", label: "PDF" },
  DOCX: { Icon: FileText, className: "bg-[#E8F0FE] text-[#1A73E8]", label: "Word document" },
  XLSX: { Icon: FileSpreadsheet, className: "bg-[#E6F4EA] text-[#188038]", label: "Excel spreadsheet" },
  TXT: { Icon: FileText, className: "bg-[#F3F3F1] text-[#525252]", label: "Text file" },
  MD: { Icon: FileCode, className: "bg-[#F3F3F1] text-[#525252]", label: "Markdown file" },
  URL: { Icon: Globe, className: "bg-[#E0F5F8] text-[#0E7490]", label: "Web page" },
};

function SourceBadge({ type }: { type: string }) {
  const icon = SOURCE_ICONS[type];
  if (icon)
    return (
      <span
        role="img"
        aria-label={icon.label}
        className={`size-5 shrink-0 rounded-[5px] flex items-center justify-center ${icon.className}`}
      >
        <icon.Icon className="size-3.5" aria-hidden />
      </span>
    );
  return (
    <span className="h-5 shrink-0 rounded-[5px] bg-[#F3F3F1] px-1.5 flex items-center font-geist-mono text-[9px] text-[#525252]">
      {type}
    </span>
  );
}
