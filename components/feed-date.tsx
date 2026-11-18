"use client";

import { patchMe } from "@/lib/actions";
import { canDate, singlesFor } from "@/lib/derive";
import { setRadius } from "@/lib/location";
import { personPoint } from "@/lib/places";
import { useApp } from "@/lib/store";
import { NoneFound, PrivacyNote } from "./feed-doors";
import { Icon } from "./icon";
import { Pager, usePaged } from "./pagination";
import { PersonCard } from "./person-card";
import { useNearby } from "./use-nearby";

/** Date: single people only. Open a profile, then send a Spark. Singles trips live under Trips, not here. */
export function DatePanel() {
  const app = useApp();
  const { me } = app;
  const near = useNearby(singlesFor(app), (person) => personPoint(person.id));
  const singles = near.list;
  const paged = usePaged(singles, `${singles.length}|${me.gender}|${near.key}`);

  if (!canDate(me)) {
    return (
      <section className="flex flex-col gap-3 rounded-2xl bg-spark-soft p-4 sm:flex-row sm:items-center" aria-label="Dating is switched off">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-spark text-white">
          <Icon name="lock" />
        </span>
        {me.status === "married" ? (
          <p className="min-w-0 flex-1 text-sm">
            <strong className="block">Dating is for single members.</strong>
            <span className="text-muted">Your profile says you’re married, so dating stays off. Travel buddies and group trips are open to you.</span>
          </p>
        ) : (
          <>
            <p className="min-w-0 flex-1 text-sm">
              <strong className="block">Dating is switched off.</strong>
              <span className="text-muted">Turn it on to see singles and send Sparks. Only you can see this setting.</span>
            </p>
            <button type="button" className="btn btn-spark btn-sm" onClick={() => patchMe({ intent: "open" })}>
              Turn on dating
            </button>
          </>
        )}
      </section>
    );
  }

  if (singles.length === 0) {
    return near.applied ? (
      <NoneFound text="Nobody open to dating this close to you yet." action="Search farther" onAction={() => setRadius(null)} />
    ) : (
      <p className="card px-6 py-8 text-center text-sm text-muted">New singles join every week. Check back soon.</p>
    );
  }

  return (
    <>
      <section aria-label={near.applied ? "Singles near you" : "Singles across India"} className="space-y-3">
        <p className="text-xs text-muted">
          <span className="font-semibold">{near.applied ? "Singles near you" : "Singles across India"}</span> · {near.applied ? "Closest first. " : ""}Tap someone to see their photos, then send a Spark.
        </p>
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {paged.items.map(({ item: person, km }) => (
            <PersonCard key={person.id} person={person} km={km} />
          ))}
        </ul>
        <Pager page={paged.page} pages={paged.pages} total={paged.total} onPage={paged.setPage} label="Singles pages" />
      </section>

      <PrivacyNote text="Surname, workplace, area and Instagram stay hidden until someone accepts your Spark. Nobody can message you unless you accept." />
    </>
  );
}
