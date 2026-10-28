import { useGo } from "../../lib/nav";
import { UserCard } from "./UserCard";

export function Sidebar3() {
  const go = useGo();
  return (
    <div className="w-84 h-full shrink-0 bg-bg-sidebar border-r border-border-default flex flex-col items-start gap-1 px-5 py-7">
      <img className="w-[295px] h-15 shrink-0" src="icons/brand.svg" alt="" />
      <div className="shrink-0 flex items-start pt-4 pr-3 pb-2 pl-3">
        <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[11px] leading-[16px] tracking-[2.4px] uppercase text-ink-secondary">
          {"Main"}
        </div>
      </div>
      <div
        className="self-stretch shrink-0 rounded-[12px] flex items-center gap-3 p-4 cursor-pointer"
        onClick={go("/")}
      >
        <div className="flex-1 min-w-0 flex items-center gap-3">
          <img className="w-5 h-5 shrink-0" src="icons/icon-chart-pie-2.svg" alt="" />
          <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[16px] leading-[24px] text-ink-body">
            {"Analytics"}
          </div>
        </div>
      </div>
      <div
        className="self-stretch shrink-0 bg-bg-inverse rounded-[12px] flex items-center gap-3 p-4 cursor-pointer"
        onClick={go("/list")}
      >
        <div className="flex-1 min-w-0 flex items-center gap-3">
          <img className="w-5 h-5 shrink-0" src="icons/icon-chat-bubble-left-right-2.svg" alt="" />
          <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-bold text-[16px] leading-[24px] text-ink-on-dark">
            {"Chatbots"}
          </div>
        </div>
      </div>
      <div
        className="self-stretch shrink-0 rounded-[12px] flex justify-between items-center p-4 cursor-pointer"
        onClick={go("/pg")}
      >
        <div className="flex-1 min-w-0 flex items-center gap-3">
          <img className="w-5 h-5 shrink-0" src="icons/icon-beaker.svg" alt="" />
          <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[16px] leading-[24px] text-ink-body">
            {"Playground"}
          </div>
        </div>
      </div>
      <div
        className="self-stretch shrink-0 rounded-[12px] flex justify-between items-center p-4 cursor-pointer"
        onClick={go("/ch0")}
      >
        <div className="flex-1 min-w-0 flex items-center gap-3">
          <img className="w-5 h-5 shrink-0" src="icons/icon-share.svg" alt="" />
          <div className="flex-1 min-w-0 whitespace-pre-wrap font-gabarito font-medium text-[16px] leading-[24px] text-ink-body">
            {"Channels"}
          </div>
        </div>
      </div>
      <div className="self-stretch shrink-0 flex flex-col items-start pt-4" />
      <div className="flex-1 min-h-0 flex flex-col items-start" />
      <UserCard />
    </div>
  );
}
