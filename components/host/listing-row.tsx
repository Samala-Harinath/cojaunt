"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icon";
import { Scene } from "@/components/scene";
import { removeListing, withdrawListing } from "@/lib/actions";
import { completeCount } from "@/lib/listing-check";
import { schedule } from "@/lib/listing-dates";
import type { Listing } from "@/lib/listing";
import { rupee } from "@/lib/plans";

/** A draft or in-review listing on the hosting dashboard. */
export function ListingRow({ listing }: { listing: Listing }) {
  const [confirming, setConfirming] = useState(false);
  const review = listing.status === "review";
  const progress = completeCount(listing);
  const when = schedule(listing);
  const title = listing.title.trim() || (listing.kind === "trip" ? "Untitled trip" : "Untitled day plan");
  const type = listing.audience === "dating" ? "Singles trip" : "Group trip";
  const facts = [when?.whenShort, listing.place.trim(), listing.price ? rupee(Number(listing.price)) : null].filter(Boolean).join(" · ");

  return (
    <li className="card overflow-hidden">
      <div className="flex gap-4 p-3">
        <Scene name={listing.scene} className="size-20 shrink-0 rounded-2xl" />
        <div className="min-w-0 flex-1">
          <span className="flex flex-wrap gap-1.5">
            <span className={`tag ${review ? "bg-marigold-soft text-amber-ink" : "bg-line text-muted"}`}>{review ? "In review" : "Draft"}</span>
            <span className={`tag ${listing.audience === "dating" ? "bg-spark-soft text-spark" : "bg-forest-soft text-forest-deep"}`}>{type}</span>
          </span>
          <h3 className="mt-1.5 truncate font-display text-lg">{title}</h3>
          <p className="truncate text-sm text-muted">{facts || (listing.kind === "trip" ? "Overnight trip" : "Day plan")}</p>
          {!review ? (
            <div className="mt-2 flex items-center gap-2">
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                <span className="block h-full rounded-full bg-forest" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
              </span>
              <span className="text-xs tabular-nums text-muted">
                {progress.done}/{progress.total} steps
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex gap-2 border-t border-line p-3">
        {confirming ? (
          <>
            <p className="flex-1 self-center text-sm font-semibold">Delete this {review ? "listing" : "draft"}?</p>
            <button type="button" className="btn btn-line btn-sm" onClick={() => setConfirming(false)}>
              Keep
            </button>
            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeListing(listing.id)}>
              Delete
            </button>
          </>
        ) : (
          <>
            {review ? (
              <button type="button" className="btn btn-soft btn-sm flex-1" onClick={() => withdrawListing(listing.id)}>
                Withdraw to edit
              </button>
            ) : (
              <Link href={`/host/studio?id=${listing.id}`} className="btn btn-primary btn-sm flex-1">
                <Icon name="edit" className="size-4" />
                Continue editing
              </Link>
            )}
            <button type="button" className="btn btn-line btn-sm" onClick={() => setConfirming(true)} aria-label={`Delete ${title}`}>
              <Icon name="trash" className="size-4" />
            </button>
          </>
        )}
      </div>
    </li>
  );
}
