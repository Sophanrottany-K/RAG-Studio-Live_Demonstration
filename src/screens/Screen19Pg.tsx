// Demo 19 · [pg] A3 · Playground
// Route: #/pg  (?bot=<chatbotId> picks the chatbot)
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChatThread } from "../components/chat/ChatThread";
import { ChatbotStatusPill } from "../components/chatbot/status";
import { DocumentViewer } from "../components/documents/DocumentViewer";
import { Banner, Button, Select, Spinner } from "../components/create/ui";
import { useGo } from "../lib/nav";
import { initials } from "../lib/chatbotDraft";
import { Header7 } from "../components/shared/Header7";
import { api, errorMessage, isAbort } from "../services/api";
import type { Chatbot, ChatSource } from "../services/types";
import { AppSidebar } from "../components/shared/AppSidebar";

export default function Screen19Pg() {
  const go = useGo();
  const [params, setParams] = useSearchParams();
  const [bots, setBots] = useState<Chatbot[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [conversation, setConversation] = useState(0);
  const [viewing, setViewing] = useState<ChatSource | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    api
      .listChatbots(controller.signal)
      .then(setBots)
      .catch((e) => !isAbort(e) && setError(errorMessage(e)));
    return () => controller.abort();
  }, []);

  const bot = bots?.find((b) => b.id === params.get("bot")) ?? bots?.[0] ?? null;
  const readyDocs = bot?.documents.filter((d) => d.status === "ready").length ?? 0;

  return (
    <div className="relative w-full h-full bg-bg-card overflow-hidden flex items-start">
      <AppSidebar active="playground" />
      <div className="flex-1 min-w-0 self-stretch bg-bg-page overflow-hidden flex flex-col items-start">
        <Header7 />
        <div className="self-stretch flex-1 min-h-0 flex flex-col items-start gap-6 pt-7 pr-10 pb-10 pl-10">
          <button
            type="button"
            onClick={go(bot ? `/bot?id=${bot.id}` : "/list")}
            className="shrink-0 rounded-[8px] flex items-center gap-2 pt-1.5 pr-2.5 pb-1.5 pl-2 cursor-pointer hover:bg-bg-soft"
          >
            <img className="w-4 h-4 shrink-0" src="icons/arrow-left-property-linear.svg" alt="" />
            <span className="font-gabarito text-[14px] leading-[20px] text-ink-secondary">{"Chatbots"}</span>
            <span className="font-gabarito text-[14px] leading-[20px] text-ink-muted">{"/"}</span>
            <span className="font-gabarito text-[14px] leading-[20px] text-[#6B6B6B]">{"Test Playground"}</span>
            <span className="font-gabarito text-[14px] leading-[20px] text-ink-muted">{"/"}</span>
            <span className="font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">
              {bot?.name ?? "…"}
            </span>
          </button>
          <div className="w-115 shrink-0 flex flex-col items-start gap-1.5">
            <label
              htmlFor="playground-bot"
              className="font-gabarito font-medium text-[14px] leading-normal text-[#111111]"
            >
              {"Selected chatbot"}
            </label>
            <Select
              id="playground-bot"
              value={bot?.id ?? ""}
              disabled={!bots}
              onChange={(e) => setParams({ bot: e.target.value }, { replace: true })}
            >
              {!bots && <option value="">Loading chatbots…</option>}
              {bots?.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
          </div>
          {error && <Banner tone="danger">{error}</Banner>}
          {!bot ? (
            !error && (
              <div className="self-stretch flex items-center justify-center gap-3 py-10 font-gabarito text-[14px] text-ink-secondary">
                <Spinner /> Loading…
              </div>
            )
          ) : (
            <>
              <div className="self-stretch shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[20px] flex items-center gap-5 p-6">
                <div className="w-14 h-14 shrink-0 bg-[#111111] rounded-[16px] flex justify-center items-center font-gabarito font-bold text-[18px] text-[#FFFFFF]">
                  {initials(bot.name)}
                </div>
                <div className="flex-1 min-w-0 flex flex-col items-start gap-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="font-gabarito font-bold text-[24px] leading-normal text-[#111111]">{bot.name}</div>
                    <ChatbotStatusPill status={bot.status} />
                  </div>
                  <div className="font-gabarito text-[14px] leading-normal text-[#6B6B6B]">
                    {`Uses this chatbot's saved settings · ${readyDocs} document${readyDocs === 1 ? "" : "s"} ready · Playground messages aren't counted in analytics`}
                  </div>
                </div>
                <Button onClick={go(`/bot?id=${bot.id}`)}>View chatbot</Button>
                <Button onClick={() => setConversation((n) => n + 1)}>Reset conversation</Button>
              </div>
              {bot.status === "paused" && (
                <Banner tone="warning">
                  This chatbot is paused, so guests can't use it. You can still test it here.
                </Banner>
              )}
              <div className="self-stretch flex-1 min-h-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[20px] overflow-hidden flex flex-col items-start">
                <ChatThread
                  key={`${bot.id}-${conversation}`}
                  botName={bot.name}
                  ask={(question, signal) => api.askPlayground(bot.id, question, signal)}
                  starterQuestions={bot.settings.starterQuestions}
                  emptyTitle="Ask a question to start testing"
                  emptySubtitle="Answers come only from this chatbot’s knowledge base, with citations."
                  placeholder={`Ask ${bot.name} a question…`}
                  onOpenSource={setViewing}
                />
              </div>
            </>
          )}
        </div>
      </div>
      {bot && viewing && (
        <DocumentViewer
          name={viewing.name}
          load={(signal) => api.getDocumentOriginal(bot.id, viewing.documentId, signal)}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}
