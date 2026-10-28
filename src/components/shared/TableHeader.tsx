export function TableHeader() {
  return (
    <div className="self-stretch shrink-0 bg-[#FAFAF9] border-b border-[#ECECEA] flex items-center gap-4 px-4 py-2">
      <div className="flex-1 min-w-0 flex items-center">
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[10px] leading-[14px] tracking-[0.6px] text-[#8A8A86]">{"NAME"}</div>
      </div>
      <div className="w-21 shrink-0 flex items-center gap-2">
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[10px] leading-[14px] tracking-[0.6px] text-[#8A8A86]">{"TYPE"}</div>
      </div>
      <div className="w-21 shrink-0 flex items-center gap-2">
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[10px] leading-[14px] tracking-[0.6px] text-[#8A8A86]">{"SIZE"}</div>
      </div>
      <div className="w-21 shrink-0 flex items-center gap-2">
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[10px] leading-[14px] tracking-[0.6px] text-[#8A8A86]">{"CHUNKS"}</div>
      </div>
      <div className="w-28 shrink-0 flex items-center gap-2">
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[10px] leading-[14px] tracking-[0.6px] text-[#8A8A86]">{"STATUS"}</div>
      </div>
    </div>
  );
}
