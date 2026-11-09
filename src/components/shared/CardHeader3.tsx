export function CardHeader3() {
  return (
    <div className="self-stretch shrink-0 flex justify-between items-center">
      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[20px] leading-[30px] text-ink-primary">{"Knowledge base"}</div>
      <div className="shrink-0 rounded-[6px] flex items-center gap-1 px-2 py-1">
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[16px] leading-[22px] text-ink-primary">{"Manage documents"}</div>
        <img className="w-3.5 h-3.5 shrink-0" src="icons/icon-arrow-right.svg" alt="" />
      </div>
    </div>
  );
}
