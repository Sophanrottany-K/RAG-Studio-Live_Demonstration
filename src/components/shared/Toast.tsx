export function Toast() {
  return (
    <div className="absolute right-10 bottom-8 w-98.5 h-[83px] bg-[#FFFFFF] border border-[#E4E4E0] rounded-[16px] shadow-[0px_2px_6px_0px_#00000014] flex items-start gap-3 px-4 py-3.5">
      <img className="w-5 h-5 shrink-0" src="icons/tick-circle-property-linear.svg" alt="" />
      <div className="shrink-0 flex flex-col items-start gap-1">
        <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-normal text-[#111111]">{"2 documents added"}</div>
        <div className="w-75 shrink-0 whitespace-pre-wrap font-gabarito text-[13px] leading-normal text-[#6B6B6B]">{"Status: QUEUED. Indexing starts automatically — READY when done."}</div>
      </div>
      <img className="w-4 h-4 shrink-0" src="icons/icon-close.svg" alt="" />
    </div>
  );
}
