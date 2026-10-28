import { useRef, useState } from "react";
import { api } from "../../services/api";
import { ALLOWED_DOMAINS_MAX, WELCOME_MESSAGE_MAX, isHexColor, normalizeDomain } from "../../services/limits";
import type { ChatbotChannels, WidgetChannel, WidgetPosition } from "../../services/types";
import { Banner, Button, ChipGroup, Field, TextArea, TextInput } from "../create/ui";
import { ChannelCard, ColorField, CopyButton, Divider, SubTitle, formatDateTime, splitError } from "./parts";

const POSITIONS = ["Bottom right", "Bottom left"] as const;
const toPosition = (label: (typeof POSITIONS)[number]): WidgetPosition =>
  label === "Bottom left" ? "bottom-left" : "bottom-right";
const toLabel = (position: WidgetPosition) => (position === "bottom-left" ? "Bottom left" : "Bottom right");

const INSTALL_STEPS = [
  "Copy the embed code above.",
  "Open the HTML of your site (or your site builder's custom code settings).",
  "Paste the snippet just before the closing </body> tag on every page that should show the chat.",
  "Publish, then open your site from an allowed domain — the launcher appears in the corner you picked.",
];

function WidgetPreview({
  color,
  position,
  welcome,
  domain,
}: {
  color: string;
  position: WidgetPosition;
  welcome: string;
  domain: string;
}) {
  const [open, setOpen] = useState(false);
  const side = position === "bottom-left" ? "left-4" : "right-4";
  const safeColor = isHexColor(color) ? color : "#111111";
  return (
    <div className="w-85 shrink-0 bg-bg-card border border-border-default rounded-[16px] overflow-hidden flex flex-col">
      <div className="shrink-0 bg-[#F5F5F3] flex items-center gap-2.5 px-3 py-2.5">
        <div className="shrink-0 flex items-start gap-[5px]">
          <div className="w-2 h-2 bg-[#D4D4D0] rounded-full" />
          <div className="w-2 h-2 bg-[#D4D4D0] rounded-full" />
          <div className="w-2 h-2 bg-[#D4D4D0] rounded-full" />
        </div>
        <div className="flex-1 min-w-0 bg-[#FFFFFF] border border-[#E4E4E0] rounded-full px-3 py-[5px] truncate font-gabarito text-[11px] text-[#6B6B6B]">
          {domain}
        </div>
      </div>
      <div className="relative h-80 bg-[#FAFAF9]">
        <div className="absolute inset-x-5 top-5 flex flex-col gap-2.5">
          <div className="h-3 w-2/3 rounded-full bg-[#ECECE8]" />
          <div className="h-3 w-full rounded-full bg-[#F0F0EC]" />
          <div className="h-3 w-5/6 rounded-full bg-[#F0F0EC]" />
        </div>
        {open && (
          <div
            className={`absolute bottom-[76px] ${side} w-60 bg-bg-card border border-border-default rounded-[14px] shadow-[0px_8px_24px_0px_#0000001F] overflow-hidden flex flex-col`}
          >
            <div
              className="px-3.5 py-2.5 font-gabarito font-bold text-[13px] text-white"
              style={{ background: safeColor }}
            >
              Chat with us
            </div>
            <div className="px-3.5 py-3 flex flex-col gap-2">
              <div className="self-start max-w-[90%] bg-bg-soft rounded-[10px] px-2.5 py-1.5 font-gabarito text-[12px] text-ink-body break-words">
                {welcome.trim() || "Hi! How can I help?"}
              </div>
            </div>
            <div className="mx-3 mb-3 border border-border-default rounded-full px-3 py-1.5 font-gabarito text-[11px] text-ink-muted">
              Type your question…
            </div>
          </div>
        )}
        <button
          type="button"
          aria-label={open ? "Close chat preview" : "Open chat preview"}
          onClick={() => setOpen((o) => !o)}
          className={`absolute bottom-4 ${side} w-12 h-12 rounded-full flex items-center justify-center text-white text-[20px] shadow-[0px_4px_12px_0px_#00000033] cursor-pointer`}
          style={{ background: safeColor }}
        >
          {open ? "×" : "💬"}
        </button>
      </div>
      <div className="shrink-0 px-3.5 py-2.5 border-t border-border-default font-gabarito text-[12px] text-ink-muted">
        Live preview · click the launcher
      </div>
    </div>
  );
}

