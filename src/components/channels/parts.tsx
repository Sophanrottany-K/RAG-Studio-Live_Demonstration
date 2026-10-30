// Building blocks shared by the three channel cards (public link, web widget, Telegram).
import { useId, useState, type ReactNode } from "react";
import { ApiError } from "../../services/types";
import { errorMessage } from "../../services/api";

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
  // Details stay hidden until the arrow in the top right corner is clicked.
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const style = STATE_STYLE[state];
  return (
    <section className="self-stretch shrink-0 bg-bg-card border border-border-default rounded-[20px] flex flex-col items-start gap-5 p-7">
      <div className="self-stretch flex items-center gap-4">
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
        <button
          type="button"
          aria-expanded={open}
          aria-controls={detailsId}
          aria-label={`${open ? "Hide" : "Show"} ${title} details`}
          onClick={() => setOpen((o) => !o)}
          className="shrink-0 rounded-[8px] p-1 cursor-pointer hover:bg-bg-soft"
        >
          <img
            className={`w-6 h-6 transition-transform ${open ? "" : "-rotate-90"}`}
            src="icons/icon-chevron-down-3.svg"
            alt=""
          />
        </button>
      </div>
      {open && (
        <div id={detailsId} className="self-stretch flex flex-col items-start gap-5">
          {children}
        </div>
      )}
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
