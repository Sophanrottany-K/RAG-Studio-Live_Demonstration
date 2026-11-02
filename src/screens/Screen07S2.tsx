// Create chatbot · Step 2 · Model and behavior
// Routes: #/s2, #/s2q
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Select, type SelectOption } from "../components/analytics/Select";
import { CreateLayout, StepFooter, StepHeading } from "../components/create/CreateLayout";
import { DraftPreview, PublishChecklist } from "../components/create/DraftPreview";
import { Banner, Button, ChipGroup, Field, SectionLabel, TextArea, TextInput, Toggle } from "../components/create/ui";
import { useCancelCreate } from "../components/create/useCancelCreate";
import { DragHandle } from "../components/shared/DragHandle";
import { DEFAULT_INSTRUCTIONS, useChatbotDraft } from "../lib/chatbotDraft";
import { api, errorMessage, isAbort } from "../services/api";
import { INSTRUCTIONS_MAX, STARTER_QUESTIONS_MAX, STARTER_QUESTION_MAX } from "../services/limits";
import type { ModelCatalog, SearchMode, SourceVisibility } from "../services/types";

const TONES = ["Professional", "Friendly", "Casual", "Formal"] as const;
const LENGTHS = ["Concise", "Detailed"] as const;
const FORMATS = ["Rich text", "Plain text only"] as const;
const LANGUAGES = ["Auto-detect", "English", "Khmer", "Korean"];
const VISIBILITY = ["Full document", "Name only", "Hidden"] as const;
const SEARCH_MODES = ["Hybrid", "Semantic", "Keyword"] as const;

const VISIBILITY_HINT: Record<SourceVisibility, string> = {
  "Full document": "Guests can open the cited document at the quoted passage.",
  "Name only": "Guests see the document name and location; nothing opens.",
  Hidden: "No citation markers for guests. You still see sources in the Playground.",
};

const SEARCH_HINT: Record<SearchMode, string> = {
  Hybrid: "Combines meaning and exact keywords. Best for most knowledge bases.",
  Semantic: "Matches by meaning, even when wording differs.",
  Keyword: "Matches exact words. Good for codes, SKUs and names.",
};

