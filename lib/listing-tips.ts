import type { Listing } from "./listing-options";
import { openPlans } from "./plans";

/** Non-blocking suggestions. Rules only, so each one can be explained to the host. */
export function tips(listing: Listing): string[] {
  const list: string[] = [];
  const area = listing.place.split(",")[0].trim();
  if (area && !listing.title.toLowerCase().includes(area.toLowerCase())) {
    list.push(`Put “${area}” in the title, so guests know where it is before they open it.`);
  }
  if (listing.days.some((day) => day.stops.some((stop) => stop.title.trim() && !stop.note.trim()))) {
    list.push("Add notes where they help: what to wear, how long the walk is, what to bring.");
  }
  if (listing.inclusions.length < 2 && Number(listing.price) > 0) list.push("List more of what’s included. Guests compare plans line by line.");
  if (listing.tags.length === 1) list.push("A second theme helps the plan reach more of the right people.");
  return list;
}

/** Price range of similar listed plans: a sanity check, not a recommendation. */
export function priceRange(kind: Listing["kind"]): { low: number; high: number; count: number } | null {
  const prices = openPlans.filter((plan) => plan.kind === kind && plan.price > 0).map((plan) => plan.price);
  if (prices.length < 2) return null;
  return { low: Math.min(...prices), high: Math.max(...prices), count: prices.length };
}
