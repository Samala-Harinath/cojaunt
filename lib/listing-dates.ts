import { OWN_WAY, type Listing } from "./listing-options";
import type { Plan } from "./plan-types";

// Dates are formatted by hand from the raw input value, so they read the same in every time zone.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export type Parts = { y: number; m: number; d: number; h: number; min: number };

export function parse(value: string): Parts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value);
  if (!match) return null;
  const [y, m, d, h, min] = match.slice(1).map(Number);
  return { y, m, d, h, min };
}

export const dayIndex = (p: Parts) => Date.UTC(p.y, p.m - 1, p.d) / 86_400_000;
export const minutes = (p: Parts) => dayIndex(p) * 1440 + p.h * 60 + p.min;
/** The host's local wall-clock time in ms, for comparing with `Date.now()`. */
export const localMs = (p: Parts) => new Date(p.y, p.m - 1, p.d, p.h, p.min).getTime();

export function clock(time: string): string {
  const match = /^(\d{1,2}):(\d{2})/.exec(time);
  if (!match) return "";
  const h = Number(match[1]);
  return `${h % 12 || 12}:${match[2]} ${h < 12 ? "AM" : "PM"}`;
}

const timeOf = (p: Parts) => clock(`${p.h}:${String(p.min).padStart(2, "0")}`);
const dateOf = (p: Parts) => `${WEEKDAYS[new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay()]} ${p.d} ${MONTHS[p.m - 1]}`;

export function nightsBetween(start: string, end: string): number | null {
  const s = parse(start);
  const e = parse(end);
  return s && e ? dayIndex(e) - dayIndex(s) : null;
}

/** Guest-facing date labels, or null until both ends are valid. */
export function schedule(listing: Listing): Pick<Plan, "when" | "whenShort" | "duration"> | null {
  const s = parse(listing.start);
  const e = parse(listing.end);
  if (!s || !e || minutes(e) <= minutes(s)) return null;
  if (listing.kind === "trip") {
    const nights = dayIndex(e) - dayIndex(s);
    if (nights < 1) return null;
    return {
      when: `${dateOf(s)}, ${timeOf(s)} → ${dateOf(e)}, ${timeOf(e)}`,
      whenShort: s.m === e.m ? `${s.d}–${e.d} ${MONTHS[e.m - 1]}` : `${s.d} ${MONTHS[s.m - 1]} – ${e.d} ${MONTHS[e.m - 1]}`,
      duration: `${nights} ${nights === 1 ? "night" : "nights"}`,
    };
  }
  const span = minutes(e) - minutes(s);
  const hours = Math.round(span / 30) / 2;
  return { when: `${dateOf(s)}, ${timeOf(s)}`, whenShort: dateOf(s), duration: span < 60 ? `${span} minutes` : `${hours} ${hours === 1 ? "hour" : "hours"}` };
}

/** The plan as guests would see it. Drives the live preview and, later, the API payload. */
export function toPlan(listing: Listing): Plan {
  const when = schedule(listing);
  const extras = [...(listing.kind === "trip" && listing.stay ? [listing.stay] : []), ...(listing.transport && listing.transport !== OWN_WAY ? [listing.transport] : [])];
  return {
    id: listing.id,
    title: listing.title.trim() || "Your plan title",
    kind: listing.kind,
    audience: listing.audience === "dating" ? "dating" : "group",
    ageRange: listing.audience === "dating" ? [listing.ageMin, listing.ageMax] : undefined,
    womenOnly: listing.audience === "dating" ? false : listing.womenOnly,
    menOnly: listing.audience === "dating" ? false : (listing.menOnly ?? false),
    scene: listing.scene,
    tagline: listing.tagline.trim(),
    place: listing.place.trim() || "Destination",
    meet: listing.meet.trim(),
    when: when?.when ?? "Dates to be added",
    whenShort: when?.whenShort ?? "Dates to be added",
    duration: when?.duration ?? (listing.kind === "trip" ? "Overnight" : "A few hours"),
    thisWeekend: false,
    past: false,
    price: Number(listing.price) || 0,
    seats: listing.seats,
    seatsLeft: listing.seats,

    idRequired: listing.kind === "trip",
    hostId: "me",
    attendeeIds: [],
    tags: listing.tags,
    vibe: listing.vibe,
    itinerary: listing.days.map((day) => ({
      label: day.label.trim() || "Day",
      stops: day.stops
        .filter((stop) => stop.title.trim())
        .map((stop) => ({ time: clock(stop.time) || "Any time", title: stop.title.trim(), note: stop.note.trim() || undefined })),
    })),
    inclusions: [...listing.inclusions, ...extras],
  };
}
