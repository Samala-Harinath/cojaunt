import type { Plan } from "./plan-types";

export type Signal = "again" | "spark" | "skip";
export type Message = { id: string; from: string; text: string; at: string };
export type Poll = { question: string; options: string[]; votes: number[] };
export type GroupThread = { id: string; planId: string; pinned: string; poll?: Poll; seed: Message[] };

let count = 0;
const m = (from: string, text: string, at: string): Message => ({ id: `seed-${++count}`, from, text, at });

/**
 * What co-attendees privately chose about the member (mock).
 * In production this never reaches the client: the server returns only mutual results.
 */
export const replies: Record<string, Record<string, Signal>> = {
  sakleshpur: { meera: "again", arjun: "spark", sana: "again" },
  savandurga: { tara: "again", kabir: "spark", ishaan: "again", zoya: "skip" },
  hampi: { riya: "again", aditya: "spark", farah: "again", kabir: "again" },
  lalbagh: { vikram: "again", anika: "again", sam: "skip", tara: "again" },
};

export const groupThreads: GroupThread[] = [
  {
    id: "g-coorg",
    planId: "coorg",
    pinned: "Meet Fri 7:00 PM at Indiranagar Metro, Gate 2. Carry a light jacket and your ID.",
    poll: { question: "Saturday evening?", options: ["Bonfire and music", "Night walk in the estate", "Early night"], votes: [2, 1, 0] },
    seed: [
      m("divya", "Welcome, everyone! Introductions when you get a minute: your name, and the one snack you’re bringing.", "Mon"),
      m("sana", "Sana here. Bringing banana chips, obviously.", "Mon"),
      m("rahul", "Rahul. First trip with strangers, slightly nervous, bringing murukku.", "Mon"),
      m("neha", "Neha! Same boat, Rahul. I’ll bring the playlist.", "Tue"),
      m("divya", "Lovely. Rooms are twin-sharing, same gender. Vote on Saturday evening in the poll above.", "Tue"),
    ],
  },
  {
    id: "g-nandi",
    planId: "nandi",
    pinned: "Pickup Sun 4:30 AM at the Hebbal flyover point. Shoes with grip, one litre of water.",
    seed: [m("karthik", "Morning crew! Weather looks clear for Sunday. Sleep early on Saturday.", "Today")],
  },
  {
    id: "g-savandurga",
    planId: "savandurga",
    pinned: "This plan has ended. Reflections stay open for 7 days.",
    seed: [
      m("divya", "Great climbing today, all of you. Photos are in the album.", "Sun"),
      m("kabir", "Best Sunday in months. Thank you, Divya.", "Sun"),
      m("tara", "My legs disagree but my heart agrees.", "Sun"),
    ],
  },
  {
    id: "g-sakleshpur",
    planId: "sakleshpur",
    pinned: "This plan has ended.",
    seed: [
      m("karthik", "Everyone home and dry? Thank you for walking through that rain without complaining.", "27 Sep"),
      m("sana", "Home. My shoes may never recover.", "27 Sep"),
    ],
  },
  {
    id: "g-hampi",
    planId: "hampi",
    pinned: "This plan has ended. Photos are in the shared album.",
    seed: [
      m("divya", "Back in Bengaluru. Thank you for being the easiest group I’ve had all year.", "11 Oct"),
      m("aditya", "Still thinking about that coracle ride.", "11 Oct"),
      m("riya", "The banana bread survived the boulders. Barely.", "11 Oct"),
      m("farah", "Already looking at the Pondicherry trip. Anyone?", "12 Oct"),
    ],
  },
  {
    id: "g-lalbagh",
    planId: "lalbagh",
    pinned: "This plan has ended.",
    seed: [
      m("meera", "Lovely light this morning. Share your best three shots here!", "8 Nov"),
      m("anika", "I got the heron. I GOT THE HERON.", "8 Nov"),
      m("vikram", "Mine are all blurry, but I had a great time.", "8 Nov"),
    ],
  },
  {
    id: "g-foodwalk",
    planId: "foodwalk",
    pinned: "Sat 7:00 PM at Sajjan Rao Circle. Come hungry, wear comfy shoes.",
    poll: { question: "Dessert stop?", options: ["Holige", "Gulkand ice cream", "Both, obviously"], votes: [1, 1, 3] },
    seed: [
      m("meera", "Hi all! Any allergies or food you don’t eat? Tell me here or privately.", "Tue"),
      m("riya", "No allergies, very high expectations.", "Tue"),
      m("sam", "Vegetarian here. Is that okay for VV Puram?", "Wed"),
      m("meera", "VV Puram is almost entirely veg, Sam. You’re in luck.", "Wed"),
    ],
  },
];

