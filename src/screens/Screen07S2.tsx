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
  WIZARD_VISIBILITY,
  modelOptionsWithHints,
} from "../components/create/step2";
import { CreateLayout, StepFooter, StepHeading } from "../components/create/CreateLayout";
import { DraftPreview, PublishChecklist } from "../components/create/DraftPreview";
import { Banner, Button } from "../components/create/ui";
import { useCancelCreate } from "../components/create/useCancelCreate";
import { useChatbotDraft } from "../lib/chatbotDraft";
import { api, errorMessage, isAbort } from "../services/api";
import { advancedSettingsError } from "../services/limits";
import type { ModelCatalog } from "../services/types";

export default function Screen07S2() {
  const navigate = useNavigate();
  const { draft, update, updateSettings, updateAdvanced, reachStep } = useChatbotDraft();
  const { settings } = draft;
  const { requestCancel, dialog } = useCancelCreate();
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
      <form
        className="self-stretch flex flex-col items-start gap-6"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <StepHeading title="Model and behavior" subtitle="Choose the models and how your chatbot answers." />
        <div className="self-stretch flex flex-col gap-8">
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
                options={modelOptionsWithHints(catalog?.chat)}
                value={settings.chatModel}
                onChange={(chatModel) => updateSettings({ chatModel })}
              />
            </FormField>
            <FormField label="Embedding model" required>
              <Select
                label="Embedding model"
                disabled={!catalog}
                placeholder={modelPlaceholder}
                options={modelOptionsWithHints(catalog?.embedding)}
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
            visibilityOptions={WIZARD_VISIBILITY}
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
        <StepFooter>
          <Button icon="icons/arrow-left-property-linear-2.svg" onClick={() => navigate("/s1e")}>
            Back
          </Button>
          <Button variant="ghost" onClick={requestCancel}>
            Cancel
          </Button>
          <div className="flex-1" />
          <Button type="submit" variant="primary" disabled={!catalog}>
            Continue
          </Button>
        </StepFooter>
      </form>
    </CreateLayout>
  );
}
