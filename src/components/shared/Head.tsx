export function Head() {
  return (
    <div className="self-stretch shrink-0 overflow-hidden flex items-center gap-2.5">
      <div className="w-7 h-7 shrink-0 bg-bg-sidebar-dark rounded-[7.78px] overflow-hidden flex justify-center items-center">
        <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[10.11px] leading-normal text-ink-on-dark">{"BA"}</div>
      </div>
      <div className="flex-1 min-w-0 whitespace-pre-wrap font-jet-brains-mono font-medium text-[11px] leading-[16px] tracking-[0.06em] uppercase text-ink-muted-2">{"Searched 3 sources · Answer from documents only"}</div>
    </div>
  );
}
