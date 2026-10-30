// Web Widget channel card, laid out as in the RAG Studio web app
// (features/channels/components/web-widget-card.tsx): color and allowed domains with a live preview,
// then the embed code, which only appears once "Save and generate widget code" has been clicked.
// Flow follows web-widget-workflow.png: an enabled widget shows the install steps, a disabled one says so.
import { useState } from "react";
import { ArrowUp, ChevronDown, FileText, Lock, MessageCircleMore, Mic, X } from "lucide-react";
import { api, errorMessage } from "../../services/api";
import { ALLOWED_DOMAINS_MAX, isHexColor, normalizeDomain } from "../../services/limits";
import type { ChatbotChannels, WidgetChannel } from "../../services/types";
import { ChannelCard, formatDateTime } from "./parts";
import {
  ColorSetting,
  Notice,
  SectionLabel,
  buttonStyles,
  codeBlockStyles,
  cx,
  fieldStyles,
  labelStyles,
  useFeedback,
} from "./ui";

const PREVIEW_DOMAIN = "shop.example.com";

const INSTALL_STEPS = [
  {
    title: "Allow your website's domain",
    text: "In Allowed domains above, add the address your website runs on, without http:// — e.g. localhost:3000 while you develop, or shop.example.com once it's online. Then click Save and generate widget code.",
  },
  {
    title: "Copy the embed code",
    text: "Click Copy code above. The snippet already includes your chatbot ID — don't edit it.",
  },
  {
    title: "Paste it into your website, just before </body>",
    text: "Plain HTML or Vite/React: index.html. WordPress: a header & footer code plugin (Footer). Wix, Squarespace, Shopify: Settings → Custom code → Footer. Next.js: the root app/layout.tsx with next/script.",
  },
  {
    title: "Keep RAG Studio running",
    text: "The script is served by RAG Studio (this app), so keep it running while you use the widget, e.g. npm run dev.",
  },
  {
    title: "Open your website",
    text: "Refresh the page. The chat bubble appears in the bottom corner; click it to chat. Nothing there? Open the browser console: the widget explains why (domain not allowed, widget disabled…).",
  },
];

/** Black text on light colors, white on dark ones. */
function isLightColor(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255 > 0.6;
}

