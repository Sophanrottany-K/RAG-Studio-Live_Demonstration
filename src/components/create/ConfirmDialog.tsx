import { useEffect, type ReactNode } from "react";
import { Button } from "./ui";

export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel = "Keep editing",
  danger,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-[#1111114D] backdrop-blur-[4px]" onClick={onCancel} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-140 max-w-[90%] bg-bg-card rounded-[20px] shadow-[0px_16px_48px_0px_#0000001F] flex flex-col gap-2 p-6"
      >
        <div className="font-gabarito font-bold text-[20px] leading-[28px] text-ink-primary">{title}</div>
        <div className="font-gabarito text-[14px] leading-[20px] text-ink-secondary">{children}</div>
        <div className="flex justify-end gap-2.5 pt-4">
          <Button onClick={onCancel} autoFocus>
            {cancelLabel}
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
