"use client";

import Link from "next/link";
import { AudiencePanel, AudienceTag } from "@/components/audience";
import { Avatar } from "@/components/avatar";
import { Icon } from "@/components/icon";
import { Scene } from "@/components/scene";
import { Empty } from "@/components/ui";
import { toggleWish } from "@/lib/actions";
import { bookingFor } from "@/lib/derive";
import { getPerson } from "@/lib/directory";
import { canJoinKind } from "@/lib/audience";
import { canSee, type Plan } from "@/lib/plans";
import { useApp } from "@/lib/store";
import { FitPanel } from "./fit-panel";
import { Join } from "./join";
import { PlanDetails } from "./plan-details";
import { Who } from "./who";

export function PlanView({ plan }: { plan: Plan }) {
  const app = useApp();
  const host = getPerson(plan.hostId);
  const status = bookingFor(app, plan.id)?.status;
  const going = status === "confirmed";
  const trusted = going || status === "approved";
  const saved = app.wishlist.includes(plan.id);

  if (!canJoinKind(plan, app.me) && !status) {
    return (
      <div className="px-5 pt-10">
        <Empty
          title="This is a Singles trip"
          body="Singles trips are only for single members who chose Open to dating. Group trips are open to everyone."
          href="/discover?tab=trips"
          cta="See group trips"
        />
      </div>
    );
  }

  if (!canSee(plan, app.me.gender)) {
    return (
      <div className="px-5 pt-10">
        <Empty
          title={plan.menOnly ? "This plan is men-only" : "This plan is women-only"}
          body="Women-only and men-only plans are visible only to the members they’re for. There are plenty of mixed plans this week."
          href="/discover"
          cta="Back to plans"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative md:px-5 md:pt-6">
        <Scene name={plan.scene} className="aspect-[16/10] w-full md:rounded-3xl" />
        <Link href="/discover" aria-label="Back to plans" className="absolute left-4 top-4 grid size-10 place-items-center rounded-full bg-surface/90 md:left-9 md:top-10">
          <Icon name="left" />
        </Link>
        <button
          type="button"
          onClick={() => toggleWish(plan.id)}
          aria-pressed={saved}
          aria-label={saved ? "Remove from your wishlist" : "Save to your wishlist"}
          className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-surface/90 text-spark md:right-9 md:top-10"
        >
          <Icon name="heart" filled={saved} />
        </button>
      </div>

      <div className="space-y-5 px-5 pt-5">
        <header>
          <div className="flex flex-wrap gap-1.5">
            <AudienceTag audience={plan.audience} />
            {plan.womenOnly ? <span className="tag bg-plum-soft text-plum">Women-only</span> : null}
            {plan.menOnly ? <span className="tag bg-plum-soft text-plum">Men-only</span> : null}
            <span className="tag bg-forest-soft text-forest-deep">{plan.kind === "trip" ? `Trip · ${plan.duration}` : `In the city · ${plan.duration}`}</span>
            {plan.past ? <span className="tag bg-line text-muted">Ended</span> : null}
          </div>
          <h1 className="mt-3 font-display text-4xl leading-[1.1]">{plan.title}</h1>
          <p className="mt-2 text-muted">{plan.tagline}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex gap-2.5">
              <Icon name="calendar" className="size-5 text-forest" />
              <dt className="sr-only">When</dt>
              <dd>{plan.when}</dd>
            </div>
            <div className="flex gap-2.5">
              <Icon name="pin" className="size-5 text-forest" />
              <dt className="sr-only">Where</dt>
              <dd>
                {plan.place}
                <span className="block text-xs text-muted">
                  {trusted ? `Meet at ${plan.meet}` : "The exact meeting point is shared after the host approves you."}
                </span>
              </dd>
            </div>
          </dl>
        </header>

        <section className="card flex items-center gap-4 p-4" aria-label="Host">
          <Avatar name={host.name} hue={host.hue} size={56} />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 font-semibold">
              Hosted by {host.name}
              <Icon name="shieldCheck" className="size-4 text-forest" />
            </p>
            {host.host ? (
              <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
                <Icon name="star" filled className="size-4 text-amber-ink" />
                {host.host.rating} from {host.host.reviews} reviews · hosting since {host.host.since}
              </p>
            ) : null}
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{host.bio}</p>
          </div>
        </section>

        <AudiencePanel plan={plan} />
        <Who plan={plan} trusted={trusted} going={going} />
        {plan.past ? null : <FitPanel plan={plan} />}
        <PlanDetails plan={plan} />
      </div>

      <Join plan={plan} />
    </div>
  );
}
