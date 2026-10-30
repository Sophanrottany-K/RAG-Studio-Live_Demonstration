// Demo 20 · [pgAns] A3 · Answer with references
// Route: #/pgAns
import { useGo } from "../lib/nav";
import { Breadcrumb2 } from "../components/shared/Breadcrumb2";
import { ChatbotSelect } from "../components/shared/ChatbotSelect";
import { Composer } from "../components/shared/Composer";
import { Head } from "../components/shared/Head";
import { Header5 } from "../components/shared/Header5";
import { PlaygroundHeader } from "../components/shared/PlaygroundHeader";
import { AppSidebar } from "../components/shared/AppSidebar";

export default function Screen20PgAns() {
  const go = useGo();
  return (
    <div className="relative w-full h-full bg-bg-card overflow-hidden flex items-start">
      <AppSidebar active="playground" />
      <div className="flex-1 min-w-0 self-stretch bg-bg-page overflow-hidden flex flex-col items-start">
        <Header5 />
        <div className="self-stretch flex-1 min-h-0 overflow-y-auto flex flex-col items-start gap-6 pt-7 pr-10 pb-10 pl-10">
          <Breadcrumb2 />
          <ChatbotSelect />
          <PlaygroundHeader />
          <div className="self-stretch flex-1 min-h-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[20px] overflow-hidden flex flex-col items-start">
            <div className="self-stretch flex-1 min-h-0 overflow-y-auto flex flex-col items-start gap-5 p-7">
              <div className="self-stretch shrink-0 overflow-hidden flex justify-end items-start">
                <div className="shrink-0 bg-[#111111] rounded-[20px] overflow-hidden flex flex-col items-start px-4.5 py-3">
                  <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-normal text-[#FFFFFF]">
                    {"What is the refund policy for annual plans?"}
                  </div>
                </div>
              </div>
              <div className="self-stretch shrink-0 flex flex-col items-start gap-3.5">
                <Head />
                <div className="w-190 shrink-0 overflow-hidden flex flex-wrap items-center gap-x-1 gap-y-0.5">
                  <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">
                    {"Annual plans can be refunded in"}
                  </div>
                  <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">
                    {"full within 30 days of purchase."}
                  </div>
                  <div
                    className="shrink-0 min-w-5 bg-bg-surface border border-border-hairline/10 rounded-[4px] flex justify-center items-center px-[5px] py-0.5 cursor-pointer"
                    onClick={go("/pgSrc")}
                  >
                    <div className="shrink-0 whitespace-pre text-center font-jet-brains-mono font-bold text-[11px] leading-[14px] text-ink-default">
                      {"1"}
                    </div>
                  </div>
                  <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">
                    {"After that, refunds are pro-rated for"}
                  </div>
                  <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">
                    {"the remaining months."}
                  </div>
                  <div className="shrink-0 min-w-5 bg-bg-surface border border-border-hairline/10 rounded-[4px] flex justify-center items-center px-[5px] py-0.5">
                    <div className="shrink-0 whitespace-pre text-center font-jet-brains-mono font-bold text-[11px] leading-[14px] text-ink-default">
                      {"3"}
                    </div>
                  </div>
                  <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">
                    {"The money goes back to the"}
                  </div>
                  <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">
                    {"original payment method in 5–7 business"}
                  </div>
                  <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">
                    {"days."}
                  </div>
                  <div className="shrink-0 min-w-5 bg-bg-surface border border-border-hairline/10 rounded-[4px] flex justify-center items-center px-[5px] py-0.5">
                    <div className="shrink-0 whitespace-pre text-center font-jet-brains-mono font-bold text-[11px] leading-[14px] text-ink-default">
                      {"2"}
                    </div>
                  </div>
                </div>
                <div className="shrink-0 overflow-hidden flex items-center gap-2.5">
                  <div
                    className="shrink-0 bg-bg-card border border-border-default rounded-full flex justify-center items-center gap-2 px-4 py-3 cursor-pointer"
                    onClick={go("/pgSrc")}
                  >
                    <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-[16px] text-ink-primary">
                      {"View retrieved sources (3)"}
                    </div>
                  </div>
                  <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-normal text-[#6B6B6B]">
                    {"GPT-4o mini · 1.8s"}
                  </div>
                </div>
              </div>
            </div>
            <Composer />
          </div>
        </div>
      </div>
    </div>
  );
}
