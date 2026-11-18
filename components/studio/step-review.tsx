"use client";

import { Icon } from "@/components/icon";
import { PlanDetails } from "@/components/plan/plan-details";
import { Proto } from "@/components/ui";
import { isDone } from "@/lib/listing-check";
import { toPlan } from "@/lib/listing-dates";
import { steps, type Listing } from "@/lib/listing";
import type { Me } from "@/lib/store";
import { PreviewCard, Tips } from "./preview";

type Props = { listing: Listing; me: Me; onEdit: (step: number) => void };

const editable = steps.slice(0, -1);

const nextSteps = [
  "Our team reviews pricing, the venue and transport, usually within 48 hours",
  "First-time hosts get a short call and a trial plan with one of our team",
  "Once approved, your trip appears in Discover under Trips, in the Group trips or Singles trips list",
];

export function StepReview({ listing, me, onEdit }: Props) {
  const plan = toPlan(listing);

  return (
    <>
      <section aria-labelledby="checklist-heading" className="card divide-y divide-line">
        <h3 id="checklist-heading" className="sr-only">
          Checklist
        </h3>
        {editable.map((step, i) => {
          const done = isDone(listing, step.id);
          return (
            <div key={step.id} className="flex items-center gap-3 px-4 py-3 text-sm">
              <span className={`grid size-6 shrink-0 place-items-center rounded-full ${done ? "bg-forest text-white" : "bg-spark-soft text-danger"}`} aria-hidden="true">
                <Icon name={done ? "check" : "alert"} className="size-3.5" />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block">{step.label}</strong>
                <span className={done ? "text-muted" : "text-danger"}>{done ? "Complete" : "Needs attention"}</span>
              </span>
              <button type="button" className="btn btn-line btn-sm" onClick={() => onEdit(i)} aria-label={`Edit ${step.label}`}>
                <Icon name="edit" className="size-4" />
                Edit
              </button>
            </div>
          );
        })}
      </section>

      <div className="lg:hidden">
        <h3 className="eyebrow mb-2">Card preview</h3>
        <PreviewCard listing={listing} me={me} />
      </div>

      <Tips listing={listing} />

      <div className="space-y-5">
        <h3 className="eyebrow">What guests see on the plan page</h3>
        <PlanDetails plan={plan} />
      </div>

      <section className="card p-5" aria-labelledby="after-heading">
        <h3 id="after-heading" className="font-display text-2xl">
          After you send it
        </h3>
        <ol className="mt-3 space-y-3 text-sm">
          {nextSteps.map((item, i) => (
            <li key={item} className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-forest-soft text-xs font-bold text-forest-deep">{i + 1}</span>
              {item}
            </li>
          ))}
        </ol>
      </section>

      <Proto>Nothing is sent. The listing stays on this device with the status “In review”, and nobody reviews it.</Proto>
    </>
  );
}
