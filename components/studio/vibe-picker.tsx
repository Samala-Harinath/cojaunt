"use client";

import { planVibe } from "@/lib/listing";
import { Group, type StepProps } from "./fields";

/** The six vibe answers for a plan, matching the questions every member answers. */
export function VibePicker({ listing, set }: Pick<StepProps, "listing" | "set">) {
  return (
    <Group name="vibe" legend="The vibe" hint="These match the six questions every member answers. They power the “why this fits you” notes guests see.">
      <div className="space-y-4">
        {planVibe.map((question) => (
          <div key={question.key} role="radiogroup" aria-label={question.label}>
            <p className="text-xs font-semibold text-muted">{question.label}</p>
            <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-2xl bg-paper p-1">
              {question.options.map((option, i) => {
                const on = listing.vibe[question.key] === i;
                return (
                  <label
                    key={option}
                    className={`cursor-pointer rounded-xl px-2 py-2 text-center text-xs font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-forest ${
                      on ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
                    }`}
                  >
                    <input type="radio" name={`vibe-${question.key}`} checked={on} onChange={() => set({ vibe: { ...listing.vibe, [question.key]: i } })} className="sr-only" />
                    {option}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Group>
  );
}
