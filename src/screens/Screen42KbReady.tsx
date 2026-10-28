// Demo 42 · [kbReady] A6 · Knowledge base · Document ready
// Route: #/kbReady
import { useGo } from "../lib/nav";
import { Breadcrumb3 } from "../components/shared/Breadcrumb3";
import { ConfigTiles } from "../components/shared/ConfigTiles";
import { Header3 } from "../components/shared/Header3";
import { Info2 } from "../components/shared/Info2";
import { KnowledgeBase } from "../components/shared/KnowledgeBase";
import { SidebarUserV22 } from "../components/shared/SidebarUserV22";
import { Tabs2 } from "../components/shared/Tabs2";
import { Toast } from "../components/shared/Toast";

export default function Screen42KbReady() {
  const go = useGo();
  return (
    <div className="relative w-full h-full bg-bg-card overflow-hidden flex items-start">
      <div className="w-full h-full shrink-0 bg-bg-card overflow-hidden flex items-start">
        <SidebarUserV22 />
        <div className="flex-1 min-w-0 self-stretch bg-bg-page overflow-hidden flex flex-col items-start">
          <Header3 />
          <div className="self-stretch flex-1 min-h-0 overflow-y-auto flex flex-col items-start">
            <div className="self-stretch shrink-0 overflow-hidden flex flex-col items-start gap-6 pt-7 pr-10 pb-10 pl-10">
              <Breadcrumb3 />
              <div className="self-stretch shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[20px] flex flex-col items-start gap-5 p-6">
                <div className="self-stretch shrink-0 flex items-start gap-5">
                  <Info2 />
                  <div className="shrink-0 flex items-center gap-2.5">
                    <div className="shrink-0 bg-bg-card border border-border-default rounded-full flex justify-center items-center gap-2 px-4 py-3">
                      <img className="w-4 h-4 shrink-0" src="icons/send-2-property-linear.svg" alt="" />
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-[16px] text-ink-primary">{"Publish"}</div>
                    </div>
                    <div className="shrink-0 bg-bg-inverse rounded-full flex justify-center items-center gap-2 px-4 py-3 cursor-pointer" onClick={go("/pg2")}>
                      <img className="w-4 h-4 shrink-0" src="icons/icon-play.svg" alt="" />
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-[16px] text-ink-on-dark">{"Open Playground"}</div>
                    </div>
                    <img className="w-10.5 h-10.5 shrink-0" src="icons/button-more-2.svg" alt="" />
                  </div>
                </div>
                <ConfigTiles />
              </div>
              <Tabs2 />
              <KnowledgeBase />
            </div>
          </div>
        </div>
      </div>
      <Toast />
    </div>
  );
}
