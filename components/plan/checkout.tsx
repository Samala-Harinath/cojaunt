"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { Proto, Sheet } from "@/components/ui";
import { paySeat } from "@/lib/actions";
import { brand } from "@/lib/brand";
import { bookingFor } from "@/lib/derive";
import { cancellation, rupee, type Plan } from "@/lib/plans";
import { useApp } from "@/lib/store";

const GST_RATE = 0.18;

function feesFor(plus: boolean) {
  const fee = plus ? 0 : brand.platformFee;
  return { fee, gst: Math.round(fee * GST_RATE) };
}

/** Seat price and platform fee are both per seat, so a group booking scales linearly. */
export function totalFor(plan: Plan, plus: boolean, seats = 1): number {
  const { fee, gst } = feesFor(plus);
  return (plan.price + fee + gst) * seats;
}

type Props = { plan: Plan; open: boolean; onClose: () => void };
type Method = "upi" | "card";

const methods: { id: Method; label: string; hint: string }[] = [
  { id: "upi", label: "UPI", hint: "Any UPI app" },
  { id: "card", label: "Card", hint: "Credit or debit" },
];

/** S12: price breakdown, cancellation terms and payment method. UPI comes first. */
export function Checkout({ plan, open, onClose }: Props) {
  const app = useApp();
  const { me } = app;
  const [method, setMethod] = useState<Method>("upi");
  const seats = bookingFor(app, plan.id)?.seats ?? 1;
  const { fee: perFee, gst: perGst } = feesFor(me.plus);
  const fee = perFee * seats;
  const gst = perGst * seats;
  const total = totalFor(plan, me.plus, seats);

  function pay() {
    paySeat(plan.id);
    onClose();
  }

  return (
    <Sheet open={open} onClose={onClose} title={seats > 1 ? `Confirm ${seats} seats` : "Confirm your seat"}>
      <div className="space-y-5">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt>
              {seats > 1 ? `${seats} seats × ${rupee(plan.price)}` : "Seat"} · {plan.title}
            </dt>
            <dd className="font-semibold">{rupee(plan.price * seats)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>
              Platform fee
              {me.plus ? <span className="ml-2 tag bg-marigold-soft text-amber-ink">Waived with Plus</span> : null}
            </dt>
            <dd className="font-semibold">{rupee(fee)}</dd>
          </div>
          <div className="flex justify-between gap-4 text-muted">
            <dt>GST on platform fee (18%)</dt>
            <dd>{rupee(gst)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-line pt-3 text-base font-bold">
            <dt>Total</dt>
            <dd>{rupee(total)}</dd>
          </div>
        </dl>

        <fieldset>
          <legend className="text-sm font-semibold">Pay with</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {methods.map((item) => (
              <label
                key={item.id}
                className={`cursor-pointer rounded-2xl border p-3 text-sm ${method === item.id ? "border-forest bg-forest-soft" : "border-line"}`}
              >
                <input type="radio" name="method" value={item.id} checked={method === item.id} onChange={() => setMethod(item.id)} className="sr-only" />
                <span className="block font-bold">{item.label}</span>
                <span className="text-xs text-muted">{item.hint}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="rounded-2xl bg-paper p-4">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Icon name="shieldCheck" className="size-4 text-forest" />
            Your money is held until the plan happens
          </p>
          <ul className="mt-2 space-y-1 text-xs leading-relaxed text-muted">
            {cancellation[plan.kind].map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>

        <Proto>No payment is taken. Fee and tax lines are illustrative and need an accountant’s sign-off before launch.</Proto>

        <button type="button" className="btn btn-primary w-full" onClick={pay}>
          Pay {rupee(total)}
        </button>
      </div>
    </Sheet>
  );
}
