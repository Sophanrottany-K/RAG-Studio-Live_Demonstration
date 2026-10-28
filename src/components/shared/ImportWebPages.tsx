export function ImportWebPages() {
  return (
    <div className="flex-1 min-w-0 self-stretch bg-[#FFFFFF] border border-[#E4E4E0] rounded-[16px] flex flex-col items-start gap-4 p-7">
      <div className="shrink-0 flex flex-col items-start gap-1">
        <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[18px] leading-normal text-[#111111]">{"Import web pages"}</div>
        <div className="shrink-0 whitespace-pre font-gabarito text-[13px] leading-normal text-[#6B6B6B]">{"Paste 1–10 links, one per line"}</div>
      </div>
      <div className="self-stretch shrink-0 flex flex-col items-start gap-2.5">
        <div className="self-stretch shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[12px] flex items-center gap-3 px-3.5 py-3">
          <img className="w-5 h-5 shrink-0" src="icons/link-2-property-linear-3.svg" alt="" />
          <div className="flex-1 min-w-0 flex flex-col items-start gap-0.5">
            <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-normal text-[#111111]">{"Add links"}</div>
            <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-normal text-[#6B6B6B]">{"Each link is imported as one page · preview before import"}</div>
          </div>
          <img className="w-4 h-4 shrink-0" src="icons/icon-chevron-right-2.svg" alt="" />
        </div>
      </div>
    </div>
  );
}
