import type { Audience, Plan } from "./plan-types";

export type { Audience };
/**
 * Discover has three doors.
 * date: single people to Spark · buddy: one person to travel with · trips: hosted trips (Group trips and Singles trips, kept apart).
 */
export type Category = "date" | "buddy" | "trips";

export const categories: Category[] = ["date", "buddy", "trips"];

/** Most seats one member can request at once on a group trip. Keeps every group mostly new faces. */
export const GROUP_MAX = 4;

type AudienceInfo = { label: string; title: string; blurb: string; promises: string[] };

/**
 * The two kinds of hosted plan. They never mix: each has its own list in Discover and its own rules.
 * group: anyone can join, alone or with friends · dating: a Singles trip, only for singles open to dating.
 */
export const audiences: Record<Audience, AudienceInfo> = {
  group: {
    label: "Group trip",
    title: "A hosted group trip",
    blurb: `A small group of verified people with a host. Come alone, or book up to ${GROUP_MAX} seats with friends.`,
    promises: [
      `Come alone, or book up to ${GROUP_MAX} seats in one request`,
      "Rooms are shared only with a verified guest of the same gender",
      "The host starts with introductions, so nobody is left out",
      "Women-only and men-only trips are hidden from everyone else",
    ],
  },
  dating: {
    label: "Singles trip",
    title: "A trip for singles",
    blurb: "Only for single members who chose Open to dating, in one age band. Meet in a small group, then decide.",
    promises: [
      "Every guest is single and has chosen Open to dating",
      "Guests are in the same age band",
      "The host balances the group, so no gender is more than half",
      "One seat per person, so nobody arrives with a crowd",
    ],
  },
};

export const audienceIds: Audience[] = ["group", "dating"];

/**
 * Who may open and book a plan. Singles trips are only for single members who chose Open to dating;
 * everyone else never sees them, so the two kinds never get mixed up.
 */
export function canJoinKind(plan: Plan, me: { status: string; intent: string }): boolean {
  return plan.audience !== "dating" || (me.status !== "married" && me.intent === "open");
}

/** Reads `?tab=`. Old links (`dating`, `group`, `travel`, `solo`) still land in the right place. */
export function toCategory(value: string | null): Category | null {
  if (value === "date" || value === "dating") return "date";
  if (value === "buddy") return "buddy";
  if (value === "trips" || value === "group" || value === "travel" || value === "solo") return "trips";
  return null;
}

/** Group trips let one request cover several seats; a Singles trip is always one seat per person. */
export function maxSeats(plan: Plan): number {
  return plan.audience === "group" ? Math.max(1, Math.min(GROUP_MAX, plan.seatsLeft)) : 1;
}