export default function Screen07S2() {
  const navigate = useNavigate();
  const { draft, update, updateSettings, updateAdvanced, reachStep } = useChatbotDraft();
  const { requestCancel, dialog } = useCancelCreate();
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
  const { chunkSize, chunkOverlap, topK, temperature } = settings.advanced;
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
    // Drop empty question rows before moving on.
    update({ starterQuestions: draft.starterQuestions.filter((q) => q.text.trim()) });
    reachStep(3);
    navigate("/s3e");
  };

  const chatModel = catalog?.chat.find((m) => m.id === settings.chatModel);

  return (
    <CreateLayout
      step={2}
      overlay={dialog}
      aside={
        <>
          <DraftPreview step={2} />
          <PublishChecklist />
        </>
      }
    >
      <StepHeading title="Model and behavior" subtitle="Choose the models and how your chatbot should answer." />

      <div className="self-stretch flex flex-col items-start gap-4">
        <SectionLabel>Models</SectionLabel>
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
        <div className="self-stretch flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <Field
              label="Chat model *"
              hint={
                chatModel
                  ? `${chatModel.provider} · ${chatModel.description}`
                  : "From the chat models your admin has enabled."
              }
            >
              <FieldSelect
                label="Chat model"
                disabled={!catalog}
                placeholder={catalogError ? "Unavailable" : "Loading models…"}
                options={(catalog?.chat ?? []).map((m) => ({
                  value: m.id,
                  label: `${m.label}${m.isDefault ? " (default)" : ""}`,
                }))}
                value={settings.chatModel}
                onChange={(chatModel) => updateSettings({ chatModel })}
              />
            </Field>
          </div>
          <div className="flex-1 min-w-0">
            <Field
              label="Embedding model"
              hint={
                catalog?.embedding.find((m) => m.id === settings.embeddingModel)?.description ??
                "Turns documents into searchable vectors."
              }
            >
              <FieldSelect
                label="Embedding model"
                disabled={!catalog}
                placeholder={catalogError ? "Unavailable" : "Loading models…"}
                options={(catalog?.embedding ?? []).map((m) => ({ value: m.id, label: m.label }))}
                value={settings.embeddingModel}
                onChange={(embeddingModel) => updateSettings({ embeddingModel })}
              />
            </Field>
          </div>
        </div>
        <Banner tone="warning">
          The embedding model can't be changed after creation, to protect vector index integrity.
        </Banner>
      </div>

      <div className="self-stretch flex flex-col items-start gap-4">
        <SectionLabel>Behavior</SectionLabel>
        <Field
          label="System instructions *"
          htmlFor="instructions"
          counter={`${settings.instructions.length}/${INSTRUCTIONS_MAX}`}
          error={submitted ? instructionsError : null}
          hint={
            settings.instructions !== DEFAULT_INSTRUCTIONS ? (
              <button
                type="button"
                className="underline cursor-pointer"
                onClick={() => updateSettings({ instructions: DEFAULT_INSTRUCTIONS })}
              >
                Reset to default
              </button>
            ) : (
              "The chatbot follows these on every answer."
            )
          }
        >
          <TextArea
            id="instructions"
            rows={4}
            maxLength={INSTRUCTIONS_MAX}
            invalid={submitted && !!instructionsError}
            value={settings.instructions}
            onChange={(e) => updateSettings({ instructions: e.target.value })}
          />
        </Field>
        <Field label="Tone preset">
          <ChipGroup
            label="Tone preset"
            options={TONES}
            value={settings.tone}
            onChange={(tone) => updateSettings({ tone })}
          />
        </Field>
      </div>

      <div className="self-stretch flex flex-col items-start gap-4">
        <SectionLabel>Answer behavior</SectionLabel>
        <div className="self-stretch flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <Field label="Answer length">
              <ChipGroup
                label="Answer length"
                options={LENGTHS}
                value={settings.answerLength}
                onChange={(answerLength) => updateSettings({ answerLength })}
              />
            </Field>
          </div>
          <div className="flex-1 min-w-0">
            <Field label="Formatting">
              <ChipGroup
                label="Formatting"
                options={FORMATS}
                value={settings.formatting}
                onChange={(formatting) => updateSettings({ formatting })}
              />
            </Field>
          </div>
        </div>
        <Field
          label="Answer language"
          hint="Supports English, Khmer and Korean. Auto-detect replies in whichever of these the guest writes in."
        >
          <FieldSelect
            label="Answer language"
            options={LANGUAGES.map((l) => ({ value: l, label: l }))}
            value={settings.language}
            onChange={(language) => updateSettings({ language })}
          />
        </Field>
        <StarterQuestions />
        <Field label="Source visibility" hint={VISIBILITY_HINT[settings.sourceVisibility]}>
          <ChipGroup
            label="Source visibility"
            options={VISIBILITY}
            value={settings.sourceVisibility}
            onChange={(sourceVisibility) => updateSettings({ sourceVisibility })}
          />
        </Field>
      </div>

      <div className="self-stretch bg-bg-page border border-border-default rounded-[12px] flex flex-col items-start">
        <button
          type="button"
          aria-expanded={advancedOpen}
          onClick={() => setAdvancedOpen((o) => !o)}
          className="self-stretch flex justify-between items-center gap-4 p-5 text-left cursor-pointer"
        >
          <div className="flex-1 min-w-0 flex flex-col items-start gap-1">
            <div className="font-gabarito font-medium text-[16px] leading-[16px] text-ink-primary">
              Advanced configuration
            </div>
            <div className="self-stretch font-gabarito text-[12px] leading-[16px] text-ink-secondary">
              {`Optional · Temperature ${temperature.toFixed(1)} · Top K ${topK} · ${settings.advanced.searchMode} search · Chunks ${chunkSize}/${chunkOverlap} · ${settings.advanced.documentsOnly ? "Documents only" : "Documents + general knowledge"}, with citations`}
            </div>
          </div>
          <img
            className={`w-5 h-5 shrink-0 transition-transform ${advancedOpen ? "rotate-180" : ""}`}
            src="icons/icon-chevron-down-2.svg"
            alt=""
          />
        </button>
        {advancedOpen && (
          <div className="self-stretch border-t border-border-default flex flex-col items-start gap-5 p-5">
            {advancedError && <Banner tone="danger">{advancedError}</Banner>}
            <Field
              label="Temperature"
              htmlFor="temperature"
              counter={temperature.toFixed(1)}
              hint="Lower = consistent and factual. Higher = more varied wording."
            >
              <input
                id="temperature"
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={temperature}
                onChange={(e) => updateAdvanced({ temperature: Number(e.target.value) })}
                className="self-stretch accent-[#111111] cursor-pointer"
              />
            </Field>
            <div className="self-stretch flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <Field label="Top K" htmlFor="top-k" hint="Passages retrieved per question (1–20).">
                  <TextInput
                    id="top-k"
                    type="number"
                    min={1}
                    max={20}
                    value={topK}
                    onChange={(e) => updateAdvanced({ topK: Number(e.target.value) })}
                  />
                </Field>
              </div>
              <div className="flex-1 min-w-0">
                <Field label="Chunk size" htmlFor="chunk-size" hint="Tokens per chunk (100–2000).">
                  <TextInput
                    id="chunk-size"
                    type="number"
                    min={100}
                    max={2000}
                    step={50}
                    value={chunkSize}
                    onChange={(e) => updateAdvanced({ chunkSize: Number(e.target.value) })}
                  />
                </Field>
              </div>
              <div className="flex-1 min-w-0">
                <Field label="Chunk overlap" htmlFor="chunk-overlap" hint="Tokens shared between chunks.">
                  <TextInput
                    id="chunk-overlap"
                    type="number"
                    min={0}
                    step={10}
                    value={chunkOverlap}
                    onChange={(e) => updateAdvanced({ chunkOverlap: Number(e.target.value) })}
                  />
                </Field>
              </div>
            </div>
            <Field label="Search mode" hint={SEARCH_HINT[settings.advanced.searchMode]}>
              <ChipGroup
                label="Search mode"
                options={SEARCH_MODES}
                value={settings.advanced.searchMode}
                onChange={(searchMode) => updateAdvanced({ searchMode })}
              />
            </Field>
            <div className="self-stretch flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="font-gabarito font-medium text-[12px] leading-[16px] text-ink-primary">
                  Answer only from documents
                </div>
                <div className="font-gabarito text-[12px] leading-[16px] text-ink-secondary">
                  When off, the chatbot may use general knowledge if documents don't cover a question.
                </div>
              </div>
              <Toggle
                label="Answer only from documents"
                checked={settings.advanced.documentsOnly}
                onChange={(documentsOnly) => updateAdvanced({ documentsOnly })}
              />
            </div>
          </div>
        )}
      </div>

      <StepFooter>
        <Button icon="icons/arrow-left-property-linear-2.svg" onClick={() => navigate("/s1e")}>
          Back
        </Button>
        <Button variant="ghost" onClick={requestCancel}>
          Cancel
        </Button>
        <div className="flex-1" />
        <Button variant="primary" disabled={!catalog} onClick={submit}>
          Continue
        </Button>
      </StepFooter>
    </CreateLayout>
  );
}

