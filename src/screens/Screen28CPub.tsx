// Demo 28 · [cPub] A4 · Confirm publish
// Route: #/cPub
import { useGo } from "../lib/nav";
import { Actions } from "../components/shared/Actions";
import { Columns } from "../components/shared/Columns";
import { ConfigTiles3 } from "../components/shared/ConfigTiles3";
import { Info2 } from "../components/shared/Info2";
import { Stats3 } from "../components/shared/Stats3";
import { Tabs } from "../components/shared/Tabs";
import { AppSidebar } from "../components/shared/AppSidebar";

export default function Screen28CPub() {
  const go = useGo();
  return (
    <div className="relative w-full h-full bg-bg-card overflow-hidden flex items-start">
      <div className="flex-1 min-w-0 self-stretch bg-bg-card overflow-hidden flex items-start">
        <AppSidebar active="chatbots" links={{ channels: "/ch3" }} />
        <div className="flex-1 min-w-0 self-stretch bg-bg-page overflow-hidden flex flex-col items-start">
          <div className="self-stretch h-16 shrink-0 bg-bg-card border-b border-border-default flex justify-between items-center px-6">
            <div className="shrink-0 flex flex-col items-start gap-0.5 cursor-pointer" onClick={go("/list")}>
              <div className="shrink-0 flex items-center gap-2">
                <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[18px] leading-[28px] text-ink-primary">
                  {"Chatbots"}
                </div>
              </div>
              <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-[16px] text-ink-secondary">
                {"Create, manage, and configure your AI assistants."}
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-3" />
          </div>
          <div className="self-stretch flex-1 min-h-0 overflow-y-auto flex flex-col items-start">
            <div className="self-stretch flex-1 min-h-0 overflow-y-auto flex flex-col items-start gap-6 pt-7 pr-10 pb-10 pl-10">
              <div
                className="shrink-0 rounded-[8px] flex items-center gap-2 pt-1.5 pr-2.5 pb-1.5 pl-2 cursor-pointer"
                onClick={go("/list")}
              >
                <img className="w-4 h-4 shrink-0" src="icons/arrow-left-property-linear.svg" alt="" />
                <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-secondary">
                  {"Chatbots"}
                </div>
                <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-muted">
                  {"/"}
                </div>
                <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">
                  {"Billing Assistant"}
                </div>
              </div>
              <div className="self-stretch shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[20px] flex flex-col items-start gap-5 p-6">
                <div className="self-stretch shrink-0 flex items-start gap-5">
                  <Info2 />
                  <Actions />
                </div>
                <ConfigTiles3 />
              </div>
              <Tabs />
              <Stats3 />
              <Columns />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute left-0 top-0 w-full h-full bg-[#1111114D] backdrop-blur-[4px]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-140 h-[183px] bg-[#FFFFFF] rounded-[20px] shadow-[0px_16px_48px_0px_#0000001F] flex flex-col items-start">
        <div className="self-stretch shrink-0 flex items-start gap-4 pt-7 pr-8 pb-2 pl-8">
          <div className="flex-1 min-w-0 flex flex-col items-start gap-1.5">
            <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[22px] leading-normal text-[#111111]">
              {"Publish Billing Assistant?"}
            </div>
            <div className="self-stretch shrink-0 whitespace-pre-wrap font-gabarito text-[14px] leading-normal text-[#6B6B6B]">
              {"The chatbot goes live. Connect a channel so guests can reach it."}
            </div>
          </div>
          <img className="w-10 h-10 shrink-0" src="icons/close.svg" alt="" />
        </div>
        <div className="self-stretch shrink-0 flex justify-end items-center gap-3 pt-5 pr-8 pb-7 pl-8">
          <div className="shrink-0 bg-bg-card border border-border-default rounded-full flex justify-center items-center gap-2 px-6 py-3.5">
            <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[16px] leading-[20px] text-ink-primary">
              {"Cancel"}
            </div>
          </div>
          <div
            className="w-25 shrink-0 bg-bg-inverse rounded-full flex justify-center items-center gap-2 px-6 py-3.5 cursor-pointer"
            onClick={go("/active")}
          >
            <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[16px] leading-[20px] text-ink-on-dark">
              {"Publish"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
