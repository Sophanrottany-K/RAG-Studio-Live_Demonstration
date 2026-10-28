export function DocumentsCard() {
  return (
    <div className="self-stretch shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[16px] flex flex-col items-start p-7">
      <div className="self-stretch shrink-0 flex flex-col items-start gap-4 pb-5">
        <div className="shrink-0 flex flex-col items-start gap-1">
          <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[20px] leading-normal text-[#111111]">{"Documents"}</div>
          <div className="shrink-0 whitespace-pre font-gabarito text-[13px] leading-normal text-[#6B6B6B]">{"4 documents · 1.6 MB"}</div>
        </div>
        <div className="self-stretch shrink-0 flex items-center gap-3">
          <div className="w-90 h-12 shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[12px] flex items-center gap-2.5 px-3.5">
            <img className="w-4.5 h-4.5 shrink-0" src="icons/icon-search-2.svg" alt="" />
            <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito text-[14px] leading-normal text-[#9A9A96]">{"Search by document name"}</div>
          </div>
          <div className="w-45 h-12 shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[12px] flex items-center gap-1.5 px-3.5">
            <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-normal text-[#6B6B6B]">{"Type:"}</div>
            <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[14px] leading-normal text-[#111111]">{"All"}</div>
            <img className="w-4 h-4 shrink-0" src="icons/icon-caret-down-2.svg" alt="" />
          </div>
          <div className="w-50 h-12 shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[12px] flex items-center gap-1.5 px-3.5">
            <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-normal text-[#6B6B6B]">{"Status:"}</div>
            <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[14px] leading-normal text-[#111111]">{"All"}</div>
            <img className="w-4 h-4 shrink-0" src="icons/icon-caret-down-2.svg" alt="" />
          </div>
        </div>
      </div>
      <div className="self-stretch h-10 shrink-0 bg-[#F5F5F3] rounded-[10px] flex items-center gap-5 px-4">
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-geist-mono font-medium text-[11px] leading-normal tracking-[0.01em] uppercase text-[#6B6B6B]">{"NAME"}</div>
        </div>
        <div className="w-18 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-geist-mono font-medium text-[11px] leading-normal tracking-[0.01em] uppercase text-[#6B6B6B]">{"TYPE"}</div>
        </div>
        <div className="w-21 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-geist-mono font-medium text-[11px] leading-normal tracking-[0.01em] uppercase text-[#6B6B6B]">{"SIZE"}</div>
        </div>
        <div className="w-32 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-geist-mono font-medium text-[11px] leading-normal tracking-[0.01em] uppercase text-[#6B6B6B]">{"STATUS"}</div>
        </div>
        <div className="w-28 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-geist-mono font-medium text-[11px] leading-normal tracking-[0.01em] uppercase text-[#6B6B6B]">{"UPLOADED"}</div>
        </div>
        <div className="w-30 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-geist-mono font-medium text-[11px] leading-normal tracking-[0.01em] uppercase text-[#6B6B6B]">{"LAST FETCHED"}</div>
        </div>
        <div className="w-28 shrink-0 flex items-center gap-2" />
      </div>
      <div className="self-stretch shrink-0 border-b border-[#E4E4E0] flex items-center gap-5 px-4 py-3.5">
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <div className="shrink-0 flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 bg-[#B3261E1F] rounded-[10px] flex justify-center items-center">
              <div className="shrink-0 whitespace-pre font-geist-mono font-bold text-[10px] leading-normal text-[#B3261E]">{"PDF"}</div>
            </div>
            <div className="shrink-0 flex flex-col items-start gap-0.5">
              <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-normal text-[#111111]">{"Refund policy 2026.pdf"}</div>
              <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-normal text-[#6B6B6B]">{"Uploaded by you"}</div>
            </div>
          </div>
        </div>
        <div className="w-18 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-normal text-[#444444]">{"PDF"}</div>
        </div>
        <div className="w-21 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-normal text-[#444444]">{"1.2 MB"}</div>
        </div>
        <div className="w-32 shrink-0 flex items-center gap-2">
          <div className="w-[89px] shrink-0 bg-[#2E9E664D] border border-[#2E9E66] rounded-[99px] flex justify-center items-center px-2.5 py-1">
            <div className="shrink-0 whitespace-pre font-geist-mono font-bold text-[11px] leading-[16px] tracking-[0.01em] uppercase text-[#17653F]">{"READY"}</div>
          </div>
        </div>
        <div className="w-28 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-normal text-[#444444]">{"Oct 2, 2026"}</div>
        </div>
        <div className="w-30 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-normal text-[#9A9A96]">{"—"}</div>
        </div>
        <img className="w-28 h-8 shrink-0" src="icons/actions-2.svg" alt="" />
      </div>
      <div className="self-stretch shrink-0 border-b border-[#E4E4E0] flex items-center gap-5 px-4 py-3.5">
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <div className="shrink-0 flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 bg-[#2F6FD61F] rounded-[10px] flex justify-center items-center">
              <div className="shrink-0 whitespace-pre font-geist-mono font-bold text-[10px] leading-normal text-[#2F6FD6]">{"DOCX"}</div>
            </div>
            <div className="shrink-0 flex flex-col items-start gap-0.5">
              <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-normal text-[#111111]">{"Billing FAQ.docx"}</div>
              <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-normal text-[#6B6B6B]">{"Uploaded by you"}</div>
            </div>
          </div>
        </div>
        <div className="w-18 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-normal text-[#444444]">{"DOCX"}</div>
        </div>
        <div className="w-21 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-normal text-[#444444]">{"340 KB"}</div>
        </div>
        <div className="w-32 shrink-0 flex items-center gap-2">
          <div className="w-[89px] shrink-0 bg-[#2E9E664D] border border-[#2E9E66] rounded-[99px] flex justify-center items-center px-2.5 py-1">
            <div className="shrink-0 whitespace-pre font-geist-mono font-bold text-[11px] leading-[16px] tracking-[0.01em] uppercase text-[#17653F]">{"READY"}</div>
          </div>
        </div>
        <div className="w-28 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-normal text-[#444444]">{"Oct 2, 2026"}</div>
        </div>
        <div className="w-30 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-normal text-[#9A9A96]">{"—"}</div>
        </div>
        <img className="w-28 h-8 shrink-0" src="icons/actions-2.svg" alt="" />
      </div>
      <div className="self-stretch shrink-0 border-b border-[#E4E4E0] flex items-center gap-5 px-4 py-3.5">
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <div className="shrink-0 flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 bg-[#C2410C1F] rounded-[10px] flex justify-center items-center">
              <div className="shrink-0 whitespace-pre font-geist-mono font-bold text-[10px] leading-normal text-[#C2410C]">{"URL"}</div>
            </div>
            <div className="shrink-0 flex flex-col items-start gap-0.5">
              <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-normal text-[#111111]">{"help.acme.com/billing"}</div>
              <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-normal text-[#6B6B6B]">{"Add links"}</div>
            </div>
          </div>
        </div>
        <div className="w-18 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-normal text-[#444444]">{"WEB"}</div>
        </div>
        <div className="w-21 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-normal text-[#444444]">{"42 KB"}</div>
        </div>
        <div className="w-32 shrink-0 flex items-center gap-2">
          <div className="w-[89px] shrink-0 bg-[#2E9E664D] border border-[#2E9E66] rounded-[99px] flex justify-center items-center px-2.5 py-1">
            <div className="shrink-0 whitespace-pre font-geist-mono font-bold text-[11px] leading-[16px] tracking-[0.01em] uppercase text-[#17653F]">{"READY"}</div>
          </div>
        </div>
        <div className="w-28 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-normal text-[#444444]">{"Oct 9, 2026"}</div>
        </div>
        <div className="w-30 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-normal text-[#444444]">{"Oct 15, 2026"}</div>
        </div>
        <img className="w-28 h-8 shrink-0" src="icons/actions-2.svg" alt="" />
      </div>
      <div className="self-stretch shrink-0 border-b border-[#E4E4E0] flex items-center gap-5 px-4 py-3.5">
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <div className="shrink-0 flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 bg-[#5555551F] rounded-[10px] flex justify-center items-center">
              <div className="shrink-0 whitespace-pre font-geist-mono font-bold text-[10px] leading-normal text-[#555555]">{"TXT"}</div>
            </div>
            <div className="shrink-0 flex flex-col items-start gap-0.5">
              <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-normal text-[#111111]">{"Payment methods.txt"}</div>
              <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-normal text-[#6B6B6B]">{"Uploaded by you"}</div>
            </div>
          </div>
        </div>
        <div className="w-18 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-normal text-[#444444]">{"TXT"}</div>
        </div>
        <div className="w-21 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-normal text-[#444444]">{"12 KB"}</div>
        </div>
        <div className="w-32 shrink-0 flex items-center gap-2">
          <div className="w-[89px] shrink-0 bg-[#2E9E664D] border border-[#2E9E66] rounded-[99px] flex justify-center items-center px-2.5 py-1">
            <div className="shrink-0 whitespace-pre font-geist-mono font-bold text-[11px] leading-[16px] tracking-[0.01em] uppercase text-[#17653F]">{"READY"}</div>
          </div>
        </div>
        <div className="w-28 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-normal text-[#444444]">{"Sep 30, 2026"}</div>
        </div>
        <div className="w-30 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[13px] leading-normal text-[#9A9A96]">{"—"}</div>
        </div>
        <img className="w-28 h-8 shrink-0" src="icons/actions-2.svg" alt="" />
      </div>
      <div className="self-stretch shrink-0 flex justify-between items-center pt-5">
        <div className="shrink-0 whitespace-pre font-gabarito text-[13px] leading-normal text-[#6B6B6B]">{"Showing 1–4 of 4 documents"}</div>
        <div className="shrink-0 bg-[#F4F4F2] rounded-full flex items-center gap-1.5 px-5 py-1.5">
          <div className="shrink-0 opacity-40 overflow-hidden flex items-center gap-1.5 pr-4.5">
            <img className="w-3.5 h-3.5 shrink-0" src="icons/icon-chevron-left.svg" alt="" />
            <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[12px] leading-normal tracking-[0.08em] text-[#111111]">{"PREV"}</div>
          </div>
          <div className="w-8.5 h-8.5 shrink-0 bg-[#111111] rounded-full flex justify-center items-center">
            <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-normal text-[#FFFFFF]">{"1"}</div>
          </div>
          <div className="shrink-0 opacity-40 overflow-hidden flex items-center gap-1.5 pl-4.5">
            <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[12px] leading-normal tracking-[0.08em] text-[#111111]">{"NEXT"}</div>
            <img className="w-3.5 h-3.5 shrink-0" src="icons/icon-chevron-right.svg" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
