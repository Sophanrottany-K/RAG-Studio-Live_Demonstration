export function StarterQuestions() {
  return (
    <div className="self-stretch shrink-0 bg-bg-card border border-border-default rounded-[20px] flex flex-col items-start gap-3 p-6">
      <div className="self-stretch shrink-0 flex justify-between items-center">
        <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[18px] leading-[28px] text-ink-primary">{"Starter questions"}</div>
        <div className="shrink-0 rounded-[6px] flex items-center gap-1 px-2 py-1">
          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">{"Edit"}</div>
          <img className="w-3.5 h-3.5 shrink-0" src="icons/icon-arrow-right.svg" alt="" />
        </div>
      </div>
      <div className="self-stretch shrink-0 flex flex-wrap items-start gap-x-2 gap-y-2">
        <div className="shrink-0 bg-bg-subtle rounded-[20px] flex items-center gap-1.5 px-3 py-2">
          <img className="w-3.5 h-3.5 shrink-0" src="icons/message-text-property-linear.svg" alt="" />
          <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-primary">{"How do I get a refund?"}</div>
        </div>
        <div className="shrink-0 bg-bg-subtle rounded-[20px] flex items-center gap-1.5 px-3 py-2">
          <img className="w-3.5 h-3.5 shrink-0" src="icons/message-text-property-linear.svg" alt="" />
          <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-primary">{"How do I change my payment method?"}</div>
        </div>
        <div className="shrink-0 bg-bg-subtle rounded-[20px] flex items-center gap-1.5 px-3 py-2">
          <img className="w-3.5 h-3.5 shrink-0" src="icons/message-text-property-linear.svg" alt="" />
          <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-primary">{"Where can I download my invoice?"}</div>
        </div>
      </div>
    </div>
  );
}
