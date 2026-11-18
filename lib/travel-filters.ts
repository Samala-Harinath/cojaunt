import type { Gender } from "./people";
import { crewOf, type Crew, type Plan } from "./plans";

export type When = "any" | "weekend" | "city" | "trips";
export type CrewPick = "any" | Crew;
export type TravelFilters = { when: When; crew: CrewPick };

export const noFilters: TravelFilters = { when: "any", crew: "any" };

export const whenOptions: { id: When; label: string; test: (plan: Plan) => boolean }[] = [
  { id: "any", label: "Any time", test: () => true },
  { id: "weekend", label: "This weekend", test: (plan) => plan.thisWeekend },
  { id: "city", label: "In the city", test: (plan) => plan.kind === "local" },
  { id: "trips", label: "Overnight trips", test: (plan) => plan.kind === "trip" },
];

const crewOptions: { id: CrewPick; label: string }[] = [
  { id: "any", label: "Anyone" },
  { id: "mixed", label: "Women & men" },
  { id: "women", label: "Only women" },
  { id: "men", label: "Only men" },
];

/** Women-only is hidden from men and men-only from women, since they can't join those. */
export function crewOptionsFor(gender: Gender) {
  return crewOptions.filter((option) => (option.id !== "women" || gender !== "man") && (option.id !== "men" || gender !== "woman"));
}

/** `skipWhen` is set while a typed search is active, since the search can set its own time facet. */
export function matches(plan: Plan, filters: TravelFilters, skipWhen: boolean): boolean {
  const timeTest = whenOptions.find((item) => item.id === filters.when)?.test ?? (() => true);
  return (skipWhen || timeTest(plan)) && (filters.crew === "any" || crewOf(plan) === filters.crew);
}
