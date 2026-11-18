import type { Plan } from "./plan-types";

/**
 * Plain-language plan search.
 *
 * PROTOTYPE: this is a deterministic keyword parser standing in for a language model.
 * The contract is what matters for the backend: free text in, a list of explicit,
 * removable facets out. The member always sees how they were understood.
 */
export type Facet = { key: string; label: string; test: (plan: Plan) => boolean };

const themes: { tag: string; words: RegExp }[] = [
  { tag: "Trekking", words: /\b(treks?|trekking|hikes?|hiking|hills?|mountains?|sunrise)\b/ },
  { tag: "Beach", words: /\b(beach|beaches|sea|coast|coastal)\b/ },
  { tag: "Coffee", words: /\b(coffee|cafes?)\b/ },
  { tag: "Food", words: /\b(food|foodie|dinner|breakfast|brunch)\b/ },
  { tag: "Art", words: /\b(arts?|pottery|crafts?|creative|sketch|sketching)\b/ },
  { tag: "Nature", words: /\b(nature|wildlife|safari|forest|jungle|outdoors?)\b/ },
  { tag: "Fitness", words: /\b(run|running|fitness|workout)\b/ },
  { tag: "Games", words: /\b(games?|boardgames?)\b/ },
];

const priceWords = /(?:under|below|less than|max|upto|up to|within|budget(?: of)?)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:[.,]\d+)?)\s*(k)?/;

export function parseAsk(input: string): Facet[] {
  const text = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "");
  const facets: Facet[] = [];

  const price = priceWords.exec(text);
  if (price) {
    const amount = Number(price[1].replace(",", price[2] ? "." : "")) * (price[2] ? 1000 : 1);
    if (Number.isFinite(amount) && amount > 0) {
      facets.push({ key: "price", label: `Under ₹${amount.toLocaleString("en-IN")}`, test: (plan) => plan.price <= amount });
    }
  }

  if (/\b(women|womens|woman|ladies|girls|female)\b/.test(text)) {
    facets.push({ key: "women", label: "Women-only", test: (plan) => plan.womenOnly });
  }

  if (/\b(men|mens|man|guys|boys|male)\b/.test(text)) {
    facets.push({ key: "men", label: "Men-only", test: (plan) => plan.menOnly === true });
  }

  if (/\b(trips?|getaway|overnight|nights?|weekend away)\b/.test(text)) {
    facets.push({ key: "kind", label: "Overnight trips", test: (plan) => plan.kind === "trip" });
  } else if (/\b(local|in the city|evening|tonight|few hours|after work|day plan)\b/.test(text)) {
    facets.push({ key: "kind", label: "In the city", test: (plan) => plan.kind === "local" });
  }

  if (/\b(this weekend|saturday|sunday)\b/.test(text)) {
    facets.push({ key: "when", label: "This weekend", test: (plan) => plan.thisWeekend });
  }

  if (/\b(chill|slow|relax|relaxed|relaxing|calm|quiet|easy|lazy)\b/.test(text)) {
    facets.push({ key: "pace", label: "Slow pace", test: (plan) => plan.vibe.pace === 0 });
  } else if (/\b(adventure|adventurous|active|intense|challenging)\b/.test(text)) {
    facets.push({ key: "pace", label: "High energy", test: (plan) => plan.vibe.pace === 2 });
  }

  if (/\b(small|intimate)\b/.test(text)) {
    facets.push({ key: "size", label: "6 people or fewer", test: (plan) => plan.seats <= 6 });
  }

  // Several themes in one request mean "any of these", so they become a single facet.
  const wanted = themes.filter((theme) => theme.words.test(text)).map((theme) => theme.tag);
  if (wanted.length > 0) {
    facets.push({ key: "themes", label: wanted.join(" or "), test: (plan) => plan.tags.some((tag) => wanted.includes(tag)) });
  }

  return facets;
}

export const askExamples = [
  "Chill women-only trip under 7k",
  "Something active this weekend",
  "Coffee or art, small group",
];
