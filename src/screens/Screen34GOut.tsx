// Demo 34 · [gOut] A4 · Guest · Outside knowledge
// Route: #/gOut
import { useGo } from "../lib/nav";
import { Bot2 } from "../components/shared/Bot2";
import { BottomInput } from "../components/shared/BottomInput";

export default function Screen34GOut() {
  const go = useGo();
  return (
    <div className="relative w-full h-full bg-bg-page-2 overflow-hidden flex items-start">
      <div className="flex-1 min-w-0 self-stretch bg-bg-page overflow-hidden flex flex-col items-center">
        <div className="self-stretch shrink-0 bg-bg-card border-b border-border-default flex justify-between items-center px-14 py-5">
          <Bot2 />
          <div className="shrink-0 flex items-center gap-3">
            <img className="w-20.5 h-11 shrink-0" src="icons/theme-toggle-4.svg" alt="" />
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
                <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-inverse-text">{"Do you offer student discounts?"}</div>
              </div>
            </div>
            <div className="self-stretch shrink-0 flex flex-col items-start gap-3.5">
              <div className="self-stretch shrink-0 overflow-hidden flex items-center gap-2.5">
                <div className="w-7 h-7 shrink-0 bg-bg-sidebar-dark rounded-[7.78px] overflow-hidden flex justify-center items-center">
                  <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[10.11px] leading-normal text-ink-on-dark">{"B"}</div>
                </div>
                <div className="flex-1 min-w-0 whitespace-pre-wrap font-jet-brains-mono font-medium text-[11px] leading-[16px] tracking-[0.06em] uppercase text-ink-muted-2">{"Searched 4 sources · No answer found"}</div>
              </div>
              <div className="self-stretch shrink-0 overflow-hidden flex flex-wrap items-center gap-x-1 gap-y-0.5">
                <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">{"I don’t have specific knowledge related to"}</div>
                <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">{"that question. My documents cover refunds,"}</div>
                <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">{"billing and payment methods, but nothing"}</div>
                <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">{"about student discounts."}</div>
              </div>
              <div className="self-stretch shrink-0 overflow-hidden flex flex-wrap items-center gap-x-2 gap-y-2" />
              <img className="w-[137px] h-8 shrink-0" src="icons/answer-feedback-default-light.svg" alt="" />
            </div>
          </div>
        </div>
        <BottomInput />
      </div>
      <div
        className="absolute right-8 bottom-8 w-46.5 h-11 bg-[#4B3FD1] rounded-full shadow-[0px_8px_24px_0px_#00000033] overflow-hidden flex items-start px-5.5 py-[13px] cursor-pointer"
        onClick={go("/active2")}
      >
        <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[15px] leading-normal text-[#FFFFFF]">
          {"← Back to Owner tab"}
        </div>
      </div>
    </div>
  );
}
