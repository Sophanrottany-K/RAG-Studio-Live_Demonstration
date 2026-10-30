import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type SelectOption = { value: string; label: string };

/**
 * Dropdown with a styled list, as in the RAG Studio web app (components/ui/select.tsx).
 * Keyboard: Arrow keys, Home/End, Enter/Space to choose, Escape to close.
 */
export function Select({
  label,
  options,
  value,
  onChange,
  valuePrefix,
  className = "",
}: {
  /** Read by screen readers. Not shown on screen. */
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  /** Muted text before the chosen value, e.g. "Chatbot:". */
  valuePrefix?: string;
  className?: string;
}) {
  const id = useId();
  const labelId = `${id}-label`;
  const buttonId = `${id}-button`;
  const optionId = (index: number) => `${id}-option-${index}`;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (open) document.getElementById(`${id}-option-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex, id]);

  const openList = () => {
    setActiveIndex(Math.max(0, selectedIndex));
    setOpen(true);
  };
  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };
  const choose = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    close();
  };

  const onListKeyDown = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(last, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(last);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(activeIndex);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <span id={labelId} className="sr-only">
        {label}
      </span>
      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${labelId} ${buttonId}`}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            openList();
          }
        }}
        className={`bg-card text-p1 rounded-small shadow-subtle flex h-12 w-full cursor-pointer items-center gap-2 border px-4 text-left transition-colors ${
          open ? "border-accent" : "border-line hover:border-accent"
        }`}
      >
        <span className="min-w-0 flex-1 truncate">
          {valuePrefix && <span className="text-ink-secondary">{`${valuePrefix} `}</span>}
          <span className="text-ink">{selected?.label ?? ""}</span>
        </span>
        <ChevronDown aria-hidden className="text-ink shrink-0" />
      </button>
      {open && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={labelId}
          aria-activedescendant={optionId(activeIndex)}
          onKeyDown={onListKeyDown}
          className="bg-card border-line shadow-elevated rounded-small absolute top-full left-0 z-20 mt-2 max-h-72 w-full overflow-y-auto border p-1.5 outline-none"
        >
          {options.map((option, index) => {
            const isSelected = index === selectedIndex;
            return (
              <li
                key={option.value}
                id={optionId(index)}
                role="option"
                aria-selected={isSelected}
                onClick={() => choose(index)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`rounded-tag text-p3 flex cursor-pointer items-center gap-2 px-3 py-2.5 ${
                  index === activeIndex ? "bg-subtle" : ""
                } ${isSelected ? "text-ink font-medium" : "text-ink-body"}`}
              >
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                {isSelected && <Check className="text-accent size-4 shrink-0" aria-hidden />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
