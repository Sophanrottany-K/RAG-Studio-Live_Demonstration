import { TableHeader } from "./TableHeader";

export function DocumentsTable() {
  return (
    <div className="self-stretch shrink-0 bg-[#FFFFFF] border border-border-default rounded-[16px] overflow-hidden flex flex-col items-start">
      <TableHeader />
      <div className="self-stretch shrink-0 border-b border-[#ECECEA] flex items-center gap-4 px-4 py-3">
        <div className="flex-1 min-w-0 flex items-center gap-2.5">
          <div className="shrink-0 flex flex-col items-start gap-0.5">
            <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-[#111111]">{"Refund policy 2026.pdf"}</div>
          </div>
        </div>
        <div className="w-21 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-[#6B6B6B]">{"PDF"}</div>
        </div>
        <div className="w-21 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-[#6B6B6B]">{"2.4 MB"}</div>
        </div>
        <div className="w-21 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-[#6B6B6B]">{"96"}</div>
        </div>
        <div className="w-28 shrink-0 flex items-center gap-2">
          <div className="shrink-0 bg-success-tint border border-[#B7E2C8] rounded-[20px] flex items-center gap-1 px-[7px] py-0.5">
            <div className="w-[5px] h-[5px] shrink-0 bg-success-solid rounded-full" />
            <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[10px] leading-[14px] tracking-[0.3px] text-success-text">{"READY"}</div>
          </div>
        </div>
      </div>
      <div className="self-stretch shrink-0 border-b border-[#ECECEA] flex items-center gap-4 px-4 py-3">
        <div className="flex-1 min-w-0 flex items-center gap-2.5">
          <div className="shrink-0 flex flex-col items-start gap-0.5">
            <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-[#111111]">{"Billing FAQ.docx"}</div>
          </div>
        </div>
        <div className="w-21 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-[#6B6B6B]">{"DOCX"}</div>
        </div>
        <div className="w-21 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-[#6B6B6B]">{"120 KB"}</div>
        </div>
        <div className="w-21 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-[#6B6B6B]">{"14"}</div>
        </div>
        <div className="w-28 shrink-0 flex items-center gap-2">
          <div className="shrink-0 bg-success-tint border border-[#B7E2C8] rounded-[20px] flex items-center gap-1 px-[7px] py-0.5">
            <div className="w-[5px] h-[5px] shrink-0 bg-success-solid rounded-full" />
            <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[10px] leading-[14px] tracking-[0.3px] text-success-text">{"READY"}</div>
          </div>
        </div>
      </div>
      <div className="self-stretch shrink-0 flex items-center gap-4 px-4 py-3">
        <div className="flex-1 min-w-0 flex items-center gap-2.5">
          <div className="shrink-0 flex flex-col items-start gap-0.5">
            <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-[#111111]">{"help.acme.com/billing"}</div>
          </div>
        </div>
        <div className="w-21 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-[#6B6B6B]">{"WEB"}</div>
        </div>
        <div className="w-21 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-[#6B6B6B]">{"42 KB"}</div>
        </div>
        <div className="w-21 shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-[#6B6B6B]">{"6"}</div>
        </div>
        <div className="w-28 shrink-0 flex items-center gap-2">
          <div className="shrink-0 bg-success-tint border border-[#B7E2C8] rounded-[20px] flex items-center gap-1 px-[7px] py-0.5">
            <div className="w-[5px] h-[5px] shrink-0 bg-success-solid rounded-full" />
            <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[10px] leading-[14px] tracking-[0.3px] text-success-text">{"READY"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