/** A full-width dropdown styled like the status filter on the chatbot list. */
function FieldSelect({
  placeholder,
  ...props
}: {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  /** Shown while there's no option to show, e.g. when models are loading. */
  placeholder?: string;
}) {
  return (
    <Select
      {...props}
      className="self-stretch"
      buttonClassName="w-full h-12 shrink-0 bg-bg-card border border-border-default enabled:hover:border-accent aria-expanded:border-accent rounded-[12px] flex items-center gap-2 pr-3 pl-3.5 text-left cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
    >
      <div className="flex-1 min-w-0 truncate font-gabarito font-medium text-[14px] leading-[20px] text-ink-primary">
        {props.options.find((o) => o.value === props.value)?.label ?? placeholder}
      </div>
      <img className="w-3.5 h-3.5 shrink-0" src="icons/icon-caret-down.svg" alt="" />
    </Select>
  );
}

function StarterQuestions() {
  const { draft, update } = useChatbotDraft();
  const questions = draft.starterQuestions;
  const [armed, setArmed] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const full = questions.length >= STARTER_QUESTIONS_MAX;

  const set = (next: typeof questions) => update({ starterQuestions: next });
  const move = (fromId: string, toId: string) => {
    const from = questions.findIndex((q) => q.id === fromId);
    const to = questions.findIndex((q) => q.id === toId);
    if (from < 0 || to < 0 || from === to) return;
    const next = [...questions];
    next.splice(to, 0, next.splice(from, 1)[0]);
    set(next);
  };

  return (
    <div className="self-stretch flex flex-col items-start gap-3">
      <div className="font-gabarito font-medium text-[12px] leading-[16px] text-ink-primary">Starter questions</div>
      <div className="self-stretch font-gabarito text-[12px] leading-[16px] text-ink-secondary">
        {`Prompt chips shown to guests when a new chat starts. Up to ${STARTER_QUESTIONS_MAX} questions — drag to reorder.`}
      </div>
      {questions.map((q, i) => (
        <div
          key={q.id}
          draggable={armed === q.id}
          onDragStart={() => setDragging(q.id)}
          onDragOver={(e) => {
            e.preventDefault();
            if (dragging) move(dragging, q.id);
          }}
          onDragEnd={() => {
            setDragging(null);
            setArmed(null);
          }}
          className={`self-stretch h-12 flex items-center gap-2 ${dragging === q.id ? "opacity-50" : ""}`}
        >
          <div
            className="cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
            onMouseDown={() => setArmed(q.id)}
            onMouseUp={() => setArmed(null)}
          >
            <DragHandle />
          </div>
          <TextInput
            aria-label={`Starter question ${i + 1}`}
            autoFocus={!q.text}
            value={q.text}
            maxLength={STARTER_QUESTION_MAX}
            placeholder="Type a question guests can tap"
            onChange={(e) => set(questions.map((x) => (x.id === q.id ? { ...x, text: e.target.value } : x)))}
            className="flex-1 min-w-0"
          />
          <button
            type="button"
            aria-label={`Remove question ${i + 1}`}
            className="w-10 h-10 shrink-0 cursor-pointer hover:opacity-70"
            onClick={() => set(questions.filter((x) => x.id !== q.id))}
          >
            <img className="w-10 h-10" src="icons/button-icon-close.svg" alt="" />
          </button>
        </div>
      ))}
      <button
        type="button"
        disabled={full}
        onClick={() => set([...questions, { id: Math.random().toString(36).slice(2, 10), text: "" }])}
        className="font-gabarito text-[12px] leading-[16px] underline text-[#121212] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {`+ Add question (${questions.length} of ${STARTER_QUESTIONS_MAX})`}
      </button>
    </div>
  );
}
