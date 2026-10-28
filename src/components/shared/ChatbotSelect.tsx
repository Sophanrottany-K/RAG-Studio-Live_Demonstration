import { useState } from "react";

const chatbotOptions = ["Billing Assistant", "Support Copilot", "Finance Bot", "Ops Guide"];

export function ChatbotSelect() {
  const [selectedChatbot, setSelectedChatbot] = useState(chatbotOptions[0]);

  return (
    <div className="w-115 shrink-0 flex flex-col items-start gap-1.5">
      <div className="shrink-0 whitespace-pre font-gabarito font-medium text-[14px] leading-normal text-[#111111]">{"Selected chatbot"}</div>
      <div className="self-stretch shrink-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-[12px] overflow-hidden flex items-center px-4 py-[13px]">
        <select
          value={selectedChatbot}
          onChange={(event) => setSelectedChatbot(event.target.value)}
          className="flex-1 min-w-0 appearance-none bg-transparent font-gabarito text-[15px] leading-normal text-[#111111] focus:outline-none"
          aria-label="Selected chatbot"
        >
          {chatbotOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <img className="w-[9px] h-1.5 shrink-0 ml-3" src="icons/polygon.svg" alt="" />
      </div>
    </div>
  );
}
