"use client";

import Link from "next/link";
import { useState } from "react";
import { detailsFor, relationTo } from "@/lib/asks";
import { sharedInterests } from "@/lib/derive";
import { vibeQuestions, type Person } from "@/lib/people";
import { canJoinKind } from "@/lib/audience";
import { personCity } from "@/lib/places";
import { canSee, openPlans } from "@/lib/plans";
import { useApp, type AskKind } from "@/lib/store";
import { AskSheet } from "./ask-sheet";
import { Icon } from "./icon";
import { PersonActions } from "./person-actions";
import { PersonMenu } from "./person-menu";
import { Gallery, PersonPhoto } from "./photo";
import { PrivateDetailsCard } from "./private-details";

/** Anyone's profile. Photos and the public basics are open; private details unlock only after a request is accepted. */
export function PersonProfile({ person }: { person: Person }) {
  const app = useApp();
  const [asking, setAsking] = useState<AskKind | null>(null);
  const relation = relationTo(app, person.id);
  const blocked = relation.kind === "blocked";
  const muted = app.muted.includes(person.id);
  const shared = sharedInterests(app.me, person);
  const going = openPlans.filter((plan) => plan.attendeeIds.includes(person.id) && canSee(plan, app.me.gender) && canJoinKind(plan, app.me));
  const slides = Array.from({ length: person.photos }, (_, i) => <PersonPhoto key={i} person={person} index={i} />);

  return (
    <div className="mx-auto max-w-xl space-y-5 px-5 pb-10 pt-5">
      <header className="flex items-center gap-3">
        <Link href="/discover" aria-label="Back to Discover" className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface">
          <Icon name="left" />
        </Link>
        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-muted">Profile</p>
        <PersonMenu person={person} blocked={blocked} connected={relation.kind === "connected"} />
      </header>

      {blocked ? null : <Gallery name={person.name} slides={slides} />}

      <section>
        <h1 className="flex items-center gap-2 font-display text-4xl leading-tight">
          {person.name}, {person.age}
          {person.idVerified ? <Icon name="shieldCheck" className="size-6 text-forest" /> : null}
        </h1>
        <p className="mt-1 text-muted">{[person.work, personCity(person.id)].filter(Boolean).join(" · ")}</p>
        {muted ? (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-line px-3 py-1 text-xs font-semibold text-muted">
            <Icon name="eyeOff" className="size-3.5" />
            Muted. Hidden from your Discover.
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {person.idVerified ? <span className="tag bg-forest-soft text-forest-deep">ID verified</span> : null}
          <span className="tag bg-line text-ink">{person.plansDone} plans done</span>
        </div>
      </section>

      <PersonActions person={person} relation={relation} onAsk={setAsking} />

      {blocked ? null : (
        <>
          {person.bio ? (
            <section className="card p-5">
              <h2 className="eyebrow">About</h2>
              <p className="mt-2 leading-relaxed">{person.bio}</p>
            </section>
          ) : null}

          <section className="card p-5">
            <h2 className="eyebrow">Interests</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {person.interests.map((tag) => (
                <span key={tag} className={`chip min-h-8 ${shared.includes(tag) ? "border-forest bg-forest-soft text-forest-deep" : ""}`}>
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="eyebrow mt-5">Travel style</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {vibeQuestions.map((question) => (
                <span key={question.key} className="chip min-h-8">
                  {question.short[person.vibe[question.key]]}
                </span>
              ))}
            </div>
          </section>

          <PrivateDetailsCard details={detailsFor(app, person.id)} />

          {going.length > 0 ? (
            <section className="card p-5">
              <h2 className="eyebrow">Going on</h2>
              <ul className="mt-3 space-y-2">
                {going.slice(0, 3).map((plan) => (
                  <li key={plan.id}>
                    <Link href={`/plans/${plan.id}`} className="flex items-center gap-2 text-sm font-semibold text-forest">
                      <Icon name="calendar" className="size-4 shrink-0" />
                      <span className="min-w-0 flex-1 truncate">
                        {plan.title} · {plan.whenShort}
                      </span>
                      <Icon name="right" className="size-4 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-muted">You can also join the same group and meet there.</p>
            </section>
          ) : null}
        </>
      )}

      {asking ? <AskSheet person={person} kind={asking} onClose={() => setAsking(null)} /> : null}
    </div>
  );
}
