export function ChannelPublicLink() {
  return (
    <div className="self-stretch shrink-0 border border-border-default rounded-[12px] flex items-center gap-3 px-3 py-2.5">
      <img className="w-9 h-9 shrink-0" src="icons/icon-6.svg" alt="" />
      <div className="flex-1 min-w-0 flex flex-col items-start gap-0.5">
        <div className="self-stretch shrink-0 whitespace-pre-wrap font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">{"Public link"}</div>
        <div className="self-stretch shrink-0 whitespace-pre-wrap font-gabarito text-[12px] leading-[16px] text-ink-secondary">{"Not connected · share a page guests can open in any browser"}</div>
      </div>
      <div className="shrink-0 bg-[#F0F0ED] border border-[#B7E2C8] rounded-[20px] flex items-center gap-1.5 px-2.5 py-[3px]">
        <div className="w-1.5 h-1.5 shrink-0 bg-[#999999] rounded-full" />
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[12px] leading-normal text-[#6B6B6B]">{"NOT CONNECTED"}</div>
      </div>
    </div>
  );
}
