// Building blocks shared by the three channel cards (public link, web widget, Telegram).
import { useEffect, useRef, useState, type ReactNode } from "react";
import { isHexColor } from "../../services/limits";
import { ApiError } from "../../services/types";
import { errorMessage } from "../../services/api";
import { Button } from "../create/ui";

export function formatDateTime(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

/** Splits an API error into a message for one field, or a general message for the card. */
export function splitError(error: unknown, fields: string[]) {
  if (error instanceof ApiError && error.field && fields.includes(error.field))
    return { field: error.field, message: error.message };
  return { field: null, message: errorMessage(error) };
}

export type ChannelState = "off" | "live" | "paused" | "connected" | "chatbotPaused";

const STATE_STYLE: Record<ChannelState, { box: string; dot: string; label: string }> = {
  off: { box: "bg-[#F0F0EE] text-[#6B6B6B]", dot: "bg-[#6B6B6B]", label: "Off" },
  paused: { box: "bg-warning-surface text-warning-text", dot: "bg-warning-solid", label: "Disabled" },
  live: { box: "bg-[#E7F6EC] text-[#1A7F37]", dot: "bg-[#1A7F37]", label: "Live" },
  connected: { box: "bg-[#E7F6EC] text-[#1A7F37]", dot: "bg-[#1A7F37]", label: "Connected" },
  chatbotPaused: { box: "bg-warning-surface text-warning-text", dot: "bg-warning-solid", label: "Chatbot paused" },
};

export function ChannelCard({
  icon,
  title,
  subtitle,
  state,
  children,
}: {
  icon: string;
  title: string;
  subtitle: string;
  state: ChannelState;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const style = STATE_STYLE[state];
  return (
    <section className="self-stretch shrink-0 bg-bg-card border border-border-default rounded-[20px] flex flex-col items-start gap-5 p-7">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="self-stretch flex items-center gap-4 text-left cursor-pointer"
      >
        <img className="w-12 h-12 shrink-0" src={icon} alt="" />
        <div className="flex-1 min-w-0 flex flex-col items-start gap-1">
          <h3 className="font-gabarito font-bold text-[20px] leading-normal text-ink-primary">{title}</h3>
          <div className="font-gabarito text-[13px] leading-normal text-ink-secondary">{subtitle}</div>
        </div>
        <span
          className={`shrink-0 rounded-full flex items-center gap-1.5 px-3 py-[5px] font-gabarito font-medium text-[12px] ${style.box}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
          {style.label}
        </span>
        <img
          className={`w-6 h-6 shrink-0 transition-transform ${open ? "" : "-rotate-90"}`}
          src="icons/icon-chevron-down-3.svg"
          alt=""
        />
      </button>
      {open && children}
    </section>
  );
}

export function SubTitle({ children }: { children: ReactNode }) {
  return (
    <div className="font-gabarito font-bold text-[12px] leading-normal tracking-[0.08em] uppercase text-ink-muted">
      {children}
    </div>
  );
}

export function Divider() {
  return <div className="self-stretch h-px shrink-0 bg-border-default" />;
}

/** Native color picker plus an editable hex field, kept in sync. */
export function ColorField({
  id,
  value,
  onChange,
  invalid,
}: {
  id: string;
  value: string;
  onChange: (hex: string) => void;
  invalid?: boolean;
}) {
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  return (
    <div className="flex items-center gap-2.5">
      <label className="shrink-0 bg-bg-card border border-border-default rounded-[10px] p-1 cursor-pointer">
        <span className="sr-only">Pick a color</span>
        <input
          type="color"
          value={isHexColor(value) ? value : "#111111"}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
        <span className="block w-9 h-6 rounded-[6px]" style={{ background: isHexColor(value) ? value : "#111111" }} />
      </label>
      <input
        id={id}
        value={text}
        maxLength={7}
        spellCheck={false}
        aria-invalid={invalid || undefined}
        onChange={(e) => {
          const next = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
          setText(next);
          onChange(next);
        }}
        className={`w-28 h-10 bg-bg-card border rounded-[10px] px-3 font-roboto-mono text-[13px] text-ink-body focus:outline-none focus:border-ink-primary focus:ring-1 focus:ring-ink-primary ${
          invalid ? "border-danger-solid" : "border-border-default"
        }`}
      />
    </div>
  );
}

/** Copies text and briefly confirms; falls back to selecting the text if the clipboard is blocked. */
export function CopyButton({
  text,
  label,
  variant = "primary",
  fallbackTarget,
}: {
  text: string;
  label: string;
  variant?: "primary" | "secondary";
  fallbackTarget?: () => HTMLElement | null;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      const el = fallbackTarget?.();
      if (el) window.getSelection()?.selectAllChildren(el);
    }
  };
  return (
    <Button variant={variant} onClick={copy}>
      {copied ? "Copied ✓" : label}
    </Button>
  );
}
