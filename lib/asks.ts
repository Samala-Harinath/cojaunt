import { canSpark, connectionsOf } from "./derive";
import { findPerson } from "./directory";
import type { PrivateDetails } from "./people";
import { sampleDetails } from "./private-details";
import { scanMessage } from "./safety";
import type { Ask, AskKind, State } from "./store";

/**
 * Rules for Sparks and travel-buddy requests, in one place so every screen applies the same ones.
 * PROTOTYPE: these run in the browser. A backend must enforce every rule here again, on the server,
 * because anything in the browser can be changed by the person using it.
 */
export const NOTE_MAX = 200;
/** Caps on requests waiting for a reply. They stop one member from messaging everyone at once. */
export const PENDING_MAX = 10;
export const SPARK_PENDING_MAX = 5;

export const askInfo: Record<AskKind, { name: string; received: string; action: string; tone: string; icon: "spark" | "compass" }> = {
  spark: { name: "Spark", received: "sent you a Spark", action: "Send a Spark", tone: "bg-spark-soft text-spark", icon: "spark" },
  travel: { name: "Travel buddy", received: "wants to travel with you", action: "Ask to travel together", tone: "bg-forest-soft text-forest-deep", icon: "compass" },
};

/**
 * Requests the member may see: never from blocked people, and a Spark only when the same Spark
 * would be allowed the other way round (both single, both open to dating, each other's preference).
 */
export function visibleAsks(state: State): Ask[] {
  return state.asks.filter((ask) => {
    const person = findPerson(ask.personId);
    if (!person || state.blocked.includes(ask.personId)) return false;
    return ask.kind !== "spark" || canSpark(state.me, person);
  });
}

/** Requests waiting for the member. Muted people's requests wait silently: no badge, no list entry. */
export function inbox(state: State): Ask[] {
  return visibleAsks(state).filter((ask) => ask.from === "them" && ask.status === "pending" && !state.muted.includes(ask.personId));
}

export function outbox(state: State): Ask[] {
  return visibleAsks(state).filter((ask) => ask.from === "me");
}

export function isConnected(state: State, personId: string): boolean {
  return connectionsOf(state).some((connection) => connection.person.id === personId);
}

/** Private details are released only to connections. Everyone else gets null. */
export function detailsFor(state: State, personId: string): PrivateDetails | null {
  return isConnected(state, personId) ? sampleDetails(personId) : null;
}

export type Relation =
  | { kind: "blocked" }
  | { kind: "connected" }
  | { kind: "incoming"; ask: Ask }
  | { kind: "outgoing"; ask: Ask }
  | { kind: "closed" }
  /** Was connected, then unfriended. A new request can be sent. */
  | { kind: "ended" }
  | { kind: "none" };

/** Where the member stands with one person. Decides which buttons a profile shows. */
export function relationTo(state: State, personId: string): Relation {
  if (state.blocked.includes(personId)) return { kind: "blocked" };
  if (isConnected(state, personId)) return { kind: "connected" };
  const asks = visibleAsks(state).filter((ask) => ask.personId === personId);
  const pending = asks.find((ask) => ask.status === "pending");
  if (pending) return pending.from === "them" ? { kind: "incoming", ask: pending } : { kind: "outgoing", ask: pending };
  // A declined request since the last unfriend closes the door both ways, so nobody can be asked again and again.
  // After an unfriend ("ended"), either side may send one fresh request.
  const lastEnded = asks.reduce((latest, ask, index) => (ask.status === "ended" ? index : latest), -1);
  if (asks.some((ask, index) => ask.status === "declined" && index > lastEnded)) return { kind: "closed" };
  return { kind: state.unfriended.includes(personId) ? "ended" : "none" };
}

/** Why a request can't be sent, in words for the member, or null when it can. */
export function askProblem(state: State, personId: string, kind: AskKind, note: string): string | null {
  const person = findPerson(personId);
  if (!person) return "This member isn’t available.";
  if (state.blocked.includes(personId)) return "You’ve blocked this member.";
  if (!state.me.selfieVerified) return "Verify your selfie before sending requests. It keeps everyone here real.";

  const relation = relationTo(state, personId);
  if (relation.kind === "connected") return `You’re already connected with ${person.name}.`;
  if (relation.kind === "incoming") return `${person.name} already sent you a request. Accept it instead.`;
  if (relation.kind === "outgoing") return `Your request to ${person.name} is already waiting.`;
  if (relation.kind === "closed") return "This request is closed, so you can’t send another one.";

  if (kind === "spark" && !canSpark(state.me, person)) return "Sparks are only between single members who are open to dating.";

  const waiting = state.asks.filter((ask) => ask.from === "me" && ask.status === "pending");
  if (waiting.length >= PENDING_MAX) return `You have ${PENDING_MAX} requests waiting. Withdraw one or wait for replies first.`;
  if (kind === "spark" && waiting.filter((ask) => ask.kind === "spark").length >= SPARK_PENDING_MAX) {
    return `You have ${SPARK_PENDING_MAX} Sparks waiting. Withdraw one or wait for replies first.`;
  }

  const text = note.trim();
  if (text.length > NOTE_MAX) return `Keep your note under ${NOTE_MAX} characters.`;
  if (scanMessage(text)) return "Leave phone numbers, links and payment details out of your note. You can share them once they accept.";
  return null;
}