export function WidgetCard({
  chatbotId,
  widget,
  onSaved,
  chatbotName = "Your chatbot",
  chatbotPaused = false,
}: {
  chatbotId: string;
  /** Shown in the header of the previewed chat window. */
  chatbotName?: string;
  widget: WidgetChannel;
  onSaved: (c: ChatbotChannels) => void;
  chatbotPaused?: boolean;
}) {
  const [color, setColor] = useState(widget.primaryColor);
  const [domains, setDomains] = useState<string[]>(widget.allowedDomains);
  const [domainInput, setDomainInput] = useState("");
  const [domainError, setDomainError] = useState<string | null>(null);
  const [busy, setBusy] = useState<null | "save" | "toggle">(null);
  const [copied, setCopied] = useState(false);
  // True after any change to color or domains, until "Save and generate widget code" succeeds.
  const [edited, setEdited] = useState(false);
  const settingsFeedback = useFeedback();
  const codeFeedback = useFeedback();

  const addDomain = () => {
    const domain = normalizeDomain(domainInput);
    if (!domain) return setDomainError("Enter a domain like example.com.");
    if (!domains.includes(domain) && domains.length >= ALLOWED_DOMAINS_MAX)
      return setDomainError(`You can add at most ${ALLOWED_DOMAINS_MAX} domains.`);
    if (!domains.includes(domain)) {
      setDomains([...domains, domain]);
      setEdited(true);
    }
    setDomainInput("");
    setDomainError(null);
    settingsFeedback.show({ tone: "success", text: `${domain} added.` });
  };

  const removeDomain = (domain: string) => {
    setDomains(domains.filter((d) => d !== domain));
    setEdited(true);
    settingsFeedback.show({ tone: "success", text: `${domain} removed.` });
  };

  const save = async () => {
    if (!isHexColor(color)) return settingsFeedback.show({ tone: "danger", text: "Use a hex color like #111111." });
    setBusy("save");
    try {
      onSaved(
        await api.saveWidget(chatbotId, {
          primaryColor: color,
          position: widget.position,
          welcomeMessage: widget.welcomeMessage,
          allowedDomains: domains,
        }),
      );
      setEdited(false);
      settingsFeedback.show({ tone: "success", text: "Widget code generated." });
    } catch (e) {
      settingsFeedback.show({ tone: "danger", text: errorMessage(e) });
    } finally {
      setBusy(null);
    }
  };

  const copyCode = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      codeFeedback.show({ tone: "success", text: "Embed code copied." });
    } catch {
      codeFeedback.show({ tone: "danger", text: "Could not copy. Select the text and copy it yourself." });
    }
  };

  const toggle = async () => {
    const enabling = !widget.enabled;
    setBusy("toggle");
    try {
      onSaved(await api.setChannelEnabled(chatbotId, "widget", enabling));
      codeFeedback.show({
        tone: "success",
        text: enabling
          ? "Widget enabled. It now shows on your allowed domains."
          : "Widget disabled. It no longer shows on your website.",
      });
    } catch (e) {
      codeFeedback.show({ tone: "danger", text: errorMessage(e) });
    } finally {
      setBusy(null);
    }
  };

  const state = !widget.configured ? "off" : !widget.enabled ? "paused" : chatbotPaused ? "chatbotPaused" : "live";
  const subtitle = widget.configured
    ? `${widget.messagesThisWeek} inbound messages this week · Updated ${formatDateTime(widget.updatedAt)}`
    : "A chat bubble you embed on your own website";
  // web-widget-workflow.png: Have domain? → Generate widget → Show JavaScript code box. Any edit hides the code
  // until "Save and generate widget code" is clicked again, even if the edit is undone.
  const snippet = edited ? null : widget.embedCode;
  const canSave = domains.length > 0 && busy === null && (edited || !widget.embedCode);

  return (
    <ChannelCard icon="icons/channel-icon-2.svg" title="Web Widget" subtitle={subtitle} state={state}>
      <div className="self-stretch font-gabarito">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 min-w-0">
            <SectionLabel>{"Widget settings"}</SectionLabel>
            <ColorSetting
              label="Primary color"
              value={color}
              onChange={(hex) => {
                setColor(hex);
                setEdited(true);
              }}
            />

            <div className="mt-5">
              <label htmlFor="widget-domain" className={labelStyles}>
                {"Allowed domains"}
              </label>
              <div className="flex gap-2">
                <input
                  id="widget-domain"
                  value={domainInput}
                  placeholder="example.com"
                  aria-invalid={domainError !== null}
                  onChange={(e) => {
                    setDomainInput(e.target.value);
                    setDomainError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addDomain();
                    }
                  }}
                  className={fieldStyles}
                />
                <button type="button" onClick={addDomain} className={cx(buttonStyles.outline, "h-12")}>
                  {"Add domain"}
                </button>
              </div>
              {domainError && <p className="text-c1 text-danger-text mt-2">{domainError}</p>}

              {domains.length === 0 ? (
                <p className="text-c1 text-ink-secondary mt-2">{"No allowed domains configured."}</p>
              ) : (
                <ul className="rounded-small border-line mt-2 divide-y divide-(--border-default) border">
                  {domains.map((domain) => (
                    <li key={domain} className="flex items-center justify-between gap-3 px-3 py-2">
                      <span className="text-p4 text-ink font-bold">{domain}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${domain}`}
                        onClick={() => removeDomain(domain)}
                        className={cx(buttonStyles.dangerSoft, "h-8 px-3")}
                      >
                        {"Remove"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="button"
              onClick={save}
              disabled={!canSave}
              className={cx(canSave ? buttonStyles.primary : buttonStyles.outline, "mt-6 h-12 px-6")}
            >
              {busy === "save" ? "Saving…" : "Save and generate widget code"}
            </button>

            {/* Sits under the button in the left column, so the taller preview doesn't leave a gap above it. */}
            {snippet && (
              <div className="border-line mt-6 border-t pt-6">
                <SectionLabel>{"Embed code"}</SectionLabel>
                <pre className={codeBlockStyles}>
                  <code>{snippet}</code>
                </pre>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => copyCode(snippet)} className={buttonStyles.primary}>
                    {copied ? "Copied" : "Copy code"}
                  </button>
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={toggle}
                    className={widget.enabled ? buttonStyles.danger : buttonStyles.outline}
                  >
                    {busy === "toggle" ? "…" : widget.enabled ? "Disable" : "Enable"}
                  </button>
                </div>
                {widget.enabled ? (
                  <>
                    <p className="text-c1 text-ink-secondary mt-3">
                      {"Paste the snippet before </body> on your website. The widget appears on allowed domains only."}
                    </p>
                    <InstallGuide snippet={snippet} />
                  </>
                ) : (
                  <Notice tone="danger" className="mt-4">
                    <span className="font-bold">{"Widget: DISABLED. "}</span>
                    {"It no longer appears on your website. Enable it to see the install steps."}
                  </Notice>
                )}
              </div>
            )}
          </div>

          <WidgetPreview
            color={isHexColor(color) ? color : "#111111"}
            domain={domains[0] ?? PREVIEW_DOMAIN}
            position={widget.position}
            chatbotName={chatbotName}
          />
        </div>
      </div>
    </ChannelCard>
  );
}

/** A browser window with the chat bubble in the chosen color; clicking the bubble opens the chat window. */
function WidgetPreview({
  color,
  domain,
  position,
  chatbotName,
}: {
  color: string;
  domain: string;
  position: WidgetChannel["position"];
  chatbotName: string;
}) {
  const [open, setOpen] = useState(false);
  const left = position === "bottom-left";
  // The owner's own color, so it is set inline, not with a token class.
  const brand = { backgroundColor: color, color: isLightColor(color) ? "black" : "white" };
  return (
    <div>
      <p className="text-p4 text-ink font-bold">{"Live preview"}</p>
      <p className="text-c1 text-ink-secondary">{"Click the bubble to view the web widget"}</p>
      <div className="rounded-small border-line bg-subtle relative mt-3 h-[30rem] overflow-hidden border">
        <div aria-hidden className="border-line bg-card flex items-center gap-2 border-b px-3 py-2">
          <span className="flex gap-1">
            {[0, 1, 2].map((dot) => (
              <span key={dot} className="bg-muted size-2 rounded-full" />
            ))}
          </span>
          <span className="rounded-pill border-line text-c3 text-ink-secondary flex-1 truncate border px-3 py-1">
            {domain}
          </span>
        </div>
        <div aria-hidden className="flex flex-col gap-2 p-4">
          <span className="h-3 w-1/3 rounded-xs bg-[#D6D6D2]" />
          <span className="h-2 w-5/6 rounded-xs bg-[#D6D6D2]" />
          <span className="h-2 w-3/4 rounded-xs bg-[#D6D6D2]" />
          <span className="h-2 w-1/2 rounded-xs bg-[#D6D6D2]" />
        </div>
        {open && <PreviewChatWindow name={chatbotName} brand={brand} left={left} onClose={() => setOpen(false)} />}
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Close the previewed chat window" : "Open the previewed chat window"}
          onClick={() => setOpen((o) => !o)}
          className={cx(
            "rounded-pill shadow-elevated absolute bottom-4 flex size-12 cursor-pointer items-center justify-center",
            left ? "left-4" : "right-4",
          )}
          style={brand}
        >
          {open ? <X className="size-5" /> : <MessageCircleMore className="size-5" />}
        </button>
      </div>
      <p className="text-c1 text-ink-secondary mt-2 flex items-center gap-2">
        <span aria-hidden className="border-line size-2.5 rounded-full border" style={{ backgroundColor: color }} />
        {`Primary color ${color} · Position: ${left ? "Bottom Left" : "Bottom Right"}`}
      </p>
    </div>
  );
}

/** The opened widget as visitors see it (web-widget.png), with a sample exchange. */
function PreviewChatWindow({
  name,
  brand,
  left,
  onClose,
}: {
  name: string;
  brand: { backgroundColor: string; color: string };
  left: boolean;
  onClose: () => void;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "C";
  return (
    <div
      role="dialog"
      aria-label={`${name} chat window preview`}
      className={cx(
        "rounded-small border-line bg-card shadow-elevated absolute bottom-20 flex h-[22rem] w-64 flex-col overflow-hidden border",
        left ? "left-4" : "right-4",
      )}
    >
      <div className="border-line flex items-center gap-2 border-b px-3 py-2.5">
        <span className="bg-accent-tint text-accent text-c1 flex size-7 shrink-0 items-center justify-center rounded-lg font-bold">
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-c1 text-ink truncate font-bold">{name}</p>
          <p className="text-c3 text-ink-secondary truncate">{"Online · answers from your documents"}</p>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="bg-subtle text-ink flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full"
        >
          <X className="size-3.5" />
        </button>
      </div>

      <div aria-hidden className="bg-subtle flex flex-1 flex-col gap-2.5 overflow-hidden px-3 py-3">
        <p className="text-c3 max-w-[85%] self-end rounded-xl px-3 py-2" style={brand}>
          {"What can you help me with?"}
        </p>
        <p className="text-c3 text-ink-secondary flex items-center gap-1.5 font-mono tracking-widest uppercase">
          <span className="bg-accent-tint text-accent flex size-4 items-center justify-center rounded font-bold">
            {initial}
          </span>
          {"Searched 1 source"}
        </p>
        <p className="text-c3 text-ink-body">
          {"I answer questions using the documents in this chatbot’s knowledge base. "}
          <span className="border-line rounded border px-1">{"1"}</span>
        </p>
        <span className="rounded-pill border-line bg-card text-c3 text-ink flex items-center gap-1.5 self-start border px-2 py-1">
          <span className="bg-subtle rounded px-1">{"1"}</span>
          <FileText className="size-3" />
          <span className="font-bold">{"knowledge-base"}</span>
          <span className="text-ink-secondary">{"PDF"}</span>
        </span>
      </div>

      <div aria-hidden className="border-line border-t px-3 pt-2 pb-1.5">
        <div className="rounded-pill border-line flex items-center gap-1.5 border py-1 pr-1 pl-3">
          <span className="text-c3 text-ink-muted flex-1 truncate">{`Ask ${name}…`}</span>
          <span className="border-line flex size-6 items-center justify-center rounded-full border">
            <Mic className="size-3" />
          </span>
          <span className="flex size-6 items-center justify-center rounded-full" style={brand}>
            <ArrowUp className="size-3" />
          </span>
        </div>
        <p className="text-c3 text-ink-secondary mt-1.5 flex items-center justify-center gap-1">
          <Lock className="size-2.5" />
          {"Answers come only from your documents"}
        </p>
      </div>
    </div>
  );
}

/** "How to install" row that opens the four install steps. */
function InstallGuide({ snippet }: { snippet: string }) {
  const [open, setOpen] = useState(false);
  const bodyExample = `<body>\n  …your page content…\n  ${snippet.replace(/\n\s*/g, " ")}\n</body>`;
  return (
    <div className="rounded-small border-line bg-subtle mt-4 border">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left"
      >
        <ChevronDown
          aria-hidden
          className={cx("text-ink size-4 shrink-0 transition-transform", open && "rotate-180")}
        />
        <span className="text-c1 text-ink font-bold">{"How to install"}</span>
        <span className="text-c1 text-ink-secondary flex-1 truncate">
          {open
            ? `${INSTALL_STEPS.length} steps · about 2 minutes`
            : `${INSTALL_STEPS.length} steps · Paste the snippet before </body> on your website`}
        </span>
        <span className="text-c1 text-ink font-bold">{open ? "Hide steps" : "Show steps"}</span>
      </button>
      {open && (
        <div className="border-line mx-4 border-t py-4">
          <ol className="flex flex-col gap-4">
            {INSTALL_STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="bg-inverse text-on-inverse text-c3 flex size-5 shrink-0 items-center justify-center rounded-full font-bold">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-c1 text-ink font-bold">{step.title}</p>
                  <p className="text-c1 text-ink-body">{step.text}</p>
                  {index === 2 && (
                    <pre className={cx(codeBlockStyles, "mt-2 p-4")}>
                      <code>{bodyExample}</code>
                    </pre>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <Notice className="mt-4">
            {
              "Prototype: chatbot data is stored in this browser only. The widget works on websites you open in this same browser (any localhost port works); visitors on other computers will need RAG Studio's real servers."
            }
          </Notice>
        </div>
      )}
    </div>
  );
}
