"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { inbox } from "@/lib/asks";
import { canJoinKind, toCategory, type Audience, type Category } from "@/lib/audience";
import { canDate, pendingReflections, singlesFor } from "@/lib/derive";
import { canSee, openPlans } from "@/lib/plans";
import { useApp } from "@/lib/store";
import { BuddyPanel } from "./feed-buddy";
import { DatePanel } from "./feed-date";
import { doorId, doorPanel, Doors } from "./feed-doors";
import { TripsPanel } from "./feed-trips";
import { Icon, type IconName } from "./icon";
import { AutoLocate } from "./location-bar";

const tones = {
  forest: "bg-forest-soft text-forest-deep",
  spark: "bg-spark-soft text-ink",
} as const;

/** A slim one-line pill. Pills sit side by side and wrap on small screens. */
function Notice({ href, icon, tone, title }: { href: string; icon: IconName; tone: keyof typeof tones; title: string }) {
  return (
    <Link href={href} className={`inline-flex min-w-0 max-w-full items-center gap-2 rounded-full py-1.5 pl-3 pr-2.5 text-sm font-semibold transition-opacity hover:opacity-80 ${tones[tone]}`}>
      <Icon name={icon} className="size-4 shrink-0" />
      <span className="truncate">{title}</span>
      <Icon name="right" className="size-4 shrink-0 opacity-60" />
    </Link>
  );
}

/**
 * Discover has three doors: Date (people), Travel buddy (people) and Trips (hosted plans).
 * `?tab=date|buddy|trips` makes a door linkable. Date opens first for members open to dating.
 */
export function Feed() {
  const app = useApp();
  const { me } = app;
  const category: Category = toCategory(useSearchParams().get("tab")) ?? (canDate(me) ? "date" : "buddy");
  const reflect = pendingReflections(app)[0];
  const waiting = inbox(app).length;
  // Kept here so the search and the trip kind survive switching doors and back.
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<Audience>("group");

  const singlesAllowed = canDate(me);
  const trips = openPlans.filter((plan) => canSee(plan, me.gender) && canJoinKind(plan, me));
  const counts: Record<Category, number | undefined> = { date: singlesAllowed ? singlesFor(app).length : undefined, buddy: undefined, trips: trips.length };

  // Next folds replaceState into the router, so useSearchParams updates without a navigation.
  const choose = (next: Category) => window.history.replaceState(null, "", `/discover?tab=${next}`);

  return (
    <div className="px-5 pt-4">
      <AutoLocate />
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h1 className="font-display text-2xl leading-tight sm:text-3xl">Hi {me.name}, what are you looking for?</h1>
        {waiting > 0 || reflect ? (
          <div className="flex min-w-0 flex-wrap gap-2">
            {waiting > 0 ? <Notice href="/people" icon="bell" tone="forest" title={`${waiting} ${waiting === 1 ? "person wants" : "people want"} to connect`} /> : null}
            {reflect ? <Notice href={`/reflect/${reflect.id}`} icon="heart" tone="spark" title={`How was ${reflect.title}?`} /> : null}
          </div>
        ) : null}
      </header>

      <div className="mt-3">
        <Doors value={category} counts={counts} onChange={choose} />
      </div>

      <div id={doorPanel} role="tabpanel" aria-labelledby={doorId(category)} className="mt-4 space-y-4">
        {category === "date" ? <DatePanel /> : null}
        {category === "buddy" ? <BuddyPanel /> : null}
        {category === "trips" ? <TripsPanel plans={trips} singlesAllowed={singlesAllowed} kind={kind} onKind={setKind} query={query} onQuery={setQuery} /> : null}
      </div>
    </div>
  );
}
