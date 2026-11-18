"use client";

import { useLocation } from "@/lib/location";
import { nearby, type Near, type Point } from "@/lib/places";

/**
 * Sorts a list by distance from the member, unless they're searching.
 * A search covers all of India, so `searching` turns location sorting off and the list comes back as given.
 */
export function useNearby<T>(items: T[], pointOf: (item: T) => Point | undefined, searching = false): { list: Near<T>[]; applied: boolean; key: string } {
  const { here, radius } = useLocation();
  if (searching) return { list: items.map((item) => ({ item })), applied: false, key: "search" };
  const result = nearby(items, pointOf, here, radius);
  const key = here.status === "on" ? `${here.place.point.lat},${here.place.point.lng},${radius}` : here.status;
  return { ...result, key };
}
