"use client";

import { useSyncExternalStore } from "react";
import { findCity, inIndiaBox } from "./india";
import { coarse, DEFAULT_RADIUS, nearestCity, placeFromCity, radii, type Here, type Place, type Point, type Radius } from "./places";

/**
 * The member's location, for sorting people and trips by distance.
 * Privacy: low accuracy, rounded to ~1 km before use, kept in sessionStorage only (gone when the tab
 * closes), never saved to the profile, never shown to other members. Names come from /api/place.
 */
type LocationState = { here: Here; radius: Radius; asked: boolean };

const KEY = "cojaunt:here:v2";
const initial: LocationState = { here: { status: "idle" }, radius: DEFAULT_RADIUS, asked: false };
const listeners = new Set<() => void>();
let state: LocationState = initial;
let loaded = false;
/** Each locate() gets a number, so a slow lookup can't overwrite a newer choice. */
let attempt = 0;

const short = (value: unknown) => (typeof value === "string" ? value.slice(0, 80) : "");

function isPoint(value: unknown): value is Point {
  if (typeof value !== "object" || value === null) return false;
  const { lat, lng } = value as Point;
  return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
}

/** Only a known shape is restored, so anything odd in storage falls back to "not asked yet". */
function restore(raw: unknown): LocationState {
  if (typeof raw !== "object" || raw === null) return initial;
  const saved = raw as Record<string, unknown>;
  const radius = radii.includes(saved.radius as Radius) ? (saved.radius as Radius) : DEFAULT_RADIUS;
  const asked = saved.asked === true;
  const place = saved.place as Record<string, unknown> | undefined;
  if (place && isPoint(place.point) && short(place.city)) {
    const point = coarse(place.point);
    const source = place.source === "picked" ? "picked" : "gps";
    return { radius, asked, here: { status: "on", place: { point, locality: short(place.locality), city: short(place.city), state: short(place.state), source, inIndia: inIndiaBox(point) } } };
  }
  if (saved.off === "chosen" || saved.off === "denied") return { here: { status: "off", reason: saved.off }, radius, asked };
  return { ...initial, radius, asked };
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    state = restore(JSON.parse(window.sessionStorage.getItem(KEY) ?? "null"));
  } catch {
    // Unreadable or blocked storage: start without a location.
  }
}

function set(change: (current: LocationState) => LocationState) {
  load();
  state = change(state);
  const { here, radius, asked } = state;
  try {
    const saved = { radius, asked, place: here.status === "on" ? here.place : undefined, off: here.status === "off" ? here.reason : undefined };
    window.sessionStorage.setItem(KEY, JSON.stringify(saved));
  } catch {
    // Storage blocked: the location still works for this page view.
  }
  listeners.forEach((listener) => listener());
}

/** Names a GPS point. Tries /api/place, and falls back to the nearest known city if that fails. */
async function name(point: Point): Promise<Place> {
  const fallback = placeFromCity(nearestCity(point), "gps", point);
  if (!inIndiaBox(point)) return { ...fallback, inIndia: false };
  try {
    const response = await fetch(`/api/place?lat=${point.lat.toFixed(2)}&lng=${point.lng.toFixed(2)}`, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return fallback;
    const found = (await response.json()) as Record<string, unknown>;
    const city = short(found.city);
    if (!city) return fallback;
    return { point, locality: short(found.locality), city, state: short(found.state) || fallback.state, source: "gps", inIndia: true };
  } catch {
    return fallback;
  }
}

/** Asks the browser for the member's position, then names it ("Bhiwandi, Maharashtra"). */
export function locate() {
  load();
  const mine = ++attempt;
  if (typeof navigator === "undefined" || !("geolocation" in navigator) || !window.isSecureContext) {
    set((current) => ({ ...current, asked: true, here: { status: "off", reason: "unsupported" } }));
    return;
  }
  set((current) => ({ ...current, asked: true, here: { status: "locating" } }));
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const place = await name(coarse({ lat: position.coords.latitude, lng: position.coords.longitude }));
      if (mine === attempt) set((current) => ({ ...current, here: { status: "on", place } }));
    },
    (error) => {
      const reason = error.code === error.PERMISSION_DENIED ? "denied" : "failed";
      if (mine === attempt) set((current) => ({ ...current, here: { status: "off", reason } }));
    },
    { enableHighAccuracy: false, timeout: 15_000, maximumAge: 10 * 60_000 },
  );
}

/** Called when Discover opens. Asks once per session; after a "no" it waits for the member to ask. */
export function autoLocate() {
  load();
  if (!state.asked && state.here.status === "idle") locate();
}

/** Uses a city picked from the list instead of GPS. */
export function pickCity(cityName: string) {
  const city = findCity(cityName);
  if (!city) return;
  attempt++;
  set((current) => ({ ...current, asked: true, here: { status: "on", place: placeFromCity(city, "picked") } }));
}

export function locationOff() {
  attempt++;
  set((current) => ({ ...current, asked: true, here: { status: "off", reason: "chosen" } }));
}

export function setRadius(radius: Radius) {
  set((current) => ({ ...current, radius }));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function snapshot(): LocationState {
  load();
  return state;
}

/** The server always renders "no location yet", so the first client render matches it. */
export function useLocation(): LocationState {
  return useSyncExternalStore(subscribe, snapshot, () => initial);
}
