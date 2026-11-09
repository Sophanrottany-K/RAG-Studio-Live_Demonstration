export function StatUnanswered() {
  return (
    <div className="flex-1 min-w-0 self-stretch border-l border-[#ECECEA] flex flex-col items-start gap-2.5 px-6 py-5">
      <div className="shrink-0 flex items-center gap-2">
        <img className="w-4 h-4 shrink-0" src="icons/icon-5.svg" alt="" />
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[16px] leading-[22px] text-[#6B6B6B]">{"Unanswered"}</div>
      </div>
      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[30px] leading-[36px] tracking-[-0.01em] text-ink-primary">{"0"}</div>
      <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[18px] text-[#8A8A86]">{"No questions yet"}</div>
    </div>
  );
}
