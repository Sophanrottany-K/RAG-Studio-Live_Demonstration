// Demo 33 · [gAns2] A4 · Guest · Ask outside question
// Route: #/gAns2
import { useGo } from "../lib/nav";
import { Bot2 } from "../components/shared/Bot2";
import { Head2 } from "../components/shared/Head2";

export default function Screen33GAns2() {
  const go = useGo();
  return (
    <div className="relative w-full h-full bg-bg-page-2 overflow-hidden flex items-start">
      <div className="flex-1 min-w-0 self-stretch bg-bg-page overflow-hidden flex flex-col items-center">
        <div className="self-stretch shrink-0 bg-bg-card border-b border-border-default flex justify-between items-center px-14 py-5">
          <Bot2 />
          <div className="shrink-0 flex items-center gap-3">
            <img className="w-20.5 h-11 shrink-0" src="icons/theme-toggle-3.svg" alt="" />
            <div className="shrink-0 bg-bg-inverse rounded-[20px] flex justify-center items-center gap-2 px-6 py-3.5">
              <img className="w-5 h-5 shrink-0" src="icons/icon-plus-3.svg" alt="" />
              <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[15px] leading-normal text-text-inverse">{"Add new chat"}</div>
            </div>
          </div>
        </div>
        <div className="self-stretch flex-1 min-h-0 overflow-hidden flex justify-center items-start gap-8 pt-10 pr-14 pb-6 pl-14">
          <div className="w-full max-w-[1161px] shrink overflow-hidden flex flex-col items-start gap-6">
            <div className="self-stretch shrink-0 overflow-hidden flex justify-end items-center">
              <div className="shrink-0 bg-bg-sidebar-dark rounded-tl-[16px] rounded-tr-[16px] rounded-br-[4px] rounded-bl-[16px] flex items-center px-4 py-3">
                <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-inverse-text">{"What is the refund policy for annual plans?"}</div>
              </div>
            </div>
            <div className="self-stretch shrink-0 flex flex-col items-start gap-3.5">
              <Head2 />
              <div className="self-stretch shrink-0 overflow-hidden flex flex-wrap items-center gap-x-1 gap-y-0.5">
                <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">{"Annual plans can be refunded in"}</div>
                <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">{"full within 30 days of purchase."}</div>
                <div className="shrink-0 min-w-5 bg-bg-surface border border-border-hairline/10 rounded-[4px] flex justify-center items-center px-[5px] py-0.5">
                  <div className="shrink-0 whitespace-pre text-center font-jet-brains-mono font-bold text-[11px] leading-[14px] text-ink-default">{"1"}</div>
                </div>
                <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">{"After that, refunds are pro-rated for"}</div>
                <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">{"the remaining months."}</div>
                <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">{"The money goes back to the"}</div>
                <div className="shrink-0 min-w-5 bg-bg-surface border border-border-hairline/10 rounded-[4px] flex justify-center items-center px-[5px] py-0.5">
                  <div className="shrink-0 whitespace-pre text-center font-jet-brains-mono font-bold text-[11px] leading-[14px] text-ink-default">{"2"}</div>
                </div>
                <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">{"original payment method in 5–7 business"}</div>
                <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">{"days."}</div>
                <div className="shrink-0 min-w-5 bg-bg-surface border border-border-hairline/10 rounded-[4px] flex justify-center items-center px-[5px] py-0.5">
                  <div className="shrink-0 whitespace-pre text-center font-jet-brains-mono font-bold text-[11px] leading-[14px] text-ink-default">{"3"}</div>
                </div>
              </div>
              <div className="self-stretch shrink-0 overflow-hidden flex flex-wrap items-center gap-x-2 gap-y-2">
                <div className="w-32.5 h-11 shrink-0 bg-bg-surface border border-border-hairline/10 rounded-full flex justify-center items-center gap-2 px-4.5">
                  <img className="w-5 h-5 shrink-0" src="icons/icon-list-bullet.svg" alt="" />
                  <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[14px] leading-[20px] text-ink-default">{"All sources (4)"}</div>
                </div>
              </div>
              <img className="w-[137px] h-8 shrink-0" src="icons/answer-feedback-default-light.svg" alt="" />
            </div>
          </div>
        </div>
        <div className="self-stretch shrink-0 bg-bg-card border-t border-border-default flex flex-col items-center gap-2.5 pt-4 pb-5">
          <div
            className="w-full max-w-230 shrink bg-bg-card border border-border-default rounded-[28px] shadow-[0px_5px_20px_0px_#1111111A,0px_1px_6px_0px_#1111110A] flex items-center gap-3 px-6 py-4 cursor-pointer"
            onClick={go("/gOut")}
          >
            <div
              className="flex-1 min-w-0 whitespace-pre-wrap truncate font-gabarito text-[16px] leading-[24px] text-ink-muted cursor-pointer"
              onClick={go("/gOut")}
            >
              {"Ask Billing Assistant or search official documents…"}
            </div>
            <img className="w-14 h-14 shrink-0" src="icons/app-icon-button-secondary-circle-lg.svg" alt="" />
            <img className="w-14 h-14 shrink-0" src="icons/app-icon-button-primary-circle-lg.svg" alt="" />
          </div>
          <div className="shrink-0 flex items-center gap-1.5">
            <img className="w-3 h-3 shrink-0" src="icons/lock-property-linear-2.svg" alt="" />
            <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[12px] leading-[16px] text-ink-muted">{"Answers are generated only from official billing documents.  •  Powered by RAG Studio"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
