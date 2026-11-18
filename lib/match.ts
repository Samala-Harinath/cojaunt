import { getPerson } from "./directory";
import { vibeQuestions, type Vibe, type VibeKey } from "./people";
import type { Plan } from "./plan-types";

/**
 * Explained compatibility.
 * Rules only, by design: the blueprint defers ML until there is real attendance data,
 * and every number shown to a member can be traced to an answer they gave.
 */
export type Fit = {
  score: number;
  label: "Strong fit" | "Good fit" | "A stretch";
  reasons: string[];
  headsUp: string | null;
  vibeWith: number;
  groupSize: number;
};

const keys = vibeQuestions.map((question) => question.key);

const matches: Record<VibeKey, string> = {
  pace: "Matches the pace you picked",
  budget: "Sits in your spending comfort zone",
  sleep: "The timings suit your body clock",
  social: "The group energy is your kind",
  food: "The food works for you",
  drinks: "Same page on drinking",
};

const clashes: Record<VibeKey, string> = {
  pace: "The pace is quite different from what you picked.",
  budget: "The spend level is a step away from your usual.",
  sleep: "The timings run against your body clock.",
  social: "The group energy is different from your usual.",
  food: "Check the food options with the host before you book.",
  drinks: "The drinking culture differs from yours.",
};

function closeness(a: Vibe, b: Vibe): number {
  const total = keys.reduce((sum, key) => sum + (1 - Math.abs(a[key] - b[key]) / 2), 0);
  return total / keys.length;
}

export function fitFor(plan: Plan, mine: Vibe, interests: string[]): Fit {
  const shared = plan.tags.filter((tag) => interests.includes(tag));
  const score = Math.round(100 * (0.8 * closeness(plan.vibe, mine) + (0.2 * Math.min(shared.length, 2)) / 2));

  const reasons = keys.filter((key) => plan.vibe[key] === mine[key]).map((key) => matches[key]);
  if (shared.length > 0) reasons.unshift(`Overlaps with your interests: ${shared.slice(0, 2).join(", ")}`);

  const clash = keys.find((key) => Math.abs(plan.vibe[key] - mine[key]) === 2);
  const group = plan.attendeeIds.map(getPerson);

  return {
    score,
    label: score >= 80 ? "Strong fit" : score >= 60 ? "Good fit" : "A stretch",
    reasons: reasons.slice(0, 3),
    headsUp: clash ? clashes[clash] : null,
    vibeWith: group.filter((person) => closeness(person.vibe, mine) >= 0.7).length,
    groupSize: group.length,
  };
}
