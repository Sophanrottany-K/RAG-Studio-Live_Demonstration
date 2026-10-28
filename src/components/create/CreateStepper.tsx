import { useNavigate } from "react-router-dom";
import { useChatbotDraft } from "../../lib/chatbotDraft";

export const STEPS = [
  { n: 1, title: "Basic info", subtitle: "Name and description", path: "/s1e" },
  { n: 2, title: "Model and behavior", subtitle: "Models, tone, language", path: "/s2" },
  { n: 3, title: "Knowledge base", subtitle: "Optional · skippable", path: "/s3e" },
] as const;

/** current = 4 marks every step done (after the chatbot is created). */
export function CreateStepper({ current }: { current: 1 | 2 | 3 | 4 }) {
  const navigate = useNavigate();
  const { draft } = useChatbotDraft();

  return (
    <nav
      aria-label="Create chatbot steps"
      className="self-stretch shrink-0 bg-bg-card border border-border-default rounded-[20px] flex items-start gap-4 p-5"
    >
      {STEPS.map((step) => {
        const state = step.n < current ? "done" : step.n === current ? "current" : "upcoming";
        // Users can jump back to any step they already unlocked (not after creation).
        const clickable = current !== 4 && step.n !== current && step.n <= draft.reachedStep;
        return (
          <button
            key={step.n}
            type="button"
            disabled={!clickable}
            aria-current={state === "current" ? "step" : undefined}
            onClick={() => navigate(step.path)}
            className={`flex-1 min-w-0 flex flex-col items-start gap-3 text-left rounded-[12px] ${clickable ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
          >
            <div
              className={`self-stretch h-1 rounded-[20px] ${state === "done" ? "bg-success-solid" : state === "current" ? "bg-bg-inverse" : "bg-border-default"}`}
            />
            <div className="flex items-center gap-2.5">
              {state === "done" ? (
                <img className="w-8 h-8 shrink-0" src="icons/number.svg" alt="" />
              ) : (
                <div
                  className={`w-8 h-8 shrink-0 rounded-[20px] flex justify-center items-center font-gabarito font-medium text-[14px] leading-[20px] ${
                    state === "current"
                      ? "bg-bg-inverse text-ink-on-dark"
                      : "bg-bg-card border border-border-dashed text-ink-secondary"
                  }`}
                >
                  {step.n}
                </div>
              )}
              <div className="flex flex-col items-start">
                <div
                  className={`font-gabarito font-medium text-[11px] leading-[16px] tracking-[2.4px] uppercase ${state === "done" ? "text-success-text" : "text-ink-secondary"}`}
                >
                  {state === "done"
                    ? `Step ${step.n} · Done`
                    : state === "current"
                      ? `Step ${step.n} · Current`
                      : `Step ${step.n}`}
                </div>
                <div
                  className={`font-gabarito font-bold text-[16px] leading-[24px] ${state === "upcoming" ? "text-ink-secondary" : "text-ink-primary"}`}
                >
                  {step.title}
                </div>
                <div className="font-gabarito text-[12px] leading-[16px] text-ink-secondary">{step.subtitle}</div>
              </div>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
