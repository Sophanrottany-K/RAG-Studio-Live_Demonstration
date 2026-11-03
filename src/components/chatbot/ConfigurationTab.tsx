// Configuration tab of the chatbot detail page: edit the model, behavior, starter questions and advanced
// settings chosen in Create chatbot · Step 2. The embedding model is shown but stays locked: the documents
// are indexed with it.
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { api, errorMessage, isAbort } from "../../services/api";
import { advancedSettingsError } from "../../services/limits";
import type { Chatbot, ChatbotSettings, EditableChatbotSettings, ModelCatalog } from "../../services/types";
import { Select } from "../analytics/Select";
import {
  AdvancedPanel,
  BehaviorFields,
  FieldSection,
  FormField,
  GroundingNote,
  Note,
  StarterQuestionsField,
  modelOptions,
  starterQuestionId,
  type StarterQuestion,
} from "../create/step2";
import { Banner } from "../create/ui";
import { showToast } from "../shared/Toaster";

type Form = Omit<EditableChatbotSettings, "starterQuestions"> & { starterQuestions: StarterQuestion[] };

const toForm = ({ embeddingModel: _locked, starterQuestions, ...rest }: ChatbotSettings): Form => ({
  ...rest,
  starterQuestions: starterQuestions.map((text) => ({ id: starterQuestionId(), text })),
});

const toSettings = (form: Form): EditableChatbotSettings => ({
  ...form,
  starterQuestions: form.starterQuestions.map((q) => q.text),
});

export function ConfigurationTab({ bot, onSaved }: { bot: Chatbot; onSaved: (next: Chatbot) => void }) {
  const [form, setForm] = useState(() => toForm(bot.settings));
  const [catalog, setCatalog] = useState<ModelCatalog | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [reloadCatalog, setReloadCatalog] = useState(0);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setCatalogError(null);
    api
      .getModels(controller.signal)
      .then(setCatalog)
      .catch((e) => !isAbort(e) && setCatalogError(errorMessage(e)));
    return () => controller.abort();
  }, [reloadCatalog]);

  const change = (next: Partial<Form>) => setForm((f) => ({ ...f, ...next }));
  const instructionsError = !form.instructions.trim() ? "Tell the chatbot how to behave." : null;
  const advancedError = advancedSettingsError(form.advanced);
  const edited = JSON.stringify(toSettings(form)) !== JSON.stringify(toSettings(toForm(bot.settings)));
  const embeddingLabel =
    catalog?.embedding.find((m) => m.id === bot.settings.embeddingModel)?.label ?? bot.settings.embeddingModel;

  const save = async () => {
    setSubmitted(true);
    if (advancedError) setAdvancedOpen(true);
    if (instructionsError || advancedError || !edited || saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      const next = await api.editChatbotSettings(bot.id, toSettings(form));
      onSaved(next);
      setForm(toForm(next.settings));
      setSubmitted(false);
      showToast({ tone: "success", text: "Configuration saved." });
    } catch (e) {
      setSaveError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const discard = () => {
    setForm(toForm(bot.settings));
    setSubmitted(false);
    setSaveError(null);
  };

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="rounded-card border border-line bg-card shadow-subtle min-w-0 p-7"
    >
      <div className="flex flex-col gap-8">
        <header>
          <h2 className="text-h4 text-ink">Configuration</h2>
          <p className="text-p3 text-ink-secondary mt-1">Change the model and how your chatbot answers.</p>
        </header>

        <FieldSection title="Models">
          {catalogError && (
            <Banner tone="danger">
              {`Couldn't load models: ${catalogError} `}
              <button
                type="button"
                className="underline font-medium cursor-pointer"
                onClick={() => setReloadCatalog((n) => n + 1)}
              >
                Try again
              </button>
            </Banner>
          )}
          <FormField label="Chat model" required hint="From the models your admin allows.">
            <Select
              label="Chat model"
              disabled={!catalog}
              placeholder={catalog ? `${form.chatModel} · no longer available` : form.chatModel}
              options={modelOptions(catalog?.chat)}
              value={form.chatModel}
              onChange={(chatModel) => change({ chatModel })}
            />
          </FormField>
          <FormField htmlFor="embedding-model" label="Embedding model">
            <input
              id="embedding-model"
              disabled
              value={embeddingLabel}
              className="rounded-small border border-line bg-subtle text-p1 text-ink-secondary h-12 w-full min-w-0 cursor-not-allowed px-4"
            />
          </FormField>
          <Note yellow icon={<Lock className="size-4" aria-hidden />}>
            The embedding model cannot be changed after the chatbot is created.
          </Note>
        </FieldSection>

        <BehaviorFields settings={form} onChange={change} instructionsError={submitted ? instructionsError : null} />

        <StarterQuestionsField
          questions={form.starterQuestions}
          onChange={(starterQuestions) => change({ starterQuestions })}
        />

        <GroundingNote documentsOnly={form.advanced.documentsOnly} />

        <AdvancedPanel
          advanced={form.advanced}
          onChange={(next) => change({ advanced: { ...form.advanced, ...next } })}
          open={advancedOpen}
          onToggle={() => setAdvancedOpen((o) => !o)}
          error={advancedError}
        />

        {saveError && (
          <Banner tone="danger" onDismiss={() => setSaveError(null)}>
            {saveError}
          </Banner>
        )}
      </div>

      <footer className="border-t border-line mt-8 flex flex-wrap items-center justify-end gap-3 pt-6">
        <button
          type="button"
          disabled={!edited || saving}
          onClick={discard}
          className="rounded-input border border-line text-btn-md text-ink hover:bg-subtle h-12 cursor-pointer px-5 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          Discard changes
        </button>
        <button
          type="submit"
          disabled={!edited || saving}
          className="rounded-input bg-inverse text-on-inverse text-btn-md h-12 cursor-pointer px-6 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </footer>
    </form>
  );
}
