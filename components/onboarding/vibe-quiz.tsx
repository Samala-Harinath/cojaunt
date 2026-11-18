"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { vibeQuestions } from "@/lib/people";
import type { StepProps } from "./shell";

/** S6: one question per card, no swiping. Answering moves on; you can step back. */
export function VibeQuiz({ me, set, onNext }: StepProps) {
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(0);
  const question = vibeQuestions[index];
  const last = index === vibeQuestions.length - 1;

  function choose(option: number) {
    set({ vibe: { ...me.vibe, [question.key]: option } });
    setAnswered(Math.max(answered, index + 1));
    if (last) onNext();
    else setIndex(index + 1);
  }

  return (
    <div className="flex flex-1 flex-col px-5 pb-6">
      <h1 className="font-display text-3xl leading-tight">Your travel vibe</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Six quick questions. Your answers power the “why this fits you” notes on each plan, and nothing else.
      </p>

      <div key={question.key} className="rise card mt-6 p-5">
        <p className="eyebrow">
          Question {index + 1} of {vibeQuestions.length}
        </p>
        <h2 className="mt-2 font-display text-2xl leading-snug" aria-live="polite">
          {question.question}
        </h2>
        <div className="mt-5 space-y-2.5">
          {question.options.map((option, i) => {
            const picked = index < answered && me.vibe[question.key] === i;
            return (
              <button
                key={option}
                type="button"
                onClick={() => choose(i)}
                aria-pressed={picked}
                className="flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 text-left text-sm font-semibold transition-colors hover:border-forest aria-pressed:border-forest aria-pressed:bg-forest-soft"
              >
                {option}
                {picked ? <Icon name="check" className="size-5 text-forest" /> : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        {index > 0 ? (
          <button type="button" className="font-semibold text-forest underline underline-offset-4" onClick={() => setIndex(index - 1)}>
            Previous question
          </button>
        ) : (
          <span />
        )}
        <span className="text-muted">There are no right answers.</span>
      </div>
    </div>
  );
}
