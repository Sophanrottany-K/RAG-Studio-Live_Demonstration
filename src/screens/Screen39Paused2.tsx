// Demo 39 · [paused2] A6 · Paused · Knowledge base
// Route: #/paused2
import { useGo } from "../lib/nav";
import { Breadcrumb7 } from "../components/shared/Breadcrumb7";
import { DocumentsTable } from "../components/shared/DocumentsTable";
import { Header8 } from "../components/shared/Header8";
import { Right2 } from "../components/shared/Right2";
import { StarterQuestions } from "../components/shared/StarterQuestions";
import { Stats3 } from "../components/shared/Stats3";
import { TileChannels2 } from "../components/shared/TileChannels2";
import { TileLanguage } from "../components/shared/TileLanguage";
import { TilePrimaryModel2 } from "../components/shared/TilePrimaryModel2";
import { TileTone } from "../components/shared/TileTone";
import { Top } from "../components/shared/Top";
import { AppSidebar } from "../components/shared/AppSidebar";

export default function Screen39Paused2() {
  const go = useGo();
  return (
    <div className="relative w-full h-full bg-bg-card overflow-hidden flex items-start">
      <div className="flex-1 min-w-0 self-stretch bg-bg-card overflow-hidden flex items-start">
        <AppSidebar active="chatbots" links={{ playground: "/pg2", channels: "/ch3" }} />
        <div className="flex-1 min-w-0 self-stretch bg-bg-page overflow-hidden flex flex-col items-start">
          <Header8 />
          <div className="self-stretch flex-1 min-h-0 overflow-y-auto flex flex-col items-start">
            <div className="self-stretch flex-1 min-h-0 overflow-y-auto flex flex-col items-start gap-6 pt-7 pr-10 pb-10 pl-10">
              <Breadcrumb7 />
              <div className="self-stretch shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[20px] flex flex-col items-start gap-5 p-6">
                <Top />
                <div className="self-stretch shrink-0 flex items-start gap-3">
                  <TilePrimaryModel2 />
                  <TileLanguage />
                  <TileTone />
                  <div className="flex-1 min-w-0 bg-[#FAFAF9] border border-[#ECECEA] rounded-[14px] flex items-center gap-3 px-4 py-3.5 cursor-pointer" onClick={go("/kbDrop")}>
                    <img className="w-9 h-9 shrink-0" src="icons/frame-4.svg" alt="" />
                    <div className="shrink-0 flex flex-col items-start gap-0.5">
                      <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-normal text-[#8A8A86]">{"Knowledge base"}</div>
                      <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[15px] leading-normal text-[#111111]">{"4 documents"}</div>
                    </div>
                  </div>
                  <TileChannels2 />
                </div>
              </div>
              <div className="self-stretch shrink-0 border-b border-border-default flex items-start gap-1">
                <div className="h-11 shrink-0 border-b-[2px] border-border-strong flex items-center px-3.5">
                  <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[16px] leading-[24px] text-ink-primary">{"Overview"}</div>
                </div>
                <div className="h-11 shrink-0 flex items-center px-3.5 cursor-pointer" onClick={go("/kbDrop")}>
                  <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[16px] leading-[24px] text-ink-secondary">{"Knowledge base"}</div>
                </div>
                <div className="h-11 shrink-0 flex items-center px-3.5">
                  <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[16px] leading-[24px] text-ink-secondary">{"Configuration"}</div>
                </div>
              </div>
              <Stats3 />
              <div className="self-stretch shrink-0 flex items-start gap-6">
                <div className="flex-1 min-w-0 flex flex-col items-start gap-6">
                  <div className="self-stretch shrink-0 bg-bg-card border border-border-default rounded-[20px] flex flex-col items-start gap-3 p-6">
                    <div className="self-stretch shrink-0 flex justify-between items-center">
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[18px] leading-[28px] text-ink-primary cursor-pointer" onClick={go("/kbDrop")}>{"Knowledge base"}</div>
                      <div className="shrink-0 rounded-[6px] flex items-center gap-1 px-2 py-1">
                        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">{"Manage documents"}</div>
                        <img className="w-3.5 h-3.5 shrink-0" src="icons/icon-arrow-right.svg" alt="" />
                      </div>
                    </div>
                    <DocumentsTable />
                    <div className="self-stretch shrink-0 whitespace-pre-wrap font-gabarito text-[12px] leading-[16px] text-ink-secondary">{"Showing 3 of 4 documents"}</div>
                  </div>
                  <StarterQuestions />
                </div>
                <Right2 />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
