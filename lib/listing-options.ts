import { vibeQuestions, type Vibe, type VibeKey } from "./people";
import type { Audience, Plan, Scene } from "./plan-types";

/**
 * A plan a member is creating in the Host Studio. Saved on every change, like a draft.
 * The shape mirrors `Plan` so an approved listing maps straight onto one (see `toPlan`).
 */
export type Kind = Plan["kind"];
export type ListingStop = { id: string; time: string; title: string; note: string };
export type ListingDay = { id: string; label: string; stops: ListingStop[] };

export type Listing = {
  id: string;
  status: "editing" | "review";
  /** Zero-based index into `steps`. */
  step: number;
  /** Furthest step reached. Earlier steps can be reopened from the step list. */
  reached: number;
  kind: Kind;
  /** group: a Group trip, open to everyone · dating: a Singles trip, only for singles open to dating. */
  audience: Audience;
  title: string;
  tagline: string;
  scene: Scene;
  tags: string[];
  place: string;
  /** Exact meeting point. Guests see it only after the host approves them. */
  meet: string;
  /** Raw `YYYY-MM-DDTHH:mm` values from the inputs, in the host's local time. */
  start: string;
  end: string;
  days: ListingDay[];
  seats: number;
  ageMin: number;
  ageMax: number;
  womenOnly: boolean;
  /** Older drafts saved before this existed read as false. */
  menOnly?: boolean;
  vibe: Vibe;
  /** Kept as typed so an empty field stays empty. Whole rupees. */
  price: string;
  inclusions: string[];
  transport: string;
  stay: string;
  pledges: string[];
};

export const steps = [
  { id: "basics", label: "Basics", title: "What are you hosting?", lead: "The title and summary are what guests see first in Discover." },
  { id: "when", label: "When & where", title: "When and where", lead: "Guests see the area and dates. The exact meeting point stays private until you approve them." },
  { id: "itinerary", label: "Itinerary", title: "Plan it stop by stop", lead: "A clear itinerary is the main reason guests request a seat. Rough times are fine." },
  { id: "group", label: "Who it’s for", title: "Who it’s for", lead: "Choose Group trip or Singles trip, then the group size, ages and vibe." },
  { id: "pricing", label: "Pricing", title: "Price and what’s included", lead: "One price per seat. Guests pay in the app, and your payout follows the plan." },
  { id: "safety", label: "Safety", title: "Logistics and safety", lead: "Every host makes these commitments. Our team checks them before a plan is listed." },
  { id: "review", label: "Review", title: "Review and send", lead: "This is how guests will see your plan. Send it when you’re happy." },
] as const;

export type StepId = (typeof steps)[number]["id"];

export const kinds: { id: Kind; title: string; hint: string }[] = [
  { id: "local", title: "Day plan", hint: "A few hours, same day" },
  { id: "trip", title: "Overnight trip", hint: "1 to 7 nights, with a stay" },
];

export const sceneOptions: { id: Scene; label: string }[] = [
  { id: "hills", label: "Hills" },
  { id: "coast", label: "Coast" },
  { id: "peaks", label: "Peaks" },
  { id: "forest", label: "Forest" },
  { id: "city", label: "City" },
  { id: "craft", label: "Studio" },
];

const vibeLabels: Record<VibeKey, string> = { pace: "Pace", budget: "Spend level", sleep: "Timings", social: "Group energy", food: "Food", drinks: "Drinks" };

/** The same six answers members give in the vibe quiz, so plan fit stays explainable. */
export const planVibe = vibeQuestions.map((question) => ({ key: question.key, label: vibeLabels[question.key], options: question.short }));

export const OWN_WAY = "Guests make their own way to the meeting point";

export const transportOptions: Record<Kind, string[]> = {
  local: [OWN_WAY, "Shared cab from a pickup point", "Licensed vehicle arranged by the host"],
  trip: ["Licensed tempo traveller, GPS-tracked", "Licensed cabs arranged by the host", "Train or bus, booked together"],
};

export const stayOptions = ["Homestay, same-gender twin rooms", "Boutique hotel, same-gender twin rooms", "Campsite, same-gender tents", "Hostel, private same-gender rooms"];

export const inclusionPresets: Record<Kind, string[]> = {
  local: ["Entry or venue fee", "Coffee and a snack", "All materials", "Breakfast", "Trek lead with a first-aid kit"],
  trip: ["Breakfast and dinner", "All meals", "Entry fees", "Local guide", "Activity gear", "Water and snacks on the road"],
};

export const pledges: Record<Kind, string[]> = {
  local: [
    "The meeting point is a public place, never a private home",
    "All payments stay in the app. I won’t ask guests to pay me directly",
    "I’ll keep Trip Mode on during the plan and answer check-ins",
    "Any venue, vendor or vehicle I use is licensed",
  ],
  trip: [
    "The meeting point is a public place, never a private home",
    "Rooms and tents are shared only within the same gender, unless everyone in the room opts in",
    "All payments stay in the app. I won’t ask guests to pay me directly",
    "I’ll keep Trip Mode on for the whole trip and answer check-ins",
    "Every stay, vendor and vehicle I use is licensed",
  ],
};

export const ageOptions = Array.from({ length: 43 }, (_, i) => 18 + i);
