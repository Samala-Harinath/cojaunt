"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { interestOptions } from "@/lib/people";
import type { Me } from "@/lib/store";
import { Shell, type StepProps } from "./shell";

const intents: { id: Me["intent"]; label: string; hint: string }[] = [
  { id: "friends", label: "New friends", hint: "You’ll be asked who you’d travel with again, and that’s all." },
  { id: "open", label: "Open to dating", hint: "After a plan you can also mark a private Spark. It shows only if it’s mutual." },
];

/** S7: interests and private intent. */
export function About({ me, set, onNext }: StepProps) {
  const [intent, setIntent] = useState<Me["intent"] | null>(me.interests.length > 0 ? me.intent : null);
  const [error, setError] = useState("");

  function toggle(tag: string) {
    const has = me.interests.includes(tag);
    set({ interests: has ? me.interests.filter((item) => item !== tag) : [...me.interests, tag] });
  }

  function submit() {
    if (me.interests.length < 3) return setError("Pick at least three interests.");
    if (me.status === "married") {
      set({ intent: "friends" });
      return onNext();
    }
    if (!intent) return setError("Choose what you’re here for. Only you will see it.");
    set({ intent });
    onNext();
  }

  return (
    <Shell title="What are you into?" lead="Pick at least three. They help us suggest plans, and they’re shown on your profile." onNext={submit} error={error}>
      <div className="flex flex-wrap gap-2">
        {interestOptions.map((tag) => (
          <button key={tag} type="button" className="chip" aria-pressed={me.interests.includes(tag)} onClick={() => toggle(tag)}>
            {tag}
          </button>
        ))}
      </div>

      {me.status === "married" ? (
        <p className="rounded-2xl bg-forest-soft p-4 text-sm text-forest-deep">
          <strong className="block">You’re here for friends.</strong>
          Dating is for single members, so we’ll show you travel buddies and group trips.
        </p>
      ) : (
      <fieldset>
        <legend className="font-display text-2xl">What are you here for?</legend>
        <p className="mt-1 flex items-start gap-1.5 text-xs leading-relaxed text-muted">
          <Icon name="lock" className="mt-px size-3.5" />
          Private. No other member, host or guest is ever told which one you picked.
        </p>
        <div className="mt-3 space-y-2.5">
          {intents.map((option) => (
            <label
              key={option.id}
              className={`block cursor-pointer rounded-2xl border p-4 ${intent === option.id ? "border-forest bg-forest-soft" : "border-line bg-surface"}`}
            >
              <input type="radio" name="intent" value={option.id} checked={intent === option.id} onChange={() => setIntent(option.id)} className="sr-only" />
              <span className="block text-sm font-bold">{option.label}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-muted">{option.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>
      )}
    </Shell>
  );
}
