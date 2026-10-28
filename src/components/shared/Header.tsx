import { useGo } from "../../lib/nav";

export function Header() {
  const go = useGo();
  return (
    <div className="self-stretch h-16 shrink-0 bg-bg-card border-b border-border-default flex justify-between items-center px-6">
      <div className="shrink-0 flex flex-col items-start gap-0.5 cursor-pointer" onClick={go("/ch3")}>
        <div className="shrink-0 flex items-center gap-2">
          <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[18px] leading-[28px] text-ink-primary">{"Channels"}</div>
        </div>
        <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-ink-secondary">{"Connect your assistants to the places your audience uses."}</div>
      </div>
      <div className="shrink-0 flex items-center gap-3" />
    </div>
  );
}
