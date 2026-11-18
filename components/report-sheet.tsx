"use client";

import { useState } from "react";
import { blockPerson } from "@/lib/actions";
import { reportReasons } from "@/lib/safety";
import { Icon } from "./icon";
import { Proto, Sheet } from "./ui";

type Props = { open: boolean; onClose: () => void; about: string; personId?: string };

/** Report from anywhere: a category, optional details and, for a person, the choice to block them too. */
export function ReportSheet({ open, onClose, about, personId }: Props) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [block, setBlock] = useState(true);
  const [done, setDone] = useState(false);

  function close() {
    // Blocking waits until the sheet closes, so the confirmation stays on screen.
    if (done && personId && block) blockPerson(personId);
    setReason("");
    setDetails("");
    setDone(false);
    onClose();
  }

  if (done) {
    return (
      <Sheet open={open} onClose={close} title="Thanks for telling us">
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-muted">
            In the live app, reports go straight to the safety team and are acknowledged within 24 hours. The person you report is never told who reported them.
          </p>
          <Proto>This report was not sent to anyone. If you are in danger, call 112.</Proto>
          <a href="tel:112" className="btn btn-danger w-full">
            <Icon name="phone" />
            Call 112
          </a>
          <button type="button" className="btn btn-line w-full" onClick={close}>
            Done
          </button>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onClose={close} title={`Report ${about}`}>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (reason) setDone(true);
        }}
      >
        <fieldset>
          <legend className="text-sm font-semibold">What happened?</legend>
          <div className="mt-2 space-y-2">
            {reportReasons.map((option) => (
              <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 text-sm ${reason === option ? "border-forest bg-forest-soft" : "border-line"}`}>
                <input type="radio" name="reason" value={option} checked={reason === option} onChange={() => setReason(option)} className="size-4 accent-forest" />
                {option}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="report-details" className="text-sm font-semibold">
            Anything else we should know? <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="report-details"
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            rows={3}
            maxLength={500}
            placeholder="What was said or done, and when."
            className="field mt-2 resize-none"
          />
        </div>

        {personId ? (
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input type="checkbox" checked={block} onChange={(event) => setBlock(event.target.checked)} className="size-4 accent-forest" />
            Also block {about}, everywhere
          </label>
        ) : null}

        <button type="submit" className="btn btn-primary w-full" disabled={!reason}>
          Send report
        </button>
      </form>
    </Sheet>
  );
}
