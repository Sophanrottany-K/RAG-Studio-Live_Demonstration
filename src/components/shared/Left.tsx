import { CardHeader3 } from "./CardHeader3";
import { DocumentsTable } from "./DocumentsTable";
import { StarterQuestions } from "./StarterQuestions";

export function Left() {
  return (
    <div className="flex-1 min-w-0 flex flex-col items-start gap-6">
      <div className="self-stretch shrink-0 bg-bg-card border border-border-default rounded-[20px] flex flex-col items-start gap-3 p-6">
        <CardHeader3 />
        <DocumentsTable />
        <div className="self-stretch shrink-0 whitespace-pre-wrap font-gabarito text-[12px] leading-[16px] text-ink-secondary">{"Showing 3 of 4 documents"}</div>
      </div>
      <StarterQuestions />
    </div>
  );
}
