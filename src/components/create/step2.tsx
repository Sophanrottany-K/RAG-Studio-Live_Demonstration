// Building blocks for Create chatbot · Step 2, matching the RAG Studio web app
// (ragstudio-web-ui: create-chatbot-wizard, wizard-stepper, wizard-aside, form-field, segmented).
import type { ReactNode } from "react";
import { Check, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { initials, sourceCounts, useChatbotDraft } from "../../lib/chatbotDraft";
import { STEPS } from "./CreateStepper";

const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

/** Shared by the number and text inputs. */
export const inputClass =
  "rounded-input border border-line bg-card text-p3 text-ink placeholder:text-ink-muted tabular h-12 w-full min-w-0 px-3 py-1 outline-none transition-[color,border-color,box-shadow] focus-visible:border-accent focus-visible:ring-accent/30 focus-visible:ring-[3px]";

export const textareaClass =
  "rounded-input border border-line bg-card text-p3 text-ink placeholder:text-ink-muted field-sizing-content min-h-24 w-full px-4 py-3 outline-none transition-[color,border-color,box-shadow] focus-visible:border-accent focus-visible:ring-accent/30 focus-visible:ring-[3px] aria-invalid:border-danger";

/** Uppercase mono heading that starts a block of fields. */
export function FieldSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-5">
      <h3 className="text-eyebrow text-ink-muted font-mono uppercase">{title}</h3>
      {children}
    </section>
  );
}

/** Label row, the input, then one line of help or the error. */
export function FormField({
  htmlFor,
  label,
  required,
  hint,
  error,
  counter,
  children,
}: {
  htmlFor?: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string | null;
  counter?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={htmlFor} className="text-p4 text-ink font-bold">
          {label}
          {required && (
            <span className="text-danger-text ml-0.5" aria-hidden>
              *
            </span>
          )}
          {required && <span className="sr-only"> (required)</span>}
        </label>
        {counter && <span className="text-c1 tabular text-ink-muted">{counter}</span>}
      </div>
      {children}
      {error ? (
        <p role="alert" className="text-c1 text-danger-text">
          {error}
        </p>
      ) : hint ? (
        <p className="text-c1 text-ink-secondary">{hint}</p>
      ) : null}
    </div>
  );
}

/** Note beside a setting. The web app's is grey; `yellow` keeps this demo's highlighted notes. */
export function Note({ icon, yellow, children }: { icon: ReactNode; yellow?: boolean; children: ReactNode }) {
  return (
    <p
      className={cx(
        "rounded-small text-c1 flex items-start gap-2 px-4 py-3",
        yellow ? "bg-warning-tint text-warning-text" : "bg-subtle text-ink-secondary",
      )}
    >
      <span className={cx("mt-0.5 shrink-0", !yellow && "text-ink-muted")}>{icon}</span>
      {children}
    </p>
  );
}

/** Row of joined buttons where exactly one is picked. */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="rounded-input border border-line bg-card inline-flex h-10 w-fit items-center gap-1 p-1"
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={option === value}
          onClick={() => onChange(option)}
          className={cx(
            "rounded-small text-p4 h-full cursor-pointer px-3 transition-colors outline-none",
            option === value ? "bg-inverse text-on-inverse" : "text-ink-secondary hover:bg-subtle hover:text-ink",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

/** The step bar above the form. Steps already reached can be clicked. */
export function Step2Stepper() {
  const navigate = useNavigate();
  const { draft } = useChatbotDraft();
  const current = 2;

  return (
    <nav aria-label="Create chatbot steps" className="grid w-full grid-cols-3 gap-5">
      {STEPS.map((step) => {
        const done = step.n < current;
        const active = step.n === current;
        const reachable = step.n <= draft.reachedStep;
        return (
          <button
            key={step.n}
            type="button"
            disabled={!reachable}
            aria-current={active ? "step" : undefined}
            onClick={() => !active && navigate(step.path)}
            className={cx(
              "flex w-full flex-col items-start gap-4 text-left",
              reachable ? "cursor-pointer" : "cursor-not-allowed opacity-60",
            )}
          >
            <span
              className={cx(
                "rounded-pill h-1 w-full transition-colors",
                done ? "bg-success" : active ? "bg-inverse" : "bg-muted",
              )}
              aria-hidden
            />
            <span className="flex w-full items-start gap-3">
              <span
                className={cx(
                  "rounded-small text-p4 flex size-8 shrink-0 items-center justify-center font-bold transition-colors",
                  done
                    ? "bg-success text-on-inverse"
                    : active
                      ? "bg-inverse text-on-inverse"
                      : "bg-muted text-ink-muted",
                )}
                aria-hidden
              >
                {done ? <Check className="size-4" /> : step.n}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-eyebrow text-ink-muted font-mono uppercase">
                  {`Step ${step.n}${active ? " · current" : ""}`}
                </span>
                <span className={cx("text-s2", active ? "text-ink" : "text-ink-secondary")}>{step.title}</span>
                <span className="text-c1 text-ink-muted">{step.subtitle}</span>
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}

/** Right column: a live preview and the publish checklist. */
export function Step2Aside() {
  const { draft } = useChatbotDraft();
  const name = draft.name.trim();
  const description = draft.description.trim();
  const checklist = [
    { label: "At least 1 ready document", done: sourceCounts(draft.sources).ready > 0 },
    { label: "A chat model selected", done: Boolean(draft.settings.chatModel) },
    { label: "At least 1 channel", done: false },
  ];

  return (
    <aside className="flex flex-col gap-6">
      <section className="rounded-card-sm border border-line bg-card p-6">
        <h2 className="text-eyebrow text-ink-muted font-mono uppercase">Preview</h2>
        <div className="mt-4 flex items-start gap-3">
          <span className="bg-accent-tint text-accent text-c2 flex size-10 shrink-0 items-center justify-center rounded-full font-bold">
            {name ? initials(name) : "?"}
          </span>
          <div className="min-w-0">
            <p className="text-s1 text-ink truncate">{name || "Your chatbot"}</p>
            <span className="rounded-pill bg-neutral-tint text-neutral-text text-c2 mt-2 inline-flex min-w-20 items-center justify-center border border-current/30 px-3 py-1 font-mono tracking-widest uppercase">
              Draft
            </span>
          </div>
        </div>
        <p className="text-p4 text-ink-secondary mt-4 break-words">
          {description || "Add a description to see it here."}
        </p>
      </section>

      <section className="rounded-card-sm border border-line bg-card p-6">
        <h2 className="text-eyebrow text-ink-muted font-mono uppercase">Publish checklist</h2>
        <p className="text-c1 text-ink-secondary mt-1">All three are needed before you can publish.</p>
        <ul className="mt-4 flex flex-col gap-3">
          {checklist.map((item) => (
            <li key={item.label} className="flex items-start gap-3">
              {item.done ? (
                <Check className="text-success-text mt-0.5 size-4 shrink-0" aria-hidden />
              ) : (
                <Circle className="text-ink-disabled mt-0.5 size-4 shrink-0" aria-hidden />
              )}
              <span className={item.done ? "text-p4 text-ink" : "text-p4 text-ink-secondary"}>{item.label}</span>
              <span className="sr-only">{item.done ? " (done)" : " (not done)"}</span>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
