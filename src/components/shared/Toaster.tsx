// Toasts in the top right corner of the page. Mounted once by Stage; anything can call showToast().
import { useSyncExternalStore } from "react";
import { CircleAlert, CircleCheck, X } from "lucide-react";

export type ToastTone = "success" | "danger";
type ToastItem = { id: number; tone: ToastTone; text: string };

const TOAST_MS = 4000;
const MAX_TOASTS = 3;

let items: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

function dismiss(id: number) {
  items = items.filter((t) => t.id !== id);
  emit();
}

export function showToast(toast: { tone: ToastTone; text: string }) {
  const id = nextId++;
  items = [...items, { id, ...toast }].slice(-MAX_TOASTS);
  emit();
  setTimeout(() => dismiss(id), TOAST_MS);
}

export function Toaster() {
  const list = useSyncExternalStore(subscribe, () => items);
  return (
    // Fixed inside Stage's scaled box, so it sits at the top right of the page at the page's scale.
    <div
      aria-live="polite"
      className="pointer-events-none fixed top-5 right-5 z-[100] flex w-90 flex-col items-end gap-2 font-gabarito"
    >
      {list.map((t) => (
        <div
          key={t.id}
          role={t.tone === "danger" ? "alert" : "status"}
          className="pointer-events-auto flex w-full items-start gap-3 rounded-[16px] border border-[#E4E4E0] bg-[#FFFFFF] px-4 py-3.5 shadow-[0px_2px_6px_0px_#00000014]"
        >
          {t.tone === "danger" ? (
            <CircleAlert aria-hidden className="text-danger-text mt-px size-5 shrink-0" />
          ) : (
            <CircleCheck aria-hidden className="text-success-text mt-px size-5 shrink-0" />
          )}
          <p className="min-w-0 flex-1 text-[14px] leading-normal text-[#111111]">{t.text}</p>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => dismiss(t.id)}
            className="shrink-0 cursor-pointer text-[#6B6B6B] hover:text-[#111111]"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
