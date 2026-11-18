"use client";

import { Icon } from "@/components/icon";
import { pledges, stayOptions, transportOptions } from "@/lib/listing";
import { Choice, fid, Group, type StepProps } from "./fields";

export function StepSafety({ listing, set, issues }: StepProps) {
  const trip = listing.kind === "trip";
  const mine = pledges[listing.kind];
  const all = mine.every((pledge) => listing.pledges.includes(pledge));

  const toggle = (pledge: string) =>
    set({ pledges: listing.pledges.includes(pledge) ? listing.pledges.filter((p) => p !== pledge) : [...listing.pledges, pledge] });

  return (
    <>
      <Group name="transport" legend="Getting there" error={issues.transport}>
        <div className="space-y-2">
          {transportOptions[listing.kind].map((option) => (
            <Choice key={option} name="transport" checked={listing.transport === option} onSelect={() => set({ transport: option })} title={option} />
          ))}
        </div>
      </Group>

      {trip ? (
        <Group name="stay" legend="Where the group stays" hint="Room sharing is always within the same gender unless everyone in the room opts in." error={issues.stay}>
          <div className="space-y-2">
            {stayOptions.map((option) => (
              <Choice key={option} name="stay" checked={listing.stay === option} onSelect={() => set({ stay: option })} title={option} />
            ))}
          </div>
        </Group>
      ) : null}

      <Group name="pledges" legend="Host commitments" hint="Breaking one of these ends hosting privileges." error={issues.pledges}>
        <ul className="card divide-y divide-line">
          {mine.map((pledge) => {
            const on = listing.pledges.includes(pledge);
            return (
              <li key={pledge}>
                <label className="flex cursor-pointer items-start gap-3 px-4 py-3.5 text-sm has-[:focus-visible]:bg-paper">
                  <input type="checkbox" checked={on} onChange={() => toggle(pledge)} className="peer sr-only" />
                  <span
                    className={`mt-px grid size-5 shrink-0 place-items-center rounded-md border-2 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-forest ${
                      on ? "border-forest bg-forest text-white" : "border-line"
                    }`}
                    aria-hidden="true"
                  >
                    {on ? <Icon name="check" className="size-3.5" /> : null}
                  </span>
                  {pledge}
                </label>
              </li>
            );
          })}
        </ul>
        {!all ? (
          <button type="button" className="mt-2 text-sm font-semibold text-forest underline underline-offset-4" onClick={() => set({ pledges: [...mine] })}>
            I confirm all of these
          </button>
        ) : null}
      </Group>

      <div id={fid("safety-info")} className="rounded-2xl bg-paper p-4 text-sm">
        <p className="flex items-center gap-2 font-semibold">
          <Icon name="shieldCheck" className="size-5 text-forest" />
          Included on every plan, free
        </p>
        <ul className="mt-2 space-y-1 text-xs leading-relaxed text-muted">
          <li>Every guest is selfie-verified{trip ? ", and ID-checked for overnight trips" : ""}</li>
          <li>Trip Mode with SOS, live location and check-ins for you and your guests</li>
          <li>Payments held by us, with a full refund to guests if you cancel</li>
        </ul>
      </div>
    </>
  );
}
