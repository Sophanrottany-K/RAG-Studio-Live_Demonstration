// Create chatbot · Step 2 · Model and behavior
// Routes: #/s2, #/s2q
// Looks like step 2 of the RAG Studio web app (ragstudio-web-ui, /chatbots/new). The options and
// settings stay this demo's, since the mock server reads them.
import { useEffect, useState } from "react";
import { ChevronDown, Lock, Plus, ShieldCheck, X } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { Select } from "../components/analytics/Select";
import {
  FieldSection,
  FormField,
  Note,
  Segmented,
  Step2Aside,
  Step2Stepper,
  inputClass,
  textareaClass,
} from "../components/create/step2";
import { Banner, Toggle } from "../components/create/ui";
import { Sidebar2 } from "../components/shared/Sidebar2";
import { useChatbotDraft } from "../lib/chatbotDraft";
import { api, errorMessage, isAbort } from "../services/api";
import { INSTRUCTIONS_MAX, STARTER_QUESTIONS_MAX, STARTER_QUESTION_MAX } from "../services/limits";
import type { AdvancedSettings, ModelCatalog, SearchMode } from "../services/types";

const TONES = ["Professional", "Friendly", "Casual", "Formal"] as const;
const LENGTHS = ["Concise", "Detailed"] as const;
const FORMATS = ["Rich text", "Plain text only"] as const;
const LANGUAGES = ["Auto-detect", "English", "Khmer", "Korean"];
const VISIBILITY = ["Full document", "Name only", "Hidden"] as const;
const SEARCH_MODES: { value: SearchMode; label: string }[] = [
  { value: "Hybrid", label: "Hybrid (keyword + meaning)" },
  { value: "Semantic", label: "Meaning only" },
  { value: "Keyword", label: "Keyword only" },
];

const modelOptions = (models: ModelCatalog["chat"] = []) =>
  models.map((m) => ({ value: m.id, label: m.isDefault ? `${m.label} · default` : m.label }));

