// Demo 03 · [tch] A1 · Tour · Channels module
// Route: #/tch
import { useGo } from "../lib/nav";
import { Header6 } from "../components/shared/Header6";
import { UserCard } from "../components/shared/UserCard";

export default function Screen03Tch() {
  const go = useGo();
  return (
    <div className="relative w-full h-full bg-bg-card overflow-hidden flex items-start pl-84">
      <div className="absolute left-0 top-0 w-84 h-full bg-bg-sidebar border-r border-border-default flex flex-col items-start gap-1 px-5 py-7">
        <img className="w-[295px] h-15 shrink-0" src="icons/brand.svg" alt="" />
        <div className="shrink-0 flex items-start pt-4 pr-3 pb-2 pl-3">
          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[11px] leading-[16px] tracking-[2.4px] uppercase text-ink-secondary">{"Main"}</div>
        </div>
        <div className="self-stretch shrink-0 rounded-[12px] flex items-center gap-3 p-4 cursor-pointer" onClick={go("/")}>
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <img className="w-5 h-5 shrink-0" src="icons/icon-chart-pie-2.svg" alt="" />
            <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[16px] leading-[24px] text-ink-body">{"Analytics"}</div>
          </div>
        </div>
        <div className="self-stretch shrink-0 rounded-[12px] flex items-center gap-3 p-4 cursor-pointer" onClick={go("/list")}>
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <img className="w-5 h-5 shrink-0" src="icons/icon-chat-bubble-left-right.svg" alt="" />
            <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[16px] leading-[24px] text-ink-body">{"Chatbots"}</div>
          </div>
        </div>
        <div className="self-stretch shrink-0 rounded-[12px] flex justify-between items-center p-4 cursor-pointer" onClick={go("/tpg")}>
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <img className="w-5 h-5 shrink-0" src="icons/icon-beaker.svg" alt="" />
            <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[16px] leading-[24px] text-ink-body">{"Playground"}</div>
          </div>
        </div>
        <div className="self-stretch shrink-0 bg-bg-inverse rounded-[12px] flex justify-between items-center p-4">
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <img className="w-5 h-5 shrink-0" src="icons/icon-share-2.svg" alt="" />
            <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-bold text-[16px] leading-[24px] text-ink-on-dark">{"Channels"}</div>
          </div>
        </div>
        <div className="self-stretch shrink-0 flex flex-col items-start pt-4" />
        <div className="flex-1 min-h-0 flex flex-col items-start" />
        <UserCard />
      </div>
      <div className="flex-1 min-w-0 h-full bg-bg-page overflow-hidden flex flex-col items-start">
        <Header6 />
        <div className="self-stretch shrink-0 overflow-hidden flex flex-col items-start gap-6 pt-7 pr-10 pb-12 pl-10">
          <div className="self-stretch shrink-0 overflow-hidden flex flex-col items-start gap-1.5">
            <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[32px] leading-normal text-[#111111]">{"Channels"}</div>
            <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-normal text-[#6B6B6B]">{"Connect your assistants to the places your audience uses."}</div>
          </div>
          <div className="w-115 shrink-0 flex flex-col items-start gap-1.5">
            <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-normal text-[#111111]">{"Selected chatbot"}</div>
            <div className="self-stretch shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[12px] overflow-hidden flex items-center px-4 py-[13px]">
              <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito text-[15px] leading-normal text-[#8A8A86]">{"Select a chatbot"}</div>
              <img className="w-[9px] h-1.5 shrink-0" src="icons/polygon.svg" alt="" />
            </div>
          </div>
          <div className="self-stretch shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] border-dashed rounded-[20px] overflow-hidden flex flex-col justify-center items-center gap-3 px-10 py-18">
            <img className="w-16 h-16 shrink-0" src="icons/icon.svg" alt="" />
            <div className="w-px h-1 shrink-0 overflow-hidden" />
            <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[20px] leading-normal text-[#111111]">{"Select a chatbot to manage its channels"}</div>
            <div className="w-115 shrink-0 whitespace-pre-wrap text-center font-gabarito text-[14px] leading-normal text-[#6B6B6B]">{"Choose a chatbot above to see its channels — Public Share Link, Web Widget and Telegram — with their status and messages this week."}</div>
            <div className="w-px h-2 shrink-0 overflow-hidden" />
            <div className="shrink-0 overflow-hidden flex items-start gap-2">
              <div className="shrink-0 bg-bg-inverse-raised rounded-full overflow-hidden flex items-center gap-2 pt-1.5 pr-3.5 pb-1.5 pl-1.5">
                <div className="w-6.5 h-6.5 shrink-0 bg-[#FFFFFF] rounded-full overflow-hidden flex justify-center items-center">
                  <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[10px] leading-normal text-[#8A8A86]">{"PL"}</div>
                </div>
                <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-normal text-ink-on-dark">{"Public Share Link"}</div>
              </div>
              <div className="shrink-0 bg-bg-inverse-raised rounded-full overflow-hidden flex items-center gap-2 pt-1.5 pr-3.5 pb-1.5 pl-1.5">
                <div className="w-6.5 h-6.5 shrink-0 bg-[#FFFFFF] rounded-full overflow-hidden flex justify-center items-center">
                  <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[10px] leading-normal text-[#8A8A86]">{"WW"}</div>
                </div>
                <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-normal text-ink-on-dark">{"Web Widget"}</div>
              </div>
              <div className="shrink-0 bg-bg-inverse-raised rounded-full overflow-hidden flex items-center gap-2 pt-1.5 pr-3.5 pb-1.5 pl-1.5">
                <div className="w-6.5 h-6.5 shrink-0 bg-[#FFFFFF] rounded-full overflow-hidden flex justify-center items-center">
                  <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[10px] leading-normal text-[#8A8A86]">{"TG"}</div>
                </div>
                <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-normal text-ink-on-dark">{"Telegram"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute left-94 top-44.5 w-115 h-[69px] bg-[#FFFFFF00]" />
    </div>
  );
}
