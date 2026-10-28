export function ConfigurationSummary() {
  return (
    <div className="self-stretch shrink-0 bg-bg-card border border-border-default rounded-[20px] flex flex-col items-start gap-1 p-5">
      <div className="self-stretch shrink-0 flex justify-between items-center">
        <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[18px] leading-[28px] text-ink-primary">{"Configuration"}</div>
        <div className="shrink-0 rounded-[6px] flex items-center gap-1 px-2 py-1">
          <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">{"Edit"}</div>
          <img className="w-3.5 h-3.5 shrink-0" src="icons/icon-arrow-right.svg" alt="" />
        </div>
      </div>
      <div className="self-stretch h-2 shrink-0 flex flex-col items-start" />
      <div className="self-stretch shrink-0 border-b border-border-default flex justify-between items-center py-[9px]">
        <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-secondary">{"Chat model"}</div>
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">{"qwen3:8b"}</div>
      </div>
      <div className="self-stretch shrink-0 border-b border-border-default flex justify-between items-center py-[9px]">
        <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-secondary">{"Embedding model"}</div>
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">{"bge-m3 · locked"}</div>
      </div>
      <div className="self-stretch shrink-0 border-b border-border-default flex justify-between items-center py-[9px]">
        <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-secondary">{"Tone"}</div>
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">{"Professional"}</div>
      </div>
      <div className="self-stretch shrink-0 border-b border-border-default flex justify-between items-center py-[9px]">
        <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-secondary">{"Answer length"}</div>
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">{"Concise"}</div>
      </div>
      <div className="self-stretch shrink-0 border-b border-border-default flex justify-between items-center py-[9px]">
        <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-secondary">{"Formatting"}</div>
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">{"Rich text"}</div>
      </div>
      <div className="self-stretch shrink-0 border-b border-border-default flex justify-between items-center py-[9px]">
        <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-secondary">{"Language"}</div>
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">{"Auto-detect · KM / EN / KO"}</div>
      </div>
      <div className="self-stretch shrink-0 border-b border-border-default flex justify-between items-center py-[9px]">
        <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-secondary">{"Temperature"}</div>
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">{"0.40"}</div>
      </div>
      <div className="self-stretch shrink-0 border-b border-border-default flex justify-between items-center py-[9px]">
        <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-secondary">{"Top K · Search"}</div>
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">{"5 · Hybrid"}</div>
      </div>
      <div className="self-stretch shrink-0 border-b border-border-default flex justify-between items-center py-[9px]">
        <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-secondary">{"Max response length"}</div>
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">{"1,024 tokens"}</div>
      </div>
      <div className="self-stretch shrink-0 border-b border-border-default flex justify-between items-center py-[9px]">
        <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-secondary">{"Max context size"}</div>
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">{"4,000 tokens"}</div>
      </div>
      <div className="self-stretch shrink-0 border-b border-border-default flex justify-between items-center py-[9px]">
        <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-secondary">{"Chunk size / overlap"}</div>
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">{"500 / 50 tokens"}</div>
      </div>
      <div className="self-stretch shrink-0 border-b border-border-default flex justify-between items-center py-[9px]">
        <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-secondary">{"Starter questions"}</div>
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">{"3 of 4"}</div>
      </div>
    </div>
  );
}
