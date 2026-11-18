"use client";

import { statuses } from "@/components/onboarding/basics";
import { patchMe } from "@/lib/actions";
import { vibeQuestions } from "@/lib/people";
import type { Me } from "@/lib/store";

const intents: { id: Me["intent"]; label: string }[] = [
  { id: "friends", label: "New friends" },
  { id: "open", label: "Open to dating" },
];

/** The answers behind every “why this fits you” note, editable at any time. */
export function VibeEditor({ me }: { me: Me }) {
  return (
    <section className="card p-5" aria-labelledby="vibe-heading">
      <h2 id="vibe-heading" className="font-display text-2xl">
        Your travel vibe
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-muted">These six answers are all the matching uses. Change one and the plan suggestions update straight away.</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {vibeQuestions.map((question) => (
          <label key={question.key} className="block text-sm font-semibold">
            {question.question}
            <select
              value={me.vibe[question.key]}
              onChange={(event) => patchMe({ vibe: { ...me.vibe, [question.key]: Number(event.target.value) } })}
              className="field mt-1.5 font-normal"
            >
              {question.options.map((option, i) => (
                <option key={option} value={i}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <fieldset className="mt-5 border-t border-line pt-4">
        <legend className="sr-only">Relationship status</legend>
        <p className="text-sm font-semibold">Relationship status</p>
        <p className="mt-0.5 text-xs text-muted">Dating plans and Sparks are for single members only. Choosing Married switches dating off.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {statuses.map((option) => (
            <label key={option.id} className={`chip cursor-pointer ${me.status === option.id ? "border-ink bg-ink text-paper" : ""}`}>
              <input
                type="radio"
                name="status"
                value={option.id}
                checked={me.status === option.id}
                onChange={() => patchMe({ status: option.id, ...(option.id === "married" ? { intent: "friends" as const } : {}) })}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5 border-t border-line pt-4">
        <legend className="sr-only">What you’re here for</legend>
        <p className="text-sm font-semibold">Here for</p>
        <p className="mt-0.5 text-xs text-muted">
          {me.status === "married" ? "You’re set to New friends because dating is for single members." : "Private. No other member is ever told which one you picked."}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {intents.filter((option) => me.status !== "married" || option.id === "friends").map((option) => (
            <label key={option.id} className={`chip cursor-pointer ${me.intent === option.id ? "border-ink bg-ink text-paper" : ""}`}>
              <input type="radio" name="intent" value={option.id} checked={me.intent === option.id} onChange={() => patchMe({ intent: option.id })} className="sr-only" />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  );
}
