"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { fitFor } from "@/lib/match";
import type { Plan } from "@/lib/plans";
import { useApp } from "@/lib/store";

/** Explained matching: every line here traces back to an answer the member gave in the vibe quiz. */
export function FitPanel({ plan }: { plan: Plan }) {
  const { me } = useApp();
  const fit = fitFor(plan, me.vibe, me.interests);

  return (
    <section className="rounded-[1.25rem] bg-band p-5 text-white" aria-labelledby="fit-heading">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-marigold">
        <Icon name="spark" className="size-4" />
        Why this fits you
      </p>
      <h2 id="fit-heading" className="mt-2 font-display text-2xl">
        {fit.label}
      </h2>

      {fit.reasons.length > 0 ? (
        <ul className="mt-3 space-y-2 text-sm">
          {fit.reasons.map((reason) => (
            <li key={reason} className="flex gap-2">
              <Icon name="check" className="mt-px size-4 text-marigold" />
              {reason}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-white/80">This one is outside your usual choices, which can be the point.</p>
      )}

      {fit.headsUp ? (
        <p className="mt-3 flex gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm">
          <Icon name="info" className="mt-px size-4 text-marigold" />
          <span>
            <strong>Worth knowing:</strong> {fit.headsUp}
          </span>
        </p>
      ) : null}

      {fit.groupSize > 0 ? (
        <p className="mt-3 text-sm text-white/90">
          Your travel style is close to {fit.vibeWith} of the {fit.groupSize} people going.
        </p>
      ) : null}

      <p className="mt-4 border-t border-white/15 pt-3 text-xs leading-relaxed text-white/70">
        Worked out from your vibe quiz answers and interests, nothing else. It never looks at photos or messages.{" "}
        <Link href="/profile" className="font-semibold text-white underline underline-offset-2">
          Change your answers
        </Link>
      </p>
    </section>
  );
}
