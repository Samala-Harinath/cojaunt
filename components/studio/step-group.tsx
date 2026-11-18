"use client";

import { audienceIcon } from "@/components/audience";
import { Icon } from "@/components/icon";
import { audienceIds, audiences } from "@/lib/audience";
import { canDate } from "@/lib/derive";
import { ageOptions, asAudience } from "@/lib/listing";
import type { Me } from "@/lib/store";
import { Choice, Counter, Field, fid, Group, type StepProps } from "./fields";
import { VibePicker } from "./vibe-picker";

/**
 * Who the plan is for. Group trip or Singles trip comes first, because it changes the rules below:
 * a Singles trip is single-only, mixed (never women-only or men-only), and keeps ages in a tight band.
 */
export function StepGroup({ listing, set, issues, me }: StepProps & { me: Me }) {
  const singles = listing.audience === "dating";
  const singlesAllowed = canDate(me);

  return (
    <>
      <Group
        name="audience"
        legend="Type of trip"
        hint="Group trips appear under Trips → Group trips. Singles trips appear under Trips → Singles trips, and only single members open to dating can see or join them."
        error={issues.audience}
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {audienceIds.map((id) => (
            <Choice
              key={id}
              name="audience"
              checked={listing.audience === id}
              disabled={id === "dating" && !singlesAllowed && !singles}
              onSelect={() => set(asAudience(listing, id))}
              title={audiences[id].label}
              hint={id === "dating" && !singlesAllowed ? "Only single members open to dating can host these." : audiences[id].promises[0]}
              icon={<Icon name={audienceIcon[id]} className={`mt-0.5 size-5 ${id === "dating" ? "text-spark" : "text-forest"}`} />}
            />
          ))}
        </div>
      </Group>

      {singles ? (
        <ul className="space-y-1.5 rounded-2xl bg-spark-soft p-4 text-sm">
          {audiences.dating.promises.map((promise) => (
            <li key={promise} className="flex gap-2">
              <Icon name="check" className="mt-px size-4 shrink-0 text-spark" />
              {promise}
            </li>
          ))}
        </ul>
      ) : null}

      <Group name="seats" legend="Group size, not counting you" hint="4 to 10 guests. Smaller groups get better reviews and more repeat bookings." error={issues.seats}>
        <Counter name="seats" label="seat" value={listing.seats} min={4} max={10} onChange={(seats) => set({ seats })} />
      </Group>

      <Field
        name="age"
        label="Age range"
        hint={singles ? "Singles trips keep everyone within 12 years, so the group are peers. The band shows on the card." : "Guests outside the range won’t see the plan."}
        error={issues.age}
      >
        <div className="flex items-center gap-3">
          <select id={fid("age")} aria-label="Youngest age" value={listing.ageMin} onChange={(event) => set({ ageMin: Number(event.target.value) })} className="field">
            {ageOptions.filter((age) => age < listing.ageMax).map((age) => (
              <option key={age} value={age}>
                {age}
              </option>
            ))}
          </select>
          <span className="text-sm text-muted">to</span>
          <select aria-label="Oldest age" value={listing.ageMax} onChange={(event) => set({ ageMax: Number(event.target.value) })} className="field">
            {ageOptions.filter((age) => age > listing.ageMin).map((age) => (
              <option key={age} value={age}>
                {age === ageOptions[ageOptions.length - 1] ? `${age}+` : age}
              </option>
            ))}
          </select>
        </div>
      </Field>

      {singles ? null : (
        <Group name="crew" legend="Who can join" hint="Women-only trips are hidden from men, and men-only trips from women. You can only run the kinds that include you.">
          <div className="grid gap-2 sm:grid-cols-3">
            <Choice name="crew" checked={!listing.womenOnly && !listing.menOnly} onSelect={() => set({ womenOnly: false, menOnly: false })} title="Women & men" hint="A mixed group. Everyone can see it." />
            {me.gender === "man" ? null : (
              <Choice name="crew" checked={listing.womenOnly} onSelect={() => set({ womenOnly: true, menOnly: false })} title="Only women" hint="Hidden from men." />
            )}
            {me.gender === "woman" ? null : (
              <Choice name="crew" checked={Boolean(listing.menOnly)} onSelect={() => set({ menOnly: true, womenOnly: false })} title="Only men" hint="Hidden from women." />
            )}
          </div>
        </Group>
      )}

      <VibePicker listing={listing} set={set} />
    </>
  );
}
