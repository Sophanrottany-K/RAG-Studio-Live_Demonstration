// Demo 04 · [list] A2 · Chatbots list
// Route: #/list
import { useGo } from "../lib/nav";
import { CreatedChatbotRows } from "../components/shared/CreatedChatbotRows";
import { Header8 } from "../components/shared/Header8";
import { Status } from "../components/shared/Status";
import { UserCard } from "../components/shared/UserCard";

export default function Screen04List() {
  const go = useGo();
  return (
    <div className="relative w-full h-full bg-[#FFFFFF] overflow-hidden flex items-start">
      <div className="flex-1 min-w-0 self-stretch bg-bg-card overflow-hidden flex items-start">
        <div className="w-84 h-full shrink-0 bg-bg-sidebar border-r border-border-default flex flex-col items-start gap-1 px-5 py-7">
          <img className="w-[295px] h-15 shrink-0" src="icons/brand.svg" alt="" />
          <div className="shrink-0 flex items-start pt-4 pr-3 pb-2 pl-3">
            <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[11px] leading-[16px] tracking-[2.4px] uppercase text-ink-secondary">
              {"Main"}
            </div>
          </div>
          <div
            className="self-stretch shrink-0 rounded-[12px] flex items-center gap-3 p-4 cursor-pointer"
            onClick={go("/")}
          >
            <div className="flex-1 min-w-0 flex items-center gap-3">
              <img className="w-5 h-5 shrink-0" src="icons/icon-chart-pie-2.svg" alt="" />
              <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[16px] leading-[24px] text-ink-body">
                {"Analytics"}
              </div>
            </div>
          </div>
          <div className="self-stretch shrink-0 bg-bg-inverse rounded-[12px] flex items-center gap-3 p-4">
            <div className="flex-1 min-w-0 flex items-center gap-3">
              <img className="w-5 h-5 shrink-0" src="icons/icon-chat-bubble-left-right-2.svg" alt="" />
              <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-bold text-[16px] leading-[24px] text-ink-on-dark">
                {"Chatbots"}
              </div>
            </div>
          </div>
          <div
            className="self-stretch shrink-0 rounded-[12px] flex justify-between items-center p-4 cursor-pointer"
            onClick={go("/tpg")}
          >
            <div className="flex-1 min-w-0 flex items-center gap-3">
              <img className="w-5 h-5 shrink-0" src="icons/icon-beaker.svg" alt="" />
              <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[16px] leading-[24px] text-ink-body">
                {"Playground"}
              </div>
            </div>
          </div>
          <div
            className="self-stretch shrink-0 rounded-[12px] flex justify-between items-center p-4 cursor-pointer"
            onClick={go("/tch")}
          >
            <div className="flex-1 min-w-0 flex items-center gap-3">
              <img className="w-5 h-5 shrink-0" src="icons/icon-share.svg" alt="" />
              <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[16px] leading-[24px] text-ink-body">
                {"Channels"}
              </div>
            </div>
          </div>
          <div className="self-stretch shrink-0 flex flex-col items-start pt-4" />
          <div className="flex-1 min-h-0 flex flex-col items-start" />
          <UserCard />
        </div>
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
                <CreatedChatbotRows />
                <div className="self-stretch h-18 shrink-0 bg-[#FFFFFF] border-b border-[#E4E4E0] flex items-center gap-5 px-4 py-3.5">
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <div className="shrink-0 flex flex-col items-start gap-0.5">
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-[20px] text-[#111111]">
                        {"Admission Assistant"}
                      </div>
                      <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-[#6B6B6B]">
                        {"Programs, fees and application deadlines"}
                      </div>
                    </div>
                  </div>
                  <div className="w-37.5 shrink-0 flex items-center gap-2 relative">
                    <div className="absolute left-0 top-0 w-24 h-6.5 flex flex-col justify-center items-start">
                      <div className="w-24 shrink-0 bg-[#8A8A864D] border border-[#8A8A86] rounded-[99px] flex justify-center items-center gap-1.5 px-2.5 py-1">
                        <div className="shrink-0 whitespace-pre text-center font-geist-mono font-bold text-[11px] leading-[16px] tracking-[0.01em] uppercase text-neutral-text">
                          {"Draft"}
                        </div>
                      </div>
                    </div>
                    <div className="w-[101px] h-9 shrink-0 overflow-hidden" />
                  </div>
                  <div className="w-47.5 shrink-0 flex items-center gap-2">
                    <div className="shrink-0 flex flex-col items-start gap-1.5">
                      <div className="shrink-0 flex items-center gap-1.5">
                        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-[#111111]">
                          {"0 docs"}
                        </div>
                        <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-[#8A8A86]">
                          {"Add documents"}
                        </div>
                      </div>
                      <div className="w-35 h-1 shrink-0 bg-[#F0F0EE] rounded-[20px] overflow-hidden relative">
                        <div className="absolute left-0 top-0 w-[0.01px] h-1 bg-[#E4E4E0] rounded-[20px]" />
                      </div>
                    </div>
                  </div>
                  <div className="w-37.5 shrink-0 flex items-center gap-1.5">
                    <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-[#9A9A96]">
                      {"Not connected"}
                    </div>
                  </div>
                  <div className="w-27.5 shrink-0 flex justify-end items-center gap-2">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-[#111111]">
                      {"0"}
                    </div>
                  </div>
                  <div className="w-32.5 shrink-0 flex items-center gap-2">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-[16px] text-[#444444]">
                      {"Oct 9, 2026"}
                    </div>
                  </div>
                  <div className="w-32.5 shrink-0 flex items-center gap-2">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-[16px] text-[#444444]">
                      {"Oct 9, 2026"}
                    </div>
                  </div>
                </div>
                <div className="self-stretch h-18 shrink-0 bg-[#FFFFFF] border-b border-[#E4E4E0] flex items-center gap-5 px-4 py-3.5">
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <div className="shrink-0 flex flex-col items-start gap-0.5">
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-[20px] text-[#111111]">
                        {"Customer Support"}
                      </div>
                      <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-[#6B6B6B]">
                        {"Answers billing, refund and account questions"}
                      </div>
                    </div>
                  </div>
                  <Status />
                  <div className="w-47.5 shrink-0 flex items-center gap-2">
                    <div className="shrink-0 flex flex-col items-start gap-1.5">
                      <div className="shrink-0 flex items-center gap-1.5">
                        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-[#111111]">
                          {"12 docs"}
                        </div>
                        <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-[#8A8A86]">
                          {"All ready"}
                        </div>
                      </div>
                      <div className="w-35 h-1 shrink-0 bg-[#F0F0EE] rounded-[20px] overflow-hidden relative">
                        <div className="absolute left-0 top-0 w-35 h-1 bg-[#2E9E66] rounded-[20px]" />
                      </div>
                    </div>
                  </div>
                  <img className="w-37.5 h-7 shrink-0" src="icons/channels.svg" alt="" />
                  <div className="w-27.5 shrink-0 flex justify-end items-center gap-2">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-[#111111]">
                      {"12,480"}
                    </div>
                  </div>
                  <div className="w-32.5 shrink-0 flex items-center gap-2">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-[16px] text-[#444444]">
                      {"Sep 12, 2026"}
                    </div>
                  </div>
                  <div className="w-32.5 shrink-0 flex items-center gap-2">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-[16px] text-[#444444]">
                      {"Oct 9, 2026"}
                    </div>
                  </div>
                </div>
                <div className="self-stretch h-18 shrink-0 bg-[#FFFFFF] border-b border-[#E4E4E0] flex items-center gap-5 px-4 py-3.5">
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <div className="shrink-0 flex flex-col items-start gap-0.5">
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-[20px] text-[#111111]">
                        {"HR Policy Helper"}
                      </div>
                      <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-[#6B6B6B]">
                        {"Leave, benefits and internal policy lookups"}
                      </div>
                    </div>
                  </div>
                  <Status />
                  <div className="w-47.5 shrink-0 flex items-center gap-2">
                    <div className="shrink-0 flex flex-col items-start gap-1.5">
                      <div className="shrink-0 flex items-center gap-1.5">
                        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-[#111111]">
                          {"9 docs"}
                        </div>
                        <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-[#8A8A86]">
                          {"All ready"}
                        </div>
                      </div>
                      <div className="w-35 h-1 shrink-0 bg-[#F0F0EE] rounded-[20px] overflow-hidden relative">
                        <div className="absolute left-0 top-0 w-35 h-1 bg-[#2E9E66] rounded-[20px]" />
                      </div>
                    </div>
                  </div>
                  <img className="w-37.5 h-7 shrink-0" src="icons/channels-2.svg" alt="" />
                  <div className="w-27.5 shrink-0 flex justify-end items-center gap-2">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-[#111111]">
                      {"3,215"}
                    </div>
                  </div>
                  <div className="w-32.5 shrink-0 flex items-center gap-2">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-[16px] text-[#444444]">
                      {"Sep 12, 2026"}
                    </div>
                  </div>
                  <div className="w-32.5 shrink-0 flex items-center gap-2">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-[16px] text-[#444444]">
                      {"Oct 8, 2026"}
                    </div>
                  </div>
                </div>
                <div className="self-stretch h-18 shrink-0 bg-[#FFFFFF] border-b border-[#E4E4E0] flex items-center gap-5 px-4 py-3.5">
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <div className="shrink-0 flex flex-col items-start gap-0.5">
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-[20px] text-[#111111]">
                        {"IT Helpdesk"}
                      </div>
                      <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-[#6B6B6B]">
                        {"Password resets, VPN and device setup"}
                      </div>
                    </div>
                  </div>
                  <Status />
                  <div className="w-47.5 shrink-0 flex items-center gap-2">
                    <div className="shrink-0 flex flex-col items-start gap-1.5">
                      <div className="shrink-0 flex items-center gap-1.5">
                        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-[#111111]">
                          {"31 docs"}
                        </div>
                        <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-[#8A8A86]">
                          {"2 processing"}
                        </div>
                      </div>
                      <div className="w-35 h-1 shrink-0 bg-[#F0F0EE] rounded-[20px] overflow-hidden relative">
                        <div className="absolute left-0 top-0 w-31.5 h-1 bg-[#E0A100] rounded-[20px]" />
                      </div>
                    </div>
                  </div>
                  <img className="w-37.5 h-7 shrink-0" src="icons/channels.svg" alt="" />
                  <div className="w-27.5 shrink-0 flex justify-end items-center gap-2">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-[#111111]">
                      {"7,630"}
                    </div>
                  </div>
                  <div className="w-32.5 shrink-0 flex items-center gap-2">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-[16px] text-[#444444]">
                      {"Aug 28, 2026"}
                    </div>
                  </div>
                  <div className="w-32.5 shrink-0 flex items-center gap-2">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-[16px] text-[#444444]">
                      {"Oct 7, 2026"}
                    </div>
                  </div>
                </div>
                <div className="self-stretch h-18 shrink-0 bg-[#FFFFFF] border-b border-[#E4E4E0] flex items-center gap-5 px-4 py-3.5">
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <div className="shrink-0 flex flex-col items-start gap-0.5">
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-[20px] text-[#111111]">
                        {"Onboarding Guide"}
                      </div>
                      <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-[#6B6B6B]">
                        {"Walks new staff through their first week"}
                      </div>
                    </div>
                  </div>
                  <div className="w-37.5 shrink-0 flex items-center gap-2 relative">
                    <div className="absolute left-0 top-0 w-24 h-6.5 flex flex-col items-start">
                      <div className="w-24 shrink-0 bg-[#EA580C4D] border border-[#EA580C] rounded-[99px] flex justify-center items-center gap-1.5 px-2.5 py-1">
                        <div className="shrink-0 whitespace-pre text-center font-geist-mono font-bold text-[11px] leading-[16px] tracking-[0.01em] uppercase text-[#9A3412]">
                          {"Paused"}
                        </div>
                      </div>
                    </div>
                    <div className="w-[101px] h-9 shrink-0 overflow-hidden" />
                  </div>
                  <div className="w-47.5 shrink-0 flex items-center gap-2">
                    <div className="shrink-0 flex flex-col items-start gap-1.5">
                      <div className="shrink-0 flex items-center gap-1.5">
                        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-[#111111]">
                          {"14 docs"}
                        </div>
                        <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-[#8A8A86]">
                          {"All ready"}
                        </div>
                      </div>
                      <div className="w-35 h-1 shrink-0 bg-[#F0F0EE] rounded-[20px] overflow-hidden relative">
                        <div className="absolute left-0 top-0 w-35 h-1 bg-[#2E9E66] rounded-[20px]" />
                      </div>
                    </div>
                  </div>
                  <img className="w-37.5 h-7 shrink-0" src="icons/channels-3.svg" alt="" />
                  <div className="w-27.5 shrink-0 flex justify-end items-center gap-2">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-[#111111]">
                      {"1,904"}
                    </div>
                  </div>
                  <div className="w-32.5 shrink-0 flex items-center gap-2">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-[16px] text-[#444444]">
                      {"Aug 15, 2026"}
                    </div>
                  </div>
                  <div className="w-32.5 shrink-0 flex items-center gap-2">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-[16px] text-[#444444]">
                      {"Oct 2, 2026"}
                    </div>
                  </div>
                </div>
                <div className="self-stretch h-18 shrink-0 bg-[#FFFFFF] border-b border-[#E4E4E0] flex items-center gap-5 px-4 py-3.5">
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <div className="shrink-0 flex flex-col items-start gap-0.5">
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-[20px] text-[#111111]">
                        {"Product FAQ (Khmer)"}
                      </div>
                      <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-[#6B6B6B]">
                        {"Khmer-language product questions"}
                      </div>
                    </div>
                  </div>
                  <div className="w-37.5 shrink-0 flex items-center gap-2 relative">
                    <div className="absolute left-0 top-0 w-24 h-6.5 flex items-center">
                      <div className="w-24 shrink-0 bg-[#E0A1004D] border border-warning-solid rounded-[99px] flex justify-center items-center gap-1.5 px-2.5 py-1">
                        <div className="shrink-0 whitespace-pre text-center font-geist-mono font-bold text-[11px] leading-[16px] tracking-[0.01em] uppercase text-warning-text">
                          {"Pending"}
                        </div>
                      </div>
                    </div>
                    <div className="w-[101px] h-9 shrink-0 overflow-hidden" />
                  </div>
                  <div className="w-47.5 shrink-0 flex items-center gap-2">
                    <div className="shrink-0 flex flex-col items-start gap-1.5">
                      <div className="shrink-0 flex items-center gap-1.5">
                        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-[#111111]">
                          {"6 docs"}
                        </div>
                        <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-[#8A8A86]">
                          {"Ready to publish"}
                        </div>
                      </div>
                      <div className="w-35 h-1 shrink-0 bg-[#F0F0EE] rounded-[20px] overflow-hidden relative">
                        <div className="absolute left-0 top-0 w-35 h-1 bg-[#2E9E66] rounded-[20px]" />
                      </div>
                    </div>
                  </div>
                  <img className="w-37.5 h-7 shrink-0" src="icons/channels-4.svg" alt="" />
                  <div className="w-27.5 shrink-0 flex justify-end items-center gap-2">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-[#111111]">
                      {"0"}
                    </div>
                  </div>
                  <div className="w-32.5 shrink-0 flex items-center gap-2">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-[16px] text-[#444444]">
                      {"Oct 3, 2026"}
                    </div>
                  </div>
                  <div className="w-32.5 shrink-0 flex items-center gap-2">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-[16px] text-[#444444]">
                      {"Oct 9, 2026"}
                    </div>
                  </div>
                </div>
                <div className="self-stretch shrink-0 flex justify-between items-center pt-5 pr-4 pl-4">
                  <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-[#6B6B6B]">
                    {"Showing 1–6 of 8 chatbots"}
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
                    <div className="w-8.5 h-8.5 shrink-0 rounded-full flex justify-center items-center">
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-normal text-[#111111]">
                        {"2"}
                      </div>
                    </div>
                    <div className="shrink-0 overflow-hidden flex items-center gap-1.5 pl-4.5">
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
