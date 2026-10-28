// Demo 17 · [pvDocx] A2 · All sources · DOCX original
// Route: #/pvDocx
import { useGo } from "../lib/nav";
import { DemoDocxOriginal } from "../components/documents/DemoDocxOriginal";
import { PageUser } from "../components/shared/PageUser";

export default function Screen17PvDocx() {
  const go = useGo();
  return (
    <div className="relative w-full h-full bg-bg-card overflow-hidden flex items-start">
      <PageUser />
      <div className="absolute left-0 top-0 w-full h-full bg-[#1111114D] backdrop-blur-[4px]" />
      <div className="absolute right-0 top-0 w-180 h-full bg-[#FFFFFF] shadow-[-8px_0px_40px_0px_#0000001F] flex flex-col items-start">
        <div className="self-stretch shrink-0 border-b border-[#E4E4E0] flex items-center gap-3 pt-6 pr-7 pb-5 pl-7">
          <div className="w-10 h-10 shrink-0 bg-[#2F6FD61F] rounded-[10px] flex justify-center items-center">
            <div className="shrink-0 whitespace-pre font-geist-mono font-bold text-[10px] leading-normal text-[#2F6FD6]">
              {"DOCX"}
            </div>
          </div>
          <div className="flex-1 min-w-0 flex flex-col items-start gap-1">
            <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[18px] leading-normal text-[#111111]">
              {"Billing FAQ.docx"}
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-normal text-[#6B6B6B]">
                {"DOCX · 340 KB · 4 pages · uploaded Oct 2, 2026"}
              </div>
              <div className="w-[89px] shrink-0 bg-[#2E9E664D] border border-[#2E9E66] rounded-[99px] flex justify-center items-center px-2.5 py-1">
                <div className="shrink-0 whitespace-pre font-geist-mono font-bold text-[11px] leading-[16px] tracking-[0.01em] uppercase text-[#17653F]">
                  {"READY"}
                </div>
              </div>
            </div>
          </div>
          <img className="w-10 h-10 shrink-0" src="icons/frame-12.svg" alt="" />
        </div>
        <div className="self-stretch shrink-0 bg-[#FAFAF9] flex justify-between items-center px-7 py-3">
          <div className="shrink-0 whitespace-pre font-geist-mono font-bold text-[12px] leading-normal tracking-[0.01em] uppercase text-[#6B6B6B]">
            {"Original document"}
          </div>
          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[12px] leading-normal text-[#6B6B6B]">
            {"Page 1 of 4"}
          </div>
        </div>
        <DemoDocxOriginal />
      </div>
      <div
        className="absolute right-8 bottom-8 w-[143px] h-11 bg-[#4B3FD1] rounded-full shadow-[0px_8px_24px_0px_#00000033] overflow-hidden flex items-start px-5.5 py-[13px] cursor-pointer"
        onClick={go("/pvXlsx")}
      >
        <div className="shrink-0 whitespace-pre font-gabarito font-semibold text-[15px] leading-normal text-[#FFFFFF]">
          {"Next source →"}
        </div>
      </div>
    </div>
  );
}
