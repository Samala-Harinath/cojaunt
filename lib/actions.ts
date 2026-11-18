import { askProblem, NOTE_MAX, relationTo } from "./asks";
import { maxSeats } from "./audience";
import { getPlan } from "./plans";
import { isSafePhoto, MAX_PHOTOS } from "./photos";
import type { PrivateDetails } from "./people";
import type { Signal } from "./social";
import type { Listing } from "./listing-options";
import { sampleAsks, sampleBookings, sampleSignals, sampleWishlist } from "./sample";
import { demo, getState, update, type AskKind, type AskStatus, type BookingStatus, type Contact, type Me, type Privacy, type State } from "./store";

function withBooking(state: State, planId: string, status: BookingStatus | null, note?: string, seats?: number): State {
  const previous = state.bookings.find((booking) => booking.planId === planId);
  const rest = state.bookings.filter((booking) => booking.planId !== planId);
  if (!status) return { ...state, bookings: rest };
  return { ...state, bookings: [...rest, { planId, status, note: note ?? previous?.note ?? "", seats: seats ?? previous?.seats ?? 1 }] };
}

const toggled = (list: string[], id: string) => (list.includes(id) ? list.filter((item) => item !== id) : [...list, id]);

export function toggleWish(planId: string) {
  update((state) => ({ ...state, wishlist: toggled(state.wishlist, planId) }));
}

/**
 * A full plan puts the member on the waitlist instead of sending a request.
 * Group plans can cover several seats in one request (see maxSeats); everything else is one seat.
 */
export function requestSeat(planId: string, note: string, seats = 1) {
  const plan = getPlan(planId);
  const full = (plan?.seatsLeft ?? 0) === 0;
  const count = plan ? Math.min(Math.max(1, Math.round(seats)), maxSeats(plan)) : 1;
  update((state) => withBooking(state, planId, full ? "waitlist" : "requested", note, count));
}

/** PROTOTYPE ONLY: stands in for the host approving the request. */
export function approveSeat(planId: string) {
  update((state) => withBooking(state, planId, "approved"));
}

export function paySeat(planId: string) {
  update((state) => withBooking(state, planId, "confirmed"));
}

export function cancelSeat(planId: string) {
  update((state) => withBooking(state, planId, null));
}

export function patchMe(patch: Partial<Me>) {
  update((state) => ({ ...state, me: { ...state.me, ...patch } }));
}

export function patchPrivacy(patch: Partial<Privacy>) {
  update((state) => ({ ...state, privacy: { ...state.privacy, ...patch } }));
}

export function addContact(contact: Contact) {
  update((state) => ({ ...state, contacts: [...state.contacts, contact] }));
}

export function removeContact(index: number) {
  update((state) => ({ ...state, contacts: state.contacts.filter((_, i) => i !== index) }));
}

export function saveSignals(planId: string, choices: Record<string, Signal>) {
  update((state) => ({ ...state, signals: { ...state.signals, [planId]: choices } }));
}

export function sendMessage(threadId: string, text: string) {
  update((state) => {
    const mine = state.sent[threadId] ?? [];
    const message = { id: `me-${threadId}-${mine.length}`, from: "me", text, at: "Now" };
    return { ...state, sent: { ...state.sent, [threadId]: [...mine, message] } };
  });
}

export function castVote(threadId: string, option: number) {
  update((state) => ({ ...state, votes: { ...state.votes, [threadId]: option } }));
}

/** Blocking applies everywhere: profiles, requests, chats, connections and future plan groups. Pending requests close. */
export function blockPerson(personId: string) {
  update((state) =>
    state.blocked.includes(personId)
      ? state
      : {
          ...state,
          blocked: [...state.blocked, personId],
          asks: state.asks.map((ask) => (ask.personId === personId && ask.status === "pending" ? { ...ask, status: "declined" } : ask)),
        },
  );
}

/**
 * Sends a Spark or a travel request. Every rule is checked again here, not only in the form,
 * and the result says what went wrong. Returns null on success.
 */
