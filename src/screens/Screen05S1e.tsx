// Create chatbot · Step 1 · Basic info
// Routes: #/s1e, #/s1f
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateLayout, StepFooter, StepHeading } from "../components/create/CreateLayout";
import { DraftPreview, PublishChecklist } from "../components/create/DraftPreview";
import { Banner, Button, Field, TextArea, TextInput } from "../components/create/ui";
import { useCancelCreate } from "../components/create/useCancelCreate";
import { useChatbotDraft } from "../lib/chatbotDraft";
import { DESCRIPTION_MAX, NAME_MAX, NAME_MIN } from "../services/limits";

export default function Screen05S1e() {
  const navigate = useNavigate();
  const { draft, update, reachStep } = useChatbotDraft();
  const { requestCancel, dialog } = useCancelCreate();
  const [touched, setTouched] = useState(false);
  const name = draft.name.trim();

  // Only the format is checked here; the server validates the name again when the chatbot is created.
  const nameError = !name
    ? "Give your chatbot a name."
    : name.length < NAME_MIN
      ? `Use at least ${NAME_MIN} characters.`
      : null;

  const submit = () => {
    setTouched(true);
    if (nameError) return;
    reachStep(2);
    navigate("/s2");
  };

  return (
    <CreateLayout
      step={1}
      overlay={dialog}
      aside={
        <>
          <DraftPreview step={1} />
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
        <StepHeading
          title="Basic info"
          subtitle="Give your chatbot a name guests will recognise. You can change this later."
        />
        <Field
          label="Bot name *"
          htmlFor="bot-name"
          counter={`${draft.name.length}/${NAME_MAX}`}
          error={touched ? nameError : null}
          hint={`Required. ${NAME_MIN}–${NAME_MAX} characters.`}
        >
          <TextInput
            id="bot-name"
            autoFocus
            autoComplete="off"
            value={draft.name}
            maxLength={NAME_MAX}
            invalid={touched && !!nameError}
            placeholder="e.g. Billing Assistant"
            onChange={(e) => update({ name: e.target.value })}
            onBlur={() => setTouched(true)}
          />
        </Field>
        <Field
          label="Description (optional)"
          htmlFor="bot-description"
          counter={`${draft.description.length}/${DESCRIPTION_MAX}`}
          hint="Shown to you in the dashboard, not to guests."
        >
          <TextArea
            id="bot-description"
            rows={4}
            value={draft.description}
            maxLength={DESCRIPTION_MAX}
            placeholder="What should this chatbot help guests with?"
            onChange={(e) => update({ description: e.target.value })}
          />
        </Field>
        <Banner>New chatbots are saved as Draft. Nothing goes live until you publish.</Banner>
        <StepFooter>
          <Button onClick={requestCancel}>Cancel</Button>
          <div className="flex-1" />
          <Button type="submit" variant="primary">
            Continue
          </Button>
        </StepFooter>
      </form>
    </CreateLayout>
  );
}
