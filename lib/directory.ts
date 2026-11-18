import { vibe, type Person } from "./people";

/** Mock members. Every one of them is fictional. */
const raw: Omit<Person, "status" | "openToDating" | "photos">[] = [
  { id: "divya", name: "Divya", age: 31, gender: "woman", hue: 12, work: "Trek lead", bio: "Coorg-born, raised on a coffee estate. I keep groups small and mornings slow.", interests: ["Trekking", "Coffee", "Nature"], plansDone: 31, idVerified: true, vibe: vibe(0, 1, 0, 1, 1, 0), host: { rating: 4.9, reviews: 31, since: "2024" } },
  { id: "karthik", name: "Karthik", age: 34, gender: "man", hue: 200, work: "Outdoor guide", bio: "Ten years of coastal trails. Safety briefing first, sunset second.", interests: ["Trekking", "Beach", "Photography"], plansDone: 54, idVerified: true, vibe: vibe(2, 0, 0, 2, 2, 1), host: { rating: 4.8, reviews: 54, since: "2023" } },
  { id: "meera", name: "Meera", age: 32, gender: "woman", hue: 290, work: "Consultant, community host", bio: "Solo traveller turned host. I plan the trips I wished existed.", interests: ["Slow travel", "Coffee", "Art"], plansDone: 22, idVerified: true, vibe: vibe(0, 1, 1, 1, 0, 0), host: { rating: 4.9, reviews: 18, since: "2025" } },
  { id: "sana", name: "Sana", age: 27, gender: "woman", hue: 330, work: "UX researcher", bio: "Asks too many questions on walking tours.", interests: ["Coffee", "Culture", "Food"], plansDone: 7, idVerified: true, vibe: vibe(0, 1, 1, 1, 1, 1) },
  { id: "rahul", name: "Rahul", age: 29, gender: "man", hue: 225, work: "Software engineer", bio: "Weekend trekker, weekday debugger.", interests: ["Trekking", "Fitness", "Games"], plansDone: 4, idVerified: true, vibe: vibe(1, 1, 0, 0, 1, 1) },
  { id: "arjun", name: "Arjun", age: 30, gender: "man", hue: 160, work: "Architect", bio: "Sketches buildings, photographs birds.", interests: ["Photography", "Nature", "Art"], plansDone: 9, idVerified: true, vibe: vibe(0, 1, 1, 1, 1, 1) },
  { id: "neha", name: "Neha", age: 26, gender: "woman", hue: 350, work: "Data analyst", bio: "Will make the playlist. Will not share the aux.", interests: ["Music", "Food", "Fitness"], plansDone: 5, idVerified: true, vibe: vibe(1, 1, 1, 2, 2, 1) },
  { id: "ishaan", name: "Ishaan", age: 28, gender: "man", hue: 180, work: "Product manager", bio: "New to the city. Good at carrying extra water.", interests: ["Fitness", "Trekking", "Coffee"], plansDone: 3, idVerified: true, vibe: vibe(2, 1, 0, 1, 2, 0) },
  { id: "tara", name: "Tara", age: 29, gender: "woman", hue: 262, work: "Illustrator", bio: "Draws the trip instead of photographing it.", interests: ["Art", "Slow travel", "Nature"], plansDone: 12, idVerified: true, vibe: vibe(0, 1, 1, 0, 0, 1) },
  { id: "kabir", name: "Kabir", age: 31, gender: "man", hue: 20, work: "Documentary editor", bio: "Collects stories from chai stalls.", interests: ["Photography", "Culture", "Coffee"], plansDone: 8, idVerified: true, vibe: vibe(0, 1, 2, 1, 1, 1) },
  { id: "zoya", name: "Zoya", age: 28, gender: "woman", hue: 310, work: "Physiotherapist", bio: "Stretches before treks and tells you to as well.", interests: ["Fitness", "Nature", "Art"], plansDone: 10, idVerified: true, vibe: vibe(1, 1, 0, 1, 0, 0) },
  { id: "dev", name: "Dev", age: 27, gender: "nonbinary", hue: 140, work: "Musician", bio: "Carries a ukulele. Takes requests after 9.", interests: ["Music", "Games", "Beach"], plansDone: 6, idVerified: true, vibe: vibe(1, 0, 2, 2, 1, 1) },
  { id: "riya", name: "Riya", age: 26, gender: "woman", hue: 40, work: "Pastry chef", bio: "Brings home-baked banana bread to every trip. It’s a bribe.", interests: ["Food", "Coffee", "Slow travel"], plansDone: 6, idVerified: true, vibe: vibe(0, 1, 0, 1, 1, 0) },
  { id: "aditya", name: "Aditya", age: 30, gender: "man", hue: 210, work: "School teacher", bio: "Knows the history of every ruin and will tell you, gently.", interests: ["Culture", "Trekking", "Photography"], plansDone: 11, idVerified: true, vibe: vibe(1, 1, 0, 1, 1, 1) },
  { id: "farah", name: "Farah", age: 30, gender: "woman", hue: 5, work: "Lawyer", bio: "Reads the fine print, then jumps in the river anyway.", interests: ["Beach", "Culture", "Food"], plansDone: 9, idVerified: true, vibe: vibe(1, 2, 1, 2, 2, 1) },
  { id: "vikram", name: "Vikram", age: 29, gender: "man", hue: 120, work: "Startup founder", bio: "Trying to spend more weekends offline. Mostly succeeding.", interests: ["Fitness", "Photography", "Coffee"], plansDone: 5, idVerified: true, vibe: vibe(2, 1, 0, 1, 1, 0) },
  { id: "anika", name: "Anika", age: 25, gender: "woman", hue: 275, work: "Master’s student", bio: "Botany nerd. Will stop to name every flower on the trail.", interests: ["Nature", "Art", "Photography"], plansDone: 4, idVerified: true, vibe: vibe(0, 0, 0, 0, 0, 0) },
  { id: "sam", name: "Sam", age: 28, gender: "nonbinary", hue: 190, work: "Copywriter", bio: "Keeps a travel journal in three colours of ink.", interests: ["Art", "Culture", "Music"], plansDone: 7, idVerified: true, vibe: vibe(0, 1, 2, 1, 1, 1) },
];

/** Mock relationship data. Married members are never listed for dating, and the hosts haven't chosen Open to dating. */
const married = new Set(["karthik", "vikram", "farah"]);
const notOpen = new Set(["divya", "meera", "rahul"]);

/** How many photos each mock member uploaded (1 to 6). */
const photoCounts: Record<string, number> = {
  divya: 4, karthik: 3, meera: 5, sana: 4, rahul: 2, arjun: 5, neha: 3, ishaan: 4, tara: 6,
  kabir: 3, zoya: 4, dev: 2, riya: 5, aditya: 3, farah: 4, vikram: 2, anika: 3, sam: 1,
};

export const people: Person[] = raw.map((person) => {
  const status = married.has(person.id) ? "married" : "single";
  return { ...person, photos: photoCounts[person.id] ?? 1, status, openToDating: status === "single" && !notOpen.has(person.id) };
});

const byId = new Map(people.map((person) => [person.id, person]));

export function findPerson(id: string): Person | undefined {
  return byId.get(id);
}

const unknown: Person = {
  id: "unknown", name: "Member", age: 0, gender: "nonbinary", hue: 30, photos: 0, work: "", bio: "",
  interests: [], plansDone: 0, idVerified: false, vibe: vibe(1, 1, 1, 1, 1, 1), status: "single", openToDating: false,
};

export function getPerson(id: string): Person {
  return byId.get(id) ?? unknown;
}
