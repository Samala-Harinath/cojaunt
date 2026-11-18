"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { Logo } from "@/components/ui";
import { patchListing, submitListing } from "@/lib/actions";
import { check, completeCount, firstGap, type Issues } from "@/lib/listing-check";
import { steps, type Listing } from "@/lib/listing";
import type { Me } from "@/lib/store";
import { fid } from "./fields";
import { PreviewCard, Tips } from "./preview";
import { StepBody } from "./step-body";
import { Stepper } from "./stepper";

/** Seven steps with autosave, inline validation and a live guest preview. */
export function Editor({ listing, me }: { listing: Listing; me: Me }) {
  const router = useRouter();
  const heading = useRef<HTMLHeadingElement>(null);
  // Errors stay hidden until the host tries to move on, then update live as they fix them.
  const [shown, setShown] = useState<Record<string, boolean>>({});
  const [now, setNow] = useState<number | undefined>(undefined);

  const step = steps[listing.step];
  const issues: Issues = shown[step.id] ? check(listing, step.id, now) : {};
  const progress = completeCount(listing);
  const last = listing.step === steps.length - 1;

  function go(index: number) {
    patchListing(listing.id, { step: index, reached: Math.max(listing.reached, index) });
    window.scrollTo({ top: 0, behavior: "smooth" });
    requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
  }

  function next() {
    const clock = Date.now();
    setNow(clock);
    if (last) {
      const gap = firstGap(listing, clock);
      if (gap >= 0) {
        setShown((current) => ({ ...current, [steps[gap].id]: true }));
        go(gap);
        return;
      }
      submitListing(listing.id);
      router.push("/host");
      return;
    }
    const found = check(listing, step.id, clock);
    const first = Object.keys(found)[0];
    if (first) {
      setShown((current) => ({ ...current, [step.id]: true }));
      requestAnimationFrame(() => document.getElementById(fid(first))?.focus());
      return;
    }
    go(listing.step + 1);
  }

  return (
    <div className="min-h-dvh pb-28 lg:pb-12">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
          <Link href="/host" className="shrink-0" aria-label="Hosting dashboard">
            <Logo />
          </Link>
          <span className="hidden border-l border-line pl-4 text-sm font-semibold text-muted sm:inline">Host Studio</span>
          <p className="ml-auto hidden items-center gap-1.5 text-xs text-muted sm:flex">
            <Icon name="check" className="size-4 text-forest" />
            Saved on this device
          </p>
          <Link href="/host" className="btn btn-line btn-sm ml-auto sm:ml-0">
            Save & exit
          </Link>
        </div>
        <div className="h-1 bg-line" role="progressbar" aria-label="Listing completeness" aria-valuemin={0} aria-valuemax={progress.total} aria-valuenow={progress.done}>
          <div className="h-full bg-forest transition-[width] duration-500" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 pt-6 lg:grid-cols-[12rem_minmax(0,1fr)_20rem] lg:gap-10">
        <Stepper listing={listing} onGo={go} />

        <main className="min-w-0">
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              next();
            }}
          >
            <p className="eyebrow">
              Step {listing.step + 1} of {steps.length}
            </p>
            <h1 ref={heading} tabIndex={-1} className="mt-1 font-display text-3xl leading-tight outline-none sm:text-4xl">
              {step.title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.lead}</p>

            <div key={step.id} className="rise mt-6 space-y-6">
              <StepBody step={step.id} listing={listing} me={me} issues={issues} onEdit={go} />
            </div>

            <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:static lg:mt-8 lg:border-0 lg:bg-transparent lg:p-0">
              <div className="mx-auto flex max-w-6xl items-center gap-3">
                {listing.step > 0 ? (
                  <button type="button" className="btn btn-line" onClick={() => go(listing.step - 1)}>
                    <Icon name="left" className="size-4" />
                    Back
                  </button>
                ) : null}
                <button type="submit" className="btn btn-primary ml-auto min-w-40">
                  {last ? "Send for review" : "Continue"}
                  <Icon name={last ? "send" : "arrow"} className="size-4" />
                </button>
              </div>
            </div>
          </form>
        </main>

        <aside className="hidden lg:block" aria-label="Live preview">
          <div className="sticky top-24 space-y-4">
            <p className="eyebrow flex items-center gap-1.5">
              <Icon name="eye" className="size-3.5" />
              How guests see it
            </p>
            <PreviewCard listing={listing} me={me} />
            {step.id !== "review" ? <Tips listing={listing} /> : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
