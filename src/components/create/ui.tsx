// Form building blocks for the Create chatbot wizard, styled with the Figma tokens.
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

const fieldBase =
  "self-stretch bg-bg-card border rounded-[12px] font-gabarito text-[14px] leading-[20px] text-ink-primary placeholder:text-[#999999] transition-colors focus:outline-none focus:border-ink-primary focus:ring-1 focus:ring-ink-primary disabled:bg-bg-subtle disabled:text-ink-disabled";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="shrink-0 font-gabarito font-medium text-[11px] leading-[16px] tracking-[2.4px] uppercase text-ink-secondary">
      {children}
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  counter,
  hint,
  error,
  children,
}: {
  label: ReactNode;
  htmlFor?: string;
  counter?: string;
  hint?: ReactNode;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <div className="self-stretch shrink-0 flex flex-col items-start gap-2">
      <div className="self-stretch flex justify-between items-center gap-3">
        <label htmlFor={htmlFor} className="font-gabarito font-medium text-[12px] leading-[16px] text-ink-primary">
          {label}
        </label>
        {counter && (
          <div className="font-geist-mono text-[12px] leading-[16px] tracking-[0.4px] text-ink-muted">{counter}</div>
        )}
      </div>
      {children}
      {error ? (
        <div role="alert" className="self-stretch font-gabarito text-[12px] leading-[16px] text-danger-text">
          {error}
        </div>
      ) : (
        hint && <div className="self-stretch font-gabarito text-[12px] leading-[16px] text-ink-secondary">{hint}</div>
      )}
    </div>
  );
}

export function TextInput({
  invalid,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      className={cx(fieldBase, "h-12 px-3.5", invalid ? "border-danger-solid" : "border-border-default", className)}
    />
  );
}

export function TextArea({
  invalid,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      {...props}
      aria-invalid={invalid || undefined}
      className={cx(
        fieldBase,
        "px-4 py-3.5 resize-y",
        invalid ? "border-danger-solid" : "border-border-default",
        className,
      )}
    />
  );
}

export function Select({
  invalid,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <div className="self-stretch relative">
      <select
        {...props}
        className={cx(
          fieldBase,
          "w-full h-12 pl-3.5 pr-10 appearance-none cursor-pointer shadow-[0px_1px_2px_0px_#0000000D]",
          invalid ? "border-danger-solid" : "border-border-default",
          className,
        )}
      >
        {children}
      </select>
      <img
        className="pointer-events-none absolute right-3.5 top-3.5 w-5 h-5"
        src="icons/icon-chevron-down-2.svg"
        alt=""
      />
    </div>
  );
}

export function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap items-start gap-2">
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option)}
            className={cx(
              "h-9 rounded-full flex items-center px-3.5 border font-gabarito font-medium text-[14px] leading-[20px] transition-colors cursor-pointer",
              selected
                ? "bg-bg-inverse border-bg-inverse text-ink-on-dark"
                : "bg-bg-card border-border-default text-ink-body hover:border-ink-muted",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export function Button({
  variant = "secondary",
  loading,
  icon,
  className,
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; loading?: boolean; icon?: string }) {
  return (
    <button
      type="button"
      {...props}
      disabled={disabled || loading}
      className={cx(
        "shrink-0 rounded-[20px] flex justify-center items-center gap-2 px-6 py-3.5 font-gabarito font-bold text-[16px] leading-[20px] transition-opacity cursor-pointer disabled:cursor-not-allowed disabled:opacity-40",
        variant === "primary" && "bg-bg-inverse text-ink-on-dark hover:opacity-90",
        variant === "secondary" && "bg-bg-card border border-border-default text-ink-primary hover:bg-bg-soft",
        variant === "ghost" && "text-ink-primary hover:bg-bg-soft",
        variant === "danger" && "bg-danger-solid text-ink-on-dark hover:opacity-90",
        className,
      )}
    >
      {loading ? (
        <Spinner light={variant === "primary" || variant === "danger"} />
      ) : (
        icon && <img className="w-4.5 h-4.5 shrink-0" src={icon} alt="" />
      )}
      {children}
    </button>
  );
}

export function Spinner({ light, size = 16 }: { light?: boolean; size?: number }) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className={cx(
        "inline-block shrink-0 rounded-full border-2 animate-spin",
        light ? "border-white/30 border-t-white" : "border-border-default border-t-ink-primary",
      )}
    />
  );
}

type Tone = "neutral" | "warning" | "success" | "danger" | "info";

const pillTones: Record<Tone, { box: string; dot: string; text: string }> = {
  neutral: { box: "bg-neutral-tint border-[#D6D6D2]", dot: "bg-[#8A8A86]", text: "text-neutral-text" },
  warning: { box: "bg-warning-surface border-warning-tint", dot: "bg-warning-solid", text: "text-warning-text" },
  success: { box: "bg-success-tint border-[#B7E2C8]", dot: "bg-success-solid", text: "text-success-text" },
  danger: { box: "bg-danger-tint border-danger-border", dot: "bg-danger-solid", text: "text-danger-text" },
  info: { box: "bg-[#ECE7FB] border-[#DCD3F6]", dot: "bg-accent-indigo", text: "text-accent-indigo" },
};

export function StatusPill({ tone, children, pulse }: { tone: Tone; children: ReactNode; pulse?: boolean }) {
  const t = pillTones[tone];
  return (
    <span className={cx("shrink-0 border rounded-[20px] inline-flex items-center gap-1 px-[7px] py-0.5", t.box)}>
      <span className={cx("w-[5px] h-[5px] rounded-full", t.dot, pulse && "animate-pulse")} />
      <span
        className={cx(
          "whitespace-pre font-gabarito font-medium text-[10px] leading-[14px] tracking-[0.3px] uppercase",
          t.text,
        )}
      >
        {children}
      </span>
    </span>
  );
}

export function Banner({
  tone = "info",
  children,
  onDismiss,
}: {
  tone?: "info" | "danger" | "warning";
  children: ReactNode;
  onDismiss?: () => void;
}) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cx(
        "self-stretch shrink-0 rounded-[12px] flex items-start gap-2.5 px-3.5 py-3 font-gabarito text-[14px] leading-[20px]",
        tone === "info" && "bg-bg-subtle text-ink-body",
        tone === "danger" && "bg-danger-tint border border-danger-border text-danger-text",
        tone === "warning" && "bg-warning-surface border border-warning-tint text-warning-text",
      )}
    >
      <img
        className="w-4 h-4 shrink-0 mt-0.5"
        src={tone === "warning" ? "icons/lock-property-linear.svg" : "icons/info-circle-property-linear.svg"}
        alt=""
      />
      <div className="flex-1 min-w-0">{children}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 text-[16px] leading-none opacity-60 hover:opacity-100 cursor-pointer"
        >
          ×
        </button>
      )}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx(
        "w-10 h-6 shrink-0 rounded-full p-0.5 transition-colors cursor-pointer",
        checked ? "bg-bg-inverse" : "bg-border-default",
      )}
    >
      <span
        className={cx("block w-5 h-5 rounded-full bg-white shadow transition-transform", checked && "translate-x-4")}
      />
    </button>
  );
}
