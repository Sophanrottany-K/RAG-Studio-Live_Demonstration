// Building blocks for Create chatbot · Step 2, matching the RAG Studio web app
// (ragstudio-web-ui: create-chatbot-wizard, wizard-stepper, wizard-aside, form-field, segmented).
// The settings fields are also used by the Configuration tab of the chatbot detail page.
import { useState, type ReactNode } from "react";
import { Check, ChevronDown, Circle, Plus, ShieldCheck, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { initials, sourceCounts, useChatbotDraft } from "../../lib/chatbotDraft";
import { INSTRUCTIONS_MAX, STARTER_QUESTIONS_MAX, STARTER_QUESTION_MAX } from "../../services/limits";
import type { AdvancedSettings, ChatbotSettings, ModelCatalog, SearchMode } from "../../services/types";
import { Select } from "../analytics/Select";
import { STEPS } from "./CreateStepper";
import { Banner, Toggle } from "./ui";

const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

const TONES = ["Professional", "Friendly", "Casual", "Formal"] as const;
const LENGTHS = ["Concise", "Detailed"] as const;
const FORMATS = ["Rich text", "Plain text only"] as const;
const LANGUAGES = ["Auto-detect", "English", "Khmer", "Korean"];
const VISIBILITY = ["Full document", "Name only", "Hidden"] as const;
export const WIZARD_VISIBILITY = ["Full document", "Name only"] as const;
const SEARCH_MODES: { value: SearchMode; label: string }[] = [
  { value: "Hybrid", label: "Hybrid (keyword + meaning)" },
  { value: "Semantic", label: "Meaning only" },
  { value: "Keyword", label: "Keyword only" },
];

export const modelOptions = (models: ModelCatalog["chat"] = []) =>
  models.map((m) => ({ value: m.id, label: m.isDefault ? `${m.label} · default` : m.label }));

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

type BehaviorSettings = Pick<
  ChatbotSettings,
  "instructions" | "tone" | "answerLength" | "formatting" | "language" | "sourceVisibility"
>;

/** The "Behavior" and "Answer behavior" blocks of fields. */
export function BehaviorFields({
  settings,
  onChange,
  instructionsError,
  visibilityOptions = VISIBILITY,
}: {
  settings: BehaviorSettings;
  onChange: (change: Partial<BehaviorSettings>) => void;
  /** Shown under the system instructions; null when there is nothing to report yet. */
  instructionsError: string | null;
  /** The create wizard leaves out "Hidden"; the Configuration tab still offers all three. */
  visibilityOptions?: readonly ChatbotSettings["sourceVisibility"][];
}) {
  return (
    <>
      <FieldSection title="Behavior">
        <FormField
          htmlFor="instructions"
          label="System instructions"
          hint="Tells the chatbot who it is and how to answer."
          error={instructionsError}
        >
          <textarea
            id="instructions"
            rows={4}
            maxLength={INSTRUCTIONS_MAX}
            aria-invalid={!!instructionsError || undefined}
            value={settings.instructions}
            placeholder="You are the support assistant for Acme. Answer only from the documents."
            onChange={(e) => onChange({ instructions: e.target.value })}
            className={textareaClass}
          />
        </FormField>
        <FormField label="Tone preset">
          <Segmented
            label="Tone preset"
            options={TONES}
            value={settings.tone}
            onChange={(tone) => onChange({ tone })}
          />
        </FormField>
      </FieldSection>

      <FieldSection title="Answer behavior">
        <div className="flex flex-wrap gap-8">
          <FormField label="Answer length">
            <Segmented
              label="Answer length"
              options={LENGTHS}
              value={settings.answerLength}
              onChange={(answerLength) => onChange({ answerLength })}
            />
          </FormField>
          <FormField label="Formatting">
            <Segmented
              label="Formatting"
              options={FORMATS}
              value={settings.formatting}
              onChange={(formatting) => onChange({ formatting })}
            />
          </FormField>
        </div>
        <FormField
          label="Language"
          hint="Supports English, Khmer and Korean. Auto-detect replies in whichever of these the guest writes in."
        >
          <Select
            label="Language"
            options={LANGUAGES.map((l) => ({ value: l, label: l }))}
            value={settings.language}
            onChange={(language) => onChange({ language })}
          />
        </FormField>
        <FormField label="Source visibility" hint="How much of a cited source a guest may open.">
          <Segmented
            label="Source visibility"
            options={visibilityOptions}
            value={settings.sourceVisibility}
            onChange={(sourceVisibility) => onChange({ sourceVisibility })}
          />
        </FormField>
      </FieldSection>
    </>
  );
}

export type StarterQuestion = { id: string; text: string };

export const starterQuestionId = () => Math.random().toString(36).slice(2, 10);

/** The list of starter questions: add, remove, drag to reorder. */
export function StarterQuestionsField({
  questions,
  onChange,
}: {
  questions: StarterQuestion[];
  onChange: (next: StarterQuestion[]) => void;
}) {
  const [text, setText] = useState("");
  const [dragging, setDragging] = useState<string | null>(null);
  const full = questions.length >= STARTER_QUESTIONS_MAX;

  const add = () => {
    const question = text.trim();
    if (!question || full) return;
    onChange([...questions, { id: starterQuestionId(), text: question }]);
    setText("");
  };
  const move = (fromId: string, toId: string) => {
    const from = questions.findIndex((q) => q.id === fromId);
    const to = questions.findIndex((q) => q.id === toId);
    if (from < 0 || to < 0 || from === to) return;
    const next = [...questions];
    next.splice(to, 0, next.splice(from, 1)[0]);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor="starter-question-new" className="text-p4 text-ink font-bold">
          Starter questions
        </label>
        <span className="text-c1 text-ink-muted tabular">{`${questions.length}/${STARTER_QUESTIONS_MAX}`}</span>
      </div>

      {questions.length > 0 && (
        <ul className="flex flex-col gap-2">
          {questions.map((q) => (
            <li
              key={q.id}
              draggable
              title="Drag to reorder"
              onDragStart={() => setDragging(q.id)}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragging) move(dragging, q.id);
              }}
              onDragEnd={() => setDragging(null)}
              className={`rounded-input border border-line bg-subtle flex cursor-grab items-center gap-2 px-4 py-2 active:cursor-grabbing ${dragging === q.id ? "opacity-50" : ""}`}
            >
              <span className="text-p3 text-ink-body flex-1 truncate">{q.text}</span>
              <button
                type="button"
                aria-label={`Remove "${q.text}"`}
                onClick={() => onChange(questions.filter((x) => x.id !== q.id))}
                className="rounded-small text-ink-muted hover:bg-card hover:text-danger-text inline-flex size-8 cursor-pointer items-center justify-center transition-colors"
              >
                <X className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      {!full && (
        <div className="flex gap-2">
          <input
            id="starter-question-new"
            value={text}
            maxLength={STARTER_QUESTION_MAX}
            placeholder="How do I get a refund?"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              // Enter adds the question instead of submitting the whole form.
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            className={inputClass}
          />
          <button
            type="button"
            onClick={add}
            disabled={!text.trim()}
            className="rounded-input border border-line text-btn-sm text-ink hover:bg-subtle inline-flex h-12 shrink-0 cursor-pointer items-center gap-2 px-4 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="size-4" aria-hidden />
            Add
          </button>
        </div>
      )}

      <p className="text-c1 text-ink-secondary">
        {full
          ? `You have all ${STARTER_QUESTIONS_MAX} starter questions. Remove one to add another.`
          : "Shown as buttons when a guest opens the chat."}
      </p>
    </div>
  );
}

/** How far answers may stray from the documents. */
export function GroundingNote({ documentsOnly }: { documentsOnly: boolean }) {
  return (
    <FieldSection title="Grounding and citations">
      <Note icon={<ShieldCheck className="size-4" aria-hidden />}>
        {documentsOnly
          ? "Answers always come only from your documents, with citations."
          : "Answers come from your documents first, with citations, and may use general knowledge."}
      </Note>
    </FieldSection>
  );
}

function NumberField({
  name,
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step,
}: {
  name: string;
  label: string;
  hint: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step: number;
}) {
  return (
    <FormField htmlFor={name} label={label} hint={hint}>
      <input
        id={name}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          // An empty box gives NaN. Keep the old value until a number is typed.
          const next = e.target.valueAsNumber;
          if (!Number.isNaN(next)) onChange(next);
        }}
        className={inputClass}
      />
    </FormField>
  );
}

/** The fold-out "Advanced configuration" panel: generation, retrieval and chunking. */
export function AdvancedPanel({
  advanced,
  onChange,
  open,
  onToggle,
  error,
}: {
  advanced: AdvancedSettings;
  onChange: (change: Partial<AdvancedSettings>) => void;
  open: boolean;
  onToggle: () => void;
  error: string | null;
}) {
  return (
    <div className="rounded-card-sm border border-line">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center gap-4 px-6 py-5 text-left"
      >
        <span className="flex-1">
          <span className="text-s2 text-ink block">Advanced configuration</span>
          <span className="text-c1 text-ink-secondary block">
            Generation, retrieval and chunking. The defaults work for most chatbots.
          </span>
        </span>
        <ChevronDown
          className={`text-ink-muted size-5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <div className="border-t border-line flex flex-col gap-8 px-6 py-6">
          {error && <Banner tone="danger">{error}</Banner>}
          <FieldSection title="Generation">
            <div className="grid grid-cols-2 gap-5">
              <NumberField
                name="temperature"
                label="Temperature"
                hint="Lower is more exact. Higher is more varied. 0–1."
                value={advanced.temperature}
                onChange={(temperature) => onChange({ temperature })}
                min={0}
                max={1}
                step={0.1}
              />
            </div>
          </FieldSection>
          <FieldSection title="Retrieval">
            <div className="grid grid-cols-2 gap-5">
              <NumberField
                name="topK"
                label="Top K results"
                hint="How many chunks to read before answering. 1–20."
                value={advanced.topK}
                onChange={(topK) => onChange({ topK })}
                min={1}
                max={20}
                step={1}
              />
              <FormField label="Search mode" hint="Hybrid works best for most knowledge bases.">
                <Select
                  label="Search mode"
                  options={SEARCH_MODES}
                  value={advanced.searchMode}
                  onChange={(searchMode) => onChange({ searchMode: searchMode as SearchMode })}
                />
              </FormField>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="text-p4 text-ink font-bold">Answer only from documents</div>
                <div className="text-c1 text-ink-secondary">
                  When off, the chatbot may use general knowledge if documents don't cover a question.
                </div>
              </div>
              <Toggle
                label="Answer only from documents"
                checked={advanced.documentsOnly}
                onChange={(documentsOnly) => onChange({ documentsOnly })}
              />
            </div>
          </FieldSection>
          <FieldSection title="Chunking">
            <div className="grid grid-cols-2 gap-5">
              <NumberField
                name="chunkSize"
                label="Chunk size"
                hint="Tokens per chunk. 100–2000."
                value={advanced.chunkSize}
                onChange={(chunkSize) => onChange({ chunkSize })}
                min={100}
                max={2000}
                step={50}
              />
              <NumberField
                name="chunkOverlap"
                label="Chunk overlap"
                hint="Tokens repeated between chunks."
                value={advanced.chunkOverlap}
                onChange={(chunkOverlap) => onChange({ chunkOverlap })}
                min={0}
                step={10}
              />
            </div>
          </FieldSection>
        </div>
      )}
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
