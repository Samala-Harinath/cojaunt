"use client";

import { AudienceTag } from "@/components/audience";
import { Avatar } from "@/components/avatar";
import { Icon } from "@/components/icon";
import { Scene } from "@/components/scene";
import { toPlan } from "@/lib/listing-dates";
import type { Listing } from "@/lib/listing";
import { tips } from "@/lib/listing-tips";
import { rupee } from "@/lib/plans";
import type { Me } from "@/lib/store";

/** The plan card exactly as it will appear in Discover, updated as the host types. */
export function PreviewCard({ listing, me }: { listing: Listing; me: Me }) {
  const plan = toPlan(listing);
  return (
    <article className="card overflow-hidden" aria-label="Preview of your plan card">
      <div className="relative aspect-[16/10]">
        <Scene name={plan.scene} className="size-full" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <AudienceTag audience={plan.audience} />
          {plan.womenOnly ? <span className="tag bg-plum text-white">Women-only</span> : null}
          {plan.menOnly ? <span className="tag bg-plum text-white">Men-only</span> : null}
          <span className="tag bg-surface/90 text-ink">{plan.kind === "trip" ? plan.duration : "In the city"}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className={`font-display text-xl leading-snug ${listing.title.trim() ? "" : "text-muted"}`}>{plan.title}</h3>
        <p className="mt-1 text-sm text-muted">
          {plan.whenShort} · {plan.place}
        </p>
        {plan.tagline ? <p className="mt-2 line-clamp-2 text-sm leading-relaxed">{plan.tagline}</p> : null}
        <div className="mt-3 flex items-end justify-between gap-3">
          <p>
            <span className="text-lg font-bold">{listing.price === "" ? "₹—" : plan.price === 0 ? "Free" : rupee(plan.price)}</span>
            <span className="text-xs text-muted"> per seat</span>
          </p>
          <p className="text-xs font-semibold">{plan.seats} seats</p>
        </div>
        <div className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-xs text-muted">
          <Avatar name={me.name} hue={me.hue} size={24} />
          Hosted by {me.name}
          <span className="ml-auto">
            {listing.audience === "dating" ? "Singles only · " : ""}Ages {listing.ageMin}–{listing.ageMax}
          </span>
        </div>
      </div>
    </article>
  );
}

export function Tips({ listing }: { listing: Listing }) {
  const list = tips(listing);
  if (list.length === 0) return null;
  return (
    <section className="rounded-2xl bg-marigold-soft p-4" aria-labelledby="tips-heading">
      <h3 id="tips-heading" className="flex items-center gap-2 text-sm font-bold text-amber-ink">
        <Icon name="bulb" className="size-4" />
        Make it stand out
      </h3>
      <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-amber-ink">
        {list.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </section>
  );
}
