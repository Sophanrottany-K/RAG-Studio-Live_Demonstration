import { useGo } from "../../lib/nav";

export function Breadcrumb6() {
  const go = useGo();
  return (
    <div className="shrink-0 rounded-[8px] flex items-center gap-2 pt-1.5 pr-2.5 pb-1.5 pl-2 cursor-pointer" onClick={go("/list")}>
      <img className="w-4 h-4 shrink-0" src="icons/arrow-left-property-linear.svg" alt="" />
      <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-secondary">{"Chatbots"}</div>
      <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-muted">{"/"}</div>
      <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">{"Create chatbot"}</div>
    </div>
  );
}
