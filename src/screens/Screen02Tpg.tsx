// Demo 02 · [tpg] A1 · Tour · Playground module
// Route: #/tpg
import { useGo } from "../lib/nav";
import { Header7 } from "../components/shared/Header7";
import { UserCard } from "../components/shared/UserCard";

export default function Screen02Tpg() {
  const go = useGo();
  return (
    <div className="relative w-full h-full bg-bg-card overflow-hidden flex items-start">
      <div className="w-84 self-stretch shrink-0 bg-bg-sidebar border-r border-border-default flex flex-col items-start gap-1 px-5 py-7">
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
        <div className="self-stretch shrink-0 bg-bg-inverse rounded-[12px] flex justify-between items-center p-4">
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <img className="w-5 h-5 shrink-0" src="icons/icon-beaker-2.svg" alt="" />
            <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-bold text-[16px] leading-[24px] text-ink-on-dark">{"Playground"}</div>
          </div>
        </div>
        <div className="self-stretch shrink-0 rounded-[12px] flex justify-between items-center p-4 cursor-pointer" onClick={go("/tch")}>
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <img className="w-5 h-5 shrink-0" src="icons/icon-share.svg" alt="" />
            <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[16px] leading-[24px] text-ink-body">{"Channels"}</div>
          </div>
        </div>
        <div className="self-stretch shrink-0 flex flex-col items-start pt-4" />
        <div className="flex-1 min-h-0 flex flex-col items-start" />
        <UserCard />
      </div>
      <div className="flex-1 min-w-0 self-stretch bg-bg-page overflow-hidden flex flex-col items-start">
        <Header7 />
        <div className="self-stretch flex-1 min-h-0 overflow-y-auto flex flex-col items-start gap-6 pt-7 pr-10 pb-10 pl-10">
          <div
            className="shrink-0 rounded-[8px] flex items-center gap-2 pt-1.5 pr-2.5 pb-1.5 pl-2 cursor-pointer"
            onClick={go("/list")}
          >
            <img className="w-4 h-4 shrink-0" src="icons/arrow-left-property-linear.svg" alt="" />
            <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-secondary">{"Chatbots"}</div>
            <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-muted">{"/"}</div>
            <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-[#6B6B6B]">{"Test Playground"}</div>
          </div>
          <div className="w-115 shrink-0 flex flex-col items-start gap-1.5">
            <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-normal text-[#111111]">{"Selected chatbot"}</div>
            <div className="self-stretch shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[12px] overflow-hidden flex items-center px-4 py-[13px]">
              <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito text-[15px] leading-normal text-[#999999]">{"Select a chatbot…"}</div>
              <img className="w-[9px] h-1.5 shrink-0" src="icons/polygon.svg" alt="" />
            </div>
          </div>
          <div className="self-stretch flex-1 min-h-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[20px] overflow-hidden flex flex-col items-start">
            <div className="self-stretch flex-1 min-h-0 overflow-y-auto flex flex-col justify-center items-center gap-3 p-7">
              <img className="w-16 h-16 shrink-0" src="icons/empty-icon.svg" alt="" />
              <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[24px] leading-normal text-[#111111]">{"Select a chatbot to start testing"}</div>
              <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-normal text-[#6B6B6B]">{"Choose one of your chatbots to chat with it and check its answers and sources before you share it."}</div>
              <div className="shrink-0 overflow-hidden flex flex-col items-center gap-3 pt-4">
                <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-normal text-[#6B6B6B]">{"Or pick a recent chatbot"}</div>
                <div className="shrink-0 overflow-hidden flex items-start gap-3">
                  <div className="w-60 shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[14px] overflow-hidden flex items-center gap-3 px-4 py-3.5">
                    <div className="w-10 h-10 shrink-0 bg-[#111111] rounded-[10px] overflow-hidden flex justify-center items-center">
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-normal text-[#FFFFFF]">{"CS"}</div>
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden flex flex-col items-start gap-1">
                      <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[15px] leading-normal text-[#111111]">{"Billing Assistant"}</div>
                      <div className="shrink-0 bg-[#DBF7E5] rounded-full overflow-hidden flex items-start px-2 py-0.5">
                        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[11px] leading-normal text-[#17803D]">{"Active"}</div>
                      </div>
                    </div>
                  </div>
                  <div className="w-60 shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[14px] overflow-hidden flex items-center gap-3 px-4 py-3.5">
                    <div className="w-10 h-10 shrink-0 bg-[#111111] rounded-[10px] overflow-hidden flex justify-center items-center">
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-normal text-[#FFFFFF]">{"IT"}</div>
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden flex flex-col items-start gap-1">
                      <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[15px] leading-normal text-[#111111]">{"IT Helpdesk"}</div>
                      <div className="shrink-0 bg-[#DBF7E5] rounded-full overflow-hidden flex items-start px-2 py-0.5">
                        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[11px] leading-normal text-[#17803D]">{"Active"}</div>
                      </div>
                    </div>
                  </div>
                  <div className="w-60 shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[14px] overflow-hidden flex items-center gap-3 px-4 py-3.5">
                    <div className="w-10 h-10 shrink-0 bg-[#BFBFBD] rounded-[10px] overflow-hidden flex justify-center items-center">
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-normal text-[#FFFFFF]">{"HR"}</div>
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden flex flex-col items-start gap-1">
                      <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[15px] leading-normal text-[#111111]">{"HR Policy Helper"}</div>
                      <div className="shrink-0 bg-[#F2F2F0] rounded-full overflow-hidden flex items-start px-2 py-0.5">
                        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[11px] leading-normal text-[#6B6B6B]">{"Draft"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch shrink-0 opacity-45 overflow-hidden flex flex-col items-start px-5 py-4">
              <div className="self-stretch shrink-0 bg-[#FAFAF9] border border-[#E4E4E0] rounded-full overflow-hidden flex justify-between items-center pt-2 pr-2 pb-2 pl-5.5">
                <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-normal text-[#6B6B6B]">{"Select a chatbot first…"}</div>
                <div className="w-10 h-10 shrink-0 bg-[#111111] rounded-full overflow-hidden flex justify-center items-center">
                  <div className="shrink-0 whitespace-pre font-inter font-bold text-[18px] leading-normal text-[#FFFFFF]">{"↑"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
