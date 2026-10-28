// Guest · Public link chat (what anyone with the share link sees, opened in its own tab)
// Route: #/s/:token
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChatThread } from "../components/chat/ChatThread";
import { DocumentViewer } from "../components/documents/DocumentViewer";
import { Button, Spinner } from "../components/create/ui";
import { initials } from "../lib/chatbotDraft";
import { api, errorMessage, isAbort, watchChanges } from "../services/api";
import { ApiError, type ChatSource, type PublicChat } from "../services/types";

const UNAVAILABLE: Record<NonNullable<PublicChat["reason"]>, { title: string; body: string }> = {
  paused: {
    title: "This chatbot is temporarily unavailable",
    body: "The owner has paused this chatbot. Please check back soon.",
  },
  not_published: {
    title: "This chatbot is temporarily unavailable",
    body: "This chatbot hasn't been published yet. Please check back soon.",
  },
  disabled: {
    title: "This link is no longer active",
    body: "The owner turned off this link. Ask them for a new one.",
  },
  expired: {
    title: "This link has expired",
    body: "The owner set this link to stop working. Ask them for a new one.",
  },
};

export default function Screen46Guest() {
  const { token = "" } = useParams();
  const [chat, setChat] = useState<PublicChat | null>(null);
  const [error, setError] = useState<{ message: string; notFound: boolean } | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [viewing, setViewing] = useState<ChatSource | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setError(null);
    api
      .getPublicChat(token, controller.signal)
      .then(setChat)
      .catch(
        (e) =>
          !isAbort(e) && setError({ message: errorMessage(e), notFound: e instanceof ApiError && e.status === 404 }),
      );
    return () => controller.abort();
  }, [token, attempt]);

  // Keep the link's status live: when the owner pauses, resumes or turns off the chatbot, the page
  // switches without a refresh. Re-checks quietly on changes from other tabs, on focus, and every 10s.
  const loaded = chat !== null;
  useEffect(() => {
    if (!loaded) return;
    let controller: AbortController | null = null;
    const recheck = () => {
      controller?.abort();
      controller = new AbortController();
      api
        .getPublicChat(token, controller.signal)
        .then((next) =>
          setChat((prev) =>
            prev && prev.available === next.available && prev.reason === next.reason ? { ...prev, ...next } : next,
          ),
        )
        .catch(() => {}); // a failed background check keeps what is on screen
    };
    const onVisible = () => document.visibilityState === "visible" && recheck();
    const unwatch = watchChanges(recheck);
    const timer = window.setInterval(recheck, 10_000);
    window.addEventListener("focus", recheck);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      unwatch();
      window.clearInterval(timer);
      window.removeEventListener("focus", recheck);
      document.removeEventListener("visibilitychange", onVisible);
      controller?.abort();
    };
  }, [token, loaded]);

  useEffect(() => {
    if (chat) document.title = chat.title;
  }, [chat]);

  const accent = chat?.themeColor ?? "#111111";
  const unavailable = chat && !chat.available ? UNAVAILABLE[chat.reason ?? "paused"] : null;

  return (
    <div className="relative w-full h-full bg-bg-page-2 overflow-hidden flex items-start">
      <div className="flex-1 min-w-0 self-stretch bg-bg-page overflow-hidden flex flex-col items-center">
        <div className="self-stretch shrink-0 bg-bg-card border-b border-border-default flex justify-between items-center px-14 py-5">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 shrink-0 rounded-[12px] flex justify-center items-center font-gabarito font-bold text-[18px] text-ink-on-dark"
              style={{ background: accent }}
            >
              {chat ? initials(chat.chatbotName) : "·"}
            </div>
            <div className="flex flex-col items-start">
              <div className="font-gabarito font-bold text-[18px] leading-[28px] text-ink-primary">
                {chat?.title ?? " "}
              </div>
              <div className="font-gabarito text-[14px] leading-[20px] text-ink-secondary">
                {"Public chat  •  Answers come only from official documents"}
              </div>
            </div>
          </div>
        </div>

        {!chat ? (
          <div className="self-stretch flex-1 min-h-0 flex flex-col justify-center items-center gap-5 px-10 text-center">
            {error ? (
              <>
                <img className="w-18 h-18 shrink-0" src="icons/status-icon.svg" alt="" />
                <div className="font-gabarito font-bold text-[32px] leading-[40px] text-ink-strong">
                  {error.notFound ? "This link doesn't work" : "Something went wrong"}
                </div>
                <div className="max-w-140 font-gabarito text-[15px] leading-[24px] text-ink-subtle">
                  {error.message}
                </div>
                {!error.notFound && <Button onClick={() => setAttempt((n) => n + 1)}>Try again</Button>}
              </>
            ) : (
              <div className="flex items-center gap-3 font-gabarito text-[14px] text-ink-secondary">
                <Spinner /> Loading chat…
              </div>
            )}
          </div>
        ) : unavailable ? (
          <div className="self-stretch flex-1 min-h-0 flex flex-col justify-center items-center gap-5 px-10 text-center">
            <img className="w-18 h-18 shrink-0" src="icons/status-icon.svg" alt="" />
            <div className="font-gabarito font-bold text-[36px] leading-[40px] text-ink-strong">
              {unavailable.title}
            </div>
            <div className="max-w-190 font-gabarito text-[15px] leading-[24px] text-ink-subtle">{unavailable.body}</div>
            <Button onClick={() => setAttempt((n) => n + 1)}>Check again</Button>
          </div>
        ) : (
          <ChatThread
            botName={chat.chatbotName}
            ask={(question, signal) => api.askPublic(token, question, signal)}
            starterQuestions={chat.starterQuestions}
            emptyTitle={`Hi! I'm ${chat.chatbotName}.`}
            emptySubtitle="Ask a question and I'll answer from the official documents."
            placeholder={`Ask ${chat.chatbotName} a question…`}
            accent={accent}
            sources={
              chat.sourceVisibility === "Full document"
                ? "clickable"
                : chat.sourceVisibility === "Name only"
                  ? "names"
                  : "hidden"
            }
            onOpenSource={setViewing}
            onError={(e) => {
              // Paused (or link turned off) while the guest was chatting: show the unavailable page.
              if (e instanceof ApiError && e.code === "chatbot_unavailable") {
                setAttempt((n) => n + 1);
                return true;
              }
            }}
            footer={
              <div className="flex items-center gap-1.5">
                <img className="w-3 h-3 shrink-0" src="icons/lock-property-linear-2.svg" alt="" />
                <div className="font-gabarito font-medium text-[12px] leading-[16px] text-ink-muted">
                  {"Answers are generated only from official documents.  •  Powered by RAG Studio"}
                </div>
              </div>
            }
          />
        )}
      </div>
      {viewing && (
        <DocumentViewer
          name={viewing.name}
          load={(signal) => api.getPublicDocumentOriginal(token, viewing.documentId, signal)}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}
