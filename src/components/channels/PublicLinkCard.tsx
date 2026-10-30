// Public Share Link channel card, laid out as in the RAG Studio web app
// (features/channels/components/public-link-card.tsx): page settings, then the guest URL and its actions.
import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { api, errorMessage } from "../../services/api";
import { LINK_TITLE_MAX, isHexColor } from "../../services/limits";
import type { ChatbotChannels, PublicLinkChannel } from "../../services/types";
import { ConfirmDialog } from "../create/ConfirmDialog";
import { ChannelCard, formatDateTime } from "./parts";
import {
  ColorSetting,
  Notice,
  SectionLabel,
  buttonStyles,
  cx,
  fieldStyles,
  labelStyles,
  readOnlyFieldStyles,
  useFeedback,
} from "./ui";

// <input type="datetime-local"> works in local time without a zone: "2026-10-31T23:59".
const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

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
  const [title, setTitle] = useState(link.title);
  const [expires, setExpires] = useState(toLocalInput(link.expiresAt));
  const [color, setColor] = useState(link.themeColor);
  const [busy, setBusy] = useState<null | "save" | "toggle" | "regenerate">(null);
  const [copied, setCopied] = useState(false);
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const settingsFeedback = useFeedback();
  const linkFeedback = useFeedback();

  const url = link.url;
  const live = link.configured && link.enabled;

  const save = async () => {
    if (!title.trim()) return settingsFeedback.show({ tone: "danger", text: "Give the chat page a title." });
    if (!isHexColor(color)) return settingsFeedback.show({ tone: "danger", text: "Use a hex color like #111111." });
    const first = !url;
    setBusy("save");
    try {
      onSaved(
        await api.savePublicLink(chatbotId, {
          title: title.trim(),
          themeColor: color,
          expiresAt: expires ? new Date(expires).toISOString() : null,
        }),
      );
      settingsFeedback.show({ tone: "success", text: first ? "Guest link generated." : "Link settings saved." });
    } catch (e) {
      settingsFeedback.show({ tone: "danger", text: errorMessage(e) });
    } finally {
      setBusy(null);
    }
  };

  const copyLink = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      linkFeedback.show({ tone: "success", text: "Link copied." });
    } catch {
      linkFeedback.show({ tone: "danger", text: "Could not copy. Select the text and copy it yourself." });
    }
  };

  const linkAction = async (kind: "toggle" | "regenerate", call: () => Promise<ChatbotChannels>, done: string) => {
    setBusy(kind);
    try {
      onSaved(await call());
      linkFeedback.show({ tone: "success", text: done });
    } catch (e) {
      linkFeedback.show({ tone: "danger", text: errorMessage(e) });
    } finally {
      setBusy(null);
    }
  };

  const toggle = () =>
    linkAction(
      "toggle",
      () => api.setChannelEnabled(chatbotId, "public-link", !link.enabled),
      link.enabled
        ? "Link disabled. Guests now see “This link is not available”."
        : "Link enabled. Guests can open it now.",
    );

  const state = !link.configured ? "off" : !link.enabled ? "paused" : chatbotPaused ? "chatbotPaused" : "live";
  const subtitle = link.configured
    ? `${link.messagesThisWeek} inbound messages this week · Updated ${formatDateTime(link.updatedAt)}`
    : "A hosted chat page anyone with the link can use";

  return (
    <ChannelCard icon="icons/channel-icon.svg" title="Public Share Link" subtitle={subtitle} state={state}>
      <div className="self-stretch font-gabarito">
        <SectionLabel>{"Link settings"}</SectionLabel>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="link-title" className={labelStyles}>
              {"Page title"}
            </label>
            <input
              id="link-title"
              value={title}
              maxLength={LINK_TITLE_MAX}
              placeholder="e.g. Support chat"
              onChange={(e) => setTitle(e.target.value)}
              className={fieldStyles}
            />
          </div>
          <div>
            <label htmlFor="link-expiry" className={labelStyles}>
              {"Expiry date (optional)"}
            </label>
            <input
              id="link-expiry"
              type="datetime-local"
              value={expires}
              min={toLocalInput(new Date().toISOString())}
              onChange={(e) => setExpires(e.target.value)}
              className={fieldStyles}
            />
          </div>
        </div>
        <div className="mt-5">
          <ColorSetting label="Theme color" value={color} onChange={setColor} />
        </div>
        <button
          type="button"
          disabled={busy !== null}
          onClick={save}
          className={cx(buttonStyles.primary, "mt-6 h-12 px-6")}
        >
          {busy === "save" ? "Saving…" : url ? "Save link settings" : "Save and generate link"}
        </button>

        <div className="border-line mt-6 border-t pt-6">
          <SectionLabel>{"Guest link"}</SectionLabel>
          {!url ? (
            <Notice>{"No public link yet. Save your settings to generate a guest link."}</Notice>
          ) : (
            <>
              {!link.enabled && (
                <Notice tone="danger" className="mb-5">
                  {"! This link is disabled. Guests who open it see “This link is not available”."}
                </Notice>
              )}
              <p className="text-p4 text-ink mb-2 font-bold">{"Guest URL"}</p>
              <p className={cx(fieldStyles, readOnlyFieldStyles, "flex items-center truncate font-mono")}>{url}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => copyLink(url)} className={buttonStyles.primary}>
                  {copied ? "Copied" : "Copy link"}
                </button>
                <a href={url} target="_blank" rel="noreferrer" className={buttonStyles.outline}>
                  {"Open guest preview ↗"}
                </a>
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={toggle}
                  className={live ? buttonStyles.danger : buttonStyles.outline}
                >
                  {busy === "toggle" ? "…" : live ? "Disable" : "Enable"}
                </button>
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => setConfirmRegenerate(true)}
                  className={buttonStyles.outline}
                >
                  {busy === "regenerate" ? "…" : "Regenerate"}
                </button>
                <button type="button" onClick={() => setShowQr(true)} className={buttonStyles.ghost}>
                  {"Show QR code"}
                </button>
              </div>

              <p className="text-c1 text-ink-secondary mt-3">
                {"Regenerate creates a new link. The old link stops working."}
                {link.expiresAt && ` This link expires on ${formatDate(link.expiresAt)}.`}
              </p>
            </>
          )}
        </div>
      </div>

      {url && showQr && <QrCodeDialog url={url} onClose={() => setShowQr(false)} />}
      <ConfirmDialog
        open={confirmRegenerate}
        title="Regenerate the guest link?"
        confirmLabel="Regenerate link"
        cancelLabel="Cancel"
        danger
        onCancel={() => setConfirmRegenerate(false)}
        onConfirm={() => {
          setConfirmRegenerate(false);
          linkAction(
            "regenerate",
            () => api.regeneratePublicLink(chatbotId),
            "New link generated. The old link no longer works.",
          );
        }}
      >
        A new URL is created and the current one stops working right away. Anyone using the old link will need the new
        one.
      </ConfirmDialog>
    </ChannelCard>
  );
}

