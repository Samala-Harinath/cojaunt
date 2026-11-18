import type { Vibe } from "./people";

export type Scene = "hills" | "coast" | "peaks" | "forest" | "city" | "craft";
/**
 * Who a plan is for. Every plan is a small verified group with a host.
 * group: a Group trip, open to everyone · dating: a Singles trip, only for singles open to dating.
 */
export type Audience = "group" | "dating";
export type Stop = { time: string; title: string; note?: string };
export type Day = { label: string; stops: Stop[] };

export type Plan = {
  id: string;
  title: string;
  kind: "local" | "trip";
  audience: Audience;
  /** Singles trips run in an age band, so the group is peers. */
  ageRange?: [number, number];
  scene: Scene;
  tagline: string;
  place: string;
  /** Exact meeting point. Shown only after the host approves you. */
  meet: string;
  when: string;
  whenShort: string;
  duration: string;
  thisWeekend: boolean;
  past: boolean;
  price: number;
  seats: number;
  seatsLeft: number;
  womenOnly: boolean;
  /** Men-only plans are hidden from women, the way women-only plans are hidden from men. */
  menOnly?: boolean;
  /** Overnight plans require government-ID verification. */
  idRequired: boolean;
  hostId: string;
  attendeeIds: string[];
  tags: string[];
  vibe: Vibe;
  itinerary: Day[];
  inclusions: string[];
};

export const day = (label: string, ...stops: [time: string, title: string, note?: string][]): Day => ({
  label,
  stops: stops.map(([time, title, note]) => ({ time, title, note })),
});

export const cancellation: Record<Plan["kind"], string[]> = {
  trip: [
    "7 or more days before: full refund",
    "3 to 6 days before: 50% refund",
    "Under 72 hours: no refund, but your seat can go to the waitlist",
    "If the host cancels: 100% refund, guaranteed by us",
  ],
  local: [
    "24 hours or more before: full refund",
    "Under 24 hours: no refund",
    "If the host cancels: 100% refund, guaranteed by us",
  ],
};
