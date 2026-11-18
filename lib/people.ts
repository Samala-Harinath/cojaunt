export type Gender = "woman" | "man" | "nonbinary";
export type VibeKey = "pace" | "budget" | "sleep" | "social" | "food" | "drinks";
/** Each answer is 0, 1 or 2: the index of the option picked in the vibe quiz. */
export type Vibe = Record<VibeKey, number>;

export const vibe = (
  pace: number,
  budget: number,
  sleep: number,
  social: number,
  food: number,
  drinks: number,
): Vibe => ({ pace, budget, sleep, social, food, drinks });

export type VibeQuestion = {
  key: VibeKey;
  question: string;
  options: [string, string, string];
  short: [string, string, string];
};

export const vibeQuestions: VibeQuestion[] = [
  {
    key: "pace",
    question: "What’s your ideal trip pace?",
    options: ["Slow mornings, one good thing a day", "A loose plan with room to wander", "Up at dawn, fit everything in"],
    short: ["Slow pace", "Balanced pace", "Packed days"],
  },
  {
    key: "budget",
    question: "How do you like to spend?",
    options: ["Hostels and street food", "Comfortable, nothing fancy", "Happy to splurge on the stay"],
    short: ["Shoestring", "Comfort", "Splurge"],
  },
  {
    key: "sleep",
    question: "When are you at your best?",
    options: ["Early mornings", "Either works", "Late nights"],
    short: ["Early bird", "Flexible hours", "Night owl"],
  },
  {
    key: "social",
    question: "In a group of new people, you…",
    options: ["Listen first, talk later", "Warm up within the hour", "Know everyone’s name by lunch"],
    short: ["Quiet start", "Warms up", "Outgoing"],
  },
  {
    key: "food",
    question: "What do you eat?",
    options: ["Vegetarian", "Mostly veg, flexible", "Everything"],
    short: ["Vegetarian", "Flexible eater", "Eats everything"],
  },
  {
    key: "drinks",
    question: "And drinking?",
    options: ["I don’t drink", "A drink or two", "Up for a proper night out"],
    short: ["Doesn’t drink", "Social drinker", "Night-out person"],
  },
];

export const interestOptions = [
  "Trekking", "Beach", "Coffee", "Food", "Art", "Nature",
  "Fitness", "Games", "Photography", "Music", "Culture", "Slow travel",
];

export type Relationship = "single" | "married";

/**
 * Details a member shares only with people they've connected with (an accepted request or a mutual choice after a plan).
 * Everyone else sees first name, age, photos, bio, interests and travel style.
 */
export type PrivateDetails = { surname: string; company: string; area: string; instagram: string };

export const noDetails: PrivateDetails = { surname: "", company: "", area: "", instagram: "" };

export const detailLabels: { key: keyof PrivateDetails; label: string }[] = [
  { key: "surname", label: "Surname" },
  { key: "company", label: "Works at" },
  { key: "area", label: "Lives in" },
  { key: "instagram", label: "Instagram" },
];

/**
 * Dating preference used by the prototype: men see women, women see men, non-binary members see everyone.
 * PLACEHOLDER: a real app asks each member who they want to meet.
 */
export function likes(a: Gender, b: Gender): boolean {
  if (a === "man") return b === "woman";
  if (a === "woman") return b === "man";
  return true;
}

export type Person = {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  /** Hue for the generated avatar. No photos of real people ship with the prototype. */
  hue: number;
  /** How many photos the member uploaded. The prototype draws an illustration for each one. */
  photos: number;
  work: string;
  bio: string;
  interests: string[];
  plansDone: number;
  idVerified: boolean;
  vibe: Vibe;
  status: Relationship;
  /** Chose "Open to dating". Only single members can, so a married member is never listed for dating. */
  openToDating: boolean;
  host?: { rating: number; reviews: number; since: string };
};