/** The guest link as a QR code, with a PNG download. */
function QrCodeDialog({ url, onClose }: { url: string; onClose: () => void }) {
  // A larger hidden copy is what gets downloaded, so the PNG stays sharp when printed.
  const downloadRef = useRef<HTMLCanvasElement>(null);
  const download = () => {
    const canvas = downloadRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${url.split("/").pop() || "public-link"}-qr.png`;
    a.click();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center font-gabarito">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="QR code for your public link"
        className="rounded-card-sm bg-card relative w-full max-w-md p-7 shadow-[0px_16px_48px_0px_#0000001F]"
      >
        <h2 className="text-s1 text-ink font-bold">{"QR code for your public link"}</h2>
        <p className="text-c1 text-ink-secondary mt-1">
          {"Guests can scan this code with their phone to open the chat page."}
        </p>
        <div className="rounded-small bg-subtle mt-5 flex flex-col items-center gap-3 p-6">
          <div className="rounded-small border-line bg-card border p-4">
            <QRCodeCanvas value={url} size={168} level="H" marginSize={1} />
          </div>
          <p className="text-c1 text-ink-secondary max-w-full truncate">{url.replace(/^https?:\/\//, "")}</p>
        </div>
        <QRCodeCanvas ref={downloadRef} value={url} size={512} level="H" marginSize={1} className="hidden" />
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={download} className={buttonStyles.outline}>
            {"Download PNG"}
          </button>
          <button type="button" onClick={onClose} className={buttonStyles.primary}>
            {"Done"}
          </button>
        </div>
      </div>
    </div>
  );
}
