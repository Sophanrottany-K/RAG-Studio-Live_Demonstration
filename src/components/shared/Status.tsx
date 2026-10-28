export function Status() {
  return (
    <div className="w-37.5 shrink-0 flex items-center gap-2 relative">
      <div className="absolute left-0 top-0 w-24 h-6.5 flex flex-col items-start">
        <div className="w-24 shrink-0 bg-[#2E9E664D] border border-success-solid rounded-[99px] flex justify-center items-center gap-1.5 px-2.5 py-1">
          <div className="shrink-0 whitespace-pre text-center font-geist-mono font-bold text-[11px] leading-[16px] tracking-[0.01em] uppercase text-success-text">{"Active"}</div>
        </div>
      </div>
      <div className="w-[101px] h-9 shrink-0 overflow-hidden" />
    </div>
  );
}