export function sendAsk(personId: string, kind: AskKind, note: string): string | null {
  const problem = askProblem(getState(), personId, kind, note);
  if (problem) return problem;
  const id = `ask-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const saved = update((state) => ({
    ...state,
    asks: [...state.asks, { id, personId, kind, from: "me", note: note.trim().slice(0, NOTE_MAX), status: "pending", at: Date.now() }],
  }));
  return saved ? null : "Sent, but this browser couldn’t save it. It may be gone after a refresh.";
}

/**
 * Changes one request's status, only from the side allowed to make that change.
 * Accepting a new request after an earlier unfriend reconnects the two people.
 */
function settleAsk(id: string, from: "me" | "them", status: AskStatus) {
  update((state) => {
    const ask = state.asks.find((item) => item.id === id && item.from === from && item.status === "pending");
    if (!ask) return state;
    return {
      ...state,
      asks: state.asks.map((item) => (item === ask ? { ...item, status } : item)),
      unfriended: status === "accepted" ? state.unfriended.filter((personId) => personId !== ask.personId) : state.unfriended,
    };
  });
}

/**
 * Ends a connection. The 1:1 chat closes, private details lock again on both sides, and they leave
 * Connected. They aren't told; they simply can't message you any more. Either of you can send a new request later.
 */
export function unfriend(personId: string) {
  update((state) => ({
    ...state,
    unfriended: state.unfriended.includes(personId) ? state.unfriended : [...state.unfriended, personId],
    asks: state.asks.map((ask) => (ask.personId === personId && ask.status === "accepted" ? { ...ask, status: "ended" } : ask)),
  }));
}

/** Mute (unfollow): hide someone from Discover and stop their requests notifying you, without blocking. They aren't told. */
export function mutePerson(personId: string) {
  update((state) => (state.muted.includes(personId) ? state : { ...state, muted: [...state.muted, personId] }));
}

export function unmutePerson(personId: string) {
  update((state) => ({ ...state, muted: state.muted.filter((id) => id !== personId) }));
}

/** Accept a request someone sent you. Opens a 1:1 chat and unlocks private details on both sides. */
export function acceptAsk(id: string) {
  const ask = getState().asks.find((item) => item.id === id);
  // Re-check: an unverified member can't connect, a Spark can't be accepted once dating is off,
  // and nothing from a blocked member can be (relationTo applies the same visibility rules as the inbox).
  if (!ask || !getState().me.selfieVerified || relationTo(getState(), ask.personId).kind !== "incoming") return;
  settleAsk(id, "them", "accepted");
}

/** Decline quietly. The sender sees “Not this time” and can't send another request. */
export function declineAsk(id: string) {
  settleAsk(id, "them", "declined");
}

/** Take back a request that hasn't been answered. It disappears for both people. */
export function withdrawAsk(id: string) {
  update((state) => ({ ...state, asks: state.asks.filter((ask) => !(ask.id === id && ask.from === "me" && ask.status === "pending")) }));
}

/** PROTOTYPE ONLY: stands in for the other member answering a request the member sent. */
export function simulateReply(id: string, status: "accepted" | "declined") {
  settleAsk(id, "me", status);
}

/** Adds a photo made by preparePhoto. Returns an error message, or null when it was saved. */
export function addPhoto(src: string): string | null {
  if (!isSafePhoto(src)) return "That photo couldn’t be used.";
  if (getState().me.photos.length >= MAX_PHOTOS) return `You can add up to ${MAX_PHOTOS} photos.`;
  const saved = update((state) => ({ ...state, me: { ...state.me, photos: [...state.me.photos, src] } }));
  if (saved) return null;
  // Roll back, so the profile never shows a photo that won't survive a refresh.
  update((state) => ({ ...state, me: { ...state.me, photos: state.me.photos.filter((photo) => photo !== src) } }));
  return "This browser is out of space for photos. Remove one and try again.";
}

/** A profile always keeps at least one photo once it has one. */
export function removePhoto(index: number) {
  update((state) => (state.me.photos.length <= 1 ? state : { ...state, me: { ...state.me, photos: state.me.photos.filter((_, i) => i !== index) } }));
}

/** Moves a photo to the front, where it becomes the main photo. */
export function makeMainPhoto(index: number) {
  update((state) => {
    const photo = state.me.photos[index];
    if (!photo || index === 0) return state;
    return { ...state, me: { ...state.me, photos: [photo, ...state.me.photos.filter((_, i) => i !== index)] } };
  });
}

export function patchDetails(patch: Partial<PrivateDetails>) {
  update((state) => ({ ...state, me: { ...state.me, details: { ...state.me.details, ...patch } } }));
}

export function unblockPerson(personId: string) {
  update((state) => ({ ...state, blocked: state.blocked.filter((id) => id !== personId) }));
}

export function toggleShare(planId: string) {
  update((state) => ({ ...state, shared: toggled(state.shared, planId) }));
}

export function decide(requestId: string, decision: "approved" | "declined") {
  update((state) => ({ ...state, decisions: { ...state.decisions, [requestId]: decision } }));
}

export function addListing(listing: Listing) {
  update((state) => ({ ...state, listings: [...state.listings, listing] }));
}

/** Autosave: every edit in the Host Studio lands here. */
export function patchListing(id: string, patch: Partial<Listing>) {
  update((state) => ({ ...state, listings: state.listings.map((item) => (item.id === id ? { ...item, ...patch } : item)) }));
}

export function removeListing(id: string) {
  update((state) => ({ ...state, listings: state.listings.filter((item) => item.id !== id) }));
}

/** Sends a listing to the ops team. PROTOTYPE: nothing is sent and nobody reviews it. */
export function submitListing(id: string) {
  patchListing(id, { status: "review" });
}

/** Pulls a listing back out of review so it can be edited again. */
export function withdrawListing(id: string) {
  patchListing(id, { status: "editing" });
}

export function resetDemo() {
  update(() => demo);
}

/**
 * Replaces the demo member with the account created in onboarding.
 * SAMPLE DATA: the new profile gets the same sample history as the demo, so every screen has content.
 */
export function startFresh(me: Me, privacy: Privacy) {
  update(() => ({
    isDemo: false,
    me,
    privacy,
    contacts: [],
    bookings: sampleBookings,
    wishlist: sampleWishlist,
    signals: sampleSignals(me.intent),
    sent: {},
    votes: {},
    blocked: [],
    shared: [],
    decisions: {},
    listings: [],
    asks: sampleAsks,
    unfriended: [],
    muted: [],
  }));
}
