import { connectionsOf, type Connection } from "./derive";
import { getPerson } from "./directory";
import { getPlan, type Plan } from "./plans";
import { dmSeeds, threadFor, type Message, type Poll } from "./social";
import type { State } from "./store";

export type GroupChat = { kind: "group"; id: string; title: string; plan: Plan; pinned: string; poll?: Poll; messages: Message[] };
export type DirectChat = { kind: "dm"; id: string; title: string; connection: Connection; messages: Message[] };
export type Thread = GroupChat | DirectChat;

/** Seeded history plus what the member has sent, with blocked people's messages removed. */
function history(state: State, id: string, seed: Message[]): Message[] {
  return [...seed, ...(state.sent[id] ?? [])].filter((message) => !state.blocked.includes(message.from));
}

function groupChat(state: State, plan: Plan): GroupChat {
  const thread = threadFor(plan);
  return { kind: "group", id: thread.id, title: plan.title, plan, pinned: thread.pinned, poll: thread.poll, messages: history(state, thread.id, thread.seed) };
}

function directChat(state: State, connection: Connection): DirectChat {
  const id = `dm-${connection.person.id}`;
  return { kind: "dm", id, title: connection.person.name, connection, messages: history(state, id, dmSeeds[connection.person.id] ?? []) };
}

/**
 * Every conversation the member can open.
 * A group chat needs a confirmed seat. A 1:1 chat exists only after a mutual signal.
 */
export function threadsOf(state: State): Thread[] {
  const groups = state.bookings
    .filter((booking) => booking.status === "confirmed")
    .map((booking) => getPlan(booking.planId))
    .filter((plan): plan is Plan => plan !== undefined)
    .map((plan) => groupChat(state, plan));
  const direct = connectionsOf(state).map((connection) => directChat(state, connection));
  return [...groups.filter((chat) => !chat.plan.past), ...direct, ...groups.filter((chat) => chat.plan.past)];
}

export function findThread(state: State, id: string): Thread | undefined {
  return threadsOf(state).find((thread) => thread.id === id);
}

export function senderName(from: string): string {
  return from === "me" ? "You" : getPerson(from).name;
}
