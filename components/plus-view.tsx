"use client";

import { useState } from "react";
import { patchMe } from "@/lib/actions";
import { brand, type PlusPlanId } from "@/lib/brand";
import { rupee } from "@/lib/plans";
import { useApp } from "@/lib/store";
import { Icon } from "./icon";
import { Proto, Top } from "./ui";

const rows: { label: string; free: string; plus: string }[] = [
  { label: "Verification, SOS, reports and blocking", free: "Included", plus: "Included" },
  { label: "Browse and join plans", free: "Included", plus: "Included" },
  { label: "Platform fee per seat", free: rupee(brand.platformFee), plus: "₹0" },
  { label: "Early look at new trips", free: "—", plus: "24 hours early" },
  { label: "Wishlist alerts when a group forms", free: "2 plans", plus: "Unlimited" },
  { label: "Free late cancellation", free: "—", plus: "1 each quarter" },
];

const never = ["Seeing who chose you", "Chatting with a mutual connection", "Any safety feature"];

const monthlyPrice = brand.plusPlans[0].price;

/** What a plan saves compared with paying month by month, in whole rupees. */
const saving = (plan: (typeof brand.plusPlans)[number]) => monthlyPrice * plan.months - plan.price;

export function PlusView() {
  const { me } = useApp();
  const [picked, setPicked] = useState<PlusPlanId>("quarterly");
  const current = brand.plusPlans.find((plan) => plan.id === (me.plusPlan ?? "monthly"));
  const chosen = brand.plusPlans.find((plan) => plan.id === picked) ?? brand.plusPlans[0];

  return (
    <div className="mx-auto max-w-2xl">
      <Top title="Plus" back="/profile" sub="For people who join a few plans a month." />
      <div className="space-y-5 px-5">
        <section className="rounded-[1.25rem] bg-band p-6 text-white" aria-label="Choose a Plus plan">
          <p className="font-display text-2xl">Pick a plan</p>
          <p className="mt-1 text-sm text-white/80">The longer you stay, the less you pay each month.</p>

          <div role="radiogroup" aria-label="Plus plans" className="mt-4 grid gap-2.5 sm:grid-cols-3">
            {brand.plusPlans.map((plan) => {
              const on = plan.id === picked;
              const save = saving(plan);
              return (
                <label
                  key={plan.id}
                  className={`relative block cursor-pointer rounded-2xl border-2 p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-marigold ${
                    on ? "border-marigold bg-white/15" : "border-white/20 bg-white/5 hover:border-white/40"
                  }`}
                >
                  <input type="radio" name="plus-plan" value={plan.id} checked={on} onChange={() => setPicked(plan.id)} className="sr-only" />
                  <span className="block text-sm font-semibold text-white/85">{plan.label}</span>
                  <span className="mt-1 block font-display text-3xl">{rupee(plan.price)}</span>
                  <span className="mt-0.5 block text-xs text-white/75">{plan.months === 1 ? "billed monthly" : `${rupee(Math.round(plan.price / plan.months))} a month`}</span>
                  {save > 0 ? <span className="mt-2 inline-block rounded-full bg-marigold px-2 py-0.5 text-xs font-bold text-night">Save {rupee(save)}</span> : null}
                </label>
              );
            })}
          </div>

          {me.plus ? (
            <>
              <p className="mt-5 flex items-center gap-2 text-sm font-bold text-marigold">
                <Icon name="check" />
                You’re on Plus{current ? ` · ${current.label}` : ""}
              </p>
              {me.plusPlan !== picked ? (
                <button type="button" className="btn mt-3 w-full bg-marigold text-night" onClick={() => patchMe({ plus: true, plusPlan: picked })}>
                  Switch to {chosen.label} for {rupee(chosen.price)} (simulated)
                </button>
              ) : null}
              <button type="button" className="btn mt-3 w-full bg-white/10 text-white" onClick={() => patchMe({ plus: false, plusPlan: undefined })}>
                Cancel Plus
              </button>
            </>
          ) : (
            <button type="button" className="btn mt-5 w-full bg-marigold text-night" onClick={() => patchMe({ plus: true, plusPlan: picked })}>
              Try Plus for {chosen.label}, {rupee(chosen.price)} (simulated)
            </button>
          )}
        </section>

        <Proto>
          No payment is taken. The prices are test prices, set low on purpose. In this prototype Plus changes one thing: the platform fee at checkout.
        </Proto>

        <section className="card overflow-hidden" aria-labelledby="compare-heading">
          <h2 id="compare-heading" className="sr-only">
            Free and Plus compared
          </h2>
          <table className="w-full text-left text-sm">
            <thead className="bg-paper text-xs uppercase tracking-wider text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-bold">
                  What you get
                </th>
                <th scope="col" className="px-3 py-3 font-bold">
                  Free
                </th>
                <th scope="col" className="px-3 py-3 font-bold">
                  Plus
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className="px-4 py-3 font-semibold">
                    {row.label}
                  </th>
                  <td className="px-3 py-3 text-muted">{row.free}</td>
                  <td className="px-3 py-3 font-semibold text-forest">{row.plus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card p-5" aria-labelledby="never-heading">
          <h2 id="never-heading" className="font-display text-2xl">
            What we’ll never charge for
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {never.map((item) => (
              <li key={item} className="flex gap-2.5">
                <Icon name="shieldCheck" className="mt-px size-4 text-forest" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
