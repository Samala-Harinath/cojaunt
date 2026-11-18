"use client";

import { useState } from "react";
import { audiences, type Audience } from "@/lib/audience";
import { parseAsk } from "@/lib/concierge";
import { setRadius } from "@/lib/location";
import { planPoint } from "@/lib/places";
import type { Plan } from "@/lib/plans";
import { useApp } from "@/lib/store";
import { crewOptionsFor, matches, noFilters, whenOptions, type TravelFilters } from "@/lib/travel-filters";
import { Ask } from "./ask";
import { NoneFound } from "./feed-doors";
import { FilterSelect } from "./filter-select";
import { Icon } from "./icon";
import { Pager, usePaged } from "./pagination";
import { PlanCard } from "./plan-card";
import { useNearby } from "./use-nearby";

type Props = {
  /** Every plan the member can see, of both kinds. */
  plans: Plan[];
  /** Whether the member may see Singles trips at all (single and open to dating). */
  singlesAllowed: boolean;
  kind: Audience;
  onKind: (next: Audience) => void;
  query: string;
  onQuery: (next: string) => void;
};

/**
 * Trips: hosted plans in two separate lists that never mix. Group trips are for everyone; Singles trips
 * only for singles. On landing they're sorted by distance; a typed search covers all of India.
 */
export function TripsPanel({ plans, singlesAllowed, kind: picked, onKind, query, onQuery }: Props) {
  const app = useApp();
  const [filters, setFilters] = useState<TravelFilters>(noFilters);
  const [dropped, setDropped] = useState<string[]>([]);
  const kind: Audience = singlesAllowed ? picked : "group";
  const info = audiences[kind];

  const facets = parseAsk(query).filter((facet) => !dropped.includes(facet.key));
  const asking = facets.length > 0;
  const searching = query.trim() !== "";
  const ofKind = plans.filter((plan) => plan.audience === kind);
  const matched = ofKind.filter((plan) => facets.every((facet) => facet.test(plan)) && matches(plan, filters, asking));
  const near = useNearby(matched, planPoint, searching);
  const results = near.list;
  const filtered = filters.when !== "any" || filters.crew !== "any" || searching;
  const pages = usePaged(results, `${kind}|${filters.when}|${filters.crew}|${query}|${dropped.join(",")}|${near.key}`);

  const set = (patch: Partial<TravelFilters>) => setFilters((current) => ({ ...current, ...patch }));
  const clear = () => {
    setFilters(noFilters);
    onQuery("");
    setDropped([]);
  };
  const count = (audience: Audience) => plans.filter((plan) => plan.audience === audience).length;

  return (
    <>
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Find and filter trips">
          {singlesAllowed ? (
            <div className="inline-flex gap-1 rounded-full border border-line bg-surface p-1" role="group" aria-label="Kind of trip">
              {(["group", "dating"] as const).map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={kind === id}
                  onClick={() => onKind(id)}
                  className={`inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition-colors ${
                    kind === id ? (id === "dating" ? "bg-spark text-white" : "bg-ink text-paper") : "text-muted hover:text-ink"
                  }`}
                >
                  <Icon name={id === "dating" ? "heart" : "people"} className="size-4" />
                  {audiences[id].label}s
                  <span className="tabular-nums opacity-70">{count(id)}</span>
                </button>
              ))}
            </div>
          ) : null}
          <div className="min-w-48 flex-1">
            <Ask
              compact
              query={query}
              facets={facets}
              onQuery={(next) => {
                onQuery(next);
                setDropped([]);
              }}
              onDrop={(key) => setDropped((keys) => [...keys, key])}
            />
          </div>
          {asking ? null : <FilterSelect label="When" icon="clock" value={filters.when} initial="any" options={whenOptions} onChange={(when) => set({ when })} />}
          {kind === "group" ? (
            <FilterSelect label="Who" icon="people" value={filters.crew} initial="any" options={crewOptionsFor(app.me.gender)} onChange={(crew) => set({ crew })} />
          ) : null}
        </div>

        {facets.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted">Understood as:</span>
            {facets.map((facet) => (
              <button
                key={facet.key}
                type="button"
                onClick={() => setDropped((keys) => [...keys, facet.key])}
                className="chip min-h-8 border-forest bg-forest-soft text-forest-deep"
                aria-label={`Remove filter: ${facet.label}`}
              >
                {facet.label}
                <Icon name="x" className="size-3.5" />
              </button>
            ))}
          </div>
        ) : null}

        {query.trim().length > 2 && facets.length === 0 && dropped.length === 0 ? (
          <p className="text-xs text-muted">Try words like trek, beach, women-only, slow, this weekend or “under 5k”.</p>
        ) : null}

        <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted" aria-live="polite">
          <span className="font-semibold">
            {results.length} {results.length === 1 ? "trip" : "trips"}
          </span>
          <span>· {searching ? "Searching all of India" : near.applied ? "Nearest first" : info.blurb}</span>
          {filtered ? (
            <button type="button" onClick={clear} className="inline-flex items-center gap-0.5 font-semibold text-forest-deep hover:underline">
              <Icon name="x" className="size-3.5" />
              Clear
            </button>
          ) : null}
        </p>
      </div>

      {results.length > 0 ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {pages.items.map(({ item: plan, km }) => (
              <PlanCard key={plan.id} plan={plan} km={km} />
            ))}
          </div>
          <Pager page={pages.page} pages={pages.pages} total={pages.total} onPage={pages.setPage} label="Trip pages" />
        </>
      ) : near.applied && matched.length > 0 ? (
        <NoneFound text="No trips this close to you." action="Search farther" onAction={() => setRadius(null)} />
      ) : (
        <NoneFound text="No trip matches all of that." action="Show all trips" onAction={clear} />
      )}
    </>
  );
}
