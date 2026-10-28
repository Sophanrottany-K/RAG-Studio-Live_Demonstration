import { useState } from "react";

export function BottomInput() {
  const [value, setValue] = useState("");

  return (
    <div className="self-stretch shrink-0 bg-bg-card border-t border-border-default flex flex-col items-center gap-2.5 pt-4 pb-5">
      <div className="w-full max-w-230 shrink bg-bg-card border border-border-default rounded-[28px] shadow-[0px_5px_20px_0px_#1111111A,0px_1px_6px_0px_#1111110A] flex items-center gap-3 px-6 py-4">
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ask Billing Assistant or search official documents…"
          className="flex-1 min-w-0 bg-transparent border-0 px-0 py-0 font-gabarito text-[16px] leading-[24px] text-ink-primary placeholder:text-ink-muted focus:outline-none"
        />
        <img className="w-14 h-14 shrink-0" src="icons/app-icon-button-secondary-circle-lg.svg" alt="" />
        <button
          type="button"
          className="w-14 h-14 shrink-0 bg-transparent border-0 p-0 cursor-pointer"
          aria-label="Submit question"
        >
          <img className="w-full h-full" src="icons/app-icon-button-primary-circle-lg.svg" alt="" />
        </button>
      </div>
      <div className="shrink-0 flex items-center gap-1.5">
        <img className="w-3 h-3 shrink-0" src="icons/lock-property-linear-2.svg" alt="" />
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[12px] leading-[16px] text-ink-muted">{"Answers are generated only from official billing documents.  •  Powered by RAG Studio"}</div>
      </div>
    </div>
  );
}
