// "Edit name & description" dialog from the chatbot's "…" menu, ported from the RAG Studio web app
// (features/chatbots/components/chatbot-dialogs.tsx, EditChatbotDialog).
import { useEffect, useId, useState } from "react";
import { X } from "lucide-react";
import { DESCRIPTION_MAX, NAME_MAX, NAME_MIN } from "../../services/limits";
import type { Chatbot } from "../../services/types";
import { cn } from "../analytics/format";

const field =
  "rounded-input border-line bg-card text-p3 text-ink placeholder:text-ink-muted mt-2 w-full border px-4 outline-none transition-[border-color,box-shadow] focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent/30 aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/30";
const pill =
  "rounded-pill text-p4 inline-flex h-11 cursor-pointer items-center justify-center px-5 font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export function EditDetailsDialog({
  open,
  bot,
  saving,
  error,
  onSave,
  onCancel,
}: {
  open: boolean;
  bot: Chatbot;
  saving: boolean;
  /** Message from the server when saving failed. */
  error: string | null;
  onSave: (values: { name: string; description: string }) => void;
  onCancel: () => void;
}) {
  const nameId = useId();
  const descriptionId = useId();
  const [name, setName] = useState(bot.name);
  const [description, setDescription] = useState(bot.description);

  // Start from the saved values every time the dialog opens.
  useEffect(() => {
    if (open) {
      setName(bot.name);
      setDescription(bot.description);
    }
  }, [open, bot.name, bot.description]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;
  const trimmed = name.trim();
  const nameError = !trimmed
    ? "Bot name is required."
    : trimmed.length < NAME_MIN
      ? `At least ${NAME_MIN} characters.`
      : null;
  const unchanged = trimmed === bot.name && description.trim() === bot.description;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center font-gabarito">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${nameId}-title`}
        className="rounded-card-sm bg-card relative w-full max-w-md p-7 shadow-[0px_16px_48px_0px_#0000001F]"
      >
        <button
          type="button"
          aria-label="Close"
          className="text-ink-muted hover:text-ink absolute top-5 right-5 cursor-pointer"
          onClick={onCancel}
        >
          <X className="size-5" aria-hidden />
        </button>
        <h2 id={`${nameId}-title`} className="text-s1 text-ink">
          {"Edit name & description"}
        </h2>
        <p className="text-p3 text-ink-body mt-2">{"Shown on this page and in your chatbot list."}</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!nameError && !unchanged && !saving) onSave({ name: trimmed, description: description.trim() });
          }}
        >
          <div className="mt-5">
            <div className="flex items-baseline justify-between gap-2">
              <label htmlFor={nameId} className="text-p4 text-ink">
                {"Bot name "}
                <span className="text-danger-text">{"*"}</span>
              </label>
              <span className="text-c1 text-ink-muted tabular">{`${name.length}/${NAME_MAX}`}</span>
            </div>
            <input
              id={nameId}
              value={name}
              maxLength={NAME_MAX}
              placeholder="Enter a bot name"
              autoFocus
              aria-invalid={!!nameError}
              onChange={(e) => setName(e.target.value)}
              className={cn(field, "h-12")}
            />
            <p className={cn("text-c1 mt-1.5", nameError ? "text-danger-text" : "text-ink-secondary")}>
              {nameError ?? `Max ${NAME_MAX} characters.`}
            </p>
          </div>

          <div className="mt-5">
            <div className="flex items-baseline justify-between gap-2">
              <label htmlFor={descriptionId} className="text-p4 text-ink">
                {"Description "}
                <span className="text-ink-secondary font-normal">{"(optional)"}</span>
              </label>
              <span className="text-c1 text-ink-muted tabular">{`${description.length}/${DESCRIPTION_MAX}`}</span>
            </div>
            <textarea
              id={descriptionId}
              rows={4}
              value={description}
              maxLength={DESCRIPTION_MAX}
              onChange={(e) => setDescription(e.target.value)}
              className={cn(field, "min-h-24 resize-none py-3")}
            />
            <p className="text-c1 text-ink-secondary mt-1.5">
              {`Max ${DESCRIPTION_MAX} characters. Shown to you in the dashboard.`}
            </p>
          </div>

          {error && (
            <p role="alert" className="bg-danger-tint text-danger-text text-c1 rounded-small mt-4 px-3 py-2">
              {error}
            </p>
          )}

          <div className="border-line mt-6 flex justify-between gap-3 border-t pt-5">
            <button
              type="button"
              className={cn(pill, "border-line text-ink hover:bg-subtle border")}
              onClick={onCancel}
            >
              {"Cancel"}
            </button>
            <button
              type="submit"
              disabled={!!nameError || unchanged || saving}
              className={cn(pill, "bg-inverse text-on-inverse")}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
