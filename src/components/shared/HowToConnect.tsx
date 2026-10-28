export function HowToConnect() {
  return (
    <div className="w-85 shrink-0 bg-[#FAFAF9] border border-[#E4E4E0] rounded-[16px] overflow-hidden flex flex-col items-start gap-2 px-4.5 py-4">
      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-normal text-[#111111]">{"How to connect"}</div>
      <div className="self-stretch shrink-0 whitespace-pre-wrap font-gabarito text-[13px] leading-normal text-[#444444]">{"1. Create a bot using @BotFather."}</div>
      <div className="self-stretch shrink-0 whitespace-pre-wrap font-gabarito text-[13px] leading-normal text-[#444444]">{"2. Copy the bot token."}</div>
      <div className="self-stretch shrink-0 whitespace-pre-wrap font-gabarito text-[13px] leading-normal text-[#444444]">{"3. Paste the token here and click Connect."}</div>
      <div className="self-stretch shrink-0 whitespace-pre-wrap font-gabarito text-[13px] leading-normal text-[#444444]">{"4. The webhook connects automatically."}</div>
    </div>
  );
}