export default function Screen07S2() {
  const navigate = useNavigate();
  const { draft, update, updateSettings, updateAdvanced, reachStep } = useChatbotDraft();
  const { settings } = draft;
  const [catalog, setCatalog] = useState<ModelCatalog | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setCatalogError(null);
    api
      .getModels(controller.signal)
      .then((models) => {
        setCatalog(models);
        // Fall back to the admin's default if the saved choice was disabled since.
        const pick = (list: ModelCatalog["chat"], current: string) =>
          list.some((m) => m.id === current) ? current : (list.find((m) => m.isDefault) ?? list[0]).id;
        updateSettings({
          chatModel: pick(models.chat, settings.chatModel),
          embeddingModel: pick(models.embedding, settings.embeddingModel),
        });
      })
      .catch((e) => !isAbort(e) && setCatalogError(errorMessage(e)));
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  if (draft.reachedStep < 2) return <Navigate to="/s1e" replace />;

  const instructionsError = !settings.instructions.trim() ? "Tell the chatbot how to behave." : null;
  const { chunkSize, chunkOverlap, topK } = settings.advanced;
  const advancedError =
    chunkSize < 100 || chunkSize > 2000
      ? "Chunk size must be between 100 and 2000 tokens."
      : chunkOverlap < 0 || chunkOverlap >= chunkSize
        ? "Overlap must be 0 or more and smaller than the chunk size."
        : topK < 1 || topK > 20
          ? "Top K must be between 1 and 20."
          : null;

  const submit = () => {
    setSubmitted(true);
    if (advancedError) setAdvancedOpen(true);
    if (instructionsError || advancedError || !catalog) return;
    reachStep(3);
    navigate("/s3e");
  };

  const modelPlaceholder = catalogError ? "Unavailable" : "Loading models…";

  return (
    <div className="relative w-full h-full bg-bg-card overflow-hidden flex items-start">
      <Sidebar2 />
      <div className="flex-1 min-w-0 self-stretch bg-page overflow-y-auto p-8">
        <div className="flex w-full flex-col gap-8">
          <header>
            <h1 className="text-h2 text-ink">Create chatbot</h1>
            <p className="text-p3 text-ink-secondary mt-1">Three steps. You can change every setting later.</p>
          </header>

          <div className="rounded-card border border-line bg-card shadow-subtle p-7">
            <Step2Stepper />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="rounded-card border border-line bg-card shadow-subtle col-span-2 min-w-0 p-7"
            >
              <div className="flex flex-col gap-8">
                <header>
                  <h2 className="text-h4 text-ink">Model and behavior</h2>
                  <p className="text-p3 text-ink-secondary mt-1">Choose the models and how your chatbot answers.</p>
                </header>

                <FieldSection title="Models">
                  {catalogError && (
                    <Banner tone="danger">
                      {`Couldn't load models: ${catalogError} `}
                      <button
                        type="button"
                        className="underline font-medium cursor-pointer"
                        onClick={() => setReload((n) => n + 1)}
                      >
                        Try again
                      </button>
                    </Banner>
                  )}
                  <FormField label="Chat model" required hint="From the models your admin allows.">
                    <Select
                      label="Chat model"
                      disabled={!catalog}
                      placeholder={modelPlaceholder}
                      options={modelOptions(catalog?.chat)}
                      value={settings.chatModel}
                      onChange={(chatModel) => updateSettings({ chatModel })}
                    />
                  </FormField>
                  <FormField label="Embedding model" required>
                    <Select
                      label="Embedding model"
                      disabled={!catalog}
                      placeholder={modelPlaceholder}
                      options={modelOptions(catalog?.embedding)}
                      value={settings.embeddingModel}
                      onChange={(embeddingModel) => updateSettings({ embeddingModel })}
                    />
                  </FormField>
                  <Note yellow icon={<Lock className="size-4" aria-hidden />}>
                    The embedding model cannot be changed after the chatbot is created.
                  </Note>
                </FieldSection>

                <FieldSection title="Behavior">
                  <FormField
                    htmlFor="instructions"
                    label="System instructions"
                    hint="Tells the chatbot who it is and how to answer."
                    error={submitted ? instructionsError : null}
                  >
                    <textarea
                      id="instructions"
                      rows={4}
                      maxLength={INSTRUCTIONS_MAX}
                      aria-invalid={(submitted && !!instructionsError) || undefined}
                      value={settings.instructions}
                      placeholder="You are the support assistant for Acme. Answer only from the documents."
                      onChange={(e) => updateSettings({ instructions: e.target.value })}
                      className={textareaClass}
                    />
                  </FormField>
                  <FormField label="Tone preset">
                    <Segmented
                      label="Tone preset"
                      options={TONES}
                      value={settings.tone}
                      onChange={(tone) => updateSettings({ tone })}
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
                        onChange={(answerLength) => updateSettings({ answerLength })}
                      />
                    </FormField>
                    <FormField label="Formatting">
                      <Segmented
                        label="Formatting"
                        options={FORMATS}
                        value={settings.formatting}
                        onChange={(formatting) => updateSettings({ formatting })}
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
                      onChange={(language) => updateSettings({ language })}
                    />
                  </FormField>
                  <FormField label="Source visibility" hint="How much of a cited source a guest may open.">
                    <Segmented
                      label="Source visibility"
                      options={VISIBILITY}
                      value={settings.sourceVisibility}
                      onChange={(sourceVisibility) => updateSettings({ sourceVisibility })}
                    />
                  </FormField>
                </FieldSection>

                <StarterQuestions />

                <FieldSection title="Grounding and citations">
                  <Note icon={<ShieldCheck className="size-4" aria-hidden />}>
                    {settings.advanced.documentsOnly
                      ? "Answers always come only from your documents, with citations."
                      : "Answers come from your documents first, with citations, and may use general knowledge."}
                  </Note>
                </FieldSection>

                <div className="rounded-card-sm border border-line">
                  <button
                    type="button"
                    aria-expanded={advancedOpen}
                    onClick={() => setAdvancedOpen((o) => !o)}
                    className="flex w-full cursor-pointer items-center gap-4 px-6 py-5 text-left"
                  >
                    <span className="flex-1">
                      <span className="text-s2 text-ink block">Advanced configuration</span>
                      <span className="text-c1 text-ink-secondary block">
                        Generation, retrieval and chunking. The defaults work for most chatbots.
                      </span>
                    </span>
                    <ChevronDown
                      className={`text-ink-muted size-5 shrink-0 transition-transform duration-200 ${advancedOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>
                  {advancedOpen && (
                    <div className="border-t border-line flex flex-col gap-8 px-6 py-6">
                      {advancedError && <Banner tone="danger">{advancedError}</Banner>}
                      <FieldSection title="Generation">
                        <div className="grid grid-cols-2 gap-5">
                          <NumberField
                            name="temperature"
                            label="Temperature"
                            hint="Lower is more exact. Higher is more varied. 0–1."
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
                            min={1}
                            max={20}
                            step={1}
                          />
                          <FormField label="Search mode" hint="Hybrid works best for most knowledge bases.">
                            <Select
                              label="Search mode"
                              options={SEARCH_MODES}
                              value={settings.advanced.searchMode}
                              onChange={(searchMode) => updateAdvanced({ searchMode: searchMode as SearchMode })}
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
                            checked={settings.advanced.documentsOnly}
                            onChange={(documentsOnly) => updateAdvanced({ documentsOnly })}
                          />
                        </div>
                      </FieldSection>
                      <FieldSection title="Chunking">
                        <div className="grid grid-cols-2 gap-5">
                          <NumberField
                            name="chunkSize"
                            label="Chunk size"
                            hint="Tokens per chunk. 100–2000."
                            min={100}
                            max={2000}
                            step={50}
                          />
                          <NumberField
                            name="chunkOverlap"
                            label="Chunk overlap"
                            hint="Tokens repeated between chunks."
                            min={0}
                            step={10}
                          />
                        </div>
                      </FieldSection>
                    </div>
                  )}
                </div>
              </div>

              <footer className="border-t border-line mt-8 flex flex-wrap items-center gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => navigate("/s1e")}
                  className="rounded-input border border-line text-btn-md text-ink hover:bg-subtle h-12 cursor-pointer px-5 transition-colors"
                >
                  Back
                </button>
                <span className="text-c1 text-ink-muted flex-1 text-center">Step 2 of 3</span>
                <button
                  type="submit"
                  disabled={!catalog}
                  className="rounded-input bg-inverse text-on-inverse text-btn-md h-12 cursor-pointer px-6 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                </button>
              </footer>
            </form>

            <Step2Aside />
          </div>
        </div>
      </div>
    </div>
  );
}

function NumberField({
  name,
  label,
  hint,
  min,
  max,
  step,
}: {
  name: "temperature" | "topK" | "chunkSize" | "chunkOverlap";
  label: string;
  hint: string;
  min?: number;
  max?: number;
  step: number;
}) {
  const { draft, updateAdvanced } = useChatbotDraft();
  const value: AdvancedSettings[typeof name] = draft.settings.advanced[name];
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
          if (!Number.isNaN(next)) updateAdvanced({ [name]: next });
        }}
        className={inputClass}
      />
    </FormField>
  );
}

function StarterQuestions() {
  const { draft, update } = useChatbotDraft();
  const questions = draft.starterQuestions;
  const [text, setText] = useState("");
  const [dragging, setDragging] = useState<string | null>(null);
  const full = questions.length >= STARTER_QUESTIONS_MAX;

  const set = (next: typeof questions) => update({ starterQuestions: next });
  const add = () => {
    const question = text.trim();
    if (!question || full) return;
    set([...questions, { id: Math.random().toString(36).slice(2, 10), text: question }]);
    setText("");
  };
  const move = (fromId: string, toId: string) => {
    const from = questions.findIndex((q) => q.id === fromId);
    const to = questions.findIndex((q) => q.id === toId);
    if (from < 0 || to < 0 || from === to) return;
    const next = [...questions];
    next.splice(to, 0, next.splice(from, 1)[0]);
    set(next);
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
                onClick={() => set(questions.filter((x) => x.id !== q.id))}
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
