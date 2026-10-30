// Demo 43 · [pg2] A6 · Playground · Test again
// Route: #/pg2
import { useState } from "react";
import { useGo } from "../lib/nav";
import { Breadcrumb } from "../components/shared/Breadcrumb";
import { ChatbotSelect } from "../components/shared/ChatbotSelect";
import { Header7 } from "../components/shared/Header7";
import { Input } from "../components/shared/Input";
import { PlaygroundHeader } from "../components/shared/PlaygroundHeader";
import { AppSidebar } from "../components/shared/AppSidebar";

export default function Screen43Pg2() {
  const go = useGo();
  const [question, setQuestion] = useState("What is the refund policy?");

  return (
    <div className="relative w-full h-full bg-bg-card overflow-hidden flex items-start">
      <AppSidebar active="playground" links={{ channels: "/ch3" }} />
      <div className="flex-1 min-w-0 self-stretch bg-bg-page overflow-hidden flex flex-col items-start">
        <Header7 />
        <div className="self-stretch flex-1 min-h-0 overflow-y-auto flex flex-col items-start gap-6 pt-7 pr-10 pb-10 pl-10">
          <Breadcrumb />
          <ChatbotSelect />
          <PlaygroundHeader />
          <div className="self-stretch flex-1 min-h-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[20px] overflow-hidden flex flex-col items-start">
            <div className="self-stretch flex-1 min-h-0 overflow-y-auto flex flex-col justify-center items-center gap-3 p-7">
              <div className="shrink-0 whitespace-pre font-gabarito font-bold text-[24px] leading-normal text-[#111111]">
                {"Ask a question to start testing"}
              </div>
              <div className="shrink-0 whitespace-pre font-gabarito text-[15px] leading-normal text-[#6B6B6B]">
                {"Answers come only from this chatbot’s knowledge base, with citations."}
              </div>
              <div className="shrink-0 overflow-hidden flex items-start gap-2.5 pt-3">
                <div className="shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-full overflow-hidden flex items-start px-4 py-2.5">
                  <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-normal text-[#444444]">
                    {"What is the refund policy?"}
                  </div>
                </div>
                <div className="shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-full overflow-hidden flex items-start px-4 py-2.5">
                  <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-normal text-[#444444]">
                    {"How do I reset my password?"}
                  </div>
                </div>
                <div className="shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-full overflow-hidden flex items-start px-4 py-2.5">
                  <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-normal text-[#444444]">
                    {"What plans do you offer?"}
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch shrink-0 overflow-hidden flex flex-col items-start px-5 py-4">
              <Input
                value={question}
                onChange={setQuestion}
                onSubmit={(value) => {
                  if (value.trim()) {
                    go("/pgAns2");
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
