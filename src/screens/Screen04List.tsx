// Demo 04 · [list] A2 · Chatbots list
// Route: #/list
import { useState } from "react";
import { useGo } from "../lib/nav";
import { CreatedChatbotRows } from "../components/shared/CreatedChatbotRows";
import { Header8 } from "../components/shared/Header8";
import { AppSidebar } from "../components/shared/AppSidebar";

export default function Screen04List() {
  const go = useGo();
  const [count, setCount] = useState(0);
  return (
    <div className="relative w-full h-full bg-[#FFFFFF] overflow-hidden flex items-start">
      <div className="flex-1 min-w-0 self-stretch bg-bg-card overflow-hidden flex items-start">
        <AppSidebar active="chatbots" links={{ playground: "/tpg", channels: "/tch" }} />
        <div className="flex-1 min-w-0 self-stretch bg-bg-page overflow-hidden flex flex-col items-start">
          <Header8 />
          <div className="self-stretch flex-1 min-h-0 overflow-y-auto flex flex-col items-start">
            <div className="self-stretch flex-1 min-h-0 overflow-y-auto flex flex-col items-start gap-6 pt-8 pr-10 pb-51 pl-10">
              <div className="self-stretch shrink-0 flex items-start gap-4">
                <div className="flex-1 min-w-0 self-stretch bg-[#ECE7FB] border border-[#DCD3F6] rounded-[24px] flex flex-col items-start gap-3.5 p-5">
                  <div className="self-stretch shrink-0 overflow-hidden flex items-center gap-3">
                    <img className="w-11 h-11 shrink-0" src="icons/icon-tile-accent.svg" alt="" />
                    <div className="flex-1 min-w-0 self-stretch overflow-hidden flex justify-between items-center">
                      <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[15px] leading-normal text-[#171A2B]">
                        {"Total chatbots"}
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch shrink-0 flex flex-col items-start gap-1">
                    <div className="shrink-0 flex items-center gap-1.5">
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[36px] leading-[40px] tracking-[-1px] text-[#171A2B]">
                        {"8"}
                      </div>
                    </div>
                    <div className="self-stretch shrink-0 whitespace-pre-wrap font-gabarito text-[13px] leading-[16px] text-[#5B6072]">
                      {"Across all channels"}
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0 self-stretch bg-[#E3F3E7] border border-[#CDE8D3] rounded-[24px] flex flex-col items-start gap-3.5 p-5">
                  <div className="self-stretch shrink-0 overflow-hidden flex items-center gap-3">
                    <img className="w-11 h-11 shrink-0" src="icons/icon-tile-success.svg" alt="" />
                    <div className="flex-1 min-w-0 self-stretch overflow-hidden flex justify-between items-center">
                      <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[15px] leading-normal text-[#171A2B]">
                        {"Active"}
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch shrink-0 flex flex-col items-start gap-1">
                    <div className="shrink-0 flex items-center gap-1.5">
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[36px] leading-[40px] tracking-[-1px] text-[#171A2B]">
                        {"3"}
                      </div>
                    </div>
                    <div className="self-stretch shrink-0 whitespace-pre-wrap font-gabarito text-[13px] leading-[16px] text-[#5B6072]">
                      {"38% of chatbots"}
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0 self-stretch bg-[#FCEFD9] border border-[#F3DDB4] rounded-[24px] flex flex-col items-start gap-3.5 p-5">
                  <div className="self-stretch shrink-0 overflow-hidden flex items-center gap-3">
                    <img className="w-11 h-11 shrink-0" src="icons/icon-tile-warning.svg" alt="" />
                    <div className="flex-1 min-w-0 self-stretch overflow-hidden flex justify-between items-center">
                      <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[15px] leading-normal text-[#171A2B]">
                        {"Not live"}
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch shrink-0 flex flex-col items-start gap-1">
                    <div className="shrink-0 flex items-center gap-1.5">
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[36px] leading-[40px] tracking-[-1px] text-[#171A2B]">
                        {"4"}
                      </div>
                    </div>
                    <div className="self-stretch shrink-0 whitespace-pre-wrap font-gabarito text-[13px] leading-[16px] text-[#5B6072]">
                      {"Pending, paused or draft"}
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0 self-stretch bg-[#FBE6E4] border border-[#F3CFCB] rounded-[24px] flex flex-col items-start gap-3.5 p-5">
                  <div className="self-stretch shrink-0 overflow-hidden flex items-center gap-3">
                    <img className="w-11 h-11 shrink-0" src="icons/icon-tile-danger.svg" alt="" />
                    <div className="flex-1 min-w-0 self-stretch overflow-hidden flex justify-between items-center">
                      <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[15px] leading-normal text-[#171A2B]">
                        {"Disabled"}
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch shrink-0 flex flex-col items-start gap-1">
                    <div className="shrink-0 flex items-center gap-1.5">
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[36px] leading-[40px] tracking-[-1px] text-[#171A2B]">
                        {"1"}
                      </div>
                    </div>
                    <div className="self-stretch shrink-0 whitespace-pre-wrap font-gabarito text-[13px] leading-[16px] text-[#5B6072]">
                      {"Disabled by an admin"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch shrink-0 bg-bg-card border border-[#E4E4E0] rounded-[16px] flex flex-col items-start p-7">
                <div className="self-stretch shrink-0 overflow-hidden flex flex-col items-start gap-4 pb-5">
                  <div className="shrink-0 flex flex-col items-start gap-1">
                    <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[18px] leading-[28px] text-text-primary">
                      {"All chatbots"}
                    </div>
                    <div className="shrink-0 whitespace-pre font-gabarito text-[13px] leading-normal text-text-muted">
                      {"Search, filter and manage your AI assistants"}
                    </div>
                  </div>
                  <div className="self-stretch shrink-0 flex items-center gap-3 relative">
                    <div className="absolute left-138.5 top-0 w-62.5 h-12 flex flex-col items-start">
                      <div className="w-62.5 h-12 shrink-0 bg-bg-card border border-border-default rounded-[12px] flex items-center gap-2 pr-3 pl-3.5">
                        <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-secondary">
                          {"Sort:"}
                        </div>
                        <img
                          className="w-3.5 h-3.5 shrink-0"
                          src="icons/arrow-down-property-linear-property-arro.svg"
                          alt=""
                        />
                        <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">
                          {"Name (A–Z)"}
                        </div>
                        <img className="w-3.5 h-3.5 shrink-0" src="icons/icon-caret-down.svg" alt="" />
                      </div>
                    </div>
                    <div className="absolute left-83 top-0 w-52.5 h-12 flex flex-col items-start">
                      <div className="w-52.5 h-12 shrink-0 bg-bg-card border border-border-default rounded-[12px] flex items-center gap-2 pr-3 pl-3.5">
                        <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-secondary">
                          {"Status:"}
                        </div>
                        <div className="w-2 h-2 shrink-0 border-[1.5px] border-ink-secondary rounded-full" />
                        <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">
                          {"All"}
                        </div>
                        <img className="w-3.5 h-3.5 shrink-0" src="icons/icon-caret-down.svg" alt="" />
                      </div>
                    </div>
                    <div className="w-80 h-12 shrink-0 bg-bg-card border border-border-default rounded-[12px] flex items-center gap-2.5 px-3.5">
                      <img className="w-4 h-4 shrink-0" src="icons/icon-search.svg" alt="" />
                      <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-muted">
                        {"Search by bot name"}
                      </div>
                    </div>
                    <div className="w-52.5 h-12 shrink-0 overflow-hidden" />
                    <div className="w-62.5 h-12 shrink-0 overflow-hidden" />
                    <div className="flex-1 min-w-0 h-px flex items-start" />
                    <img className="w-23 h-12 shrink-0" src="icons/view-toggle-group-list-all-2.svg" alt="" />
                    <div
                      className="w-45.5 shrink-0 bg-[#111624] rounded-[20px] flex justify-center items-center gap-2 px-6 py-3.5 cursor-pointer"
                      onClick={go("/s1e")}
                    >
                      <img className="w-4.5 h-4.5 shrink-0" src="icons/icon-plus.svg" alt="" />
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[16px] leading-[20px] text-ink-on-dark">
                        {"Create chatbot"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="self-stretch h-11 shrink-0 bg-bg-sidebar-dark rounded-[10px] flex items-center gap-5 px-4">
                  <div className="flex-1 min-w-0 flex items-center gap-1">
                    <div className="shrink-0 whitespace-pre font-geist-mono font-medium text-[11px] leading-normal tracking-[0.01em] uppercase text-[#FFFFFF]">
                      {"Chatbot"}
                    </div>
                  </div>
                  <div className="w-37.5 shrink-0 flex items-center gap-2">
                    <div className="shrink-0 whitespace-pre font-geist-mono font-medium text-[11px] leading-normal tracking-[0.01em] uppercase text-[#FFFFFF]">
                      {"Status"}
                    </div>
                  </div>
                  <div className="w-47.5 shrink-0 flex items-center gap-2">
                    <div className="shrink-0 whitespace-pre font-geist-mono font-medium text-[11px] leading-normal tracking-[0.01em] uppercase text-[#FFFFFF]">
                      {"Knowledge base"}
                    </div>
                  </div>
                  <div className="w-37.5 shrink-0 flex items-center gap-2 cursor-pointer" onClick={go("/tch")}>
                    <div className="shrink-0 whitespace-pre font-geist-mono font-medium text-[11px] leading-normal tracking-[0.01em] uppercase text-[#FFFFFF]">
                      {"Channels"}
                    </div>
                  </div>
                  <div className="w-27.5 shrink-0 flex justify-end items-center gap-2">
                    <div className="shrink-0 whitespace-pre font-geist-mono font-medium text-[11px] leading-normal tracking-[0.01em] uppercase text-[#FFFFFF]">
                      {"Messages"}
                    </div>
                  </div>
                  <div className="w-32.5 shrink-0 flex items-center gap-2">
                    <div className="shrink-0 whitespace-pre font-geist-mono font-medium text-[11px] leading-normal tracking-[0.01em] uppercase text-[#FFFFFF]">
                      {"Created"}
                    </div>
                  </div>
                  <div className="w-32.5 shrink-0 flex items-center gap-2">
                    <div className="shrink-0 whitespace-pre font-geist-mono font-medium text-[11px] leading-normal tracking-[0.01em] uppercase text-[#FFFFFF]">
                      {"Last updated"}
                    </div>
                  </div>
                </div>
                <CreatedChatbotRows onCount={setCount} />
                <div className="self-stretch shrink-0 flex justify-between items-center pt-5 pr-4 pl-4">
                  <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-[#6B6B6B]">
                    {count === 0 ? "No chatbots yet" : `Showing 1–${count} of ${count} chatbot${count === 1 ? "" : "s"}`}
                  </div>
                  <div className="shrink-0 bg-[#F4F4F2] rounded-full flex items-center gap-1.5 px-5 py-1.5">
                    <div className="shrink-0 opacity-40 overflow-hidden flex items-center gap-1.5 pr-4.5">
                      <img className="w-3.5 h-3.5 shrink-0" src="icons/icon-chevron-left.svg" alt="" />
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[12px] leading-normal tracking-[0.08em] text-[#111111]">
                        {"PREV"}
                      </div>
                    </div>
                    <div className="w-8.5 h-8.5 shrink-0 bg-[#111111] rounded-full flex justify-center items-center">
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-normal text-[#FFFFFF]">
                        {"1"}
                      </div>
                    </div>
                    <div className="shrink-0 opacity-40 overflow-hidden flex items-center gap-1.5 pl-4.5">
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[12px] leading-normal tracking-[0.08em] text-[#111111]">
                        {"NEXT"}
                      </div>
                      <img className="w-3.5 h-3.5 shrink-0" src="icons/icon-chevron-right.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
