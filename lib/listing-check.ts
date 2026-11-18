import { dayIndex, localMs, minutes, parse } from "./listing-dates";
import { pledges, steps, type Listing, type StepId } from "./listing-options";
import { scanMessage } from "./safety";

export type Issues = Partial<Record<string, string>>;
type Say = (field: string, message: string) => void;

const CONTACT = "Remove contact details, payment IDs and links. Guests reach you in the app.";

function basics(listing: Listing, say: Say) {
  const title = listing.title.trim();
  const tagline = listing.tagline.trim();
  if (title.length < 8) say("title", "Use at least 8 characters, so guests know what it is at a glance.");
  if (tagline.length < 20) say("tagline", "Write at least 20 characters on what makes this plan worth joining.");
  if (listing.tags.length === 0) say("tags", "Pick at least one theme. Themes decide who sees the plan.");
  if (scanMessage(title)) say("title", CONTACT);
  if (scanMessage(tagline)) say("tagline", CONTACT);
}

function when(listing: Listing, say: Say, now?: number) {
  if (listing.place.trim().length < 3) say("place", "Add the area or destination, such as “Coorg” or “Indiranagar”.");
  if (listing.meet.trim().length < 5) say("meet", "Add the exact meeting point. Only approved guests see it.");
  if (scanMessage(listing.meet)) say("meet", "Describe a place, not a phone number or link.");
  const s = parse(listing.start);
  const e = parse(listing.end);
  if (!s) say("start", "Choose a start date and time.");
  if (!e) say("end", "Choose an end date and time.");
  if (s && e) {
    const span = minutes(e) - minutes(s);
    const nights = dayIndex(e) - dayIndex(s);
    if (span <= 0) say("end", "The end must be after the start.");
    else if (listing.kind === "local" && nights !== 0) say("end", "A day plan ends the day it starts. For overnight plans, choose Overnight trip.");
    else if (listing.kind === "local" && span < 60) say("end", "Day plans run for at least an hour.");
    else if (listing.kind === "trip" && nights < 1) say("end", "An overnight trip includes at least one night. For same-day plans, choose Day plan.");
    else if (listing.kind === "trip" && nights > 7) say("end", "Trips can be up to 7 nights.");
  }
  // Listings need time for review, and guests need time to find and book them.
  const lead = listing.kind === "trip" ? 7 : 2;
  if (s && now !== undefined && localMs(s) - now < lead * 86_400_000) {
    say("start", `Start at least ${lead} days from today. That leaves time for review and for guests to book.`);
  }
}

function itinerary(listing: Listing, say: Say) {
  listing.days.forEach((day, d) => {
    if (!day.stops.some((stop) => stop.title.trim())) say(`day-${day.id}`, `Add at least one stop to ${day.label.trim() || `day ${d + 1}`}.`);
    day.stops.forEach((stop) => {
      if (stop.title.trim() && !stop.time) say(`stop-${stop.id}`, "Add a rough time.");
      if (scanMessage(`${stop.title} ${stop.note}`)) say(`stop-${stop.id}`, CONTACT);
    });
  });
  const total = listing.days.reduce((sum, day) => sum + day.stops.filter((stop) => stop.title.trim()).length, 0);
  if (total < 2) say("itinerary", "Add at least two stops so guests can picture the plan.");
}

function pricing(listing: Listing, say: Say) {
  const price = Number(listing.price);
  if (listing.price === "" || !Number.isInteger(price)) say("price", "Enter the price per seat in whole rupees. Use 0 for a free plan.");
  else if (listing.kind === "trip" && price < 1000) say("price", "Trips start at ₹1,000 per seat, so the stay and transport are covered.");
  else if (price > 50000) say("price", "The most a seat can cost is ₹50,000.");
  if (listing.inclusions.length === 0 && price > 0) say("inclusions", "Tell guests what their money pays for.");
}

/**
 * Field-level problems for one step. Pass `now` (ms) from an event handler to also apply the
 * "far enough ahead" rule. Without it that rule is skipped, so rendering stays pure.
 */
export function check(listing: Listing, step: StepId, now?: number): Issues {
  const issues: Issues = {};
  const say: Say = (field, message) => {
    if (!issues[field]) issues[field] = message;
  };

  if (step === "basics") basics(listing, say);
  if (step === "when") when(listing, say, now);
  if (step === "itinerary") itinerary(listing, say);
  if (step === "pricing") pricing(listing, say);
  if (step === "group") {
    if (listing.audience !== "group" && listing.audience !== "dating") say("audience", "Choose Group trip or Singles trip.");
    if (listing.seats < 4 || listing.seats > 10) say("seats", "Groups are 4 to 10 people.");
    if (listing.ageMax - listing.ageMin < 5) say("age", "Leave an age range of at least 5 years, so the plan can fill.");
    if (listing.audience === "dating") {
      if (listing.ageMax - listing.ageMin > 12) say("age", "Singles trips keep everyone within 12 years. Narrow the age range.");
      if (listing.womenOnly || listing.menOnly) say("audience", "Singles trips are always mixed. Choose Group trip for a women-only or men-only plan.");
    }
  }
  if (step === "safety") {
    if (!listing.transport) say("transport", "Choose how the group travels.");
    if (listing.kind === "trip" && !listing.stay) say("stay", "Choose where the group stays.");
    if (pledges[listing.kind].some((pledge) => !listing.pledges.includes(pledge))) say("pledges", "Confirm every commitment to continue.");
  }
  return issues;
}

const editable = steps.filter((step) => step.id !== "review");

/** Index of the first step with problems, or -1 when the listing is ready to send. */
export function firstGap(listing: Listing, now?: number): number {
  return steps.findIndex((step) => step.id !== "review" && Object.keys(check(listing, step.id, now)).length > 0);
}

export function isDone(listing: Listing, step: StepId): boolean {
  return Object.keys(check(listing, step)).length === 0;
}

/** Complete editable steps, for the progress bar. */
export function completeCount(listing: Listing): { done: number; total: number } {
  return { done: editable.filter((step) => isDone(listing, step.id)).length, total: editable.length };
}
