// Web widget · the chat bubble and window that public/widget.js shows on the owner's website (web-widget.png)
// Route: #/w/:chatbotId?host=<site host> — loaded inside the loader's iframe, not on its own
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Lock, MessageCircleMore, X } from "lucide-react";
import { ChatThread } from "../components/chat/ChatThread";
import { api, isAbort, usingMockApi, watchChanges } from "../services/api";
import { connectSiteStorage, isCrossSiteFrame } from "../services/siteStorage";
import { ApiError, type WidgetChat, type WidgetEmbed } from "../services/types";

const UNAVAILABLE = {
  paused: "The owner has paused this chatbot. Please check back soon.",
  not_published: "This chatbot hasn't been published yet. Please check back soon.",
};

/** Why the loader hides the widget; it prints this in the website's browser console. */
const HIDDEN: Record<string, (host: string) => string> = {
  not_configured: () => "the widget hasn't been generated yet (RAG Studio → Channels → Web Widget).",
  disabled: () => "the widget is disabled in RAG Studio (Channels → Web Widget → Enable).",
  domain_not_allowed: (host) =>
    `"${host}" isn't in the widget's Allowed domains. Add it in RAG Studio and click Save and generate widget code.`,
  not_found: () => "no chatbot has this data-chatbot-id. Copy the embed code from RAG Studio again.",
  no_storage_access: () =>
    "Chrome didn't let the widget read RAG Studio's data on this site (third-party cookies are blocked). " +
    "Allow third-party cookies for this site (address bar → eye/site settings), then reload.",
};

type WidgetState = "open" | "closed" | "hidden";

// The host page's origin isn't known in advance, and the messages carry no data, so any origin may receive them.
const tellLoader = (state: WidgetState, extra?: { position?: string; reason?: string }) =>
  window.parent !== window && window.parent.postMessage({ type: "rag-studio-widget", state, ...extra }, "*");

