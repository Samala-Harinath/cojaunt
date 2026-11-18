"use client";

import { useState } from "react";
import { sendAsk } from "@/lib/actions";
import { askInfo, askProblem, NOTE_MAX } from "@/lib/asks";
import type { Person } from "@/lib/people";
import { useApp, type AskKind } from "@/lib/store";
import { Icon } from "./icon";
import { Sheet } from "./ui";

type Props = { person: Person; kind: AskKind; onClose: () => void };

const copy: Record<AskKind, { title: (name: string) => string; lead: (name: string) => string; placeholder: string; button: string }> = {
  spark: {
    title: (name) => `Send ${name} a Spark`,
    lead: (name) => `A Spark says you’d like to get to know ${name} and maybe go on a date. If ${name} accepts, you can chat.`,
    placeholder: "Say what caught your eye, or suggest a plan.",
    button: "Send Spark",
  },
  travel: {
    title: (name) => `Travel with ${name}?`,
    lead: (name) => `Ask ${name} to be your travel buddy. If ${name} accepts, you can chat and plan a trip together.`,
    placeholder: "Where would you like to go, and when?",
    button: "Send request",
  },
};

/** Mount only while open, so every request starts with an empty note. */
export function AskSheet({ person, kind, onClose }: Props) {
  const app = useApp();
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const text = copy[kind];
  // Checked live, so the button explains itself before the member types anything.
  const blocker = askProblem(app, person.id, kind, "");

  function submit() {
    const problem = sendAsk(person.id, kind, note);
    if (problem) return setError(problem);
    setSent(true);
  }

  if (sent) {
    return (
      <Sheet open onClose={onClose} title={kind === "spark" ? "Spark sent" : "Request sent"}>
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-muted">
            We’ll tell you when {person.name} replies. If it’s a no, you’ll just see “Not this time”, and nobody is told anything else.
          </p>
          <button type="button" className="btn btn-primary w-full" onClick={onClose}>
            Done
          </button>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet open onClose={onClose} title={text.title(person.name)}>
      <form
        noValidate
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <p className="text-sm leading-relaxed text-muted">{text.lead(person.name)}</p>

        <div>
          <label htmlFor="ask-note" className="text-sm font-semibold">
            A short note <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="ask-note"
            value={note}
            onChange={(event) => {
              setNote(event.target.value);
              setError("");
            }}
            maxLength={NOTE_MAX}
            rows={3}
            placeholder={text.placeholder}
            className="field mt-2 resize-none"
          />
          <p className="mt-1 text-right text-xs text-muted">
            {note.length}/{NOTE_MAX}
          </p>
        </div>

        <ul className="space-y-2 rounded-2xl bg-paper p-4 text-xs leading-relaxed text-muted">
          <li className="flex gap-2">
            <Icon name="eye" className="size-4 shrink-0 text-forest" />
            {person.name} sees your first name, age, photos and this note.
          </li>
          <li className="flex gap-2">
            <Icon name="lock" className="size-4 shrink-0 text-forest" />
            Your surname, workplace, area and Instagram stay hidden until {person.name} accepts.
          </li>
        </ul>

        <p role="alert" className="min-h-5 text-sm font-semibold text-danger">
          {error || blocker}
        </p>

        <button type="submit" className={`btn w-full ${kind === "spark" ? "btn-spark" : "btn-primary"}`} disabled={Boolean(blocker)}>
          <Icon name={askInfo[kind].icon} />
          {text.button}
        </button>
      </form>
    </Sheet>
  );
}
