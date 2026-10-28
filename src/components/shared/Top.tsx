export function Top() {
  return (
    <div className="self-stretch shrink-0 flex items-start gap-5">
      <div className="flex-1 min-w-0 flex flex-col items-start gap-2">
        <div className="shrink-0 flex items-center gap-3 relative">
          <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[28px] leading-normal text-[#111111]">{"Billing Assistant"}</div>
          <div className="w-[101px] h-9 shrink-0 overflow-hidden" />
          <div className="absolute left-53 top-[5px] w-24 h-6.5 flex flex-col items-start">
            <div className="w-24 shrink-0 bg-[#EA580C4D] border border-[#EA580C] rounded-[99px] flex justify-center items-center gap-1.5 px-2.5 py-1">
              <div className="shrink-0 whitespace-pre text-center font-geist-mono font-bold text-[11px] leading-[16px] tracking-[0.01em] uppercase text-[#9A3412]">{"Paused"}</div>
            </div>
          </div>
        </div>
        <div className="self-stretch shrink-0 whitespace-pre-wrap font-gabarito text-[16px] leading-normal text-[#444444]">{"Answers billing, refund and account questions using your help-center documents."}</div>
        <div className="shrink-0 whitespace-pre font-gabarito text-[13px] leading-normal text-[#6B6B6B]">{"Created Oct 22, 2026   ·   Updated Oct 22, 2026   ·   Owner: Alex Vance"}</div>
      </div>
      <div className="shrink-0 flex items-center gap-2.5">
        <div className="shrink-0 bg-bg-inverse rounded-full flex justify-center items-center gap-2 px-4 py-3">
          <img className="w-4 h-4 shrink-0" src="icons/icon-play.svg" alt="" />
          <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-[16px] text-ink-on-dark">{"Open Playground"}</div>
        </div>
        <img className="w-10.5 h-10.5 shrink-0" src="icons/button-more.svg" alt="" />
      </div>
    </div>
  );
}
