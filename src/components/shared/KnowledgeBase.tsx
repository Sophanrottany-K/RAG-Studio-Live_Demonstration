import { DocumentsCard } from "./DocumentsCard";
import { ImportWebPages } from "./ImportWebPages";
import { Stats } from "./Stats";

export function KnowledgeBase() {
  return (
    <div className="self-stretch shrink-0 flex flex-col items-start gap-6">
      <Stats />
      <div className="self-stretch shrink-0 flex items-start gap-5">
        <div className="flex-1 min-w-0 self-stretch bg-[#FFFFFF] border border-[#E4E4E0] rounded-[16px] flex flex-col items-start gap-4 p-7">
          <div className="shrink-0 flex flex-col items-start gap-1">
            <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[18px] leading-normal text-[#111111]">{"Upload documents"}</div>
            <div className="shrink-0 whitespace-pre font-gabarito text-[13px] leading-normal text-[#6B6B6B]">{"PDF, DOCX, TXT, MD, XLSX · up to 20 MB per file"}</div>
          </div>
          <div className="self-stretch shrink-0 bg-[#FAFAF9] border border-[#C9C9C4] border-dashed rounded-[14px] flex flex-col items-center gap-2.5 px-6 py-7">
            <img className="w-12 h-12 shrink-0" src="icons/frame-11.svg" alt="" />
            <div className="shrink-0 flex items-start gap-1">
              <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-normal text-[#111111]">{"Drag & drop files here, or"}</div>
              <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-normal text-[#5B3FC4]">{"browse"}</div>
            </div>
            <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-normal text-[#8A8A86]">{"You can select multiple files at once"}</div>
          </div>
        </div>
        <ImportWebPages />
      </div>
      <DocumentsCard />
    </div>
  );
}
