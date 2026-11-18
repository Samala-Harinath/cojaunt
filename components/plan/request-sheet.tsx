"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { Proto, Sheet } from "@/components/ui";
import { patchMe, requestSeat } from "@/lib/actions";
import { maxSeats } from "@/lib/audience";
import { blockedFrom } from "@/lib/derive";
import { getPerson } from "@/lib/directory";
import type { Plan } from "@/lib/plans";
import { useApp } from "@/lib/store";

type Props = { plan: Plan; open: boolean; onClose: () => void };

/** S11: a short note to the host, behind an ID check for overnight plans. */
export function RequestSheet({ plan, open, onClose }: Props) {
  const app = useApp();
  const { me } = app;
  const [note, setNote] = useState("");
  const [seats, setSeats] = useState(1);
  const host = getPerson(plan.hostId).name;
  const full = plan.seatsLeft === 0;
  const needsId = plan.idRequired && !me.idVerified;
  const most = maxSeats(plan);
  const blocked = blockedFrom(app, plan);

  function submit() {
    requestSeat(plan.id, note.trim(), seats);
    setNote("");
    setSeats(1);
    onClose();
  }

  if (blocked === "status") {
    return (
      <Sheet open={open} onClose={onClose} title="Singles trips are for singles">
        <p className="text-sm leading-relaxed text-muted">
          Your profile says you’re married, so you can’t join Singles trips. Group trips are open to you, and you can change your status in your profile at any time.
        </p>
      </Sheet>
    );
  }

  if (blocked === "intent") {
    return (
      <Sheet open={open} onClose={onClose} title="This is a Singles trip">
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-muted">
            Everyone on a Singles trip has chosen Open to dating, so the group knows why they’re there. You’re set to New friends.
          </p>
          <p className="flex gap-2 text-xs leading-relaxed text-muted">
            <Icon name="eyeOff" className="mt-px size-4" />
            Your choice is private. Other members only ever see that a trip is a Singles trip, never who picked what.
          </p>
          <button type="button" className="btn btn-spark w-full" onClick={() => patchMe({ intent: "open" })}>
            <Icon name="heart" />
            I’m open to dating
          </button>
        </div>
      </Sheet>
    );
  }

  if (blocked === "age") {
    return (
      <Sheet open={open} onClose={onClose} title="Outside this trip’s age band">
        <p className="text-sm leading-relaxed text-muted">
          This Singles trip is for ages {plan.ageRange?.[0]}–{plan.ageRange?.[1]}, so everyone meets people at a similar stage. Other Singles trips run for different ages.
        </p>
      </Sheet>
    );
  }

  if (needsId) {
    return (
      <Sheet open={open} onClose={onClose} title="Verify your ID first">
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-muted">
            Overnight plans are open only to members with a verified government ID. Everyone else on this trip has done the same.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2.5">
              <Icon name="lock" className="mt-px size-4 text-forest" />
              We store the result of the check, never your ID number or a scan.
            </li>
            <li className="flex gap-2.5">
              <Icon name="eyeOff" className="mt-px size-4 text-forest" />
              Hosts and guests see a “Verified” badge and nothing else.
            </li>
          </ul>
          <Proto>
            No document is collected here. The real check will run through DigiLocker or a licensed verification partner.
          </Proto>
          <button type="button" className="btn btn-primary w-full" onClick={() => patchMe({ idVerified: true })}>
            <Icon name="id" />
            Verify my ID (simulated)
          </button>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onClose={onClose} title={full ? "Join the waitlist" : `Ask ${host} for a seat`}>
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-muted">
          {full
            ? "This plan is full. If a seat opens, it’s offered to the waitlist in order, and you pay only if you accept."
            : `${host} reads every request. You pay nothing until you’re approved.`}
        </p>
        {most > 1 && !full ? (
          <fieldset className="rounded-2xl border border-line p-4">
            <legend className="px-1 text-sm font-semibold">Seats, including you</legend>
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs leading-relaxed text-muted">
                Your crew is approved together. Each friend verifies before the plan, and you pay for everyone in one go.
              </p>
              <div className="flex shrink-0 items-center gap-3">
                <button type="button" className="grid size-9 place-items-center rounded-full border border-line disabled:opacity-40" aria-label="One fewer seat" disabled={seats <= 1} onClick={() => setSeats(seats - 1)}>
                  <Icon name="minus" className="size-4" />
                </button>
                <output aria-live="polite" className="min-w-5 text-center text-lg font-bold tabular-nums">
                  {seats}
                </output>
                <button type="button" className="grid size-9 place-items-center rounded-full border border-line disabled:opacity-40" aria-label="One more seat" disabled={seats >= most} onClick={() => setSeats(seats + 1)}>
                  <Icon name="plus" className="size-4" />
                </button>
              </div>
            </div>
          </fieldset>
        ) : null}
        <div>
          <label htmlFor="note" className="text-sm font-semibold">
            A note for {host} <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={200}
            rows={3}
            placeholder="Why this plan appeals to you, or anything the host should know."
            className="field mt-2 resize-none"
          />
          <p className="mt-1 text-right text-xs text-muted">{note.length}/200</p>
        </div>
        <p className="flex gap-2 text-xs leading-relaxed text-muted">
          <Icon name="eyeOff" className="mt-px size-4" />
          {host} sees your first name, verification badges and reviews. Your phone number and surname stay private.
        </p>
        <button type="button" className="btn btn-primary w-full" onClick={submit}>
          {full ? "Join the waitlist" : seats > 1 ? `Request ${seats} seats` : "Send request"}
        </button>
      </div>
    </Sheet>
  );
}
