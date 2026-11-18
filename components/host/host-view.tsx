"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { Top } from "@/components/ui";
import { useApp } from "@/lib/store";
import { HostedPlan } from "./hosted-plan";
import { ListingRow } from "./listing-row";
import { StartSheet } from "./start-sheet";

const vetting = [
  "Identity check, a short interview and two references",
  "A trial plan with one of our team along",
  "Every listing is reviewed for pricing, venue and transport before it goes live",
  "Payouts are released 24 hours after the plan ends, if no safety report is open",
];

/** S19: create a plan, approve requests, see guests and the payout. */
export function HostView() {
  const app = useApp();
  const [starting, setStarting] = useState(false);
  const drafts = app.listings.filter((item) => item.status === "editing");
  const inReview = app.listings.filter((item) => item.status === "review");

  return (
    <div className="mx-auto max-w-2xl">
      <Top
        title="Hosting"
        back="/profile"
        right={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setStarting(true)}>
            <Icon name="plus" className="size-4" />
            New plan
          </button>
        }
      />
      <div className="space-y-6 px-5">
        <button
          type="button"
          onClick={() => setStarting(true)}
          className="flex w-full items-center gap-4 rounded-3xl bg-band p-5 text-left text-white transition hover:brightness-110"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white/15">
            <Icon name="map" className="size-6 text-marigold" />
          </span>
          <span className="min-w-0 flex-1">
            <strong className="block font-display text-xl">Host a Group trip or a Singles trip</strong>
            <span className="text-sm text-white/80">Choose who it’s for, then seven short steps with a live preview. Progress saves as you go.</span>
          </span>
          <Icon name="arrow" className="size-5" />
        </button>

        {inReview.length > 0 ? (
          <section aria-labelledby="review-heading">
            <h2 id="review-heading" className="font-display text-2xl">
              In review
            </h2>
            <p className="mt-1 text-sm text-muted">Our team usually replies within 48 hours.</p>
            <ul className="mt-3 space-y-3">
              {inReview.map((listing) => (
                <ListingRow key={listing.id} listing={listing} />
              ))}
            </ul>
          </section>
        ) : null}

        {drafts.length > 0 ? (
          <section aria-labelledby="drafts-heading">
            <h2 id="drafts-heading" className="font-display text-2xl">
              Drafts
            </h2>
            <ul className="mt-3 space-y-3">
              {drafts.map((listing) => (
                <ListingRow key={listing.id} listing={listing} />
              ))}
            </ul>
          </section>
        ) : null}

        {/* SAMPLE DATA: a live plan with guests and requests, shown to every profile in the prototype. */}
        <HostedPlan />

        <section className="card p-5" aria-labelledby="vetting-heading">
          <h2 id="vetting-heading" className="font-display text-2xl">
            How hosting works
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {vetting.map((item) => (
              <li key={item} className="flex gap-2.5">
                <Icon name="check" className="mt-px size-4 text-forest" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {starting ? <StartSheet onClose={() => setStarting(false)} /> : null}
    </div>
  );
}
