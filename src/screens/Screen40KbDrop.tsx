// Demo 40 · [kbDrop] A6 · Knowledge base · Drop file
// Route: #/kbDrop
import { useGo } from "../lib/nav";
import { Breadcrumb3 } from "../components/shared/Breadcrumb3";
import { ChatbotHeader } from "../components/shared/ChatbotHeader";
import { DocumentsCard } from "../components/shared/DocumentsCard";
import { Header3 } from "../components/shared/Header3";
import { ImportWebPages } from "../components/shared/ImportWebPages";
import { SidebarUserV22 } from "../components/shared/SidebarUserV22";
import { Stats } from "../components/shared/Stats";
import { Tabs2 } from "../components/shared/Tabs2";

export default function Screen40KbDrop() {
  const go = useGo();
  return (
    <div
      className="relative w-full h-full bg-bg-card overflow-hidden flex items-start cursor-pointer"
      onClick={go("/kbAdded")}
    >
      <div className="w-full h-full shrink-0 bg-bg-card overflow-hidden flex items-start">
        <SidebarUserV22 />
        <div className="flex-1 min-w-0 self-stretch bg-bg-page overflow-hidden flex flex-col items-start">
          <Header3 />
          <div className="self-stretch flex-1 min-h-0 overflow-y-auto flex flex-col items-start">
            <div className="self-stretch shrink-0 overflow-hidden flex flex-col items-start gap-6 pt-7 pr-10 pb-10 pl-10">
              <Breadcrumb3 />
              <ChatbotHeader />
              <Tabs2 />
              <div className="self-stretch shrink-0 flex flex-col items-start gap-6">
                <Stats />
                <div className="self-stretch shrink-0 flex items-start gap-5">
                  <div className="flex-1 min-w-0 self-stretch bg-[#FFFFFF] border border-[#E4E4E0] rounded-[16px] flex flex-col items-start gap-4 p-7">
                    <div className="shrink-0 flex flex-col items-start gap-1">
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[18px] leading-normal text-[#111111]">{"Upload documents"}</div>
                      <div className="shrink-0 whitespace-pre font-gabarito text-[13px] leading-normal text-[#6B6B6B]">{"PDF, DOCX, TXT, MD, XLSX · up to 20 MB per file"}</div>
                    </div>
                    <div className="self-stretch shrink-0 bg-[#5B3FC40F] border-[2px] border-[#5B3FC4] border-dashed rounded-[14px] flex flex-col items-center gap-2.5 px-6 py-7">
                      <img className="w-12 h-12 shrink-0" src="icons/frame-11.svg" alt="" />
                      <div className="shrink-0 flex items-start gap-1">
                        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-normal text-[#5B3FC4]">{"Drop 1 file to upload"}</div>
                      </div>
                      <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-normal text-[#8A8A86]">{"Student discount policy.pdf"}</div>
                    </div>
                  </div>
                  <ImportWebPages />
                </div>
                <DocumentsCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
