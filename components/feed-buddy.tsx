"use client";

import { useState } from "react";
import { buddiesFor } from "@/lib/derive";
import type { Gender } from "@/lib/people";
import { useApp } from "@/lib/store";
import { NoneFound, PrivacyNote } from "./feed-doors";
import { Pager, usePaged } from "./pagination";
import { PersonCard } from "./person-card";
import { useNearby } from "./use-nearby";
import { setRadius } from "@/lib/location";
import { personPoint } from "@/lib/places";

type Who = "anyone" | "same";

/**
 * Travel buddy: one verified person to travel with. Open a profile, then send a travel request.
 * "Same gender only" is offered because many members, especially women, prefer it for one-to-one travel.
 */
export function BuddyPanel() {
  const app = useApp();
  const [who, setWho] = useState<Who>("anyone");
  const same: Gender | null = app.me.gender === "nonbinary" ? null : app.me.gender;
  const near = useNearby(buddiesFor(app, who === "same" ? same : null), (person) => personPoint(person.id));
  const buddies = near.list;
  const paged = usePaged(buddies, `${who}|${near.key}`);
  const options: { id: Who; label: string }[] = [
    { id: "anyone", label: "Anyone" },
    ...(same ? [{ id: "same" as const, label: same === "woman" ? "Women only" : "Men only" }] : []),
  ];

  return (
    <section aria-label="Travel buddies" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted">
          <span className="font-semibold">{buddies.length} {buddies.length === 1 ? "person" : "people"}</span> · {near.applied ? "Closest first. " : ""}Tap one to ask to travel together.
        </p>
        {options.length > 1 ? (
          <div className="inline-flex rounded-full border border-line bg-surface p-1" role="group" aria-label="Who to show">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={who === option.id}
                onClick={() => setWho(option.id)}
                className="min-h-8 rounded-full px-3.5 text-sm font-semibold text-muted aria-pressed:bg-ink aria-pressed:text-paper"
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {buddies.length > 0 ? (
        <>
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {paged.items.map(({ item: person, km }) => (
              <PersonCard key={person.id} person={person} km={km} />
            ))}
          </ul>
          <Pager page={paged.page} pages={paged.pages} total={paged.total} onPage={paged.setPage} label="Travel buddy pages" />
        </>
      ) : (
        near.applied ? (
          <NoneFound text="Nobody this close to you yet." action="Search farther" onAction={() => setRadius(null)} />
        ) : (
          <NoneFound text="Nobody to show right now." action="Show everyone" onAction={() => setWho("anyone")} />
        )
      )}

      <PrivacyNote text="Private details stay hidden until your request is accepted. For your first trip, pick a group plan or a public meeting point." />
    </section>
  );
}
