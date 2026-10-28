// Demo 30 · [gEmpty] A4 · Guest · Public link
// Route: #/gEmpty
import { useGo } from "../lib/nav";
import { Bot2 } from "../components/shared/Bot2";
import { BottomInput } from "../components/shared/BottomInput";

export default function Screen30GEmpty() {
  const go = useGo();
  return (
    <div className="relative w-full h-full bg-bg-page-2 overflow-hidden flex items-start">
      <div className="flex-1 min-w-0 self-stretch bg-bg-page overflow-hidden flex flex-col items-center">
        <div className="self-stretch shrink-0 bg-bg-card border-b border-border-default flex justify-between items-center px-14 py-5">
          <Bot2 />
          <div className="shrink-0 flex items-center gap-3">
            <img className="w-20.5 h-11 shrink-0" src="icons/theme-toggle.svg" alt="" />
            <div className="shrink-0 bg-bg-inverse rounded-[20px] flex justify-center items-center gap-2 px-6 py-3.5">
              <img className="w-5 h-5 shrink-0" src="icons/icon-plus-3.svg" alt="" />
              <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[15px] leading-normal text-text-inverse">{"Add new chat"}</div>
            </div>
          </div>
        </div>
        <div className="self-stretch flex-1 min-h-0 overflow-y-auto flex flex-col justify-center items-center gap-6 pt-10 pb-6">
          <div className="w-190 shrink-0 overflow-hidden flex flex-col justify-center items-center gap-5">
            <div className="w-14 h-14 shrink-0 bg-bg-sidebar-dark rounded-[16px] overflow-hidden flex justify-center items-center">
              <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[22px] leading-normal text-ink-on-dark">{"B"}</div>
            </div>
            <div className="shrink-0 whitespace-pre text-center font-gabarito font-bold text-[36px] leading-[40px] text-ink-strong">{"Welcome to Billing Assistant"}</div>
            <div className="self-stretch shrink-0 whitespace-pre-wrap text-center font-gabarito text-[15px] leading-[24px] text-ink-subtle">{"Ask about refunds, payments, invoices and plans. Every answer is grounded in official billing documents."}</div>
            <div className="self-stretch shrink-0 overflow-hidden flex flex-wrap items-start gap-x-3 gap-y-3 pt-3">
              <div className="w-93.5 shrink-0 min-h-13 bg-bg-glass/72 border border-border-hairline/10 rounded-[16px] backdrop-blur-[12px] shadow-[0px_2px_8px_0px_#0000000A] flex items-center gap-3 px-4 py-3.5 cursor-pointer" onClick={go("/gAns")}>
                <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito text-[14px] leading-[20px] text-ink-body-2">{"What is the refund policy?"}</div>
                <img className="w-5 h-5 shrink-0" src="icons/icon-chevron-right-3.svg" alt="" />
              </div>
              <div className="w-93.5 shrink-0 min-h-13 bg-bg-glass/72 border border-border-hairline/10 rounded-[16px] backdrop-blur-[12px] shadow-[0px_2px_8px_0px_#0000000A] flex items-center gap-3 px-4 py-3.5">
                <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito text-[14px] leading-[20px] text-ink-body-2">{"How do I change my payment method?"}</div>
                <img className="w-5 h-5 shrink-0" src="icons/icon-chevron-right-3.svg" alt="" />
              </div>
              <div className="w-93.5 shrink-0 min-h-13 bg-bg-glass/72 border border-border-hairline/10 rounded-[16px] backdrop-blur-[12px] shadow-[0px_2px_8px_0px_#0000000A] flex items-center gap-3 px-4 py-3.5">
                <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito text-[14px] leading-[20px] text-ink-body-2">{"Where can I download my invoice?"}</div>
                <img className="w-5 h-5 shrink-0" src="icons/icon-chevron-right-3.svg" alt="" />
              </div>
              <div className="w-93.5 shrink-0 min-h-13 bg-bg-glass/72 border border-border-hairline/10 rounded-[16px] backdrop-blur-[12px] shadow-[0px_2px_8px_0px_#0000000A] flex items-center gap-3 px-4 py-3.5">
                <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito text-[14px] leading-[20px] text-ink-body-2">{"What plans do you offer?"}</div>
                <img className="w-5 h-5 shrink-0" src="icons/icon-chevron-right-3.svg" alt="" />
              </div>
            </div>
          </div>
        </div>
        <BottomInput />
      </div>
    </div>
  );
}
