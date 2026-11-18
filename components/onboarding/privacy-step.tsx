"use client";

import { Proto, Switch } from "@/components/ui";
import type { Privacy } from "@/lib/store";
import { Shell } from "./shell";

type Props = { privacy: Privacy; onChange: (patch: Partial<Privacy>) => void; onFinish: () => void };

export const visibilityOptions: { id: Privacy["visibility"]; label: string; hint: string }[] = [
  { id: "plans", label: "People on plans I join", hint: "Guests and the host see your first name and photo once you’re approved." },
  { id: "connections", label: "Only my Travel Friends and Sparks", hint: "Other guests see a first name and a blurred photo until you connect." },
];

/** S8: who can find you, and what location is shared. */
export function PrivacyStep({ privacy, onChange, onFinish }: Props) {
  return (
    <Shell title="Your privacy" lead="Sensible defaults are on already. You can change any of this later in the Safety centre." onNext={onFinish} nextLabel="Finish and see plans">
      <div className="card divide-y divide-line px-4">
        <Switch
          checked={privacy.hideFromContacts}
          onChange={(next) => onChange({ hideFromContacts: next })}
          label="Hide me from my phone contacts"
          hint="Family and colleagues in your contacts won’t see you on any plan, and you won’t see them."
        />
        <Switch
          checked={privacy.preciseLocation}
          onChange={(next) => onChange({ preciseLocation: next })}
          label="Share live location in Trip Mode"
          hint="Goes only to your own emergency contacts, and only while a trip is running. Other members never see where you are."
        />
      </div>

      <Proto>Contact matching needs the mobile app, so the first switch only records your choice for now.</Proto>

      <fieldset>
        <legend className="text-sm font-semibold">Who can see my profile</legend>
        <div className="mt-2 space-y-2.5">
          {visibilityOptions.map((option) => (
            <label
              key={option.id}
              className={`block cursor-pointer rounded-2xl border p-4 ${privacy.visibility === option.id ? "border-forest bg-forest-soft" : "border-line bg-surface"}`}
            >
              <input
                type="radio"
                name="visibility"
                value={option.id}
                checked={privacy.visibility === option.id}
                onChange={() => onChange({ visibility: option.id })}
                className="sr-only"
              />
              <span className="block text-sm font-bold">{option.label}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-muted">{option.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </Shell>
  );
}