export default function Screen48Widget() {
  const { chatbotId = "" } = useParams();
  const [params] = useSearchParams();
  const host = params.get("host") ?? "";
  // The settings in the embed code (forwarded by widget.js); used when this iframe's storage has none.
  const embedKey = JSON.stringify(["color", "position", "welcome", "domains"].map((k) => params.get(k) ?? ""));
  const embed = useMemo<Partial<WidgetEmbed>>(() => {
    const [primaryColor, position, welcomeMessage, domains] = JSON.parse(embedKey) as string[];
    return {
      primaryColor: primaryColor || undefined,
      position: (position || undefined) as WidgetEmbed["position"] | undefined,
      welcomeMessage: welcomeMessage || undefined,
      allowedDomains: domains ? domains.split(",") : undefined,
    };
  }, [embedKey]);
  const [chat, setChat] = useState<WidgetChat | null>(null);
  const [hidden, setHidden] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  // Prototype only: on another site this iframe can't see RAG Studio's storage until Chrome grants access, which
  // may need a click. Until then a plain bubble in the embed code's color asks for it.
  const [needsAccess, setNeedsAccess] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // The iframe must be see-through around the bubble.
  useEffect(() => {
    const els = [document.documentElement, document.body];
    els.forEach((el) => (el.style.background = "transparent"));
    return () => els.forEach((el) => (el.style.background = ""));
  }, []);

  // Load the widget, then keep it in step with the owner: disabling it, pausing the chatbot or removing the
  // domain takes effect without reloading the website.
  useEffect(() => {
    let controller: AbortController | null = null;
    const storage = usingMockApi ? connectSiteStorage() : Promise.resolve(false);
    const load = () => {
      controller?.abort();
      const current = (controller = new AbortController());
      storage
        .then((connected) =>
          api.getWidgetChat(chatbotId, host, current.signal, embed).catch((e) => {
            // Not in this iframe's own storage: maybe in RAG Studio's, once Chrome allows it (after a click).
            if (e instanceof ApiError && e.status === 404 && usingMockApi && isCrossSiteFrame() && !connected) {
              setNeedsAccess(true);
              return null;
            }
            throw e;
          }),
        )
        .then((next) => {
          if (!next) return;
          setNeedsAccess(false);
          const reason = next.reason && HIDDEN[next.reason];
          setHidden(reason ? reason(host) : null);
          setChat(next);
        })
        .catch((e) => {
          if (isAbort(e)) return;
          if (e instanceof ApiError && e.status === 404) setHidden(HIDDEN.not_found(host));
        });
    };
    load();
    const unwatch = watchChanges(load);
    const timer = window.setInterval(load, 10_000);
    window.addEventListener("focus", load);
    return () => {
      unwatch();
      window.clearInterval(timer);
      window.removeEventListener("focus", load);
      controller?.abort();
    };
  }, [chatbotId, host, embed, attempt]);

  useEffect(() => {
    if (hidden) tellLoader("hidden", { reason: hidden });
    else if (chat) tellLoader(open ? "open" : "closed", { position: chat.position });
    else if (needsAccess) tellLoader("closed", { position: embed.position });
  }, [hidden, chat, open, needsAccess, embed.position]);

  if (needsAccess && !chat && !hidden) {
    const left = embed.position === "bottom-left";
    return (
      <div className={`h-screen w-screen flex flex-col justify-end p-4 ${left ? "items-start" : "items-end"}`}>
        <button
          type="button"
          aria-label="Open chat"
          onClick={async () => {
            if (await connectSiteStorage()) {
              setOpen(true);
              setAttempt((n) => n + 1);
            } else setHidden(HIDDEN.no_storage_access(host));
          }}
          className="size-14 shrink-0 rounded-full flex items-center justify-center cursor-pointer shadow-[0px_4px_12px_0px_#00000033] transition-transform hover:scale-105"
          style={{ background: embed.primaryColor ?? "#111111", color: "#FFFFFF" }}
        >
          <MessageCircleMore className="size-6" />
        </button>
      </div>
    );
  }

  if (!chat || hidden) return null;

  const color = chat.primaryColor;
  const left = chat.position === "bottom-left";
  const unavailable = chat.reason === "paused" || chat.reason === "not_published" ? UNAVAILABLE[chat.reason] : null;
  const initial = chat.chatbotName.trim().charAt(0).toUpperCase() || "C";

  return (
    <div className={`h-screen w-screen flex flex-col justify-end gap-3 p-4 ${left ? "items-start" : "items-end"}`}>
      {open && (
        <div
          role="dialog"
          aria-label={`Chat with ${chat.chatbotName}`}
          className="w-full flex-1 min-h-0 flex flex-col overflow-hidden rounded-[24px] border border-[#E4E4E0] bg-[#FFFFFF] shadow-[0px_4px_14px_0px_#0000001F] font-gabarito"
        >
          <div className="shrink-0 flex items-center gap-3 border-b border-[#E4E4E0] px-4 py-3">
            <div
              className="size-10 shrink-0 rounded-[12px] flex items-center justify-center font-bold text-[18px]"
              style={{ background: `${color}1F`, color }}
            >
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-bold text-[16px] leading-normal text-[#111111]">{chat.chatbotName}</div>
              <div className="truncate text-[13px] leading-normal text-[#6B6B6B]">
                {unavailable ? "Unavailable right now" : "Online · answers from official documents"}
              </div>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="size-9 shrink-0 rounded-full bg-[#F0F0EE] flex items-center justify-center text-[#111111] cursor-pointer hover:bg-[#E4E4E0]"
            >
              <X className="size-4" />
            </button>
          </div>

          {unavailable ? (
            <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
              <div className="font-bold text-[20px] leading-normal text-[#111111]">
                {"This chatbot is temporarily unavailable"}
              </div>
              <div className="text-[14px] leading-normal text-[#6B6B6B]">{unavailable}</div>
            </div>
          ) : (
            <ChatThread
              botName={chat.chatbotName}
              ask={(question, signal) => api.askWidget(chatbotId, host, question, signal, embed)}
              starterQuestions={chat.starterQuestions}
              emptyTitle={`Hi! I'm ${chat.chatbotName}.`}
              emptySubtitle={chat.welcomeMessage || "Ask a question and I'll answer from the official documents."}
              placeholder={`Ask ${chat.chatbotName}…`}
              accent={color}
              sources={chat.sourceVisibility === "Hidden" ? "hidden" : "names"}
              onError={(e) => {
                // Paused or turned off while the visitor was chatting: reload so the window shows why.
                if (e instanceof ApiError && e.code === "chatbot_unavailable") {
                  setChat(null);
                  api.getWidgetChat(chatbotId, host, undefined, embed).then(setChat, () => {});
                  return true;
                }
              }}
              footer={
                <div className="flex items-center gap-1.5 text-[12px] leading-[16px] text-[#6B6B6B]">
                  <Lock className="size-3" aria-hidden />
                  {"Answers come only from official documents"}
                </div>
              }
            />
          )}
        </div>
      )}

      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close chat" : `Chat with ${chat.chatbotName}`}
        onClick={() => setOpen((o) => !o)}
        className="size-14 shrink-0 rounded-full flex items-center justify-center cursor-pointer shadow-[0px_4px_12px_0px_#00000033] transition-transform hover:scale-105"
        style={{ background: color, color: "#FFFFFF" }}
      >
        {open ? <X className="size-6" /> : <MessageCircleMore className="size-6" />}
      </button>
    </div>
  );
}
