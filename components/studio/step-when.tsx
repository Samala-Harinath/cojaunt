"use client";

import { Icon } from "@/components/icon";
import { nightsBetween, schedule } from "@/lib/listing-dates";
import { syncDays } from "@/lib/listing";
import { describe, Field, type StepProps } from "./fields";

export function StepWhen({ listing, set, issues }: StepProps) {
  const trip = listing.kind === "trip";
  const summary = schedule(listing);

  /** Keeps a trip's itinerary at one day per calendar day as the dates change. */
  function setDates(patch: { start?: string; end?: string }) {
    const next = { ...listing, ...patch };
    const nights = nightsBetween(next.start, next.end);
    const days = trip && nights !== null && nights >= 1 && nights <= 7 ? syncDays(listing.days, nights) : listing.days;
    set({ ...patch, days });
  }

  return (
    <>
      <Field name="place" label={trip ? "Destination" : "Area"} hint="Shown to everyone browsing." error={issues.place}>
        <input
          {...describe("place", true, issues.place)}
          value={listing.place}
          maxLength={60}
          onChange={(event) => set({ place: event.target.value })}
          placeholder={trip ? "Coorg, Karnataka" : "Basavanagudi"}
          className="field"
          autoComplete="off"
        />
      </Field>

      <Field name="meet" label="Exact meeting point" hint="Must be a public place. Only guests you approve will see it." error={issues.meet}>
        <div className="relative">
          <Icon name="lock" className="pointer-events-none absolute left-3.5 top-3.5 size-5 text-muted" />
          <input
            {...describe("meet", true, issues.meet)}
            value={listing.meet}
            maxLength={80}
            onChange={(event) => set({ meet: event.target.value })}
            placeholder="Indiranagar Metro, Gate 2"
            className="field pl-11"
            autoComplete="off"
          />
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="start" label={trip ? "Departs" : "Starts"} error={issues.start}>
          <input {...describe("start", false, issues.start)} type="datetime-local" value={listing.start} onChange={(event) => setDates({ start: event.target.value })} className="field" />
        </Field>
        <Field name="end" label={trip ? "Returns" : "Ends"} error={issues.end}>
          <input
            {...describe("end", false, issues.end)}
            type="datetime-local"
            value={listing.end}
            min={listing.start || undefined}
            onChange={(event) => setDates({ end: event.target.value })}
            className="field"
          />
        </Field>
      </div>

      {summary ? (
        <p className="flex items-start gap-2.5 rounded-2xl bg-forest-soft p-4 text-sm text-forest-deep" aria-live="polite">
          <Icon name="calendar" className="mt-px size-5" />
          <span>
            <strong className="block">{summary.duration}</strong>
            {summary.when}
            {trip ? <span className="mt-1 block text-xs">Your itinerary now has a day for each day of the trip.</span> : null}
          </span>
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted">
        {trip ? "Trips start at least 7 days out" : "City plans start at least 2 days out"}, so there’s time for review and for guests to book. Times are in your local time.
      </p>
    </>
  );
}