/** Every plan has a group chat. Plans without seeded history get a host welcome. */
export function threadFor(plan: Plan): GroupThread {
  const seeded = groupThreads.find((thread) => thread.planId === plan.id);
  if (seeded) return seeded;
  return {
    id: `g-${plan.id}`,
    planId: plan.id,
    pinned: `${plan.when}. Meet at ${plan.meet}.`,
    seed: [{ id: `seed-${plan.id}`, from: plan.hostId, text: "Welcome! I’ll share the final details here two days before we meet.", at: "Today" }],
  };
}

/** Opening history for 1:1 chats, keyed by person. A 1:1 chat exists only after a mutual signal. */
export const dmSeeds: Record<string, Message[]> = {
  arjun: [
    m("arjun", "So it wasn’t just me. Hi.", "28 Sep"),
    m("me", "Hi. It wasn’t just you.", "28 Sep"),
    m("arjun", "I’m on the Kabini trip in December. There’s a waitlist, if you’re tempted.", "Yesterday"),
  ],
  meera: [m("meera", "I’m hosting Chikmagalur in December. Slow weekend, women-only. Want in?", "Sat")],
  aditya: [
    m("aditya", "Hello from the other Spark. Still owe you the story of the Vittala chariot.", "12 Oct"),
    m("me", "I’ll hold you to that. Coffee sometime?", "12 Oct"),
    m("aditya", "There’s an open-mic plan on the 27th. Low pressure, lots of people. Want to go together?", "Mon"),
  ],
  riya: [m("riya", "Pondicherry at Christmas? I’ll bring the banana bread again.", "Sun"), m("me", "Tempting. Very tempting.", "Sun")],
  farah: [m("farah", "Good luck with the new job! Tell me how the first week goes.", "3 Nov")],
  vikram: [m("vikram", "Can you send me the settings you used for the lake shot?", "8 Nov")],
  anika: [m("anika", "The flower you asked about was a Tabebuia. Pink trumpet tree!", "9 Nov")],
  sana: [m("sana", "Coorg crew group is very chaotic already. You’ll love it.", "Yesterday")],
};

/** Public reviews co-travellers left for the member, keyed to the plan they met on. */
export const reviewsOfMe: { from: string; planId: string; text: string }[] = [
  { from: "meera", planId: "sakleshpur", text: "Easy company and always on time. Lent me her rain jacket without being asked." },
  { from: "sana", planId: "sakleshpur", text: "Great listener, better navigator. Would share a tent again." },
  { from: "riya", planId: "hampi", text: "Woke up first, made everyone chai, never once complained about the heat." },
  { from: "aditya", planId: "hampi", text: "Asked the best questions on the temple walk. Made a quiet group feel comfortable." },
  { from: "vikram", planId: "lalbagh", text: "Patient and kind. Helped me fix my camera settings twice." },
];

/** A plan the member hosts, for the host dashboard. */
export const hosted = {
  title: "Sunday Sketchwalk, Basavanagudi",
  when: "Sun 29 Nov, 7:30 AM",
  price: 399,
  seats: 8,
  confirmedIds: ["tara", "dev", "neha"],
  requests: [
    { id: "r1", personId: "zoya", note: "I sketch badly and enthusiastically. Is that okay?" },
    { id: "r2", personId: "ishaan", note: "New to the city and looking for a calm Sunday thing." },
    { id: "r3", personId: "kabir", note: "Would love to bring my film camera along." },
  ],
};
