// Demo 23 · [ch0] A4 · Channels
// Route: #/ch0  (also #/ch1, #/ch2, #/ch3; ?bot=<chatbotId> picks the chatbot)
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PublicLinkCard } from "../components/channels/PublicLinkCard";
import { TelegramCard } from "../components/channels/TelegramCard";
import { WidgetCard } from "../components/channels/WidgetCard";
import { Banner, Button, Select, Spinner } from "../components/create/ui";
import { Header } from "../components/shared/Header";
import { SidebarUserV2 } from "../components/shared/SidebarUserV2";
import { useGo } from "../lib/nav";
import { api, errorMessage, isAbort } from "../services/api";
import type { ChatbotChannels, ChatbotStatus } from "../services/types";

type BotOption = { id: string; name: string; status: ChatbotStatus };

export default function Screen23Ch0() {
  const go = useGo();
  const [params, setParams] = useSearchParams();
  const [bots, setBots] = useState<BotOption[] | null>(null);
  const [channels, setChannels] = useState<ChatbotChannels | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const selectedId = params.get("bot") ?? bots?.[0]?.id ?? null;

  useEffect(() => {
    const controller = new AbortController();
    api
      .listChatbots(controller.signal)
      .then((list) => setBots(list.map((b) => ({ id: b.id, name: b.name, status: b.status }))))
      .catch((e) => !isAbort(e) && setError(errorMessage(e)));
    return () => controller.abort();
  }, [attempt]);

  useEffect(() => {
    if (!selectedId) return;
    const controller = new AbortController();
    setChannels(null);
    setError(null);
    api
      .getChannels(selectedId, controller.signal)
      .then(setChannels)
      .catch((e) => !isAbort(e) && setError(errorMessage(e)));
    return () => controller.abort();
  }, [selectedId, attempt]);

  const selected = bots?.find((b) => b.id === selectedId);
  const paused = selected?.status === "paused";
  const [resuming, setResuming] = useState(false);
  const resume = async () => {
    if (!selectedId) return;
    setResuming(true);
    try {
      const bot = await api.setChatbotStatus(selectedId, "active");
      setBots((list) => list?.map((b) => (b.id === bot.id ? { ...b, status: bot.status } : b)) ?? null);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setResuming(false);
    }
  };

  const connected = channels
    ? [channels.publicLink.enabled, channels.widget.enabled, channels.telegram.connected].filter(Boolean).length
    : 0;

  return (
    <div className="relative w-full h-full bg-bg-card overflow-hidden flex items-start pl-84">
      <div className="flex-1 min-w-0 self-stretch bg-bg-page overflow-hidden flex flex-col items-start">
        <Header />
        <div className="self-stretch flex-1 min-h-0 overflow-y-auto">
          <div className="flex flex-col items-start gap-6 pt-7 pr-10 pb-12 pl-10">
            {/* Breadcrumb back to the selected chatbot's detail page. */}
            <nav className="shrink-0 flex items-center gap-2" aria-label="Breadcrumb">
              <button
                type="button"
                onClick={go("/list")}
                className="rounded-[8px] flex items-center gap-2 pt-1.5 pr-2.5 pb-1.5 pl-2 cursor-pointer hover:bg-bg-soft"
              >
                <img className="w-4 h-4 shrink-0" src="icons/arrow-left-property-linear.svg" alt="" />
                <span className="font-gabarito text-[14px] leading-[20px] text-ink-secondary">{"Chatbots"}</span>
              </button>
              <span className="font-gabarito text-[14px] leading-[20px] text-ink-muted">{"/"}</span>
              <button
                type="button"
                disabled={!selected}
                onClick={selected ? go(`/bot?id=${selected.id}`) : undefined}
                className="rounded-[8px] px-2.5 py-1.5 font-gabarito text-[14px] leading-[20px] text-ink-secondary cursor-pointer hover:bg-bg-soft hover:text-ink-primary disabled:cursor-default"
              >
                {selected?.name ?? "…"}
              </button>
              <span className="font-gabarito text-[14px] leading-[20px] text-ink-muted">{"/"}</span>
              <span className="px-1 font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">
                {"Channels"}
              </span>
            </nav>
            <div className="self-stretch shrink-0 flex flex-col items-start gap-1.5">
              <h1 className="font-gabarito font-bold text-[32px] leading-normal text-[#111111]">{"Channels"}</h1>
              <div className="font-gabarito text-[15px] leading-normal text-[#6B6B6B]">
                {"Connect your assistants to the places your audience uses."}
              </div>
            </div>

            <div className="w-115 shrink-0 flex flex-col items-start gap-1.5">
              <label
                htmlFor="channels-bot"
                className="font-gabarito font-medium text-[14px] leading-normal text-[#111111]"
              >
                {"Selected chatbot"}
              </label>
              <Select
                id="channels-bot"
                value={selectedId ?? ""}
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

            <div className="self-stretch shrink-0 flex flex-col items-start gap-1">
              <div className="font-gabarito font-bold text-[22px] leading-normal text-[#111111]">
                {channels ? `Channels · ${connected} of 3 live` : "Channels"}
              </div>
              <div className="font-gabarito text-[14px] leading-normal text-[#6B6B6B]">
                {
                  "Publish this chatbot on a public link, your website, or Telegram. Each channel shows its status and messages this week."
                }
              </div>
            </div>

            {error ? (
              <Banner tone="danger">
                <div className="flex items-center gap-3">
                  <span className="flex-1">{error}</span>
                  <Button onClick={() => setAttempt((n) => n + 1)}>Try again</Button>
                </div>
              </Banner>
            ) : !channels ? (
              <div className="self-stretch flex items-center gap-3 py-10 justify-center font-gabarito text-[14px] text-ink-secondary">
                <Spinner /> Loading channels…
              </div>
            ) : (
              // Keyed by chatbot so each card's form resets when you switch chatbots.
              <div key={channels.chatbotId} className="self-stretch flex flex-col items-start gap-6">
                {paused && (
                  <Banner tone="warning">
                    <div className="flex items-center gap-3">
                      <span className="flex-1">
                        This chatbot is paused. Its public link, widget and Telegram bot show “temporarily unavailable”
                        until you resume it.
                      </span>
                      <Button variant="primary" loading={resuming} onClick={resume}>
                        Resume chatbot
                      </Button>
                    </div>
                  </Banner>
                )}
                <PublicLinkCard
                  chatbotId={channels.chatbotId}
                  link={channels.publicLink}
                  onSaved={setChannels}
                  chatbotPaused={paused}
                />
                <WidgetCard
                  chatbotId={channels.chatbotId}
                  widget={channels.widget}
                  onSaved={setChannels}
                  chatbotPaused={paused}
                />
                <TelegramCard
                  chatbotId={channels.chatbotId}
                  telegram={channels.telegram}
                  onSaved={setChannels}
                  chatbotPaused={paused}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <SidebarUserV2 />
    </div>
  );
}
