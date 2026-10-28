export function Header8() {
  return (
    <div className="self-stretch h-16 shrink-0 bg-bg-card border-b border-border-default flex justify-between items-center px-6">
      <div className="shrink-0 flex flex-col items-start gap-0.5">
        <div className="shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[18px] leading-[28px] text-ink-primary">{"Chatbots"}</div>
        </div>
        <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-ink-secondary">{"Create, manage, and configure your AI assistants."}</div>
      </div>
      <div className="shrink-0 flex items-center gap-3" />
    </div>
  );
}
