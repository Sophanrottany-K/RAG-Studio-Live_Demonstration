// Demo 21 · [pgSrc] A3 · Source citation
// Route: #/pgSrc
import { useGo } from "../lib/nav";
import { ChatbotSelect } from "../components/shared/ChatbotSelect";
import { Composer } from "../components/shared/Composer";
import { Head } from "../components/shared/Head";
import { Header5 } from "../components/shared/Header5";
import { PlaygroundHeader } from "../components/shared/PlaygroundHeader";
import { AppSidebar } from "../components/shared/AppSidebar";

export default function Screen21PgSrc() {
  const go = useGo();
  return (
    <div className="relative w-full h-full bg-bg-card overflow-hidden flex items-start">
      <AppSidebar active="playground" links={{ chatbots: "/dPend2" }} />
      <div className="flex-1 min-w-0 self-stretch bg-bg-page overflow-hidden flex flex-col items-start">
        <Header5 />
        <div className="self-stretch flex-1 min-h-0 overflow-y-auto flex flex-col items-start gap-6 pt-7 pr-10 pb-10 pl-10">
          <div
            className="shrink-0 rounded-[8px] flex items-center gap-2 pt-1.5 pr-2.5 pb-1.5 pl-2 cursor-pointer"
            onClick={go("/dPend2")}
          >
            <img className="w-4 h-4 shrink-0" src="icons/arrow-left-property-linear.svg" alt="" />
            <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-secondary">{"Chatbots"}</div>
            <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-muted">{"/"}</div>
            <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-[#6B6B6B]">{"Test Playground"}</div>
            <div className="shrink-0 whitespace-pre font-gabarito text-[14px] leading-[20px] text-ink-muted">{"/"}</div>
            <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">{"Billing Assistant"}</div>
          </div>
          <ChatbotSelect />
          <PlaygroundHeader />
          <div className="self-stretch flex-1 min-h-0 overflow-hidden flex items-start gap-6">
            <div className="flex-1 min-w-0 self-stretch bg-[#FFFFFF] border border-[#E4E4E0] rounded-[20px] overflow-hidden flex flex-col items-start">
              <div className="self-stretch flex-1 min-h-0 overflow-y-auto flex flex-col items-start gap-5 p-7">
                <div className="self-stretch shrink-0 overflow-hidden flex justify-end items-start">
                  <div className="shrink-0 bg-[#111111] rounded-[20px] overflow-hidden flex flex-col items-start px-4.5 py-3">
                    <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-normal text-[#FFFFFF]">{"What is the refund policy for annual plans?"}</div>
                  </div>
                </div>
                <div className="self-stretch shrink-0 flex flex-col items-start gap-3.5">
                  <Head />
                  <div className="w-190 shrink-0 overflow-hidden flex flex-wrap items-center gap-x-1 gap-y-0.5">
                    <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">{"Annual plans can be refunded in"}</div>
                    <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">{"full within 30 days of purchase."}</div>
                    <div className="shrink-0 min-w-5 bg-bg-surface border border-border-hairline/10 rounded-[4px] flex justify-center items-center px-[5px] py-0.5">
                      <div className="shrink-0 whitespace-pre text-center font-jet-brains-mono font-bold text-[11px] leading-[14px] text-ink-default">{"1"}</div>
                    </div>
                    <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">{"After that, refunds are pro-rated for"}</div>
                    <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">{"the remaining months."}</div>
                    <div className="shrink-0 min-w-5 bg-bg-surface border border-border-hairline/10 rounded-[4px] flex justify-center items-center px-[5px] py-0.5">
                      <div className="shrink-0 whitespace-pre text-center font-jet-brains-mono font-bold text-[11px] leading-[14px] text-ink-default">{"3"}</div>
                    </div>
                    <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">{"The money goes back to the"}</div>
                    <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">{"original payment method in 5–7 business"}</div>
                    <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-[24px] text-ink-body-2">{"days."}</div>
                    <div className="shrink-0 min-w-5 bg-bg-surface border border-border-hairline/10 rounded-[4px] flex justify-center items-center px-[5px] py-0.5">
                      <div className="shrink-0 whitespace-pre text-center font-jet-brains-mono font-bold text-[11px] leading-[14px] text-ink-default">{"2"}</div>
                    </div>
                  </div>
                  <div className="shrink-0 overflow-hidden flex items-center gap-2.5">
                    <div className="shrink-0 bg-bg-inverse rounded-full flex justify-center items-center gap-2 px-4 py-3">
                      <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[14px] leading-[16px] text-ink-on-dark">{"Hide retrieved sources"}</div>
                    </div>
                    <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-normal text-[#6B6B6B]">{"GPT-4o mini · 1.8s"}</div>
                  </div>
                </div>
              </div>
              <Composer />
            </div>
            <div className="w-100 self-stretch shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[20px] overflow-hidden flex flex-col items-start gap-3.5 p-5">
              <div className="self-stretch shrink-0 overflow-hidden flex justify-between items-center">
                <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[18px] leading-normal text-[#111111]">{"Retrieved sources"}</div>
                <div className="shrink-0 bg-[#F5F5F3] rounded-full overflow-hidden flex items-start px-2.5 py-1">
                  <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[12px] leading-normal text-[#444444]">{"3 passages"}</div>
                </div>
              </div>
              <div className="self-stretch shrink-0 whitespace-pre-wrap font-gabarito text-[13px] leading-normal text-[#6B6B6B]">{"Source documents and the passages matched for the last answer."}</div>
              <div className="self-stretch shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[16px] overflow-hidden flex flex-col items-start gap-2 p-3.5">
                <div className="self-stretch shrink-0 overflow-hidden flex items-center gap-2">
                  <div className="shrink-0 bg-bg-sidebar-dark rounded-full overflow-hidden flex items-start px-2.5 py-1">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[12px] leading-normal text-ink-on-dark">{"1"}</div>
                  </div>
                  <div className="flex-1 min-w-0 whitespace-pre-wrap truncate font-gabarito font-medium text-[14px] leading-normal text-[#111111]">{"Refund-policy-2026.pdf"}</div>
                  <div className="shrink-0 bg-[#E7F6EC] rounded-full overflow-hidden flex items-start px-2.5 py-1">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[12px] leading-normal text-[#1A7F37]">{"92% match"}</div>
                  </div>
                </div>
                <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-normal text-[#6B6B6B]">{"Page 4 · Chunk 12"}</div>
                <div className="self-stretch shrink-0 bg-[#F5F5F3] rounded-[10px] overflow-hidden flex flex-col items-start px-3 py-2.5">
                  <div className="self-stretch shrink-0 whitespace-pre-wrap font-gabarito text-[13px] leading-[19px] text-[#444444]">{"Customers may request a full refund within 30 days of purchase, provided the subscription has not been renewed."}</div>
                </div>
                <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[12px] leading-normal text-[#111111]">{"Open source document →"}</div>
              </div>
              <div className="self-stretch shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[16px] overflow-hidden flex flex-col items-start gap-2 p-3.5">
                <div className="self-stretch shrink-0 overflow-hidden flex items-center gap-2">
                  <div className="shrink-0 bg-bg-sidebar-dark rounded-full overflow-hidden flex items-start px-2.5 py-1">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[12px] leading-normal text-ink-on-dark">{"2"}</div>
                  </div>
                  <div className="flex-1 min-w-0 whitespace-pre-wrap truncate font-gabarito font-medium text-[14px] leading-normal text-[#111111]">{"Billing FAQ.docx"}</div>
                  <div className="shrink-0 bg-[#E7F6EC] rounded-full overflow-hidden flex items-start px-2.5 py-1">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[12px] leading-normal text-[#1A7F37]">{"87% match"}</div>
                  </div>
                </div>
                <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-normal text-[#6B6B6B]">{"Section 2 · Chunk 5"}</div>
                <div className="self-stretch shrink-0 bg-[#F5F5F3] rounded-[10px] overflow-hidden flex flex-col items-start px-3 py-2.5">
                  <div className="self-stretch shrink-0 whitespace-pre-wrap font-gabarito text-[13px] leading-[19px] text-[#444444]">{"Refunds are returned to the original payment method and usually arrive in 5–7 business days."}</div>
                </div>
                <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[12px] leading-normal text-[#111111]">{"Open source document →"}</div>
              </div>
              <div className="self-stretch shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[16px] overflow-hidden flex flex-col items-start gap-2 p-3.5">
                <div className="self-stretch shrink-0 overflow-hidden flex items-center gap-2">
                  <div className="shrink-0 bg-bg-sidebar-dark rounded-full overflow-hidden flex items-start px-2.5 py-1">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[12px] leading-normal text-ink-on-dark">{"3"}</div>
                  </div>
                  <div className="flex-1 min-w-0 whitespace-pre-wrap truncate font-gabarito font-medium text-[14px] leading-normal text-[#111111]">{"Terms-of-service.pdf"}</div>
                  <div className="shrink-0 bg-[#E7F6EC] rounded-full overflow-hidden flex items-start px-2.5 py-1">
                    <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[12px] leading-normal text-[#1A7F37]">{"74% match"}</div>
                  </div>
                </div>
                <div className="shrink-0 whitespace-pre font-gabarito text-[12px] leading-normal text-[#6B6B6B]">{"Page 11 · Chunk 31"}</div>
                <div className="self-stretch shrink-0 bg-[#F5F5F3] rounded-[10px] overflow-hidden flex flex-col items-start px-3 py-2.5">
                  <div className="self-stretch shrink-0 whitespace-pre-wrap font-gabarito text-[13px] leading-[19px] text-[#444444]">{"Annual plans are refundable on a pro-rated basis after the first 30 days."}</div>
                </div>
                <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[12px] leading-normal text-[#111111]">{"Open source document →"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
