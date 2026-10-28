import { useGo } from "../../lib/nav";

export function TileChannels2() {
  const go = useGo();
  return (
    <div className="flex-1 min-w-0 bg-[#FAFAF9] border border-[#ECECEA] rounded-[14px] flex items-center gap-3 px-4 py-3.5 cursor-pointer" onClick={go("/ch3")}>
      <img className="w-9 h-9 shrink-0" src="icons/frame-5.svg" alt="" />
      <div className="shrink-0 flex flex-col items-start gap-0.5">
        <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-normal text-[#8A8A86]">{"Channels"}</div>
        <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[15px] leading-normal text-[#111111]">{"3 channels"}</div>
      </div>
    </div>
  );
}
