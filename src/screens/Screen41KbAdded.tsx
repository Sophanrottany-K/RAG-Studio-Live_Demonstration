// Demo 41 · [kbAdded] A6 · Knowledge base · Processing
// Route: #/kbAdded
import { useAutoNext } from "../lib/nav";
import { Breadcrumb3 } from "../components/shared/Breadcrumb3";
import { ChatbotHeader } from "../components/shared/ChatbotHeader";
import { Header3 } from "../components/shared/Header3";
import { KnowledgeBase } from "../components/shared/KnowledgeBase";
import { SidebarUserV22 } from "../components/shared/SidebarUserV22";
import { Tabs2 } from "../components/shared/Tabs2";
import { Toast } from "../components/shared/Toast";

export default function Screen41KbAdded() {
  useAutoNext("/kbReady", 2500);
  return (
    <div className="relative w-full h-full bg-bg-card overflow-hidden flex items-start">
      <div className="w-full h-full shrink-0 bg-bg-card overflow-hidden flex items-start">
        <SidebarUserV22 />
        <div className="flex-1 min-w-0 self-stretch bg-bg-page overflow-hidden flex flex-col items-start">
          <Header3 />
          <div className="self-stretch flex-1 min-h-0 overflow-y-auto flex flex-col items-start">
            <div className="self-stretch shrink-0 overflow-hidden flex flex-col items-start gap-6 pt-7 pr-10 pb-10 pl-10">
              <Breadcrumb3 />
              <ChatbotHeader />
              <Tabs2 />
              <KnowledgeBase />
            </div>
          </div>
        </div>
      </div>
      <Toast />
    </div>
  );
}
