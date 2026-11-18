"use client";

import Link from "next/link";
import { useState } from "react";
import { bookingFor } from "@/lib/derive";
import { canSee, openPlans, plans, type Plan } from "@/lib/plans";
import { useApp, type BookingStatus } from "@/lib/store";
import { Icon } from "./icon";
import { PlanCard } from "./plan-card";
import { Scene } from "./scene";
import { panelId, tabId, Tabs } from "./tabs";
import { Empty, Top } from "./ui";

type Tab = "upcoming" | "past" | "wishlist";

const tabs: { id: Tab; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "wishlist", label: "Wishlist" },
];

const badges: Record<BookingStatus, { label: string; tone: string }> = {
  requested: { label: "Waiting for the host", tone: "bg-marigold-soft text-amber-ink" },
  approved: { label: "Approved · pay to confirm", tone: "bg-marigold-soft text-amber-ink" },
  confirmed: { label: "Confirmed", tone: "bg-forest-soft text-forest-deep" },
  waitlist: { label: "On the waitlist", tone: "bg-line text-muted" },
};

function Row({ plan, status, reflected }: { plan: Plan; status: BookingStatus; reflected: boolean }) {
  const badge = plan.past ? { label: "Completed", tone: "bg-line text-muted" } : badges[status];
  const link = "btn btn-soft btn-sm flex-1";

  return (
    <li className="card overflow-hidden">
      <Link href={`/plans/${plan.id}`} className="flex gap-4 p-3">
        <Scene name={plan.scene} className="size-20 shrink-0 rounded-2xl" />
        <div className="min-w-0 flex-1">
          <span className={`tag ${badge.tone}`}>{badge.label}</span>
          <h2 className="mt-1.5 truncate font-display text-lg">{plan.title}</h2>
          <p className="truncate text-sm text-muted">
            {plan.whenShort} · {plan.place}
          </p>
        </div>
      </Link>

      {!plan.past && status === "confirmed" ? (
        <div className="flex gap-2 border-t border-line p-3">
          <Link href={`/chats/g-${plan.id}`} className={link}>
            <Icon name="chat" className="size-4" />
            Group chat
          </Link>
          <Link href={`/trip/${plan.id}`} className={link}>
            <Icon name="shield" className="size-4" />
            Trip Mode
          </Link>
        </div>
      ) : null}

      {!plan.past && status === "approved" ? (
        <div className="border-t border-line p-3">
          <Link href={`/plans/${plan.id}`} className="btn btn-primary btn-sm w-full">
            Pay to confirm your seat
          </Link>
        </div>
      ) : null}

      {plan.past ? (
        <div className="border-t border-line p-3">
          {reflected ? (
            <p className="flex items-center justify-center gap-1.5 text-xs font-semibold text-muted">
              <Icon name="check" className="size-4" />
              You’ve reflected on this plan
            </p>
          ) : (
            <Link href={`/reflect/${plan.id}`} className="btn btn-spark btn-sm w-full">
              <Icon name="heart" className="size-4" />
              Reflect on this plan
            </Link>
          )}
        </div>
      ) : null}
    </li>
  );
}

/** S13: upcoming, past and wishlist. */
export function TripsView() {
  const app = useApp();
  const [tab, setTab] = useState<Tab>("upcoming");

  const upcoming = openPlans.filter((plan) => bookingFor(app, plan.id));
  const past = plans.filter((plan) => plan.past && bookingFor(app, plan.id)?.status === "confirmed");
  const wished = openPlans.filter((plan) => app.wishlist.includes(plan.id) && canSee(plan, app.me.gender));
  const rows = tab === "upcoming" ? upcoming : past;

  return (
    <div className="mx-auto max-w-3xl">
      <Top
        title="My plans"
        right={
          <Link href="/host" className="btn btn-line btn-sm">
            <Icon name="plus" className="size-4" />
            Host a plan
          </Link>
        }
      />
      <div className="px-5">
        <Tabs
          label="My plans"
          idBase="trips"
          value={tab}
          onChange={setTab}
          items={tabs.map((item) => ({ ...item, count: item.id === "upcoming" ? upcoming.length : item.id === "past" ? past.length : wished.length }))}
        />

        <div id={panelId("trips")} role="tabpanel" aria-labelledby={tabId("trips", tab)}>
        {tab === "wishlist" ? (
          wished.length > 0 ? (
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {wished.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <Empty title="Nothing saved yet" body="Tap the heart on any plan to keep it here." href="/discover" cta="Browse plans" />
            </div>
          )
        ) : rows.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {rows.map((plan) => (
              <Row key={plan.id} plan={plan} status={bookingFor(app, plan.id)?.status ?? "requested"} reflected={Boolean(app.signals[plan.id])} />
            ))}
          </ul>
        ) : (
          <div className="mt-4">
            <Empty
              title={tab === "upcoming" ? "No plans yet" : "No past plans"}
              body={tab === "upcoming" ? "Request a seat on something this weekend. You pay only after the host approves you." : "Plans you’ve been on will show up here."}
              href="/discover"
              cta="Browse plans"
            />
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
