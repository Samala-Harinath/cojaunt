"use client";

import Link from "next/link";
import { toggleWish } from "@/lib/actions";
import { GROUP_MAX } from "@/lib/audience";
import { seatsHeld } from "@/lib/derive";
import { fitFor } from "@/lib/match";
import { planCity, planDistanceLabel } from "@/lib/places";
import { rupee, seatsLeft, type Plan } from "@/lib/plans";
import { useApp } from "@/lib/store";
import { AudienceTag } from "./audience";
import { Icon } from "./icon";
import { Scene } from "./scene";

/** `km` is the distance to where the plan starts (the pickup point for trips). Omitted when location isn't in use. */
export function PlanCard({ plan, km }: { plan: Plan; km?: number }) {
  const app = useApp();
  const saved = app.wishlist.includes(plan.id);
  const held = seatsHeld(app, plan.id);
  const going = held > 0;
  const left = seatsLeft(plan, held);
  const fit = fitFor(plan, app.me.vibe, app.me.interests);
  const from = planCity(plan);

  return (
    <article className="card relative flex h-full flex-col overflow-hidden transition-shadow hover:shadow-[0_18px_40px_-24px_rgb(23_36_31/0.45)]">
      <Link href={`/plans/${plan.id}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[16/10] shrink-0">
          <Scene name={plan.scene} className="size-full" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 pr-14">
            <AudienceTag audience={plan.audience} />
            {plan.womenOnly ? <span className="tag bg-plum text-white">Women-only</span> : null}
            {plan.menOnly ? <span className="tag bg-plum text-white">Men-only</span> : null}
            <span className="tag bg-surface/90 text-ink">{plan.kind === "trip" ? plan.duration : "In the city"}</span>
          </div>
        </div>
        {/* Title and details are clamped to fixed line counts, and the price row is pinned to the bottom, so every card matches. */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 min-h-[3.4rem] font-display text-xl leading-snug">{plan.title}</h3>
          <p className="mt-1 truncate text-sm text-muted">
            {plan.whenShort} · {plan.place}
            {plan.ageRange ? ` · Ages ${plan.ageRange[0]}–${plan.ageRange[1]}` : ""}
          </p>
          <p className={`mt-1 flex min-h-4 items-center gap-1 truncate text-xs ${km !== undefined ? "font-semibold text-forest" : "text-muted"}`}>
            {km !== undefined || from ? <Icon name="pin" className="size-3.5 shrink-0" /> : null}
            <span className="truncate">
              {km !== undefined
                ? `${plan.kind === "trip" ? "Pickup " : ""}${planDistanceLabel(km)} from you${from ? ` · ${from}` : ""}`
                : from
                  ? plan.kind === "trip"
                    ? `Starts from ${from}`
                    : from
                  : ""}
            </span>
          </p>
          <div className="mt-auto flex items-end justify-between gap-3 pt-3">
            <p>
              <span className="text-lg font-bold">{rupee(plan.price)}</span>
              <span className="text-xs text-muted"> per seat</span>
            </p>
            <p className={`text-xs font-semibold ${going ? "text-forest" : left === 0 ? "text-muted" : "text-ink"}`}>
              {going ? "You’re going" : left === 0 ? "Full · waitlist open" : `${left} of ${plan.seats} seats left`}
            </p>
          </div>
          <p className="mt-3 flex items-center justify-between gap-2 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 text-forest">
              <Icon name="spark" className="size-3.5" />
              {fit.label} for you
            </span>
            <span className="text-muted">{plan.audience === "group" ? `Book up to ${GROUP_MAX} together` : "1 seat per person"}</span>
          </p>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => toggleWish(plan.id)}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${plan.title} from your wishlist` : `Save ${plan.title} to your wishlist`}
        className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-surface/90 text-spark"
      >
        <Icon name="heart" filled={saved} />
      </button>
    </article>
  );
}
