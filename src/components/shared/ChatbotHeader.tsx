import { ConfigTiles } from "./ConfigTiles";
import { Info2 } from "./Info2";

export function ChatbotHeader() {
  return (
    <div className="self-stretch shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[20px] flex flex-col items-start gap-5 p-6">
      <div className="self-stretch shrink-0 flex items-start gap-5">
        <Info2 />
        <div className="shrink-0 flex items-center gap-2.5">
          <div className="shrink-0 bg-bg-card border border-border-default rounded-full flex justify-center items-center gap-2 px-4 py-3">
            <img className="w-4 h-4 shrink-0" src="icons/send-2-property-linear.svg" alt="" />
            <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-[16px] text-ink-primary">{"Publish"}</div>
          </div>
          <div className="shrink-0 bg-bg-inverse rounded-full flex justify-center items-center gap-2 px-4 py-3">
            <img className="w-4 h-4 shrink-0" src="icons/icon-play.svg" alt="" />
            <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-[16px] text-ink-on-dark">{"Open Playground"}</div>
          </div>
          <img className="w-10.5 h-10.5 shrink-0" src="icons/button-more-2.svg" alt="" />
        </div>
      </div>
      <ConfigTiles />
    </div>
  );
}
