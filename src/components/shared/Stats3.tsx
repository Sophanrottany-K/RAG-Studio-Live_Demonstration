import { useGo } from "../../lib/nav";
import { StatDocuments } from "./StatDocuments";
import { StatMessages } from "./StatMessages";
import { StatUnanswered } from "./StatUnanswered";

export function Stats3() {
  const go = useGo();
  return (
    <div className="self-stretch shrink-0 bg-[#FFFFFF] border border-[#ECECEA] rounded-[16px] overflow-hidden flex items-start">
      <StatMessages />
      <StatDocuments />
      <div className="flex-1 min-w-0 self-stretch border-l border-[#ECECEA] flex flex-col items-start gap-2.5 px-6 py-5">
        <div className="shrink-0 flex items-center gap-2 cursor-pointer" onClick={go("/ch3")}>
          <img className="w-4 h-4 shrink-0" src="icons/icon-4.svg" alt="" />
          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-[#6B6B6B]">{"Channels"}</div>
        </div>
        <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[28px] leading-[34px] tracking-[-0.01em] text-ink-primary">{"0"}</div>
        <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-[#8A8A86]">{"Not connected"}</div>
      </div>
      <StatUnanswered />
    </div>
  );
}
