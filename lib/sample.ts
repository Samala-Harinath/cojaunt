import type { Listing } from "./listing-options";
import { vibe } from "./people";
import type { Signal } from "./social";
import type { Ask, Booking, Me } from "./store";

/**
 * SAMPLE DATA: requests waiting in the inbox, plus one the member sent.
 * Requests that don't fit the member (a Spark when dating is off, for example) are hidden by lib/asks.ts.
 */
export const sampleAsks: Ask[] = [
  {
    id: "ask-ishaan",
    personId: "ishaan",
    kind: "spark",
    from: "them",
    note: "You picked Coffee and Slow travel too. Would you like to meet at the Saturday coffee walk?",
    status: "pending",
    at: 0,
  },
  {
    id: "ask-zoya",
    personId: "zoya",
    kind: "travel",
    from: "them",
    note: "Looking for a calm travel buddy for a nature weekend. You sketch, I stretch?",
    status: "pending",
    at: 0,
  },
  { id: "ask-sam", personId: "sam", kind: "travel", from: "me", note: "Your three-ink journal sounds great. Up for the pottery class together?", status: "pending", at: 0 },
];

/**
 * SAMPLE DATA. Past plans, bookings and private choices that give every screen something to show.
 * Used by the demo member and by profiles created in onboarding, so a new profile isn't empty.
 * Remove when a backend supplies real activity.
 */
export const sampleBookings: Booking[] = [
  // Upcoming, one in each state the booking flow has.
  { planId: "foodwalk", status: "confirmed", note: "" },
  { planId: "nandi", status: "confirmed", note: "" },
  { planId: "coorg", status: "approved", note: "First trip with a group. Happy to share snacks and the aux." },
  { planId: "comedy", status: "requested", note: "Looking for a fun Friday with new people." },
  { planId: "kabini", status: "waitlist", note: "Would love a spot if anyone drops out." },
  // Past: savandurga is left unreflected so the "How was it?" prompt shows.
  { planId: "savandurga", status: "confirmed", note: "" },
  { planId: "lalbagh", status: "confirmed", note: "" },
  { planId: "hampi", status: "confirmed", note: "" },
  { planId: "sakleshpur", status: "confirmed", note: "" },
];

export const sampleWishlist = ["pondicherry", "chikmagalur", "gokarna"];

/** The member's own private choices after past plans. Only mutual ones become connections. */
const choices: Record<string, Record<string, Signal>> = {
  sakleshpur: { meera: "again", arjun: "spark", sana: "again" },
  hampi: { riya: "again", aditya: "spark", farah: "again", kabir: "again" },
  lalbagh: { vikram: "again", anika: "again", sam: "again", tara: "again" },
};

/** A member who is here only for friends can't send a Spark, so theirs become "Travel again". */
export function sampleSignals(intent: Me["intent"]): Record<string, Record<string, Signal>> {
  if (intent === "open") return choices;
  return Object.fromEntries(
    Object.entries(choices).map(([plan, byPerson]) => [plan, Object.fromEntries(Object.entries(byPerson).map(([id, s]) => [id, s === "spark" ? "again" : s]))]),
  );
}

const stop = (id: string, time: string, title: string, note = "") => ({ id, time, title, note });

/** One finished listing waiting for review, so the hosting dashboard shows that state. */
export const sampleListing: Listing = {
  id: "listing-sample-sketch",
  status: "review",
  step: 6,
  reached: 6,
  kind: "local",
  audience: "group",
  title: "Sunday Sketchwalk, Malleswaram",
  tagline: "Old houses, temple corners and a filter coffee break. No drawing skills needed.",
  scene: "craft",
  tags: ["Art", "Culture"],
  place: "Malleswaram",
  meet: "Malleswaram 18th Cross bus stop",
  start: "2026-12-13T07:30",
  end: "2026-12-13T10:30",
  days: [
    {
      id: "day-sample-1",
      label: "On the day",
      stops: [
        stop("stop-s1", "07:30", "Meet and hand out sketchbooks"),
        stop("stop-s2", "07:45", "Sketch the Kadu Malleshwara temple", "Pencils are fine"),
        stop("stop-s3", "09:15", "Filter coffee at a 1950s café"),
        stop("stop-s4", "10:15", "Share sketches and wrap up"),
      ],
    },
  ],
  seats: 8,
  ageMin: 21,
  ageMax: 45,
  womenOnly: false,
  vibe: vibe(0, 0, 0, 1, 0, 0),
  price: "449",
  inclusions: ["All materials", "Coffee and a snack"],
  transport: "Guests make their own way to the meeting point",
  stay: "",
  pledges: [
    "The meeting point is a public place, never a private home",
    "All payments stay in the app. I won’t ask guests to pay me directly",
    "I’ll keep Trip Mode on during the plan and answer check-ins",
    "Any venue, vendor or vehicle I use is licensed",
  ],
};
