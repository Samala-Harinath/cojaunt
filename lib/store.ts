"use client";

import { useSyncExternalStore } from "react";
import type { Listing } from "./listing-options";
import type { PlusPlanId } from "./brand";
import { vibe, type Gender, type PrivateDetails, type Relationship, type Vibe } from "./people";
import { sampleAsks, sampleBookings, sampleListing, sampleSignals, sampleWishlist } from "./sample";
import type { Message, Signal } from "./social";

/**
 * A direct request between two members.
 * spark: "I'd like to date you" · travel: "Let's travel together as buddies".
 * Accepting one unlocks both members' private details and opens a 1:1 chat. Rules live in lib/asks.ts.
 */
export type AskKind = "spark" | "travel";
/** ended: the two were connected and one of them unfriended. Either can send a new request later. */
export type AskStatus = "pending" | "accepted" | "declined" | "ended";
export type Ask = { id: string; personId: string; kind: AskKind; from: "me" | "them"; note: string; status: AskStatus; at: number };

/**
 * Client-side state for the prototype, persisted to localStorage.
 * There is no backend yet: every action in lib/actions.ts maps to an API call later.
 */
export type BookingStatus = "requested" | "approved" | "confirmed" | "waitlist";
/** `seats` is how many seats this request covers, counting the member. Only group plans allow more than 1. */
export type Booking = { planId: string; status: BookingStatus; note: string; seats?: number };
export type Contact = { name: string; phone: string };
export type Privacy = { hideFromContacts: boolean; preciseLocation: boolean; visibility: "plans" | "connections" };

export type Me = {
  name: string;
  age: number;
  gender: Gender;
  pronouns: string;
  work: string;
  bio: string;
  hue: number;
  /** Uploaded photos as re-encoded JPEG data URLs (see lib/photos.ts). The first is the main photo. */
  photos: string[];
  /** Shown only to people the member has connected with. */
  details: PrivateDetails;
  interests: string[];
  vibe: Vibe;
  /** Private. Never shown to other members. */
  intent: "friends" | "open";
  /** Dating (Open to dating, Sparks) is only for single members. */
  status: Relationship;
  selfieVerified: boolean;
  idVerified: boolean;
  plus: boolean;
  /** Which Plus plan the member is on, while `plus` is true. */
  plusPlan?: PlusPlanId;
};

export type State = {
  /** True while the seeded demo member is in use. */
  isDemo: boolean;
  me: Me;
  privacy: Privacy;
  contacts: Contact[];
  bookings: Booking[];
  wishlist: string[];
  /** Private post-plan choices, by plan and then by person. */
  signals: Record<string, Record<string, Signal>>;
  /** Messages the member has sent, by thread. */
  sent: Record<string, Message[]>;
  votes: Record<string, number>;
  blocked: string[];
  /** Plans shared with emergency contacts. */
  shared: string[];
  decisions: Record<string, "approved" | "declined">;
  /** Plans the member is creating as a host, in progress or waiting for review. */
  listings: Listing[];
  /** Sparks and travel requests, sent and received. */
  asks: Ask[];
  /** People the member unfriended: no longer connected, chat closed, private details locked again. */
  unfriended: string[];
  /** People the member muted (unfollowed): hidden from Discover and their requests don't notify. They aren't told. */
  muted: string[];
};

/** The seeded member is the blueprint's primary persona, so every screen has content on first load. */
export const demo: State = {
  isDemo: true,
  me: {
    name: "Ananya",
    age: 27,
    gender: "woman",
    pronouns: "she/her",
    work: "Product designer",
    bio: "Moved from Pune last year. I want weekend trips without the planning headache.",
    hue: 28,
    photos: [],
    details: { surname: "Deshpande", company: "Northwind Studio", area: "Indiranagar", instagram: "@ananya.wanders" },
    interests: ["Coffee", "Slow travel", "Art", "Nature"],
    vibe: vibe(0, 1, 1, 1, 1, 1),
    intent: "open",
    status: "single",
    selfieVerified: true,
    idVerified: false,
    plus: false,
  },
  privacy: { hideFromContacts: true, preciseLocation: false, visibility: "plans" },
  contacts: [{ name: "Amma", phone: "98450 00000" }],
  bookings: sampleBookings,
  wishlist: sampleWishlist,
  signals: sampleSignals("open"),
  sent: {},
  votes: {},
  blocked: [],
  shared: [],
  decisions: {},
  listings: [sampleListing],
  asks: sampleAsks,
  unfriended: [],
  muted: [],
};

// Bumped when the saved shape changed (v6: plans are Group or Singles trips, no more "solo"), so older saved state is ignored.
// Each signed-in account has its own copy, so two people on one device never see each other's data.
const KEY = "cojaunt:v6";
const OWNER_KEY = "cojaunt:owner:v1";
const listeners = new Set<() => void>();
let state: State = demo;
let loaded = false;
/** Whose data is loaded. Null means nobody is signed in: the sample member shows and nothing is saved. */
let owner: string | null = null;

const keyFor = (id: string) => `${KEY}:${id}`;

function read(id: string | null): State {
  if (!id) return demo;
  try {
    const saved: unknown = JSON.parse(window.localStorage.getItem(keyFor(id)) ?? "null");
    if (saved && typeof saved === "object") return { ...demo, ...(saved as Partial<State>) };
  } catch {
    // Unreadable or blocked storage: carry on with the demo state.
  }
  return demo;
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    owner = window.localStorage.getItem(OWNER_KEY);
  } catch {
    owner = null;
  }
  state = read(owner);
}

/** Switches to a member's saved data (or to nobody, on sign-out) and tells every screen. */
export function setOwner(id: string | null) {
  loaded = true;
  owner = id;
  try {
    if (id) window.localStorage.setItem(OWNER_KEY, id);
    else window.localStorage.removeItem(OWNER_KEY);
  } catch {
    // Storage blocked: the switch still applies for this visit.
  }
  state = read(id);
  listeners.forEach((listener) => listener());
}

export function getOwner(): string | null {
  load();
  return owner;
}

/** Deletes one member's saved data from this device. */
export function eraseOwnerData(id: string) {
  try {
    window.localStorage.removeItem(keyFor(id));
  } catch {
    // Nothing to do.
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function snapshot(): State {
  load();
  return state;
}

export function useApp(): State {
  return useSyncExternalStore(subscribe, snapshot, () => demo);
}

const noop = () => () => {};

/**
 * False during the server render and hydration, true after. Screens that look up saved items
 * by id use it so they don't flash "not found" before localStorage is read.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

/** The current state, for actions that must validate before they change anything. */
export function getState(): State {
  load();
  return state;
}

/** Applies a change and saves it. Returns false when the browser refused to save (usually storage full). */
export function update(change: (current: State) => State): boolean {
  load();
  state = change(state);
  let saved = true;
  try {
    // Nobody signed in: nothing is saved, so the sample member can never overwrite a real account.
    if (owner) window.localStorage.setItem(keyFor(owner), JSON.stringify(state));
  } catch {
    // Storage full or blocked: the change still applies for this session.
    saved = false;
  }
  listeners.forEach((listener) => listener());
  return saved;
}
