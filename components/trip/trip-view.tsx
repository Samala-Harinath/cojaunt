"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/avatar";
import { Icon } from "@/components/icon";
import { ReportSheet } from "@/components/report-sheet";
import { Empty, Proto, Switch } from "@/components/ui";
import { patchPrivacy, toggleShare } from "@/lib/actions";
import { holdsSeat } from "@/lib/derive";
import { getPerson } from "@/lib/directory";
import type { Plan } from "@/lib/plans";
import { useApp } from "@/lib/store";
import { Sos } from "./sos";

/** S15: SOS, trip sharing, check-in, host and today's itinerary, all within two taps. */
export function TripView({ plan }: { plan: Plan }) {
  const app = useApp();
  const [checkedIn, setCheckedIn] = useState(false);
  const [report, setReport] = useState(false);
  const host = getPerson(plan.hostId);
  const names = app.contacts.map((contact) => contact.name);
  const today = plan.itinerary[0];

  if (!holdsSeat(app, plan.id)) {
    return (
      <div className="px-5 pt-10">
        <Empty title="Trip Mode opens with your seat" body="Once your seat on this plan is confirmed, SOS, trip sharing and check-ins live here." href={`/plans/${plan.id}`} cta="Back to the plan" />
      </div>
    );
  }

  if (plan.past) {
    return (
      <div className="px-5 pt-10">
        <Empty title="This plan has ended" body="Trip Mode runs from the moment your seat is confirmed until the plan ends." href={`/plans/${plan.id}`} cta="Back to the plan" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-night px-5 pb-10 text-white">
      <header className="flex items-center gap-3 pb-6 pt-5">
        <Link href={`/plans/${plan.id}`} aria-label="Back to the plan" className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10">
          <Icon name="left" />
        </Link>
        <div className="min-w-0">
          <h1 className="font-display text-2xl leading-tight">Trip Mode</h1>
          <p className="truncate text-sm text-white/70">{plan.title}</p>
        </div>
      </header>

      <Sos contacts={names} hostName={host.name} />

      <div className="mt-8 space-y-4">
        <section className="card px-4 py-1 text-ink" aria-label="Sharing">
          <div className="divide-y divide-line">
            <Switch
              checked={names.length > 0 && app.shared.includes(plan.id)}
              onChange={() => {
                if (names.length > 0) toggleShare(plan.id);
              }}
              label="Share this trip with my contacts"
              hint={names.length > 0 ? `Sends the itinerary, the host’s name and guests’ first names to ${names.join(" and ")}.` : "Add an emergency contact first."}
            />
            <Switch
              checked={app.privacy.preciseLocation}
              onChange={(next) => patchPrivacy({ preciseLocation: next })}
              label="Share my live location"
              hint="Only your own emergency contacts can see it, and only while this trip is running."
            />
          </div>
          <div className="pb-3">
            <Proto>
              Nothing is sent to anyone yet.{" "}
              <Link href="/safety" className="font-bold underline underline-offset-2">
                Manage contacts
              </Link>
            </Proto>
          </div>
        </section>

        <section className="card p-4 text-ink" aria-label="Safety check-in">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Icon name="clock" className="size-5 text-forest" />
            Safety check-in
          </h2>
          <p className="mt-1 text-sm text-muted">
            {plan.kind === "trip" ? "We ask once each evening on overnight trips. A missed check-in is followed up by the safety team." : "Let the host know you’ve arrived."}
          </p>
          {checkedIn ? (
            <p className="mt-3 flex items-center gap-2 text-sm font-bold text-forest">
              <Icon name="check" />
              Checked in. Thank you.
            </p>
          ) : (
            <button type="button" className="btn btn-soft mt-3 w-full" onClick={() => setCheckedIn(true)}>
              I’m okay
            </button>
          )}
        </section>

        <section className="card p-4 text-ink" aria-label="Host">
          <div className="flex items-center gap-3">
            <Avatar name={host.name} hue={host.hue} size={44} />
            <p className="min-w-0 flex-1 text-sm">
              <strong className="block">{host.name}, your host</strong>
              <span className="text-muted">Their phone number appears here on the day of the plan.</span>
            </p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link href={`/chats/g-${plan.id}`} className="btn btn-soft btn-sm">
              <Icon name="chat" className="size-4" />
              Group chat
            </Link>
            <button type="button" className="btn btn-line btn-sm" onClick={() => setReport(true)}>
              <Icon name="flag" className="size-4" />
              Report
            </button>
          </div>
        </section>

        <section className="card p-4 text-ink" aria-label="Itinerary">
          <h2 className="eyebrow">{today.label}</h2>
          <ol className="mt-2 space-y-2">
            {today.stops.map((stop) => (
              <li key={`${stop.time}-${stop.title}`} className="flex gap-3 text-sm">
                <span className="w-16 shrink-0 font-semibold text-muted">{stop.time}</span>
                <span className="font-semibold">{stop.title}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 flex gap-2 text-xs text-muted">
            <Icon name="pin" className="size-4" />
            Meet at {plan.meet}
          </p>
        </section>
      </div>

      <ReportSheet open={report} onClose={() => setReport(false)} about="something on this plan" />
    </div>
  );
}
