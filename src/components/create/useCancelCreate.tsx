import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChatbotDraft } from "../../lib/chatbotDraft";
import { ConfirmDialog } from "./ConfirmDialog";

/** Cancel button behaviour: leave right away if nothing was entered, otherwise confirm discarding. */
export function useCancelCreate() {
  const navigate = useNavigate();
  const { draft, reset } = useChatbotDraft();
  const [open, setOpen] = useState(false);
  const hasInput = draft.name.trim() || draft.description.trim() || draft.sources.length > 0 || draft.reachedStep > 1;

  const discard = () => {
    reset(true);
    navigate("/list");
  };

  return {
    requestCancel: () => (hasInput ? setOpen(true) : discard()),
    dialog: (
      <ConfirmDialog
        open={open}
        title="Discard this chatbot?"
        confirmLabel="Discard"
        danger
        onConfirm={discard}
        onCancel={() => setOpen(false)}
      >
        {"Everything you entered and any uploaded files will be removed. This can't be undone."}
      </ConfirmDialog>
    ),
  };
}
