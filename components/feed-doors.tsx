"use client";

import type { KeyboardEvent } from "react";
import { categories, type Category } from "@/lib/audience";
import { Icon, type IconName } from "./icon";

const doors: Record<Category, { label: string; icon: IconName; line: string; tone: string }> = {
  date: { label: "Date", icon: "heart", line: "Send a Spark to someone you like", tone: "bg-spark text-white" },
  buddy: { label: "Travel buddy", icon: "user", line: "Find one person to travel with", tone: "bg-forest text-white" },
  trips: { label: "Trips", icon: "map", line: "Join a hosted group or singles trip", tone: "bg-ink text-paper" },
};

export const doorId = (id: Category) => `door-${id}`;
export const doorPanel = "door-panel";

type DoorsProps = { value: Category; counts: Record<Category, number | undefined>; onChange: (next: Category) => void };

/** The three ways into Discover. Big, plain and impossible to misread. WAI-ARIA tabs pattern. */
export function Doors({ value, counts, onChange }: DoorsProps) {
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const index = categories.indexOf(value);
    const keys: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: categories.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = categories[(keys[event.key] + categories.length) % categories.length];
    onChange(next);
    document.getElementById(doorId(next))?.focus();
  }

  return (
    <div role="tablist" aria-label="What are you looking for" className="grid grid-cols-3 gap-1 rounded-full border border-line bg-surface p-1">
      {categories.map((id) => {
        const door = doors[id];
        const on = id === value;
        return (
          <button
            key={id}
            id={doorId(id)}
            type="button"
            role="tab"
            aria-selected={on}
            aria-controls={doorPanel}
            tabIndex={on ? 0 : -1}
            onKeyDown={onKeyDown}
            onClick={() => onChange(id)}
            title={door.line}
            className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold transition-colors ${
              on ? door.tone : "text-muted hover:text-ink"
            }`}
          >
            <Icon name={door.icon} className="size-4 shrink-0" />
            <span className="truncate">{door.label}</span>
            {counts[id] !== undefined ? <span className="hidden tabular-nums opacity-70 sm:inline">{counts[id]}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

/** One quiet line under a list explaining who can contact whom. */
export function PrivacyNote({ text }: { text: string }) {
  return (
    <p className="flex items-start gap-2 px-1 text-xs leading-relaxed text-muted">
      <Icon name="eyeOff" className="mt-px size-4" />
      {text}
    </p>
  );
}

/** A small "nothing here" with one way out, instead of a big empty block. */
export function NoneFound({ text, action, onAction }: { text: string; action: string; onAction: () => void }) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-8 text-center">
      <p className="text-sm text-muted">{text}</p>
      <button type="button" onClick={onAction} className="btn btn-soft btn-sm">
        {action}
      </button>
    </div>
  );
}
