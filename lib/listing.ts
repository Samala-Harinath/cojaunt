import { vibe } from "./people";
import { OWN_WAY, transportOptions, type Kind, type Listing, type ListingDay, type ListingStop } from "./listing-options";

export * from "./listing-options";

let counter = 0;
/** Call only from event handlers: it reads the clock. */
export const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}${(counter++).toString(36)}`;

export const newStop = (time = "", title = ""): ListingStop => ({ id: uid("stop"), time, title, note: "" });
export const newDay = (label: string): ListingDay => ({ id: uid("day"), label, stops: [newStop()] });

/** A starting itinerary with fixed first and last stops, and empty ones to fill. */
export function skeleton(kind: Kind, nights = 2): ListingDay[] {
  if (kind === "local") {
    return [{ id: uid("day"), label: "On the day", stops: [newStop("10:00", "Meet the group"), newStop("10:30"), newStop("13:00", "Wrap up")] }];
  }
  const days = Array.from({ length: nights + 1 }, (_, i) => newDay(`Day ${i + 1}`));
  days[0].stops = [newStop("19:00", "Meet and set off"), newStop()];
  days[days.length - 1].stops = [newStop("09:00"), newStop("16:00", "Head back to the city")];
  return days;
}

export type Seed = Partial<Pick<Listing, "scene" | "tags" | "inclusions" | "audience">> & { kind: Kind };

/** A Singles trip is one band of peers with a mixed group: no women-only or men-only, and a tighter age range. */
export function asAudience(listing: Listing, audience: Listing["audience"]): Partial<Listing> {
  if (audience === "dating") return { audience, womenOnly: false, menOnly: false, ageMax: Math.min(listing.ageMax, listing.ageMin + 12) };
  return { audience };
}

export function newListing(seed: Seed): Listing {
  return {
    id: uid("listing"),
    status: "editing",
    step: 0,
    reached: 0,
    audience: "group",
    title: "",
    tagline: "",
    scene: seed.kind === "trip" ? "hills" : "city",
    tags: [],
    place: "",
    meet: "",
    start: "",
    end: "",
    days: skeleton(seed.kind),
    seats: seed.kind === "trip" ? 6 : 8,
    ageMin: 21,
    ageMax: 40,
    womenOnly: false,
    vibe: vibe(1, 1, 1, 1, 1, 1),
    price: "",
    inclusions: [],
    transport: seed.kind === "local" ? OWN_WAY : "",
    stay: "",
    pledges: [],
    ...seed,
    // Singles trips start with a 10-year band; group trips with a wide one.
    ...(seed.audience === "dating" ? { ageMin: 24, ageMax: 34 } : {}),
  };
}

export const templates: { id: string; label: string; hint: string; seed: Seed }[] = [
  { id: "weekend", label: "Weekend getaway", hint: "Two nights in the hills", seed: { kind: "trip", scene: "hills", tags: ["Nature", "Slow travel"], inclusions: ["Breakfast and dinner"] } },
  { id: "coast", label: "Coastal trip", hint: "Beaches and sunsets", seed: { kind: "trip", scene: "coast", tags: ["Beach"], inclusions: ["Breakfast and dinner"] } },
  { id: "trek", label: "Day trek", hint: "Sunrise or day hikes", seed: { kind: "local", scene: "peaks", tags: ["Trekking", "Fitness"], inclusions: ["Trek lead with a first-aid kit"] } },
  { id: "social", label: "Café or games night", hint: "A few hours in town", seed: { kind: "local", scene: "city", tags: ["Games", "Coffee"] } },
  { id: "workshop", label: "Workshop", hint: "Pottery, sketching, cooking", seed: { kind: "local", scene: "craft", tags: ["Art"], inclusions: ["All materials"] } },
];

/**
 * Gives a trip one itinerary day per calendar day. The first and last days are kept; middle
 * days are added empty or trimmed from the end. Days the host renamed keep their names.
 */
export function syncDays(days: ListingDay[], nights: number): ListingDay[] {
  const want = nights + 1;
  if (days.length === want || days.length === 0) return days.length === 0 ? skeleton("trip", nights) : days;
  const first = days[0];
  const last = days[days.length - 1];
  const middle = days.slice(1, -1);
  const resized =
    want === 1
      ? [first]
      : [first, ...middle.slice(0, want - 2), ...Array.from({ length: Math.max(0, want - 2 - middle.length) }, () => newDay("Day")), last];
  return resized.map((day, i) => (/^Day( \d+)?$/.test(day.label.trim()) ? { ...day, label: `Day ${i + 1}` } : day));
}

/** Seat price split between host and platform. The commission rate is a placeholder. */
export function payout(price: number, seats: number, rate: number) {
  const fee = Math.round(price * rate);
  return { perSeat: price - fee, fee, full: (price - fee) * seats };
}

/** Switching kind keeps what the host typed and resets only what no longer applies. */
export function switchKind(listing: Listing, kind: Kind): Partial<Listing> {
  if (kind === listing.kind) return {};
  return {
    kind,
    transport: transportOptions[kind].includes(listing.transport) ? listing.transport : kind === "local" ? OWN_WAY : "",
    stay: "",
    days: skeleton(kind),
    pledges: [],
    start: "",
    end: "",
  };
}
