export function DangerZone() {
  return (
    <div className="self-stretch shrink-0 bg-danger-tint border border-danger-border rounded-[20px] flex flex-col items-start gap-3 p-5">
      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[18px] leading-[28px] text-danger-text">{"Danger zone"}</div>
      <div className="self-stretch shrink-0 whitespace-pre-wrap font-gabarito text-[14px] leading-[20px] text-ink-body">{"Deleting permanently removes Billing Assistant, its 4 documents, vector chunks and conversation logs. Guest channels will show “This chatbot is no longer available!”"}</div>
      <div className="shrink-0 flex items-start gap-2">
        <div className="shrink-0 bg-danger-solid rounded-[20px] flex justify-center items-center gap-2 px-4 py-3">
          <img className="w-4 h-4 shrink-0" src="icons/leading.svg" alt="" />
          <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-[16px] text-ink-on-dark">{"Delete chatbot"}</div>
        </div>
      </div>
    </div>
  );
}
