// Demo 38 · [gNA] A5 · Guest · Temporarily unavailable
// Route: #/gNA
import { useGo } from "../lib/nav";
import { Bot2 } from "../components/shared/Bot2";

export default function Screen38GNA() {
  const go = useGo();
  return (
    <div className="relative w-full h-full bg-bg-page-2 overflow-hidden flex items-start">
      <div className="flex-1 min-w-0 self-stretch bg-bg-page overflow-hidden flex flex-col items-center">
        <div className="self-stretch shrink-0 bg-bg-card border-b border-border-default flex justify-between items-center px-14 py-5">
          <Bot2 />
          <img className="w-20.5 h-11 shrink-0" src="icons/actions-3.svg" alt="" />
        </div>
        <div className="self-stretch flex-1 min-h-0 overflow-y-auto flex flex-col justify-center items-center gap-6 pt-10 pb-6">
          <div className="w-190 shrink-0 overflow-hidden flex flex-col justify-center items-center gap-5">
            <img className="w-18 h-18 shrink-0" src="icons/status-icon.svg" alt="" />
            <div className="shrink-0 whitespace-pre text-center font-gabarito font-bold text-[36px] leading-[40px] text-ink-strong">{"This chatbot is unavailable temporarily"}</div>
            <div className="self-stretch shrink-0 whitespace-pre-wrap text-center font-gabarito text-[15px] leading-[24px] text-ink-subtle">{"The owner has paused this chatbot while its knowledge is being updated. Please check back soon."}</div>
          </div>
        </div>
        <div className="self-stretch shrink-0 bg-bg-card border-t border-border-default flex flex-col items-center gap-2.5 pt-4 pb-5">
          <div className="shrink-0 flex items-center gap-1.5">
            <img className="w-3 h-3 shrink-0" src="icons/lock-property-linear-2.svg" alt="" />
            <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[12px] leading-[16px] text-ink-muted">{"Answers are generated only from official billing documents.  •  Powered by RAG Studio"}</div>
          </div>
        </div>
      </div>
      <div
        className="absolute right-8 bottom-8 w-46.5 h-11 bg-[#4B3FD1] rounded-full shadow-[0px_8px_24px_0px_#00000033] overflow-hidden flex items-start px-5.5 py-[13px] cursor-pointer"
        onClick={go("/paused2")}
      >
        <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[15px] leading-normal text-[#FFFFFF]">
          {"← Back to Owner tab"}
        </div>
      </div>
    </div>
  );
}
