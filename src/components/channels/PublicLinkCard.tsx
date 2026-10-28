import { useRef, useState } from "react";
import { api } from "../../services/api";
import { LINK_TITLE_MAX, isHexColor } from "../../services/limits";
import type { ChatbotChannels, PublicLinkChannel } from "../../services/types";
import { ConfirmDialog } from "../create/ConfirmDialog";
import { Banner, Button, Field, TextInput } from "../create/ui";
import { ChannelCard, ColorField, CopyButton, Divider, SubTitle, formatDateTime, splitError } from "./parts";

// <input type="datetime-local"> works in local time without a zone: "2026-10-31T23:59".
const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

export function PublicLinkCard({
  chatbotId,
  link,
  onSaved,
  chatbotPaused = false,
}: {
  chatbotId: string;
  link: PublicLinkChannel;
  onSaved: (c: ChatbotChannels) => void;
  /** While the chatbot is paused the link answers "temporarily unavailable", whatever its own state. */
  chatbotPaused?: boolean;
}) {
  const urlRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState(link.title);
  const [expires, setExpires] = useState(toLocalInput(link.expiresAt));
  const [color, setColor] = useState(link.themeColor);
  const [busy, setBusy] = useState<null | "save" | "toggle" | "regenerate">(null);
  const [fieldError, setFieldError] = useState<{ field: string | null; message: string } | null>(null);
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);

  const titleError = !title.trim() ? "Give the chat page a title." : null;
  const colorError = !isHexColor(color) ? "Use a hex color like #111111." : null;
  const errorFor = (field: string) => (fieldError?.field === field ? fieldError.message : null);

  const run = async (kind: NonNullable<typeof busy>, call: () => Promise<ChatbotChannels>, fields: string[] = []) => {
    setBusy(kind);
    setFieldError(null);
    try {
      onSaved(await call());
    } catch (e) {
      setFieldError(splitError(e, fields));
    } finally {
      setBusy(null);
    }
  };

  const save = () => {
    if (titleError || colorError)
      return setFieldError({ field: titleError ? "title" : "themeColor", message: (titleError ?? colorError)! });
    run(
      "save",
      () =>
        api.savePublicLink(chatbotId, {
          title: title.trim(),
          themeColor: color,
          expiresAt: expires ? new Date(expires).toISOString() : null,
        }),
      ["title", "themeColor", "expiresAt"],
    );
  };

  const state = !link.configured ? "off" : !link.enabled ? "paused" : chatbotPaused ? "chatbotPaused" : "live";
  const subtitle = link.configured
    ? `${link.messagesThisWeek} inbound messages this week · Updated ${formatDateTime(link.updatedAt)}`
    : "A hosted chat page anyone with the link can use";

  return (
    <ChannelCard icon="icons/channel-icon.svg" title="Public Share Link" subtitle={subtitle} state={state}>
      {/* The settings are chosen once, when the link is generated. */}
      {!link.configured && (
        <>
          <SubTitle>Link settings</SubTitle>
          <form
            className="self-stretch flex flex-col items-start gap-5"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <div className="self-stretch flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <Field
                  label="Page title"
                  htmlFor="link-title"
                  counter={`${title.length}/${LINK_TITLE_MAX}`}
                  error={errorFor("title")}
                  hint="Shown at the top of the guest chat page."
                >
                  <TextInput
                    id="link-title"
                    value={title}
                    maxLength={LINK_TITLE_MAX}
                    invalid={!!errorFor("title")}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Field>
              </div>
              <div className="flex-1 min-w-0">
                <Field
                  label="Expiry date (optional)"
                  htmlFor="link-expiry"
                  error={errorFor("expiresAt")}
                  hint={
                    expires ? (
                      <button type="button" className="underline cursor-pointer" onClick={() => setExpires("")}>
                        Remove expiry — link never expires
                      </button>
                    ) : (
                      "Leave empty to keep the link working until you disable it."
                    )
                  }
                >
                  <TextInput
                    id="link-expiry"
                    type="datetime-local"
                    value={expires}
                    min={toLocalInput(new Date().toISOString())}
                    invalid={!!errorFor("expiresAt")}
                    onChange={(e) => setExpires(e.target.value)}
                  />
                </Field>
              </div>
            </div>
            <Field
              label="Theme color"
              htmlFor="link-color"
              error={errorFor("themeColor")}
              hint="Used for the header and the guest's message bubbles."
            >
              <ColorField id="link-color" value={color} onChange={setColor} invalid={!!errorFor("themeColor")} />
            </Field>
            {fieldError && !fieldError.field && <Banner tone="danger">{fieldError.message}</Banner>}
            <Button type="submit" variant="primary" loading={busy === "save"}>
              Save and generate link
            </Button>
          </form>
          <Divider />
        </>
      )}
      <SubTitle>Guest link</SubTitle>
      {!link.url ? (
        <div className="self-stretch bg-bg-soft rounded-[12px] px-4 py-3 font-gabarito text-[14px] text-ink-body">
          No public link yet. Save your settings to generate a guest link.
        </div>
      ) : (
        <div className="self-stretch flex flex-col items-start gap-3">
          <Field label="Guest URL">
            <div
              ref={urlRef}
              className={`self-stretch bg-bg-page border border-border-default rounded-[12px] px-4 py-[13px] font-roboto-mono text-[13px] break-all ${link.enabled ? "text-ink-primary" : "text-ink-muted line-through"}`}
            >
              {link.url}
            </div>
          </Field>
          <div className="flex flex-wrap items-center gap-2.5">
            <CopyButton text={link.url} label="Copy link" fallbackTarget={() => urlRef.current} />
            <Button disabled={!link.enabled} onClick={() => window.open(link.url!, "_blank", "noopener")}>
              Open guest preview ↗
            </Button>
            <Button
              loading={busy === "toggle"}
              onClick={() => run("toggle", () => api.setChannelEnabled(chatbotId, "public-link", !link.enabled))}
            >
              {link.enabled ? "Disable" : "Enable"}
            </Button>
            <Button loading={busy === "regenerate"} onClick={() => setConfirmRegenerate(true)}>
              Regenerate
            </Button>
          </div>
          {fieldError && !fieldError.field && <Banner tone="danger">{fieldError.message}</Banner>}
          <div className="font-gabarito text-[13px] text-ink-secondary">
            {!link.enabled
              ? "This link is disabled. Guests who open it see “This link is no longer active”."
              : chatbotPaused
                ? "The chatbot is paused, so guests see “This chatbot is temporarily unavailable” until you resume it."
                : link.expiresAt
                  ? `Guests can use this link until ${formatDateTime(link.expiresAt)}.`
                  : "This link doesn't expire."}
          </div>
        </div>
      )}
      <ConfirmDialog
        open={confirmRegenerate}
        title="Regenerate the guest link?"
        confirmLabel="Regenerate link"
        cancelLabel="Cancel"
        danger
        onCancel={() => setConfirmRegenerate(false)}
        onConfirm={() => {
          setConfirmRegenerate(false);
          run("regenerate", () => api.regeneratePublicLink(chatbotId));
        }}
      >
        A new URL is created and the current one stops working right away. Anyone using the old link will need the new
        one.
      </ConfirmDialog>
    </ChannelCard>
  );
}
