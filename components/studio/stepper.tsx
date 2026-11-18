"use client";

import { Icon } from "@/components/icon";
import { isDone } from "@/lib/listing-check";
import { steps, type Listing } from "@/lib/listing";

/** Step list: vertical on desktop, a compact scrollable strip on phones. Only reached steps are clickable. */
export function Stepper({ listing, onGo }: { listing: Listing; onGo: (index: number) => void }) {
  return (
    <nav aria-label="Listing steps" className="lg:sticky lg:top-24 lg:self-start">
      <ol className="-mx-5 flex gap-1 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-col lg:px-0">
        {steps.map((step, i) => {
          const current = i === listing.step;
          const open = i <= listing.reached;
          const done = step.id !== "review" && open && isDone(listing, step.id);
          return (
            <li key={step.id} className="shrink-0">
              <button
                type="button"
                disabled={!open}
                onClick={() => onGo(i)}
                aria-current={current ? "step" : undefined}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold text-muted transition-colors enabled:hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50 aria-[current=step]:bg-surface aria-[current=step]:text-ink aria-[current=step]:shadow-sm"
              >
                <span
                  className={`grid size-6 shrink-0 place-items-center rounded-full text-xs ${
                    done ? "bg-forest text-white" : current ? "bg-ink text-paper" : "border border-line bg-surface"
                  }`}
                  aria-hidden="true"
                >
                  {done ? <Icon name="check" className="size-3.5" /> : i + 1}
                </span>
                <span className="whitespace-nowrap">{step.label}</span>
                {done ? <span className="sr-only">(complete)</span> : null}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
