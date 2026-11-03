// Create chatbot · Step 2 · Model and behavior
// Routes: #/s2, #/s2q
// Looks like step 2 of the RAG Studio web app (ragstudio-web-ui, /chatbots/new). The options and
// settings stay this demo's, since the mock server reads them.
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { Select } from "../components/analytics/Select";
import {
  AdvancedPanel,
  BehaviorFields,
  FieldSection,
  FormField,
  GroundingNote,
  Note,
  StarterQuestionsField,
  Step2Aside,
  Step2Stepper,
  modelOptions,
} from "../components/create/step2";
import { Banner } from "../components/create/ui";
import { Sidebar2 } from "../components/shared/Sidebar2";
import { useChatbotDraft } from "../lib/chatbotDraft";
import { api, errorMessage, isAbort } from "../services/api";
import { advancedSettingsError } from "../services/limits";
import type { ModelCatalog } from "../services/types";

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
  const advancedError = advancedSettingsError(settings.advanced);

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

                <BehaviorFields
                  settings={settings}
                  onChange={updateSettings}
                  instructionsError={submitted ? instructionsError : null}
                />

                <StarterQuestionsField
                  questions={draft.starterQuestions}
                  onChange={(starterQuestions) => update({ starterQuestions })}
                />

                <GroundingNote documentsOnly={settings.advanced.documentsOnly} />

                <AdvancedPanel
                  advanced={settings.advanced}
                  onChange={updateAdvanced}
                  open={advancedOpen}
                  onToggle={() => setAdvancedOpen((o) => !o)}
                  error={advancedError}
                />
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
