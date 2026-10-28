export function Tabs() {
  return (
    <div className="self-stretch shrink-0 border-b border-border-default flex items-start gap-1">
      <div className="h-11 shrink-0 border-b-[2px] border-border-strong flex items-center px-3.5">
        <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[16px] leading-[24px] text-ink-primary">{"Overview"}</div>
      </div>
      <div className="h-11 shrink-0 flex items-center px-3.5">
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[16px] leading-[24px] text-ink-secondary">{"Knowledge base"}</div>
      </div>
      <div className="h-11 shrink-0 flex items-center px-3.5">
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[16px] leading-[24px] text-ink-secondary">{"Configuration"}</div>
      </div>
    </div>
  );
}
