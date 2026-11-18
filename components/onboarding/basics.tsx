"use client";

import { useState } from "react";
import { brand } from "@/lib/brand";
import type { Gender, Relationship } from "@/lib/people";
import { Shell, type StepProps } from "./shell";

const genders: { id: Gender; label: string }[] = [
  { id: "woman", label: "Woman" },
  { id: "man", label: "Man" },
  { id: "nonbinary", label: "Non-binary" },
];

export const statuses: { id: Relationship; label: string }[] = [
  { id: "single", label: "Single" },
  { id: "married", label: "Married" },
];

/** Age in whole years. The date is split by hand so the result doesn't shift with the time zone. */
function ageFrom(dob: string, today: Date): number {
  const [year, month, day] = dob.split("-").map(Number);
  const thisMonth = today.getMonth() + 1;
  const hadBirthday = thisMonth > month || (thisMonth === month && today.getDate() >= day);
  return today.getFullYear() - year - (hadBirthday ? 0 : 1);
}

/** S3: name, date of birth (18+), gender, optional pronouns. */
export function Basics({ me, set, onNext }: StepProps) {
  const [name, setName] = useState(me.name);
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<Gender | null>(me.name ? me.gender : null);
  const [pronouns, setPronouns] = useState(me.pronouns);
  const [status, setStatus] = useState<Relationship>(me.status);
  const [error, setError] = useState("");

  function submit() {
    const first = name.trim();
    if (first.length < 2) return setError("Enter your first name.");
    if (!dob) return setError("Enter your date of birth.");
    const age = ageFrom(dob, new Date());
    if (!Number.isFinite(age) || age > 100) return setError("Check your date of birth.");
    if (age < 18) return setError(`${brand.name} is for adults. You need to be 18 or older to join.`);
    if (!gender) return setError("Choose how you identify. It’s used for women-only plans and group balance.");
    // Dating is only for single members, so a married member can only be here for friends.
    set({ name: first, age, gender, pronouns: pronouns.trim(), status, ...(status === "married" ? { intent: "friends" as const } : {}) });
    onNext();
  }

  return (
    <Shell title="The basics" lead="Other members see your first name and age. Nothing else on this screen is shown." onNext={submit} error={error}>
      <div>
        <label htmlFor="name" className="text-sm font-semibold">
          First name
        </label>
        <input id="name" autoComplete="given-name" value={name} onChange={(event) => setName(event.target.value)} className="field mt-2" />
      </div>

      <div>
        <label htmlFor="dob" className="text-sm font-semibold">
          Date of birth
        </label>
        <input id="dob" type="date" autoComplete="bday" value={dob} onChange={(event) => setDob(event.target.value)} className="field mt-2" />
        <p className="mt-1.5 text-xs text-muted">You must be 18 or older. Only your age is shown, never the date.</p>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold">I am a</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {genders.map((option) => (
            <label key={option.id} className={`chip cursor-pointer ${gender === option.id ? "border-ink bg-ink text-paper" : ""}`}>
              <input type="radio" name="gender" value={option.id} checked={gender === option.id} onChange={() => setGender(option.id)} className="sr-only" />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold">Relationship status</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {statuses.map((option) => (
            <label key={option.id} className={`chip cursor-pointer ${status === option.id ? "border-ink bg-ink text-paper" : ""}`}>
              <input type="radio" name="status" value={option.id} checked={status === option.id} onChange={() => setStatus(option.id)} className="sr-only" />
              {option.label}
            </label>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-muted">Sparks and Singles trips are for single members only. You can change this later.</p>
      </fieldset>

      <div>
        <label htmlFor="pronouns" className="text-sm font-semibold">
          Pronouns <span className="font-normal text-muted">(optional)</span>
        </label>
        <input id="pronouns" value={pronouns} onChange={(event) => setPronouns(event.target.value)} placeholder="she/her, he/him, they/them" className="field mt-2" />
      </div>

      <p className="rounded-xl bg-forest-soft px-3 py-2.5 text-sm text-forest-deep">
        <strong>Available across {brand.region}.</strong> We’ll ask for your location when you open Discover, to show people and trips near you. You can choose a city instead.
      </p>
    </Shell>
  );
}
