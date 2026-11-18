"use client";

import { Icon } from "@/components/icon";
import { newStop, type ListingDay, type ListingStop } from "@/lib/listing";
import { Err, fid, type StepProps } from "./fields";
import { StopRow } from "./stop-row";

const MAX_STOPS = 8;

function swap(stops: ListingStop[], index: number, by: -1 | 1): ListingStop[] {
  const next = [...stops];
  [next[index], next[index + by]] = [next[index + by], next[index]];
  return next;
}

export function StepItinerary({ listing, set, issues }: StepProps) {
  const trip = listing.kind === "trip";

  function setDay(dayId: string, change: (day: ListingDay) => ListingDay) {
    set({ days: listing.days.map((day) => (day.id === dayId ? change(day) : day)) });
  }

  const setStops = (dayId: string, change: (stops: ListingStop[]) => ListingStop[]) => setDay(dayId, (day) => ({ ...day, stops: change(day.stops) }));

  return (
    <>
      {issues.itinerary ? (
        <p id={fid("itinerary")} tabIndex={-1} className="rounded-xl bg-spark-soft px-3 py-2.5 text-sm font-semibold text-danger">
          {issues.itinerary}
        </p>
      ) : null}

      {trip && !listing.start ? (
        <p className="rounded-xl bg-paper px-3 py-2.5 text-xs text-muted">Set your dates first. The itinerary then gets one day for each day of the trip.</p>
      ) : null}

      {listing.days.map((day, d) => {
        const dayError = issues[`day-${day.id}`];
        return (
          <section key={day.id} aria-label={trip ? `Day ${d + 1}` : "Schedule"} className="card p-4">
            <div className="flex items-center gap-2">
              <span className="eyebrow shrink-0">{trip ? `Day ${d + 1}` : "Schedule"}</span>
              {trip ? (
                <input
                  id={fid(`day-${day.id}`)}
                  aria-label={`Name for day ${d + 1}`}
                  aria-invalid={dayError ? true : undefined}
                  value={day.label}
                  maxLength={30}
                  onChange={(event) => setDay(day.id, (current) => ({ ...current, label: event.target.value }))}
                  className="min-w-0 flex-1 rounded-lg bg-transparent px-2 py-1 text-sm font-semibold hover:bg-paper focus:bg-paper"
                />
              ) : (
                <span id={fid(`day-${day.id}`)} tabIndex={-1} />
              )}
            </div>

            <ol className="relative mt-3 space-y-2 before:absolute before:bottom-4 before:left-[5px] before:top-5 before:border-l-2 before:border-dashed before:border-line">
              {day.stops.map((stop, i) => (
                <StopRow
                  key={stop.id}
                  stop={stop}
                  index={i}
                  count={day.stops.length}
                  error={issues[`stop-${stop.id}`]}
                  onChange={(patch) => setStops(day.id, (stops) => stops.map((item) => (item.id === stop.id ? { ...item, ...patch } : item)))}
                  onMove={(by) => setStops(day.id, (stops) => swap(stops, i, by))}
                  onRemove={() => setStops(day.id, (stops) => stops.filter((item) => item.id !== stop.id))}
                />
              ))}
            </ol>
            <Err name={`day-${day.id}`} error={dayError} />

            <button
              type="button"
              className="btn btn-line btn-sm mt-3"
              disabled={day.stops.length >= MAX_STOPS}
              onClick={(event) => {
                const section = event.currentTarget.closest("section");
                setStops(day.id, (stops) => [...stops, newStop()]);
                // Move focus to the new stop once it has rendered.
                requestAnimationFrame(() => {
                  const titles = section?.querySelectorAll<HTMLInputElement>("[data-stop-title]");
                  titles?.[titles.length - 1]?.focus();
                });
              }}
            >
              <Icon name="plus" className="size-4" />
              {day.stops.length >= MAX_STOPS ? `Up to ${MAX_STOPS} stops a day` : "Add a stop"}
            </button>
          </section>
        );
      })}
    </>
  );
}
