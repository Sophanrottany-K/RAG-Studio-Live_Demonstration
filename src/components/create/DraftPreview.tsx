import { displayName, initials, sourceCounts, useChatbotDraft } from "../../lib/chatbotDraft";
import { SectionLabel } from "./ui";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="self-stretch border-t border-border-default flex justify-between items-start gap-4 py-2">
      <div className="shrink-0 font-gabarito text-[12px] leading-[16px] text-ink-secondary">{label}</div>
      <div className="min-w-0 truncate text-right font-gabarito font-medium text-[12px] leading-normal text-ink-primary">
        {value}
      </div>
    </div>
  );
}

/** Live summary of the draft, shown beside every wizard step. */
export function DraftPreview({ step }: { step: 1 | 2 | 3 }) {
  const { draft } = useChatbotDraft();
  const counts = sourceCounts(draft.sources);
  const { settings } = draft;
  const questions = draft.starterQuestions.filter((q) => q.text.trim()).length;

  let documents = "None yet";
  if (counts.total) {
    documents = `${counts.total} added`;
    if (counts.busy) documents += ` · ${counts.busy} uploading`;
    if (counts.failed) documents += ` · ${counts.failed} failed`;
  }

  return (
    <div className="self-stretch shrink-0 bg-bg-card border border-border-default rounded-[20px] flex flex-col items-start gap-3.5 p-5">
      <SectionLabel>Preview</SectionLabel>
      <div className="self-stretch flex items-center gap-3">
        <div className="w-11 h-11 shrink-0 bg-bg-inverse rounded-[12px] flex justify-center items-center font-gabarito font-bold text-[16px] leading-[24px] text-ink-on-dark">
          {initials(draft.name)}
        </div>
        <div className="min-w-0 flex flex-col items-start gap-1.5">
          <div
            className={`max-w-full truncate font-gabarito font-bold text-[18px] leading-[28px] ${draft.name.trim() ? "text-ink-primary" : "text-ink-muted"}`}
          >
            {displayName(draft.name)}
          </div>
          <div className="bg-neutral-tint border border-[#D6D6D2] rounded-[20px] flex items-center gap-1.5 px-2.5 py-1">
            <div className="w-[7px] h-[7px] bg-[#8A8A86] rounded-full" />
            <div className="font-gabarito font-medium text-[12px] leading-normal text-neutral-text">Draft</div>
          </div>
        </div>
      </div>
      <div
        className={`self-stretch break-words font-gabarito text-[14px] leading-[20px] ${draft.description.trim() ? "text-ink-body" : "text-ink-muted"}`}
      >
        {draft.description.trim() || "No description yet"}
      </div>
      {step > 1 && (
        <div className="self-stretch flex flex-col items-start">
          <Row label="Chat model" value={settings.chatModel} />
          <Row label="Embedding" value={settings.embeddingModel} />
          <Row label="Tone" value={`${settings.tone} · ${settings.answerLength}`} />
          <Row label="Language" value={settings.language} />
          <Row label="Starter questions" value={questions ? `${questions} of 4` : "None"} />
          {step === 3 && <Row label="Documents" value={documents} />}
          <Row label="Status after create" value="Draft" />
        </div>
      )}
    </div>
  );
}

export function PublishChecklist() {
  const { draft } = useChatbotDraft();
  const items = [
    { label: "At least 1 document", where: "Step 3", done: sourceCounts(draft.sources).ready > 0 },
    { label: "Model selected", where: "Step 2", done: draft.reachedStep >= 3 },
    { label: "At least 1 channel", where: "After create", done: false },
  ];
  return (
    <div className="self-stretch shrink-0 bg-bg-card border border-[#ECECEA] rounded-[28px] flex flex-col items-start gap-5 p-8">
      <SectionLabel>Publish checklist</SectionLabel>
      {items.map((item) => (
        <div key={item.label} className="self-stretch h-7 flex items-center gap-4">
          <img
            className="w-7 h-7 shrink-0"
            src={item.done ? "icons/tick-circle-property-linear.svg" : "icons/marker.svg"}
            alt={item.done ? "Done" : "Not done"}
          />
          <div
            className={`flex-1 min-w-0 font-gabarito font-medium text-[16px] leading-[24px] ${item.done ? "text-ink-primary" : "text-ink-body"}`}
          >
            {item.label}
          </div>
          <div
            className={`shrink-0 font-gabarito font-medium text-[16px] leading-[24px] ${item.done ? "text-success-text" : "text-ink-muted"}`}
          >
            {item.done ? "Done" : item.where}
          </div>
        </div>
      ))}
      <div className="self-stretch h-14.5 bg-bg-card border border-border-default rounded-[20px] flex justify-center items-center px-7 py-4 font-gabarito font-bold text-[18px] leading-[24px] tracking-[0.01em] text-ink-disabled">
        Publish (finish setup first)
      </div>
    </div>
  );
}
