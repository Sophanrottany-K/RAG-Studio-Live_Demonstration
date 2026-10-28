export function Stats() {
  return (
    <div className="self-stretch shrink-0 flex items-start gap-4">
      <div className="flex-1 min-w-0 self-stretch bg-[#ECE7FB] rounded-[24px] flex flex-col items-start gap-3.5 p-5">
        <div className="self-stretch shrink-0 overflow-hidden flex items-center gap-3">
          <img className="w-11 h-11 shrink-0" src="icons/icon-tile-accent-2.svg" alt="" />
          <div className="flex-1 min-w-0 self-stretch overflow-hidden flex justify-between items-center">
            <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[15px] leading-normal text-[#171A2B]">{"Documents"}</div>
          </div>
        </div>
        <div className="self-stretch shrink-0 flex flex-col items-start gap-1">
          <div className="shrink-0 flex items-center gap-1.5">
            <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[36px] leading-[40px] tracking-[-1px] text-[#171A2B]">{"4"}</div>
          </div>
          <div className="self-stretch shrink-0 whitespace-pre-wrap font-gabarito text-[13px] leading-[16px] text-[#5B6072]">{"4 ready"}</div>
        </div>
      </div>
      <div className="flex-1 min-w-0 self-stretch bg-[#E3F3E7] rounded-[24px] flex flex-col items-start gap-3.5 p-5">
        <div className="self-stretch shrink-0 overflow-hidden flex items-center gap-3">
          <img className="w-11 h-11 shrink-0" src="icons/icon-tile-success-2.svg" alt="" />
          <div className="flex-1 min-w-0 self-stretch overflow-hidden flex justify-between items-center">
            <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[15px] leading-normal text-[#171A2B]">{"Ready"}</div>
          </div>
        </div>
        <div className="self-stretch shrink-0 flex flex-col items-start gap-1">
          <div className="shrink-0 flex items-center gap-1.5">
            <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[36px] leading-[40px] tracking-[-1px] text-[#171A2B]">{"4"}</div>
          </div>
          <div className="self-stretch shrink-0 whitespace-pre-wrap font-gabarito text-[13px] leading-[16px] text-[#5B6072]">{"Used to answer questions"}</div>
        </div>
      </div>
      <div className="flex-1 min-w-0 self-stretch bg-[#FCEFD9] rounded-[24px] flex flex-col items-start gap-3.5 p-5">
        <div className="self-stretch shrink-0 overflow-hidden flex items-center gap-3">
          <img className="w-11 h-11 shrink-0" src="icons/icon-tile-warning-2.svg" alt="" />
          <div className="flex-1 min-w-0 self-stretch overflow-hidden flex justify-between items-center">
            <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[15px] leading-normal text-[#171A2B]">{"Indexing"}</div>
          </div>
        </div>
        <div className="self-stretch shrink-0 flex flex-col items-start gap-1">
          <div className="shrink-0 flex items-center gap-1.5">
            <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[36px] leading-[40px] tracking-[-1px] text-[#171A2B]">{"0"}</div>
          </div>
          <div className="self-stretch shrink-0 whitespace-pre-wrap font-gabarito text-[13px] leading-[16px] text-[#5B6072]">{"Queued or processing"}</div>
        </div>
      </div>
      <div className="flex-1 min-w-0 self-stretch bg-[#FBE6E4] rounded-[24px] flex flex-col items-start gap-3.5 p-5">
        <div className="self-stretch shrink-0 overflow-hidden flex items-center gap-3">
          <img className="w-11 h-11 shrink-0" src="icons/icon-tile-danger.svg" alt="" />
          <div className="flex-1 min-w-0 self-stretch overflow-hidden flex justify-between items-center">
            <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[15px] leading-normal text-[#171A2B]">{"Failed"}</div>
          </div>
        </div>
        <div className="self-stretch shrink-0 flex flex-col items-start gap-1">
          <div className="shrink-0 flex items-center gap-1.5">
            <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[36px] leading-[40px] tracking-[-1px] text-[#171A2B]">{"0"}</div>
          </div>
          <div className="self-stretch shrink-0 whitespace-pre-wrap font-gabarito text-[13px] leading-[16px] text-[#5B6072]">{"Needs your attention"}</div>
        </div>
      </div>
    </div>
  );
}
