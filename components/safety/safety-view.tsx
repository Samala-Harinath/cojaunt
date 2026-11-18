"use client";

import { Avatar } from "@/components/avatar";
import { Icon } from "@/components/icon";
import { visibilityOptions } from "@/components/onboarding/privacy-step";
import { Proto, Switch, Top } from "@/components/ui";
import { patchMe, patchPrivacy, unblockPerson, unmutePerson } from "@/lib/actions";
import { getPerson } from "@/lib/directory";
import { useApp } from "@/lib/store";
import { Contacts } from "./contacts";
import { DataControls } from "./data-controls";

/** S20: emergency contacts, verification, privacy, blocked people and data rights. */
export function SafetyView() {
  const { me, privacy, blocked, muted } = useApp();

  return (
    <div className="mx-auto max-w-2xl">
      <Top title="Safety centre" back="/profile" />
      <div className="space-y-5 px-5">
        <section className="rounded-[1.25rem] bg-danger p-5 text-white" aria-label="Emergency">
          <p className="text-sm font-semibold">In immediate danger?</p>
          <a href="tel:112" className="btn mt-3 w-full bg-white text-[#b3261e]">
            <Icon name="phone" />
            Call 112
          </a>
          <p className="mt-3 text-xs leading-relaxed text-white">On a plan, SOS in Trip Mode also alerts your contacts, the host and our safety team.</p>
        </section>

        <Contacts />

        <section className="card p-5" aria-labelledby="verify-heading">
          <h2 id="verify-heading" className="font-display text-2xl">
            Verification
          </h2>
          <ul className="mt-3 space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Icon name="camera" className="size-5 text-forest" />
              <span className="flex-1">
                <strong className="block">Selfie check</strong>
                <span className="text-muted">Required before you can request any seat.</span>
              </span>
              <span className={`tag ${me.selfieVerified ? "bg-forest-soft text-forest-deep" : "bg-line text-muted"}`}>{me.selfieVerified ? "Verified" : "Not done"}</span>
            </li>
            <li className="flex items-center gap-3">
              <Icon name="id" className="size-5 text-forest" />
              <span className="flex-1">
                <strong className="block">Government ID</strong>
                <span className="text-muted">Required for overnight trips. We keep the result, never the document.</span>
              </span>
              {me.idVerified ? (
                <span className="tag bg-forest-soft text-forest-deep">Verified</span>
              ) : (
                <button type="button" className="btn btn-soft btn-sm" onClick={() => patchMe({ idVerified: true })}>
                  Verify
                </button>
              )}
            </li>
          </ul>
          <div className="mt-3">
            <Proto>Verification is simulated. No document or photo is collected.</Proto>
          </div>
        </section>

        <section className="card p-5" aria-labelledby="privacy-heading">
          <h2 id="privacy-heading" className="font-display text-2xl">
            Privacy
          </h2>
          <div className="divide-y divide-line">
            <Switch
              checked={privacy.hideFromContacts}
              onChange={(next) => patchPrivacy({ hideFromContacts: next })}
              label="Hide me from my phone contacts"
              hint="Family and colleagues in your contacts won’t see you on any plan, and you won’t see them."
            />
            <Switch
              checked={privacy.preciseLocation}
              onChange={(next) => patchPrivacy({ preciseLocation: next })}
              label="Share live location in Trip Mode"
              hint="Only your own emergency contacts, and only while a trip is running."
            />
          </div>
          <fieldset className="mt-3">
            <legend className="text-sm font-semibold">Who can see my profile</legend>
            <div className="mt-2 space-y-2">
              {visibilityOptions.map((option) => (
                <label key={option.id} className={`block cursor-pointer rounded-2xl border p-3.5 ${privacy.visibility === option.id ? "border-forest bg-forest-soft" : "border-line"}`}>
                  <input type="radio" name="visibility" value={option.id} checked={privacy.visibility === option.id} onChange={() => patchPrivacy({ visibility: option.id })} className="sr-only" />
                  <span className="block text-sm font-bold">{option.label}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted">{option.hint}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <section className="card p-5" aria-labelledby="blocked-heading">
          <h2 id="blocked-heading" className="font-display text-2xl">
            Blocked people
          </h2>
          {blocked.length === 0 ? (
            <p className="mt-2 text-sm text-muted">You haven’t blocked anyone. A block hides you from each other in chats, connections and future plans.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {blocked.map(getPerson).map((person) => (
                <li key={person.id} className="flex items-center gap-3 py-2.5 text-sm font-semibold">
                  <Avatar name={person.name} hue={person.hue} size={32} />
                  <span className="flex-1">{person.name}</span>
                  <button type="button" className="btn btn-line btn-sm" onClick={() => unblockPerson(person.id)}>
                    Unblock
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5" aria-labelledby="muted-heading">
          <h2 id="muted-heading" className="font-display text-2xl">
            Muted people
          </h2>
          {muted.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Nobody muted. Muting hides someone from your Discover and silences their requests, without blocking them.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {muted.map(getPerson).map((person) => (
                <li key={person.id} className="flex items-center gap-3 py-2.5 text-sm font-semibold">
                  <Avatar name={person.name} hue={person.hue} size={32} />
                  <span className="flex-1">{person.name}</span>
                  <button type="button" className="btn btn-line btn-sm" onClick={() => unmutePerson(person.id)}>
                    Unmute
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <DataControls />
      </div>
    </div>
  );
}
