// Chat conversation shared by the Playground (owner testing) and the guest public link.
import { useEffect, useRef, useState } from "react";
import { errorMessage, isAbort } from "../../services/api";
import type { ChatAnswer, ChatMessage, ChatSource } from "../../services/types";
import { Spinner } from "../create/ui";

const QUESTION_MAX = 2000;
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const controller = useRef<AbortController | null>(null);

  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = async (raw: string, retryOf?: string) => {
    const question = raw.trim();
    if (!question || thinking) return;
    setText("");
    setMessages((list) => [
      ...list.filter((m) => m.id !== retryOf),
      ...(retryOf ? [] : [{ id: newId(), role: "user" as const, text: question }]),
    ]);
    setThinking(true);
    controller.current = new AbortController();
    try {
      const answer = await ask(question, controller.current.signal);
      setMessages((list) => [...list, { id: newId(), role: "bot", answer }]);
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
      <div ref={scrollRef} className="self-stretch flex-1 min-h-0 overflow-y-auto">
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
                    style={{ background: accent }}
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
                      {`Searched ${m.answer.sourcesSearched} source${m.answer.sourcesSearched === 1 ? "" : "s"} · ${
                        m.answer.answered ? "Answer found" : "No answer found"
                      }`}
                    </div>
                  </div>
                  <div className="max-w-[85%] font-gabarito text-[15px] leading-[24px] text-ink-body-2 whitespace-pre-wrap">
                    {m.answer.answer}
                  </div>
                  {sources !== "hidden" && m.answer.sources.length > 0 && (
                    <div className="max-w-[85%] flex flex-col items-start gap-2">
                      <div className="font-gabarito font-medium text-[13px] text-ink-secondary">
                        {`Retrieved sources (${m.answer.sources.length})`}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {m.answer.sources.map((s) =>
                          sources === "clickable" && onOpenSource ? (
                            <button
                              key={s.documentId}
                              type="button"
                              title={s.snippet}
                              onClick={() => onOpenSource(s)}
                              className="flex items-center gap-2 bg-[#FFFFFF] border border-[#E4E4E0] rounded-full pl-1.5 pr-3 py-1 hover:bg-bg-soft cursor-pointer"
                            >
                              <SourceBadge type={s.type} />
                              <span className="font-gabarito font-medium text-[13px] text-[#111111]">{s.name}</span>
                              <span className="text-[12px] text-ink-muted">↗</span>
                            </button>
                          ) : (
                            <span
                              key={s.documentId}
                              className="flex items-center gap-2 bg-[#FAFAF9] border border-[#ECECEA] rounded-full pl-1.5 pr-3 py-1"
                            >
                              <SourceBadge type={s.type} />
                              <span className="font-gabarito text-[13px] text-[#444444]">{s.name}</span>
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
            {thinking && (
              <div className="flex items-center gap-2.5 font-gabarito text-[14px] text-ink-secondary">
                <Spinner /> {`${botName} is searching its documents…`}
              </div>
            )}
          </div>
        )}
      </div>
      <form
        className="self-stretch shrink-0 border-t border-border-default bg-bg-card flex flex-col items-center gap-2 px-5 pt-4 pb-4"
        onSubmit={(e) => {
          e.preventDefault();
          send(text);
        }}
      >
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
          <button
            type="submit"
            aria-label="Send question"
            disabled={!text.trim() || thinking}
            className="w-11 h-11 shrink-0 rounded-full flex justify-center items-center text-white text-[20px] leading-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: accent }}
          >
            ↑
          </button>
        </div>
        {footer}
      </form>
    </div>
  );
}

function SourceBadge({ type }: { type: string }) {
  return (
    <span className="h-5 rounded-[5px] bg-[#F3F3F1] px-1.5 flex items-center font-geist-mono text-[9px] text-[#525252]">
      {type}
    </span>
  );
}
