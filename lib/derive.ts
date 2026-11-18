import { getPerson, people } from "./directory";
import { likes, type Gender, type Person } from "./people";
import { getPlan, type Plan } from "./plans";
import { replies } from "./social";
import type { Booking, Me, State } from "./store";

export function bookingFor(state: State, planId: string): Booking | undefined {
  return state.bookings.find((booking) => booking.planId === planId);
}

export function holdsSeat(state: State, planId: string): boolean {
  return bookingFor(state, planId)?.status === "confirmed";
}

/** Confirmed seats the member holds on a plan: 0 if none, more than 1 for a group booking. */
export function seatsHeld(state: State, planId: string): number {
  const booking = bookingFor(state, planId);
  return booking?.status === "confirmed" ? (booking.seats ?? 1) : 0;
}

/** Dating (the Date tab, Singles trips, Sparks) is only for single members who chose "Open to dating". */
export function canDate(me: Me): boolean {
  return me.intent === "open" && me.status !== "married";
}

/**
 * Whether the member may send this person a Spark: both single and open to dating, and each is someone
 * the other wants to meet (see `likes`). A married member, or one set to "New friends", can never send one.
 */
export function canSpark(me: Me, person: Person): boolean {
  return canDate(me) && person.status === "single" && person.openToDating && likes(me.gender, person.gender) && likes(person.gender, me.gender);
}

export function sharedInterests(me: Me, person: Person): string[] {
  return person.interests.filter((tag) => me.interests.includes(tag));
}

/** Single people the member can Spark, on the Date tab. Closest in age first. */
export function singlesFor(state: State): Person[] {
  const { me } = state;
  if (!canDate(me)) return [];
  return people
    .filter((person) => !state.blocked.includes(person.id) && !state.muted.includes(person.id) && canSpark(me, person))
    .sort((a, b) => Math.abs(a.age - me.age) - Math.abs(b.age - me.age) || a.name.localeCompare(b.name));
}

/**
 * Verified members to travel with one-to-one, on the Travel buddy tab.
 * `only` limits the list to one gender, for members who prefer a same-gender companion.
 * Most shared interests first.
 */
export function buddiesFor(state: State, only: Gender | null): Person[] {
  const shared = (person: Person) => sharedInterests(state.me, person).length;
  return people
    .filter((person) => person.idVerified && !state.blocked.includes(person.id) && !state.muted.includes(person.id) && (!only || person.gender === only))
    .sort((a, b) => shared(b) - shared(a) || a.name.localeCompare(b.name));
}

/**
 * Why the member can't request a seat, or null if they can.
 * Singles trips are only for single members who chose "Open to dating", inside the trip's age band.
 */
export function blockedFrom(state: State, plan: Plan): string | null {
  if (plan.audience !== "dating") return null;
  if (state.me.status === "married") return "status";
  if (state.me.intent !== "open") return "intent";
  if (plan.ageRange && (state.me.age < plan.ageRange[0] || state.me.age > plan.ageRange[1])) return "age";
  return null;
}

/**
 * Someone the member is connected with. `via` says how: a mutual choice after a plan, or an accepted request.
 * Connections can message each other and see each other's private details.
 */
export type Connection = { person: Person; kind: "spark" | "friend"; via: "plan" | "request"; planId?: string };

/**
 * Only mutual choices become connections. A one-sided choice or a pending request is never a connection.
 * A Spark includes "Travel again", so Spark + Travel again is a Travel buddy.
 */
export function connectionsOf(state: State): Connection[] {
  const found = new Map<string, Connection>();
  const put = (next: Connection) => {
    const existing = found.get(next.person.id);
    if (!existing || (next.kind === "spark" && existing.kind !== "spark")) found.set(next.person.id, next);
  };

  for (const [planId, mine] of Object.entries(state.signals)) {
    for (const [personId, signal] of Object.entries(mine)) {
      const theirs = replies[planId]?.[personId];
      if (!theirs || signal === "skip" || theirs === "skip" || state.blocked.includes(personId) || state.unfriended.includes(personId)) continue;
      put({ person: getPerson(personId), kind: signal === "spark" && theirs === "spark" ? "spark" : "friend", via: "plan", planId });
    }
  }

  for (const ask of state.asks) {
    if (ask.status !== "accepted" || state.blocked.includes(ask.personId) || state.unfriended.includes(ask.personId)) continue;
    // A Spark stops counting as a dating connection if the member switches dating off; it stays a travel buddy.
    put({ person: getPerson(ask.personId), kind: ask.kind === "spark" && canDate(state.me) ? "spark" : "friend", via: "request" });
  }

  return [...found.values()];
}

/** Past plans the member attended and hasn't reflected on yet. */
export function pendingReflections(state: State): Plan[] {
  return state.bookings
    .filter((booking) => booking.status === "confirmed" && !state.signals[booking.planId])
    .map((booking) => getPlan(booking.planId))
    .filter((plan): plan is Plan => plan !== undefined && plan.past);
}

/** Co-attendees the member can see, with blocked people removed. */
export function companions(state: State, plan: Plan): Person[] {
  return plan.attendeeIds.filter((id) => !state.blocked.includes(id)).map(getPerson);
}
