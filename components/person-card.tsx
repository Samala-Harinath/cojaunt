"use client";

import Link from "next/link";
import { relationTo } from "@/lib/asks";
import { sharedInterests } from "@/lib/derive";
import type { Person } from "@/lib/people";
import { distanceLabel, personCity } from "@/lib/places";
import { useApp } from "@/lib/store";
import { Icon } from "./icon";
import { PersonPhoto } from "./photo";

/** A short status on the card, so the member can see at a glance where they stand with someone. */
function useStatus(person: Person): { label: string; dot: string } | null {
  const app = useApp();
  const relation = relationTo(app, person.id);
  if (relation.kind === "connected") return { label: "Connected", dot: "bg-forest" };
  if (relation.kind === "incoming") return { label: "Wants to connect", dot: "bg-marigold" };
  if (relation.kind === "outgoing") return { label: relation.ask.kind === "spark" ? "Spark sent" : "Request sent", dot: "bg-muted" };
  return null;
}

/**
 * One person in Discover. The whole card opens their profile, where the Spark or travel request is sent.
 * `km` is shown only as a rough band (see distanceLabel), never an exact distance.
 */
export function PersonCard({ person, km }: { person: Person; km?: number }) {
  const app = useApp();
  const status = useStatus(person);
  const shared = sharedInterests(app.me, person);
  const city = personCity(person.id);

  return (
    <li className="flex">
      <Link href={`/u/${person.id}`} className="card group flex w-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden">
          <PersonPhoto person={person} className="size-full transition-transform duration-500 group-hover:scale-105" />
          {status ? (
            <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-surface/95 py-1 pl-2 pr-2.5 text-[0.6875rem] font-semibold text-ink shadow-sm">
              <span className={`size-1.5 rounded-full ${status.dot}`} aria-hidden="true" />
              {status.label}
            </span>
          ) : null}
          <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-black/65 px-2 py-0.5 text-[0.6875rem] font-semibold text-white backdrop-blur-sm">
            <Icon name="camera" className="size-3" />
            {person.photos}
          </span>
        </div>
        {/* Every line is always rendered (empty when there's nothing to say), so all cards in a row are the same height. */}
        <div className="flex flex-1 flex-col p-3.5">
          <p className="flex items-center gap-1.5 truncate text-base font-bold leading-tight">
            <span className="truncate">
              {person.name}, {person.age}
            </span>
            {person.idVerified ? <Icon name="shieldCheck" className="size-4 shrink-0 text-forest" aria-label="ID verified" /> : null}
          </p>
          <p className="mt-0.5 truncate text-sm text-muted">{person.work}</p>
          <p className="mt-1.5 flex min-h-4 items-center gap-1 truncate text-xs text-muted">
            {city || km !== undefined ? (
              <>
                <Icon name="pin" className="size-3.5 shrink-0" />
                <span className="truncate">{[city, km !== undefined ? distanceLabel(km) : ""].filter(Boolean).join(" · ")}</span>
              </>
            ) : null}
          </p>
          <div className="mt-auto min-h-7 pt-2.5">
            {shared.length > 0 ? (
              <p className="inline-flex max-w-full items-center gap-1 rounded-full bg-forest-soft px-2.5 py-1 text-[0.6875rem] font-semibold text-forest-deep">
                <span className="truncate">Both like {shared.join(", ")}</span>
              </p>
            ) : null}
          </div>
        </div>
      </Link>
    </li>
  );
}
