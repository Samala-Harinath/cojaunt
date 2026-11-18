"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icon";
import { Proto } from "@/components/ui";
import { approveSeat, cancelSeat } from "@/lib/actions";
import { GROUP_MAX } from "@/lib/audience";
import { bookingFor } from "@/lib/derive";
import { getPerson } from "@/lib/directory";
import { rupee, type Plan } from "@/lib/plans";
import { useApp } from "@/lib/store";
import { Checkout, totalFor } from "./checkout";
import { RequestSheet } from "./request-sheet";

/** The call to action, which changes with the booking: request → host approval → pay → going. */
export function Join({ plan }: { plan: Plan }) {
  const app = useApp();
  const [sheet, setSheet] = useState<"request" | "pay" | null>(null);
  const booking = bookingFor(app, plan.id);
  const status = booking?.status;
  const seats = booking?.seats ?? 1;
  const host = getPerson(plan.hostId).name;
  const full = plan.seatsLeft === 0;
  const total = totalFor(plan, app.me.plus, seats);

  if (plan.past) {
    const canReflect = status === "confirmed" && !app.signals[plan.id];
    return (
      <div className="px-5 pt-5">
        {canReflect ? (
          <Link href={`/reflect/${plan.id}`} className="btn btn-spark w-full">
            <Icon name="heart" />
            Reflect on this plan
          </Link>
        ) : (
          <p className="text-center text-sm text-muted">This plan has ended.</p>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] z-20 mt-6 border-t border-line bg-paper/95 px-5 py-3 backdrop-blur md:bottom-0">
        {status === undefined ? (
          <div className="flex items-center justify-between gap-4">
            <p>
              <span className="text-xl font-bold">{rupee(plan.price)}</span>
              <span className="block text-xs text-muted">
                {full ? "Full right now" : plan.audience === "group" ? `per seat · book up to ${GROUP_MAX} together` : "per seat · pay only after approval"}
              </span>
            </p>
            <button type="button" className={`btn ${plan.audience === "dating" ? "btn-spark" : "btn-primary"}`} onClick={() => setSheet("request")}>
              {full ? "Join the waitlist" : plan.audience === "group" ? "Book for your crew" : "Request to join"}
            </button>
          </div>
        ) : null}

        {status === "requested" ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm">
                <strong className="block">
                  Request for {seats > 1 ? `${seats} seats` : "a seat"} sent to {host}
                </strong>
                <span className="text-muted">Hosts usually reply within a few hours.</span>
              </p>
              <button type="button" className="btn btn-line btn-sm" onClick={() => cancelSeat(plan.id)}>
                Withdraw
              </button>
            </div>
            <Proto>
              There is no host on the other end yet.{" "}
              <button type="button" className="font-bold underline underline-offset-2" onClick={() => approveSeat(plan.id)}>
                Simulate approval
              </button>
            </Proto>
          </div>
        ) : null}

        {status === "approved" ? (
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm">
              <strong className="block">{host} approved you</strong>
              <span className="text-muted">Your seat is held for 24 hours.</span>
            </p>
            <button type="button" className="btn btn-primary" onClick={() => setSheet("pay")}>
              Pay {rupee(total)}
            </button>
          </div>
        ) : null}

        {status === "confirmed" ? (
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-bold text-forest">
              <Icon name="check" />
              You’re going
            </p>
            <div className="flex gap-2">
              <Link href={`/chats/g-${plan.id}`} className="btn btn-soft btn-sm">
                <Icon name="chat" className="size-4" />
                Group chat
              </Link>
              <Link href={`/trip/${plan.id}`} className="btn btn-primary btn-sm">
                <Icon name="shield" className="size-4" />
                Trip Mode
              </Link>
            </div>
          </div>
        ) : null}

        {status === "waitlist" ? (
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm">
              <strong className="block">You’re on the waitlist</strong>
              <span className="text-muted">We’ll offer you a seat if one opens. You pay only if you accept.</span>
            </p>
            <button type="button" className="btn btn-line btn-sm" onClick={() => cancelSeat(plan.id)}>
              Leave
            </button>
          </div>
        ) : null}
      </div>

      <RequestSheet plan={plan} open={sheet === "request"} onClose={() => setSheet(null)} />
      <Checkout plan={plan} open={sheet === "pay"} onClose={() => setSheet(null)} />
    </>
  );
}