export function WidgetCard({
  chatbotId,
  widget,
  onSaved,
  chatbotPaused = false,
}: {
  chatbotId: string;
  widget: WidgetChannel;
  onSaved: (c: ChatbotChannels) => void;
  chatbotPaused?: boolean;
}) {
  const codeRef = useRef<HTMLPreElement>(null);
  const [color, setColor] = useState(widget.primaryColor);
  const [position, setPosition] = useState<WidgetPosition>(widget.position);
  const [welcome, setWelcome] = useState(widget.welcomeMessage);
  const [domains, setDomains] = useState<string[]>(widget.allowedDomains);
  const [domainText, setDomainText] = useState("");
  const [domainError, setDomainError] = useState<string | null>(null);
  const [busy, setBusy] = useState<null | "save" | "toggle">(null);
  const [fieldError, setFieldError] = useState<{ field: string | null; message: string } | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);

  const dirty =
    color !== widget.primaryColor ||
    position !== widget.position ||
    welcome !== widget.welcomeMessage ||
    domains.join(",") !== widget.allowedDomains.join(",");
  const errorFor = (field: string) => (fieldError?.field === field ? fieldError.message : null);

  const addDomain = () => {
    if (!domainText.trim()) return;
    const parts = domainText.split(/[\s,]+/).filter(Boolean);
    const next = [...domains];
    for (const part of parts) {
      const domain = normalizeDomain(part);
      if (!domain)
        return setDomainError(`“${part}” isn't a valid domain. Use something like shop.example.com or *.example.com.`);
      if (!next.includes(domain)) next.push(domain);
    }
    if (next.length > ALLOWED_DOMAINS_MAX) return setDomainError(`You can add at most ${ALLOWED_DOMAINS_MAX} domains.`);
    setDomains(next);
    setDomainText("");
    setDomainError(null);
    if (fieldError?.field === "allowedDomains") setFieldError(null);
  };

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
    if (!isHexColor(color)) return setFieldError({ field: "primaryColor", message: "Use a hex color like #111111." });
    if (!domains.length)
      return setFieldError({ field: "allowedDomains", message: "Add at least one domain where the widget may load." });
    run(
      "save",
      () =>
        api.saveWidget(chatbotId, { primaryColor: color, position, welcomeMessage: welcome, allowedDomains: domains }),
      ["primaryColor", "welcomeMessage", "allowedDomains"],
    );
  };

  const state = !widget.configured ? "off" : !widget.enabled ? "paused" : chatbotPaused ? "chatbotPaused" : "live";
  const subtitle = widget.configured
    ? `${widget.messagesThisWeek} inbound messages this week · Updated ${formatDateTime(widget.updatedAt)}`
    : "A chat bubble you embed on your own website";

  return (
    <ChannelCard icon="icons/channel-icon-2.svg" title="Web Widget" subtitle={subtitle} state={state}>
      <div className="self-stretch flex items-start gap-6">
        <form
          className="flex-1 min-w-0 flex flex-col items-start gap-5"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <SubTitle>Appearance</SubTitle>
          <div className="self-stretch flex items-start gap-6">
            <div className="shrink-0">
              <Field label="Primary color" htmlFor="widget-color" error={errorFor("primaryColor")}>
                <ColorField id="widget-color" value={color} onChange={setColor} invalid={!!errorFor("primaryColor")} />
              </Field>
            </div>
            <div className="shrink-0">
              <Field label="Launcher position">
                <ChipGroup
                  label="Launcher position"
                  options={POSITIONS}
                  value={toLabel(position)}
                  onChange={(v) => setPosition(toPosition(v))}
                />
              </Field>
            </div>
          </div>
          <Field
            label="Welcome message"
            htmlFor="widget-welcome"
            counter={`${welcome.length}/${WELCOME_MESSAGE_MAX}`}
            error={errorFor("welcomeMessage")}
            hint="The first message visitors see when they open the chat."
          >
            <TextArea
              id="widget-welcome"
              rows={2}
              value={welcome}
              maxLength={WELCOME_MESSAGE_MAX}
              invalid={!!errorFor("welcomeMessage")}
              onChange={(e) => setWelcome(e.target.value)}
            />
          </Field>

          <SubTitle>Allowed domains</SubTitle>
          <Field
            label="Websites that may load the widget"
            htmlFor="widget-domain"
            counter={`${domains.length}/${ALLOWED_DOMAINS_MAX}`}
            error={domainError ?? errorFor("allowedDomains")}
            hint="Press Enter to add. Use *.example.com to allow every subdomain."
          >
            <div className="self-stretch flex items-start gap-2.5">
              <TextInput
                id="widget-domain"
                className="flex-1 min-w-0"
                placeholder="shop.example.com"
                value={domainText}
                invalid={!!(domainError ?? errorFor("allowedDomains"))}
                onChange={(e) => {
                  setDomainText(e.target.value);
                  setDomainError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addDomain();
                  }
                }}
              />
              <Button disabled={!domainText.trim()} onClick={addDomain}>
                Add
              </Button>
            </div>
          </Field>
          {domains.length > 0 && (
            <ul className="self-stretch flex flex-col border border-border-default rounded-[12px] overflow-hidden">
              {domains.map((domain) => (
                <li
                  key={domain}
                  className="flex items-center gap-3 px-4 py-2.5 border-b border-border-default last:border-b-0"
                >
                  <span className="flex-1 min-w-0 truncate font-roboto-mono text-[13px] text-ink-primary">
                    {domain}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${domain}`}
                    className="shrink-0 font-gabarito font-medium text-[13px] text-ink-secondary hover:text-danger-text cursor-pointer"
                    onClick={() => setDomains((list) => list.filter((d) => d !== domain))}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          {fieldError && !fieldError.field && <Banner tone="danger">{fieldError.message}</Banner>}
          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary" loading={busy === "save"} disabled={widget.configured && !dirty}>
              {widget.configured ? "Save widget settings" : "Save and generate widget code"}
            </Button>
            {widget.configured && dirty && (
              <span className="font-gabarito text-[13px] text-warning-text">Unsaved changes</span>
            )}
          </div>
        </form>
        <WidgetPreview
          color={color}
          position={position}
          welcome={welcome}
          domain={domains[0]?.replace(/^\*\./, "www.") ?? "your-site.com"}
        />
      </div>

      <Divider />
      <SubTitle>Embed code</SubTitle>
      {!widget.embedCode ? (
        <div className="self-stretch bg-bg-soft rounded-[12px] px-4 py-3 font-gabarito text-[14px] text-ink-body">
          No embed code yet. Save your settings to generate the snippet.
        </div>
      ) : (
        <div className="self-stretch flex flex-col items-start gap-3">
          <pre
            ref={codeRef}
            className="self-stretch bg-[#111111] text-[#E9E9E6] rounded-[12px] px-4 py-3.5 font-roboto-mono text-[13px] leading-[20px] whitespace-pre-wrap break-all"
          >
            {widget.embedCode}
          </pre>
          <div className="flex flex-wrap items-center gap-2.5">
            <CopyButton text={widget.embedCode} label="Copy code" fallbackTarget={() => codeRef.current} />
            <Button
              loading={busy === "toggle"}
              onClick={() => run("toggle", () => api.setChannelEnabled(chatbotId, "widget", !widget.enabled))}
            >
              {widget.enabled ? "Disable widget" : "Enable widget"}
            </Button>
          </div>
          {!widget.enabled && (
            <div className="font-gabarito text-[13px] text-ink-secondary">
              The widget is disabled. The snippet stays installed but the launcher is hidden.
            </div>
          )}
          <div className="self-stretch bg-[#FAFAF9] border border-[#E4E4E0] rounded-[16px] flex flex-col items-start px-4.5 py-3.5 gap-3">
            <button
              type="button"
              aria-expanded={guideOpen}
              onClick={() => setGuideOpen((o) => !o)}
              className="self-stretch flex items-center gap-2.5 text-left cursor-pointer"
            >
              <img
                className={`w-4 h-4 shrink-0 transition-transform ${guideOpen ? "rotate-90" : ""}`}
                src="icons/chevron.svg"
                alt=""
              />
              <span className="font-gabarito font-bold text-[14px] text-[#111111]">How to install</span>
              <span className="font-gabarito text-[13px] text-[#6B6B6B]">
                4 steps · Paste the snippet before &lt;/body&gt; on your website
              </span>
              <span className="flex-1" />
              <span className="font-gabarito font-bold text-[13px] text-[#111111]">
                {guideOpen ? "Hide steps" : "Show steps"}
              </span>
            </button>
            {guideOpen && (
              <ol className="flex flex-col gap-1.5 pl-6.5">
                {INSTALL_STEPS.map((step, i) => (
                  <li key={step} className="font-gabarito text-[13px] text-[#444444]">
                    {i + 1}. {step}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}
    </ChannelCard>
  );
}
