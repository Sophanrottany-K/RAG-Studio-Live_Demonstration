// Demo 01 · [an] A1 · Analytics overview
// Route: #/
import { useGo } from "../lib/nav";
import { UserCard } from "../components/shared/UserCard";

export default function Screen01An() {
  const go = useGo();
  return (
    <div className="relative w-full h-full bg-bg-page overflow-hidden flex items-start">
      <div className="w-full h-full shrink-0 bg-bg-card overflow-hidden flex items-start">
        <div className="w-84 h-full shrink-0 bg-bg-sidebar border-r border-border-default flex flex-col items-start gap-1 px-5 py-7">
          <img className="w-[295px] h-15 shrink-0" src="icons/brand.svg" alt="" />
          <div className="shrink-0 flex items-start pt-4 pr-3 pb-2 pl-3">
            <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[11px] leading-[16px] tracking-[2.4px] uppercase text-ink-secondary">{"Main"}</div>
          </div>
          <div className="self-stretch shrink-0 bg-bg-inverse rounded-[12px] flex items-center gap-3 p-4">
            <div className="flex-1 min-w-0 flex items-center gap-3">
              <img className="w-5 h-5 shrink-0" src="icons/icon-chart-pie.svg" alt="" />
              <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-bold text-[16px] leading-[24px] text-ink-on-dark">{"Analytics"}</div>
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
          <div className="self-stretch h-16 shrink-0 bg-bg-card border-b border-border-default flex justify-between items-center px-6">
            <div className="shrink-0 flex flex-col items-start gap-0.5">
              <div className="shrink-0 flex items-center gap-2">
                <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[18px] leading-[28px] text-ink-primary">{"Analytics"}</div>
              </div>
              <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-ink-secondary">{"Messages, sessions and channel activity for your chatbot."}</div>
            </div>
            <div className="shrink-0 flex items-center gap-3" />
          </div>
          <div className="self-stretch flex-1 min-h-0 overflow-y-auto flex flex-col items-start">
            <div className="self-stretch shrink-0 flex flex-col items-start gap-6 pt-8 pr-10 pb-10 pl-10">
              <div className="self-stretch shrink-0 border-b border-border-default flex items-start gap-8">
                <div className="shrink-0 border-b-[2px] border-bg-inverse flex justify-center items-center py-3.5">
                  <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[15px] leading-normal text-text-primary">{"Overview"}</div>
                </div>
                <div className="shrink-0 flex justify-center items-center py-3.5">
                  <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[15px] leading-normal text-text-muted">{"Answer quality"}</div>
                </div>
                <div className="shrink-0 flex justify-center items-center py-3.5">
                  <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[15px] leading-normal text-text-muted">{"Usage and quota"}</div>
                </div>
              </div>
              <div className="self-stretch shrink-0 overflow-hidden flex items-center gap-3">
                <div className="w-70 shrink-0 bg-[#FFFFFF] border border-[#D1D5DB] rounded-[15px] shadow-[0px_1px_2px_0px_#0000000D] flex items-center gap-2 pt-2.5 pr-3 pb-2.5 pl-3.5">
                  <div className="flex-1 min-w-0 whitespace-pre-wrap font-inter text-[14px] leading-[20px] text-[#111827]">{"Chatbot: All chatbots"}</div>
                  <img className="w-5 h-5 shrink-0" src="icons/icon-chevron-down.svg" alt="" />
                </div>
                <div className="flex-1 min-w-0 h-2.5 overflow-hidden" />
                <div className="shrink-0 whitespace-pre font-gabarito text-[13px] leading-normal text-[#73736E]">{"Showing data for all 3 chatbots · Updated 5 min ago"}</div>
              </div>
              <div className="self-stretch shrink-0 overflow-hidden flex flex-col items-start">
                <div className="self-stretch h-67 shrink-0 overflow-hidden flex items-start gap-4">
                  <div className="flex-1 min-w-0 h-[243px] bg-[#E7EBFD] border border-[#D3DAF8] rounded-[24px] overflow-hidden flex flex-col items-start gap-[13px] p-6">
                    <div className="self-stretch shrink-0 overflow-hidden flex items-center gap-3">
                      <img className="w-11 h-11 shrink-0" src="icons/icon-tile.svg" alt="" />
                      <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[17px] leading-normal text-[#171A2B]">{"Total messages"}</div>
                      <div className="shrink-0 bg-[#FFFFFF] rounded-full overflow-hidden flex items-center gap-1.5 px-3 py-1.5">
                        <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[13px] leading-normal text-[#2F6B3F]">{"↗ 8.2%"}</div>
                      </div>
                    </div>
                    <div className="shrink-0 overflow-hidden flex items-baseline gap-2.5">
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[52px] leading-[56px] text-[#171A2B]">{"17,670"}</div>
                      <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-normal text-[#5B6072]">{"last 14 days"}</div>
                    </div>
                    <div className="self-stretch shrink-0 overflow-hidden flex items-start gap-3">
                      <div className="flex-1 min-w-0 bg-[#FFFFFF] rounded-[14px] overflow-hidden flex flex-col items-start gap-0.5 px-4 py-3">
                        <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[18px] leading-normal text-[#171A2B]">{"16,610  "}</div>
                        <div className="shrink-0 whitespace-pre font-gabarito text-[13px] leading-normal text-[#5B6072]">{"Answered"}</div>
                      </div>
                      <div className="flex-1 min-w-0 bg-[#FFFFFF] rounded-[14px] overflow-hidden flex flex-col items-start gap-0.5 px-4 py-3">
                        <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[18px] leading-normal text-[#171A2B]">{"1,060  "}</div>
                        <div className="shrink-0 whitespace-pre font-gabarito text-[13px] leading-normal text-[#5B6072]">{"Unanswered replies"}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 h-[243px] bg-[#E3F3E7] border border-[#CDE8D3] rounded-[24px] overflow-hidden flex flex-col items-start gap-[13px] p-6">
                    <div className="self-stretch shrink-0 overflow-hidden flex items-center gap-3">
                      <img className="w-11 h-11 shrink-0" src="icons/icon-tile-2.svg" alt="" />
                      <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[17px] leading-normal text-[#171A2B]">{"Active chat sessions"}</div>
                      <div className="shrink-0 bg-[#FFFFFF] rounded-full overflow-hidden flex items-center gap-1.5 px-3 py-1.5">
                        <div className="w-2 h-2 shrink-0 bg-[#2F6B3F] rounded-full" />
                        <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[13px] leading-normal text-[#2F6B3F]">{"Live"}</div>
                      </div>
                    </div>
                    <div className="shrink-0 overflow-hidden flex items-baseline gap-2.5">
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[52px] leading-[56px] text-[#171A2B]">{"18"}</div>
                      <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-normal text-[#5B6072]">{"chatting right now"}</div>
                    </div>
                    <div className="self-stretch shrink-0 overflow-hidden flex items-start gap-3">
                      <div className="flex-1 min-w-0 bg-[#FFFFFF] rounded-[14px] overflow-hidden flex flex-col items-start gap-0.5 px-4 py-3">
                        <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[18px] leading-normal text-[#171A2B]">{"4,550"}</div>
                        <div className="shrink-0 whitespace-pre font-gabarito text-[13px] leading-normal text-[#5B6072]">{"Sessions"}</div>
                      </div>
                      <div className="flex-1 min-w-0 bg-[#FFFFFF] rounded-[14px] overflow-hidden flex flex-col items-start gap-0.5 px-4 py-3">
                        <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[18px] leading-normal text-[#171A2B]">{"2,933"}</div>
                        <div className="shrink-0 whitespace-pre font-gabarito text-[13px] leading-normal text-[#5B6072]">{"Guests"}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 h-[243px] bg-[#ECE7FB] border border-[#DCD3F6] rounded-[24px] overflow-hidden flex flex-col items-start gap-[13px] p-6">
                    <div className="self-stretch shrink-0 overflow-hidden flex items-center gap-3">
                      <img className="w-11 h-11 shrink-0" src="icons/icon-tile-3.svg" alt="" />
                      <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[17px] leading-normal text-[#171A2B]">{"Knowledge base"}</div>
                      <div className="shrink-0 bg-[#FFFFFF] rounded-full overflow-hidden flex items-center gap-1.5 px-3 py-1.5">
                        <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[13px] leading-normal text-[#2F6B3F]">{"✓ Indexed"}</div>
                      </div>
                    </div>
                    <div className="self-stretch shrink-0 overflow-hidden flex items-center">
                      <div className="flex-1 min-w-0 overflow-hidden flex items-baseline gap-2.5">
                        <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[52px] leading-[56px] text-[#171A2B]">{"69"}</div>
                        <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-normal text-[#5B6072]">{"documents"}</div>
                      </div>
                    </div>
                    <div className="self-stretch shrink-0 overflow-hidden flex items-start gap-3">
                      <div className="flex-1 min-w-0 bg-[#FFFFFF] rounded-[14px] overflow-hidden flex flex-col items-start gap-0.5 px-4 py-3">
                        <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[18px] leading-normal"><span className="text-[#171A2B]">{"1.8 GB"}</span><span className="text-[#5B6072]">{" / 5 GB"}</span></div>
                        <div className="shrink-0 whitespace-pre font-gabarito text-[13px] leading-normal text-[#5B6072]">{"Storage used"}</div>
                      </div>
                      <div className="flex-1 min-w-0 bg-[#FFFFFF] rounded-[14px] overflow-hidden flex flex-col items-start gap-0.5 px-4 py-3">
                        <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[18px] leading-normal text-[#171A2B]">{"481 MB"}</div>
                        <div className="shrink-0 whitespace-pre font-gabarito text-[13px] leading-normal text-[#5B6072]">{"Index size"}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="self-stretch shrink-0 overflow-hidden flex items-start gap-6">
                  <div className="flex-1 min-w-0 self-stretch bg-bg-card border border-border-default rounded-[16px] overflow-hidden flex flex-col items-start gap-4.5 p-7">
                    <div className="self-stretch shrink-0 overflow-hidden flex items-center gap-7">
                      <div className="shrink-0 flex flex-col items-start gap-1">
                        <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[18px] leading-[28px] text-text-primary">{"Message trend"}</div>
                        <div className="shrink-0 whitespace-pre font-gabarito text-[13px] leading-normal text-text-muted">{"Messages and sessions · last 14 days"}</div>
                      </div>
                      <div className="shrink-0 flex items-center gap-4">
                        <div className="shrink-0 flex items-center gap-1.5">
                          <div className="w-3.5 shrink-0 border-t-[2.5px] border-[#4B3FD1] h-0" />
                          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[12px] leading-normal text-[#444444]">{"Messages"}</div>
                        </div>
                        <div className="shrink-0 flex items-center gap-1.5">
                          <div className="w-3.5 shrink-0 border-t-[2px] border-[#AAAAA5] h-0" />
                          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[12px] leading-normal text-[#444444]">{"Sessions"}</div>
                        </div>
                      </div>
                      <div className="shrink-0 bg-bg-soft border border-border-default rounded-[10px] flex items-center gap-0.5 p-[3px]">
                        <div className="shrink-0 bg-bg-inverse rounded-[8px] overflow-hidden flex justify-center items-center px-3.5 py-[7px]">
                          <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[13px] leading-normal text-text-inverse">{"Daily"}</div>
                        </div>
                        <div className="shrink-0 rounded-[8px] overflow-hidden flex justify-center items-center px-3.5 py-[7px]">
                          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-normal text-text-secondary">{"Weekly"}</div>
                        </div>
                        <div className="shrink-0 rounded-[8px] overflow-hidden flex justify-center items-center px-3.5 py-[7px]">
                          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-normal text-text-secondary">{"Monthly"}</div>
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch h-[477px] shrink-0 relative">
                      <div className="absolute left-11 right-0 top-2 h-px bg-border-default" />
                      <div className="absolute left-0 top-0.5 w-8.5 whitespace-pre-wrap text-right font-gabarito font-medium text-[11px] leading-normal text-text-muted">
                        {"2,000"}
                      </div>
                      <div className="absolute left-11 right-0 top-[222.5px] h-px bg-border-default" />
                      <div className="absolute left-0 top-[216.5px] w-8.5 whitespace-pre-wrap text-right font-gabarito font-medium text-[11px] leading-normal text-text-muted">
                        {"1,000"}
                      </div>
                      <div className="absolute left-11 right-0 top-[437px] h-px bg-border-default" />
                      <div className="absolute left-0 top-[431px] w-8.5 whitespace-pre-wrap text-right font-gabarito font-medium text-[11px] leading-normal text-text-muted">
                        {"0"}
                      </div>
                      <img
                        className="absolute left-11 top-0 w-[calc(100%_-_44px)] h-[477px]"
                        src="icons/plot.svg"
                        alt=""
                      />
                      <div className="absolute -right-1.5 top-[90.85px] w-3 h-3 bg-accent-indigo rounded-full shadow-[0_0_0_2px_var(--color-bg-card)]" />
                      <div className="absolute left-[47px] top-[455px] whitespace-pre font-gabarito font-medium text-[12px] leading-normal text-text-muted">
                        {"Sep 26"}
                      </div>
                      <div className="absolute left-[calc(44px_+_(100%_-_44px)_*_0.441)] top-[455px] whitespace-pre font-gabarito font-medium text-[12px] leading-normal text-text-muted">
                        {"Oct 2"}
                      </div>
                      <div className="absolute right-0 top-[455px] whitespace-pre font-gabarito font-medium text-[12px] leading-normal text-text-muted">
                        {"Oct 9"}
                      </div>
                    </div>
                  </div>
                  <div className="w-117 shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[24px] overflow-hidden flex flex-col items-start gap-5 pt-7 pr-7 pb-5 pl-7">
                    <div className="shrink-0 overflow-hidden flex flex-col items-start gap-1">
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[18px] leading-normal text-[#111111]">{"Channel breakdown"}</div>
                      <div className="shrink-0 whitespace-pre font-gabarito text-[13px] leading-normal text-[#6B6B6B]">{"Messages and sessions per channel · last 14 days"}</div>
                    </div>
                    <div className="self-stretch h-58 shrink-0 bg-[#F7F7F5] rounded-[20px] overflow-hidden flex justify-center items-center py-6">
                      <div className="w-46 h-46 shrink-0 relative">
                        <img className="absolute left-0 top-0 w-46 h-46" src="icons/arc-public-link.svg" alt="" />
                        <img className="absolute left-0 top-0 w-46 h-46" src="icons/arc-web-widget.svg" alt="" />
                        <img className="absolute left-0 top-0 w-46 h-46" src="icons/arc-telegram.svg" alt="" />
                        <img className="absolute left-0 top-0 w-46 h-46" src="icons/arc-playground.svg" alt="" />
                        <div className="absolute left-[55px] top-[67px] w-18.5 h-12.5 overflow-hidden flex flex-col items-center">
                          <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[28px] leading-normal text-[#171A2B]">{"17,670"}</div>
                          <div className="shrink-0 whitespace-pre font-gabarito text-[13px] leading-normal text-[#5B6072]">{"messages"}</div>
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch shrink-0 overflow-hidden flex flex-col items-start">
                      <div className="self-stretch shrink-0 border-b border-[#ECECE8] overflow-hidden flex items-center gap-3 py-3">
                        <div className="w-3 h-3 shrink-0 bg-[#5B3FD0] rounded-full" />
                        <div className="flex-1 min-w-0 overflow-hidden flex flex-col items-start gap-0.5">
                          <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[15px] leading-normal text-[#171A2B]">{"Public link"}</div>
                          <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-normal text-[#5B6072]">{"1,974 sessions"}</div>
                        </div>
                        <div className="shrink-0 bg-[#F4F4F2] rounded-full overflow-hidden flex items-start px-2.5 py-1">
                          <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[12px] leading-normal text-[#5B6072]">{"43%"}</div>
                        </div>
                        <div className="w-15 shrink-0 whitespace-pre-wrap text-right font-gabarito font-bold text-[18px] leading-normal text-[#171A2B]">{"7,598"}</div>
                      </div>
                      <div className="self-stretch shrink-0 border-b border-[#ECECE8] overflow-hidden flex items-center gap-3 py-3">
                        <div className="w-3 h-3 shrink-0 bg-[#E0A100] rounded-full" />
                        <div className="flex-1 min-w-0 overflow-hidden flex flex-col items-start gap-0.5">
                          <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[15px] leading-normal text-[#171A2B]">{"Web widget"}</div>
                          <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-normal text-[#5B6072]">{"1,452 sessions"}</div>
                        </div>
                        <div className="shrink-0 bg-[#F4F4F2] rounded-full overflow-hidden flex items-start px-2.5 py-1">
                          <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[12px] leading-normal text-[#5B6072]">{"29%"}</div>
                        </div>
                        <div className="w-15 shrink-0 whitespace-pre-wrap text-right font-gabarito font-bold text-[18px] leading-normal text-[#171A2B]">{"5,124"}</div>
                      </div>
                      <div className="self-stretch shrink-0 border-b border-[#ECECE8] overflow-hidden flex items-center gap-3 py-3">
                        <div className="w-3 h-3 shrink-0 bg-[#3553D1] rounded-full" />
                        <div className="flex-1 min-w-0 overflow-hidden flex flex-col items-start gap-0.5">
                          <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[15px] leading-normal text-[#171A2B]">{"Telegram"}</div>
                          <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-normal text-[#5B6072]">{"867 sessions"}</div>
                        </div>
                        <div className="shrink-0 bg-[#F4F4F2] rounded-full overflow-hidden flex items-start px-2.5 py-1">
                          <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[12px] leading-normal text-[#5B6072]">{"18%"}</div>
                        </div>
                        <div className="w-15 shrink-0 whitespace-pre-wrap text-right font-gabarito font-bold text-[18px] leading-normal text-[#171A2B]">{"3,181"}</div>
                      </div>
                      <div className="self-stretch shrink-0 overflow-hidden flex items-center gap-3 py-3 cursor-pointer" onClick={go("/tpg")}>
                        <div className="w-3 h-3 shrink-0 bg-[#2F8F4E] rounded-full" />
                        <div className="flex-1 min-w-0 overflow-hidden flex flex-col items-start gap-0.5">
                          <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[15px] leading-normal text-[#171A2B]">{"Playground"}</div>
                          <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-normal text-[#5B6072]">{"253 sessions"}</div>
                        </div>
                        <div className="shrink-0 bg-[#F4F4F2] rounded-full overflow-hidden flex items-start px-2.5 py-1">
                          <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[12px] leading-normal text-[#5B6072]">{"10%"}</div>
                        </div>
                        <div className="w-15 shrink-0 whitespace-pre-wrap text-right font-gabarito font-bold text-[18px] leading-normal text-[#171A2B]">{"1,767"}</div>
                      </div>
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
