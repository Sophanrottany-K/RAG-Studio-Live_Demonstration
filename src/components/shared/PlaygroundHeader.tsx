export function PlaygroundHeader() {
  return (
    <div className="self-stretch shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[20px] overflow-hidden flex items-center gap-5 p-6">
      <div className="w-14 h-14 shrink-0 bg-[#111111] rounded-[16px] overflow-hidden flex justify-center items-center">
        <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[18px] leading-normal text-[#FFFFFF]">{"BA"}</div>
      </div>
      <div className="flex-1 min-w-0 overflow-hidden flex flex-col items-start gap-1.5">
        <div className="shrink-0 overflow-hidden flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[24px] leading-normal text-[#111111]">{"Billing Assistant"}</div>
        </div>
        <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-normal text-[#6B6B6B]">{"Uses this chatbot's saved settings · Playground messages aren't counted in analytics"}</div>
      </div>
      <div className="shrink-0 overflow-hidden flex items-center gap-2.5">
        <div className="shrink-0 bg-bg-card border border-border-default rounded-full flex justify-center items-center gap-2 px-6 py-3.5">
          <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[16px] leading-[20px] text-ink-primary">{"Reset conversation"}</div>
        </div>
      </div>
    </div>
  );
}
