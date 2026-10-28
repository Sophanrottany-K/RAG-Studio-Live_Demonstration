import { useGo } from "../../lib/nav";
import { Header4 } from "./Header4";
import { Info2 } from "./Info2";
import { KnowledgeBase } from "./KnowledgeBase";
import { Sidebar3 } from "./Sidebar3";
import { Tabs2 } from "./Tabs2";
import { TileKnowledgeBaseSelected } from "./TileKnowledgeBaseSelected";
import { TileLanguage2 } from "./TileLanguage2";
import { TilePrimaryModel } from "./TilePrimaryModel";
import { TileTone2 } from "./TileTone2";

export function PageUser() {
  const go = useGo();
  return (
    <div className="w-full h-full shrink-0 bg-bg-card overflow-hidden flex items-start">
      <Sidebar3 />
      <div className="flex-1 min-w-0 self-stretch bg-bg-page overflow-hidden flex flex-col items-start">
        <Header4 />
        <div className="self-stretch flex-1 min-h-0 overflow-y-auto flex flex-col items-start">
          <div className="self-stretch shrink-0 overflow-hidden flex flex-col items-start gap-6 pt-7 pr-10 pb-10 pl-10">
            <div
              className="shrink-0 rounded-[8px] flex items-center gap-2 pt-1.5 pr-2.5 pb-1.5 pl-2 cursor-pointer"
              onClick={go("/list")}
            >
              <img className="w-4 h-4 shrink-0" src="icons/arrow-left-property-linear-3.svg" alt="" />
              <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-secondary">
                {"Chatbots"}
              </div>
              <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-muted">
                {"/"}
              </div>
              <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">
                {"Billing Assistant"}
              </div>
            </div>
            <div className="self-stretch shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[20px] flex flex-col items-start gap-5 p-6">
              <div className="self-stretch shrink-0 flex items-start gap-5">
                <Info2 />
                <div className="shrink-0 flex items-center gap-2.5">
                  <div className="shrink-0 bg-bg-card border border-border-default rounded-full flex justify-center items-center gap-2 px-4 py-3">
                    <img className="w-4 h-4 shrink-0" src="icons/send-2-property-linear.svg" alt="" />
                    <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-[16px] text-ink-primary">
                      {"Publish"}
                    </div>
                  </div>
                  <div
                    className="shrink-0 bg-bg-inverse rounded-full flex justify-center items-center gap-2 px-4 py-3 cursor-pointer"
                    onClick={go("/pg")}
                  >
                    <img className="w-4 h-4 shrink-0" src="icons/icon-play.svg" alt="" />
                    <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-[16px] text-ink-on-dark">
                      {"Open Playground"}
                    </div>
                  </div>
                  <img className="w-10.5 h-10.5 shrink-0" src="icons/button-more-2.svg" alt="" />
                </div>
              </div>
              <div className="self-stretch shrink-0 flex items-start gap-3">
                <TilePrimaryModel />
                <TileLanguage2 />
                <TileTone2 />
                <TileKnowledgeBaseSelected />
                <div
                  className="flex-1 min-w-0 bg-[#FAFAF9] border border-[#ECECEA] rounded-[14px] flex items-center gap-3 px-4 py-3.5 cursor-pointer"
                  onClick={go("/ch0")}
                >
                  <img className="w-9 h-9 shrink-0" src="icons/frame-10.svg" alt="" />
                  <div className="shrink-0 flex flex-col items-start gap-0.5">
                    <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-normal text-[#8A8A86]">
                      {"Channels"}
                    </div>
                    <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[15px] leading-normal text-[#111111]">
                      {"No channels"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Tabs2 />
            <KnowledgeBase />
          </div>
        </div>
      </div>
    </div>
  );
}
