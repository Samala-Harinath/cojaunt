"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Icon, type IconName } from "./icon";

export type FilterOption<T extends string> = { id: T; label: string };

type Props<T extends string> = {
  /** Short name of the filter, shown above the value inside the trigger. */
  label: string;
  icon: IconName;
  value: T;
  /** The value that means "no filter". The trigger is highlighted whenever the value differs. */
  initial: T;
  options: FilterOption<T>[];
  onChange: (value: T) => void;
};

/** A compact dropdown for a single filter. Replaces a full row of chips with one pill. */
export function FilterSelect<T extends string>({ label, icon, value, initial, options, onChange }: Props<T>) {
  const base = useId();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selected = Math.max(0, options.findIndex((option) => option.id === value));
  const [cursor, setCursor] = useState(selected);
  const current = options[selected];
  const changed = value !== initial;
  const optionId = (index: number) => `${base}-option-${index}`;

  useEffect(() => {
    if (!open) return;
    const away = (event: PointerEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  const show = () => {
    setCursor(selected);
    setOpen(true);
  };

  const pick = (index: number) => {
    onChange(options[index].id);
    setOpen(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (!open) return show();
        const step = event.key === "ArrowDown" ? 1 : -1;
        setCursor((index) => (index + step + options.length) % options.length);
        break;
      }
      case "Home":
        if (open) {
          event.preventDefault();
          setCursor(0);
        }
        break;
      case "End":
        if (open) {
          event.preventDefault();
          setCursor(options.length - 1);
        }
        break;
      case "Enter":
      case " ":
        if (open) {
          event.preventDefault();
          pick(cursor);
        }
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${base}-list`}
        aria-activedescendant={open ? optionId(cursor) : undefined}
        aria-label={`${label}: ${current.label}`}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
        className={`flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-left text-sm transition-colors ${
          changed || open ? "border-forest bg-forest-soft" : "border-line bg-surface hover:border-forest/50"
        }`}
      >
        <Icon name={icon} className={`size-4 shrink-0 ${changed ? "text-forest-deep" : "text-muted"}`} />
        <span className="truncate">
          <span className="text-muted">{label}: </span>
          <span className="font-bold">{current.label}</span>
        </span>
        <Icon name="down" className={`size-4 shrink-0 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <ul
          id={`${base}-list`}
          role="listbox"
          aria-label={label}
          className="rise absolute left-0 top-full z-30 mt-2 min-w-full w-max max-w-[18rem] rounded-2xl border border-line bg-surface p-1.5 shadow-xl shadow-black/10"
        >
          {options.map((option, index) => {
            const on = option.id === value;
            return (
              <li
                key={option.id}
                id={optionId(index)}
                role="option"
                aria-selected={on}
                onPointerEnter={() => setCursor(index)}
                onClick={() => pick(index)}
                className={`flex cursor-pointer items-center justify-between gap-6 rounded-xl px-3 py-2.5 text-sm ${
                  on ? "font-bold text-forest-deep" : "font-medium"
                } ${index === cursor ? (on ? "bg-forest-soft" : "bg-paper") : on ? "bg-forest-soft/60" : ""}`}
              >
                {option.label}
                {on ? <Icon name="check" className="size-4 text-forest" /> : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
