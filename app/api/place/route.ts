import type { NextRequest } from "next/server";

/**
 * GET /api/place?lat=19.30&lng=73.06 → { locality, city, state }
 *
 * Turns rounded coordinates into a place name ("Kaneri, Bhiwandi, Maharashtra") using OpenStreetMap
 * Nominatim. It runs on the server, so the member's browser never talks to a third party, and it
 * follows the Nominatim usage policy (https://operations.osmfoundation.org/policies/nominatim/):
 * an identifying User-Agent, at most one request per second, caching, and a switchable endpoint.
 *
 * Privacy: only coordinates rounded to about 1 km are accepted, nothing is logged, and no cookie or
 * account information is forwarded. For real traffic, point PLACE_LOOKUP_URL at a self-hosted
 * Nominatim or a paid provider with the same response shape.
 */
const ENDPOINT = process.env.PLACE_LOOKUP_URL ?? "https://nominatim.openstreetmap.org/reverse";
const USER_AGENT = process.env.PLACE_LOOKUP_USER_AGENT ?? "Cojaunt/0.1 (prototype; contact: hello@cojaunt.example)";
const MIN_GAP_MS = 1100;
const CACHE_MAX = 500;

type Found = { locality: string; city: string; state: string };

const cache = new Map<string, Found | null>();
let lastCall = 0;

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": status === 200 ? "private, max-age=86400" : "no-store" } });
}

/** Accepts only numbers with at most two decimals inside India's bounding box. */
function parse(value: string | null, min: number, max: number): number | null {
  if (!value || !/^-?\d{1,3}(\.\d{1,2})?$/.test(value)) return null;
  const number = Number(value);
  return number >= min && number <= max ? number : null;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.replace(/[<>]/g, "").trim().slice(0, 80) : "";
}

/** Picks a readable name out of an OSM address. Towns, cities and villages all count as the "city". */
function pick(address: Record<string, unknown>): Found | null {
  if (text(address.country_code).toLowerCase() !== "in") return null;
  const city = text(address.city) || text(address.town) || text(address.municipality) || text(address.village) || text(address.state_district) || text(address.county);
  const locality = text(address.suburb) || text(address.neighbourhood) || text(address.city_district) || text(address.quarter);
  const state = text(address.state);
  if (!city || !state) return null;
  return { locality: locality === city ? "" : locality, city, state };
}

export async function GET(request: NextRequest) {
  const lat = parse(request.nextUrl.searchParams.get("lat"), 6, 37.6);
  const lng = parse(request.nextUrl.searchParams.get("lng"), 68, 97.5);
  if (lat === null || lng === null) return json({ error: "Send lat and lng rounded to two decimals, inside India." }, 400);

  const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  if (cache.has(key)) {
    const hit = cache.get(key);
    return hit ? json(hit) : json({ error: "No Indian place found here." }, 404);
  }

  // Shared limit across every visitor, as the policy requires. A busy moment falls back to the offline city list.
  const now = Date.now();
  if (now - lastCall < MIN_GAP_MS) return json({ error: "Busy. Try again in a moment." }, 429);
  lastCall = now;

  const url = new URL(ENDPOINT);
  url.search = new URLSearchParams({ format: "jsonv2", lat: String(lat), lon: String(lng), zoom: "14", addressdetails: "1", "accept-language": "en" }).toString();

  try {
    const response = await fetch(url, { headers: { "User-Agent": USER_AGENT, Accept: "application/json" }, signal: AbortSignal.timeout(6000), cache: "no-store" });
    if (!response.ok) return json({ error: "Place lookup is unavailable." }, 502);
    const data: unknown = await response.json();
    const address = typeof data === "object" && data !== null && "address" in data ? (data as { address: unknown }).address : null;
    const found = typeof address === "object" && address !== null ? pick(address as Record<string, unknown>) : null;

    if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value as string);
    cache.set(key, found);
    return found ? json(found) : json({ error: "No Indian place found here." }, 404);
  } catch {
    return json({ error: "Place lookup timed out." }, 504);
  }
}
