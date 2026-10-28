export function DragHandle() {
  return (
    <div className="w-4 h-6 shrink-0 overflow-hidden relative">
      <div className="absolute left-[3px] top-1 w-1 h-1 bg-[#999999] rounded-full" />
      <div className="absolute left-[9px] top-1 w-1 h-1 bg-[#999999] rounded-full" />
      <div className="absolute left-[3px] top-[11px] w-1 h-1 bg-[#999999] rounded-full" />
      <div className="absolute left-[9px] top-[11px] w-1 h-1 bg-[#999999] rounded-full" />
      <div className="absolute left-[3px] top-4.5 w-1 h-1 bg-[#999999] rounded-full" />
      <div className="absolute left-[9px] top-4.5 w-1 h-1 bg-[#999999] rounded-full" />
    </div>
  );
}
