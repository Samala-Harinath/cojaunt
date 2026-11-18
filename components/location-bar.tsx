"use client";

import { useEffect, useState } from "react";
import { citiesByState } from "@/lib/india";
import { autoLocate, locate, locationOff, pickCity, setRadius, useLocation } from "@/lib/location";
import { placeLabel, radii, radiusLabel } from "@/lib/places";
import { Icon } from "./icon";
import { Sheet } from "./ui";

/** Use GPS, pick a city, change the distance, or switch location off. */
function LocationSheet({ onClose }: { onClose: () => void }) {
  const { here, radius } = useLocation();
  const picked = here.status === "on" && here.place.source === "picked" ? here.place.city : "";

  return (
    <Sheet open onClose={onClose} title="Your location">
      <div className="space-y-5">
        {here.status === "on" && !here.place.inIndia ? (
          <div className="rounded-2xl bg-marigold-soft p-3 text-sm text-amber-ink">
            <p className="flex items-center gap-2 font-bold">
              <Icon name="alert" className="size-4" />
              Your device reported a location outside India
            </p>
            <p className="mt-1 text-xs leading-relaxed">
              It said {here.place.point.lat.toFixed(2)}, {here.place.point.lng.toFixed(2)}. This usually happens when a <strong>VPN</strong> is on, or when a
              computer guesses its location from the internet connection instead of GPS. Turn the VPN off and tap “Use my current location”, or simply choose your
              city below.
            </p>
          </div>
        ) : here.status === "on" ? (
          <p className="flex items-center gap-2 rounded-2xl bg-forest-soft p-3 text-sm text-forest-deep">
            <Icon name="pin" className="size-4" />
            <span>
              <strong>{placeLabel(here.place)}</strong>
              {here.place.locality ? `, ${here.place.state}` : ""}
              <span className="block text-xs">{here.place.source === "gps" ? "From your device’s location" : "Chosen by you"}</span>
            </span>
          </p>
        ) : null}

        <button
          type="button"
          className="btn btn-primary w-full"
          onClick={() => {
            locate();
            onClose();
          }}
        >
          <Icon name="pin" />
          Use my current location
        </button>

        <div>
          <label htmlFor="city-pick" className="text-sm font-semibold">
            Or choose a city
          </label>
          <select
            id="city-pick"
            value={picked}
            onChange={(event) => {
              if (event.target.value) {
                pickCity(event.target.value);
                onClose();
              }
            }}
            className="field mt-2"
          >
            <option value="">Select a city</option>
            {citiesByState.map((group) => (
              <optgroup key={group.state} label={group.state}>
                {group.cities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className="text-sm font-semibold">How far</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {radii.map((option) => (
              <button key={String(option)} type="button" className="chip" aria-pressed={radius === option} onClick={() => setRadius(option)}>
                {radiusLabel(option)}
              </button>
            ))}
          </div>
        </fieldset>

        <p className="flex gap-2 text-xs leading-relaxed text-muted">
          <Icon name="lock" className="mt-px size-4 shrink-0" />
          Your location is rounded to about 1 km and forgotten when you close the tab. Other members never see it. They only see your city, and a rough distance.
        </p>
        <p className="text-[0.6875rem] text-muted">Place names © OpenStreetMap contributors.</p>

        {here.status === "on" ? (
          <button
            type="button"
            className="btn btn-line w-full"
            onClick={() => {
              locationOff();
              onClose();
            }}
          >
            Don’t use my location
          </button>
        ) : null}
      </div>
    </Sheet>
  );
}

/** Asks for location once per session. Mounted on Discover only, so other pages never trigger the prompt. */
export function AutoLocate() {
  useEffect(() => {
    autoLocate();
  }, []);
  return null;
}

/**
 * The location button in the header, on every page and screen size: "📍 Thane · 10 km".
 * Phones show the city only; wider screens add the distance. Tapping it opens the location sheet.
 */
export function HeaderLocation() {
  const { here, radius } = useLocation();
  const [open, setOpen] = useState(false);

  let icon: "pin" | "clock" | "alert" = "pin";
  let short: string;
  let extra = "";
  let full: string;
  let active = false;
  if (here.status === "locating") {
    icon = "clock";
    short = "Locating…";
    full = "Finding where you are";
  } else if (here.status === "on" && !here.place.inIndia) {
    icon = "alert";
    short = "Choose your city";
    full = "Your device reported a location outside India. Choose your city";
  } else if (here.status === "on") {
    active = true;
    short = here.place.city;
    extra = radius === null ? "All India" : `${radius} km`;
    full = `${placeLabel(here.place)}, ${here.place.state} · ${radiusLabel(radius).toLowerCase()}`;
  } else {
    short = "Set location";
    full = here.status === "off" && here.reason === "denied" ? "Location is blocked. Choose your city." : "Choose your location";
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={`${full}. Tap to change.`}
        aria-label={`Location: ${full}. Change location`}
        className="inline-flex h-9 min-w-0 max-w-[9.5rem] items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-xs font-semibold shadow-sm transition-colors hover:border-forest sm:max-w-xs sm:text-sm"
      >
        <Icon name={icon} className={`size-4 shrink-0 ${active ? "text-forest" : "text-muted"}`} />
        <span className="truncate">{short}</span>
        {extra ? <span className="hidden shrink-0 text-muted sm:inline">· {extra}</span> : null}
        <Icon name="down" className="size-3.5 shrink-0 text-muted" />
      </button>
      {open ? <LocationSheet onClose={() => setOpen(false)} /> : null}
    </>
  );
}
