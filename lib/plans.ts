import { getPerson } from "./directory";
import type { Gender } from "./people";
import type { Plan } from "./plan-types";
import { extras } from "./plans-extra";
import { indiaPlans } from "./plans-india";
import { locals } from "./plans-local";
import { trips } from "./plans-trips";

export type { Day, Plan, Scene, Stop } from "./plan-types";
export { cancellation } from "./plan-types";

/** Every plan, upcoming and past. Mock data: a backend replaces this module later. */
export const plans: Plan[] = [...locals, ...trips, ...extras, ...indiaPlans];

/** Upcoming plans in the order they happen. */
export const openPlans: Plan[] = [
  "cubbon", "boardgames", "foodwalk", "pune", "nandi", "ramanagara", "kalavantin", "pottery", "comedy", "coorg", "colaba",
  "olddelhi", "gokarna", "rajmachi", "charminar", "chikmagalur", "rishikesh", "kabini", "goa", "pondicherry",
]
  .map((id) => plans.find((plan) => plan.id === id))
  .filter((plan): plan is Plan => plan !== undefined);

export function getPlan(id: string): Plan | undefined {
  return plans.find((plan) => plan.id === id);
}

/** Who a plan is for: a mixed group, only women or only men. */
export type Crew = "mixed" | "women" | "men";

export function crewOf(plan: Plan): Crew {
  return plan.womenOnly ? "women" : plan.menOnly ? "men" : "mixed";
}

/**
 * Women-only plans are hidden from men, and men-only plans from women, everywhere, including the meeting area.
 * POLICY PLACEHOLDER: how non-binary members are treated here needs a product decision.
 * For now they can see both kinds.
 */
export function canSee(plan: Plan, gender: Gender): boolean {
  if (plan.womenOnly) return gender !== "man";
  if (plan.menOnly) return gender !== "woman";
  return true;
}

/** `plan.seatsLeft` excludes the member, so take off the seats they hold (more than 1 on group plans). */
export function seatsLeft(plan: Plan, held: number): number {
  return Math.max(0, plan.seatsLeft - held);
}

const inr = new Intl.NumberFormat("en-IN");

export function rupee(amount: number): string {
  return `₹${inr.format(amount)}`;
}

export type Mix = { women: number; men: number; others: number; total: number };

/** Gender mix of confirmed attendees. Pass the member's gender when they hold a seat. */
export function mixFor(plan: Plan, me: Gender | null): Mix {
  const genders = plan.attendeeIds.map((id) => getPerson(id).gender);
  if (me) genders.push(me);
  const women = genders.filter((g) => g === "woman").length;
  const men = genders.filter((g) => g === "man").length;
  return { women, men, others: genders.length - women - men, total: genders.length };
}
