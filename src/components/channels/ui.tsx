// Styles and small parts shared by the Public Share Link and Web Widget cards, as in the RAG Studio
// web app (features/channels/{styles.ts,use-feedback.ts,components/channel-ui.tsx}).
import type { ReactNode } from "react";
import { showToast } from "../shared/Toaster";

export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

const btn =
  "rounded-pill text-btn-sm inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 px-5 font-bold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";

export const buttonStyles = {
  primary: `${btn} bg-inverse text-on-inverse`,
  outline: `${btn} border-line bg-card text-ink border`,
  danger: `${btn} bg-danger text-white`,
  dangerSoft: `${btn} bg-danger-tint text-danger-text`,
  ghost: `${btn} text-ink bg-transparent`,
};

export const labelStyles = "text-p4 text-ink mb-2 block font-bold";
export const fieldStyles =
  "rounded-small border-line bg-card text-p3 text-ink placeholder:text-ink-muted h-12 w-full border px-4 outline-none focus:border-accent aria-invalid:border-danger-text";
/** Extra classes for a field the owner cannot edit. */
export const readOnlyFieldStyles = "bg-subtle text-ink-secondary";
export const codeBlockStyles =
  "rounded-small bg-inverse text-on-inverse text-c1 overflow-x-auto p-5 font-mono leading-6 whitespace-pre";

export type Feedback = { tone: "success" | "danger"; text: string };

/** Feedback for an action, shown as a toast in the top right corner of the page. */
export function useFeedback() {
  return { show: (next: Feedback) => showToast(next) };
}

const noticeTone = {
  neutral: "bg-subtle text-ink-body",
  danger: "bg-danger-tint text-danger-text",
  success: "bg-success-tint text-success-text",
};

/** Full-width tinted bar with one line of text. */
export function Notice({
  tone = "neutral",
  className,
  children,
}: {
  tone?: keyof typeof noticeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <p
      role={tone === "danger" ? "alert" : undefined}
      className={cx("rounded-small text-p3 px-4 py-3", noticeTone[tone], className)}
    >
      {children}
    </p>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <h4 className="text-eyebrow text-ink-secondary mb-4 font-bold tracking-widest uppercase">{children}</h4>;
}

/** Swatch + hex value; clicking the swatch opens the browser's color picker. */
export function ColorSetting({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  return (
    <div>
      <p className={labelStyles}>{label}</p>
      <label className="rounded-small inline-flex cursor-pointer items-center gap-3">
        <span className="sr-only">{`${label}: ${value}`}</span>
        <input
          type="color"
          value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#111111"}
          onChange={(e) => onChange(e.target.value.toLowerCase())}
          className="sr-only"
        />
        <span className="rounded-small border-line bg-card border p-1">
          <span className="block h-6 w-9 rounded-xs" style={{ background: value }} />
        </span>
        <span className="text-c1 text-ink-body font-mono">{value}</span>
      </label>
    </div>
  );
}
