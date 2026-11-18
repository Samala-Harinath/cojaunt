"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/avatar";
import { Icon } from "@/components/icon";
import { ReportSheet } from "@/components/report-sheet";
import { Empty, Proto } from "@/components/ui";
import { saveSignals } from "@/lib/actions";
import { canDate, companions, holdsSeat } from "@/lib/derive";
import { getPerson } from "@/lib/directory";
import type { Plan } from "@/lib/plans";
import type { Signal } from "@/lib/social";
import { useApp } from "@/lib/store";
import { Done } from "./done";
import { HostReview } from "./host-review";

const pill = "chip aria-pressed:border-forest aria-pressed:bg-forest aria-pressed:text-white";
const sparkPill = "chip aria-pressed:border-spark aria-pressed:bg-spark aria-pressed:text-white";

/** S16: private signals per person, a public host review and a private safety report. */
export function ReflectView({ plan }: { plan: Plan }) {
  const app = useApp();
  const [choices, setChoices] = useState<Record<string, Signal>>({});
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState("");
  const [report, setReport] = useState(false);
  const group = companions(app, plan);
  const host = getPerson(plan.hostId);
  const dating = canDate(app.me);

  if (!plan.past || !holdsSeat(app, plan.id)) {
    return (
      <div className="px-5 pt-10">
        <Empty title="Nothing to reflect on yet" body="Reflection opens after a plan you attended has ended, and stays open for 7 days." href="/trips" cta="Back to my plans" />
      </div>
    );
  }

  if (app.signals[plan.id]) return <Done plan={plan} />;

  function pick(id: string, signal: Signal) {
    setChoices((current) => ({ ...current, [id]: current[id] === signal ? "skip" : signal }));
  }

  function save() {
    saveSignals(plan.id, Object.fromEntries(group.map((person) => [person.id, choices[person.id] ?? "skip"])));
  }

  return (
    <div className="space-y-5 px-5 pb-8 pt-5">
      <header>
        <Link href="/trips" className="inline-flex items-center gap-1 text-sm font-semibold text-forest">
          <Icon name="left" className="size-4" />
          My plans
        </Link>
        <h1 className="mt-3 font-display text-4xl leading-tight">How was {plan.title}?</h1>
        <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-muted">
          <Icon name="lock" className="mt-px size-4" />
          Your choices are private. Someone finds out only if they chose the same about you.
        </p>
      </header>

      <section className="card p-5" aria-labelledby="people-heading">
        <h2 id="people-heading" className="font-display text-2xl">
          Who would you travel with again?
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          “Travel again” means you’d happily go on another trip with them, as friends.{" "}
          {dating ? "“Spark” means you’d like to date them (it also counts as Travel again). " : ""}Leave anyone unmarked to skip them. There’s no penalty either way.
        </p>
        <ul className="mt-4 divide-y divide-line">
          {group.map((person) => (
            <li key={person.id} className="flex flex-wrap items-center gap-3 py-3">
              <Avatar name={person.name} hue={person.hue} size={44} />
              <p className="min-w-0 flex-1 text-sm">
                <strong className="block">
                  {person.name}, {person.age}
                </strong>
                <span className="text-muted">{person.work}</span>
              </p>
              <div className="flex gap-2">
                <button type="button" className={pill} aria-pressed={choices[person.id] === "again"} onClick={() => pick(person.id, "again")}>
                  <Icon name="compass" className="size-4" />
                  Travel again
                </button>
                {dating ? (
                  <button type="button" className={sparkPill} aria-pressed={choices[person.id] === "spark"} onClick={() => pick(person.id, "spark")}>
                    <Icon name="spark" className="size-4" />
                    Spark
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <HostReview host={host.name} stars={stars} onStars={setStars} text={review} onText={setReview} />

      <section className="card p-5" aria-labelledby="concern-heading">
        <h2 id="concern-heading" className="font-display text-2xl">
          Did anything feel unsafe?
        </h2>
        <p className="mt-1 text-sm text-muted">This goes only to the safety team. It is never shown to the host or other guests.</p>
        <button type="button" className="btn btn-line btn-sm mt-3" onClick={() => setReport(true)}>
          <Icon name="flag" className="size-4" />
          Report privately
        </button>
      </section>

      <Proto>Your signals are saved on this device. The host review isn’t published anywhere.</Proto>

      <button type="button" className="btn btn-primary w-full" onClick={save}>
        Save my reflection
      </button>

      <ReportSheet open={report} onClose={() => setReport(false)} about={`something on ${plan.title}`} />
    </div>
  );
}
