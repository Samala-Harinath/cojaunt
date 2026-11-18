"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { brand } from "@/lib/brand";
import { inclusionPresets, payout } from "@/lib/listing";
import { priceRange } from "@/lib/listing-tips";
import { rupee } from "@/lib/plans";
import { describe, Field, Group, type StepProps } from "./fields";

const MAX_INCLUDED = 8;

export function StepPricing({ listing, set, issues }: StepProps) {
  const [custom, setCustom] = useState("");
  const price = Number(listing.price) || 0;
  const range = priceRange(listing.kind);
  const money = payout(price, listing.seats, brand.hostCommission);
  const presets = inclusionPresets[listing.kind];
  const extras = listing.inclusions.filter((item) => !presets.includes(item));

  const toggle = (item: string) =>
    set({ inclusions: listing.inclusions.includes(item) ? listing.inclusions.filter((x) => x !== item) : [...listing.inclusions, item] });

  function addCustom() {
    const item = custom.trim();
    if (!item || listing.inclusions.includes(item) || listing.inclusions.length >= MAX_INCLUDED) return;
    set({ inclusions: [...listing.inclusions, item] });
    setCustom("");
  }

  return (
    <>
      <Field
        name="price"
        label="Price per seat"
        hint={range ? `Similar ${listing.kind === "trip" ? "trips" : "city plans"} on ${brand.name} run ${rupee(range.low)} to ${rupee(range.high)}.` : undefined}
        error={issues.price}
      >
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted">₹</span>
          <input
            {...describe("price", Boolean(range), issues.price)}
            inputMode="numeric"
            value={listing.price}
            onChange={(event) => set({ price: event.target.value.replace(/\D/g, "").slice(0, 6) })}
            placeholder={listing.kind === "trip" ? "6499" : "499"}
            className="field pl-9 text-lg font-semibold"
            autoComplete="off"
          />
        </div>
      </Field>

      <section className="card p-4" aria-label="Your earnings">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt>Guest pays per seat</dt>
            <dd className="font-semibold">{rupee(price)}</dd>
          </div>
          <div className="flex justify-between gap-4 text-muted">
            <dt>Service fee ({Math.round(brand.hostCommission * 100)}%)</dt>
            <dd>−{rupee(money.fee)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-line pt-2 font-semibold">
            <dt>You earn per seat</dt>
            <dd>{rupee(money.perSeat)}</dd>
          </div>
        </dl>
        <p className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-forest-soft px-3 py-2.5 text-sm text-forest-deep">
          <span>
            If all {listing.seats} seats fill
          </span>
          <strong className="text-base">{rupee(money.full)}</strong>
        </p>
        <p className="mt-2 text-xs text-muted">Paid out 24 hours after the plan ends, if no safety report is open. The fee rate is a placeholder.</p>
      </section>

      <Group name="inclusions" legend="What’s included" hint="Guests compare this line by line. Transport and the stay are added in the next step." error={issues.inclusions}>
        <div className="flex flex-wrap gap-2">
          {[...presets, ...extras].map((item) => {
            const on = listing.inclusions.includes(item);
            return (
              <button key={item} type="button" aria-pressed={on} className="chip" onClick={() => toggle(item)}>
                <Icon name={on ? "check" : "plus"} className="size-3.5" />
                {item}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            aria-label="Add something else that’s included"
            value={custom}
            maxLength={50}
            onChange={(event) => setCustom(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addCustom();
              }
            }}
            placeholder="Something else, e.g. a tasting session"
            className="field min-w-0 flex-1"
            autoComplete="off"
          />
          <button type="button" className="btn btn-line" onClick={addCustom} disabled={!custom.trim() || listing.inclusions.length >= MAX_INCLUDED}>
            Add
          </button>
        </div>
      </Group>
    </>
  );
}
