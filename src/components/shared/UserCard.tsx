export function UserCard() {
  return (
    <div className="self-stretch shrink-0 border-t border-[#E4E4E0] flex flex-col items-start gap-1 p-2">
      <div className="self-stretch shrink-0 flex items-center gap-3 px-3 py-2">
        <div className="w-10 h-10 shrink-0 bg-[#ECEAFB] border border-border-default rounded-[20px] flex justify-center items-center">
          <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-normal text-[#4B3FBF]">{"CS"}</div>
        </div>
        <div className="flex-1 min-w-0 flex flex-col items-start gap-0.5">
          <div className="shrink-0 overflow-hidden flex items-center gap-2">
            <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[16px] leading-[24px] text-ink-primary">{"Chann Sreypich"}</div>
            <div className="shrink-0 bg-[#111111] rounded-[4px] overflow-hidden flex items-start px-1.5 py-0.5">
              <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[11px] leading-normal tracking-[0.4px] text-[#FFFFFF]">{"USER"}</div>
            </div>
          </div>
          <div className="shrink-0 whitespace-pre font-gabarito text-[13px] leading-[20px] text-[#55555A]">{"channsreypich@gmail.com"}</div>
        </div>
        <img className="w-5 h-5 shrink-0" src="icons/icon-chevron-up-down.svg" alt="" />
      </div>
    </div>
  );
}
