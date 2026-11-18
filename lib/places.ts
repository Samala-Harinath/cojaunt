import { personHomes, planSpots, type Point } from "./areas";
import { cities, inIndiaBox, type City } from "./india";
import type { Plan } from "./plan-types";

export type { Point } from "./areas";

/**
 * Distances and place names, worked out on the device. The only network call is the optional
 * place-name lookup in app/api/place, which receives coordinates already rounded to about 1 km.
 */

/** A place the member is "at": from GPS (named by the lookup or the nearest known city) or picked by hand. */
export type Place = { point: Point; locality: string; city: string; state: string; source: "gps" | "picked"; inIndia: boolean };

/** Where the member is, as far as the app knows. */
export type Here =
  | { status: "idle" }
  | { status: "locating" }
  | { status: "off"; reason: "denied" | "unsupported" | "failed" | "chosen" }
  | { status: "on"; place: Place };

/** How far to look, in km. null means anywhere in India. */
export type Radius = 10 | 25 | 50 | 200 | null;
export const radii: Radius[] = [10, 25, 50, 200, null];
export const DEFAULT_RADIUS: Radius = 50;

export function radiusLabel(radius: Radius): string {
  return radius === null ? "Anywhere in India" : `Within ${radius} km`;
}

/** "Bhiwandi, Maharashtra", or "Kaneri, Bhiwandi" when a neighbourhood is known. */
export function placeLabel(place: Place): string {
  if (place.locality && place.locality !== place.city) return `${place.locality}, ${place.city}`;
  return place.state && place.state !== place.city ? `${place.city}, ${place.state}` : place.city;
}

/** A fixed shift of about 1 km per person, so nobody's position can be pinned down by moving around. */
function fuzz(id: string, point: Point): Point {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  const angle = ((hash >>> 0) % 360) * (Math.PI / 180);
  return {
    lat: point.lat + Math.sin(angle) / 111,
    lng: point.lng + Math.cos(angle) / (111 * Math.cos((point.lat * Math.PI) / 180)),
  };
}

export function planPoint(plan: Plan): Point | undefined {
  return planSpots[plan.id]?.at;
}

/** The city a plan starts from, shown on its card ("Starts in Thane"). */
export function planCity(plan: Plan): string | undefined {
  return planSpots[plan.id]?.city;
}

export function personPoint(personId: string): Point | undefined {
  const home = personHomes[personId];
  return home ? fuzz(personId, home.at) : undefined;
}

/** The city a member is in. City only: never a neighbourhood or anything finer. */
export function personCity(personId: string): string | undefined {
  return personHomes[personId]?.city;
}

/** Great-circle distance in km (haversine). */
export function distanceKm(a: Point, b: Point): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export function nearestCity(point: Point): City {
  return cities.reduce((best, city) => (distanceKm(point, city.at) < distanceKm(point, best.at) ? city : best));
}

/** Rounds to 2 decimal places, about 1 km. Precise coordinates are never kept or sent. */
export function coarse(point: Point): Point {
  return { lat: Math.round(point.lat * 100) / 100, lng: Math.round(point.lng * 100) / 100 };
}

/** A place named from the nearest known city: used when the lookup is unavailable, and for picked cities. */
export function placeFromCity(city: City, source: Place["source"], point: Point = city.at): Place {
  return { point: coarse(point), locality: "", city: city.name, state: city.state, source, inIndia: inIndiaBox(point) };
}

/** Distances to people are shown in bands, never exact numbers, so a member's position can't be worked out. */
export function distanceLabel(km: number): string {
  if (km < 5) return "Under 5 km away";
  if (km < 15) return "5–15 km away";
  if (km < 50) return "15–50 km away";
  if (km < 200) return "50–200 km away";
  return "200+ km away";
}

/** Distances to plans are public meeting areas, so a rounded number is fine. */
export function planDistanceLabel(km: number): string {
  if (km < 1) return "Under 1 km";
  if (km < 100) return `${Math.round(km)} km`;
  return `${Math.round(km / 10) * 10} km`;
}

export type Near<T> = { item: T; km?: number };

/**
 * Sorts by distance and keeps what's within the radius, but only when the member's location is on
 * and inside India. Otherwise the list comes back unchanged and `applied` is false.
 */
export function nearby<T>(items: T[], pointOf: (item: T) => Point | undefined, here: Here, radius: Radius): { list: Near<T>[]; applied: boolean } {
  if (here.status !== "on" || !here.place.inIndia) return { list: items.map((item) => ({ item })), applied: false };
  const from = here.place.point;
  const measured = items.map((item) => {
    const point = pointOf(item);
    return { item, km: point ? distanceKm(from, point) : undefined };
  });
  const kept = radius === null ? measured : measured.filter((entry) => entry.km !== undefined && entry.km <= radius);
  return { list: kept.toSorted((a, b) => (a.km ?? Infinity) - (b.km ?? Infinity)), applied: true };
}
