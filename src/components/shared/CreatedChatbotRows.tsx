import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, isAbort } from "../../services/api";
import type { Chatbot, ChatbotStatus } from "../../services/types";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const STATUS_PILL: Record<ChatbotStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-[#8A8A864D] border-[#8A8A86] text-neutral-text" },
  pending: { label: "Pending", className: "bg-[#E0A1004D] border-[#E0A100] text-warning-text" },
  active: { label: "Active", className: "bg-[#2E9E664D] border-success-solid text-success-text" },
  paused: { label: "Paused", className: "bg-[#8A8A864D] border-[#8A8A86] text-neutral-text" },
};

/** Chatbots created through the wizard, fetched from the API and shown above the demo rows. */
export function CreatedChatbotRows() {
  const navigate = useNavigate();
  const [bots, setBots] = useState<Chatbot[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    const load = () =>
      api
        .listChatbots(controller.signal)
        .then((list) => {
          setBots(list);
          if (list.some((b) => b.documents.some((d) => d.status !== "ready"))) timer = setTimeout(load, 2000);
        })
        .catch((e) => !isAbort(e) && console.warn("Couldn't load chatbots", e));
    load();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {bots.map((bot) => {
        const ready = bot.documents.filter((d) => d.status === "ready").length;
        const total = bot.documents.length;
        const pill = STATUS_PILL[bot.status];
        return (
          <div
            key={bot.id}
            onClick={() => navigate(`/bot?id=${bot.id}`)}
            className="self-stretch h-18 shrink-0 bg-[#FFFFFF] border-b border-[#E4E4E0] flex items-center gap-5 px-4 py-3.5 cursor-pointer hover:bg-bg-page"
          >
            <div className="flex-1 min-w-0 flex flex-col items-start gap-0.5">
              <div className="max-w-full truncate font-gabarito font-bold text-[14px] leading-[20px] text-[#111111]">
                {bot.name}
              </div>
              <div className="max-w-full truncate font-gabarito text-[12px] leading-[16px] text-[#6B6B6B]">
                {bot.description || "No description"}
              </div>
            </div>
            <div className="w-37.5 shrink-0 flex items-center">
              <div
                className={`w-24 border rounded-[99px] flex justify-center items-center px-2.5 py-1 font-geist-mono font-bold text-[11px] leading-[16px] tracking-[0.01em] uppercase ${pill.className}`}
              >
                {pill.label}
              </div>
            </div>
            <div className="w-47.5 shrink-0 flex flex-col items-start gap-1.5">
              <div className="flex items-center gap-1.5">
                <div className="font-gabarito font-medium text-[14px] leading-[20px] text-[#111111]">{`${total} doc${total === 1 ? "" : "s"}`}</div>
                <div className="font-gabarito text-[12px] leading-[16px] text-[#8A8A86]">
                  {!total ? "Add documents" : ready === total ? "All ready" : `${ready} of ${total} ready`}
                </div>
              </div>
              <div className="w-35 h-1 bg-[#F0F0EE] rounded-[20px] overflow-hidden">
                <div
                  className={`h-full rounded-[20px] transition-[width] duration-500 ${ready === total ? "bg-[#2E9E66]" : "bg-[#E0A100]"}`}
                  style={{ width: total ? `${(ready / total) * 100}%` : 0 }}
                />
              </div>
            </div>
            <div
              className={`w-37.5 shrink-0 truncate font-gabarito text-[12px] leading-[16px] ${bot.channels.length ? "text-[#111111]" : "text-[#9A9A96]"}`}
            >
              {bot.channels.length ? bot.channels.join(" · ") : "Not connected"}
            </div>
            <div className="w-27.5 shrink-0 text-right font-gabarito font-medium text-[14px] leading-[20px] text-[#111111]">
              0
            </div>
            <div className="w-32.5 shrink-0 font-gabarito font-medium text-[13px] leading-[16px] text-[#444444]">
              {fmtDate(bot.createdAt)}
            </div>
            <div className="w-32.5 shrink-0 font-gabarito font-medium text-[13px] leading-[16px] text-[#444444]">
              {fmtDate(bot.updatedAt)}
            </div>
          </div>
        );
      })}
    </>
  );
}
