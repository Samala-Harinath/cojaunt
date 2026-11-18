"use client";

import { Avatar } from "@/components/avatar";
import { Icon } from "@/components/icon";
import { Proto } from "@/components/ui";
import { decide } from "@/lib/actions";
import { brand } from "@/lib/brand";
import { getPerson } from "@/lib/directory";
import { rupee } from "@/lib/plans";
import { hosted } from "@/lib/social";
import { useApp } from "@/lib/store";

const COMMISSION = brand.hostCommission;

/** The sample member's live plan: guests, join requests and the payout estimate. */
export function HostedPlan() {
  const app = useApp();
  const approved = hosted.requests.filter((request) => app.decisions[request.id] === "approved");
  const pending = hosted.requests.filter((request) => !app.decisions[request.id] && !app.blocked.includes(request.personId));
  const going = [...hosted.confirmedIds, ...approved.map((request) => request.personId)].map(getPerson);
  const seatsLeft = hosted.seats - going.length;
  const gross = going.length * hosted.price;
  const fee = Math.round(gross * COMMISSION);

  return (
    <>
      <section className="card p-5" aria-labelledby="hosted-heading">
        <span className="tag bg-forest-soft text-forest-deep">Live</span>
        <h2 id="hosted-heading" className="mt-2 font-display text-2xl">
          {hosted.title}
        </h2>
        <p className="text-sm text-muted">
          {hosted.when} · {rupee(hosted.price)} per seat
        </p>
        <p className="mt-3 text-sm font-semibold">
          {going.length} of {hosted.seats} seats filled
        </p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {going.map((person) => (
            <li key={person.id} className="flex items-center gap-2 text-sm">
              <Avatar name={person.name} hue={person.hue} size={28} />
              {person.name}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="requests-heading">
        <h2 id="requests-heading" className="font-display text-2xl">
          Requests to join
        </h2>
        {pending.length === 0 ? <p className="mt-2 text-sm text-muted">No requests waiting. You’re all caught up.</p> : null}
        <ul className="mt-3 space-y-3">
          {pending.map((request) => {
            const person = getPerson(request.personId);
            return (
              <li key={request.id} className="card p-4">
                <div className="flex items-center gap-3">
                  <Avatar name={person.name} hue={person.hue} size={44} />
                  <p className="min-w-0 flex-1 text-sm">
                    <strong className="block">
                      {person.name}, {person.age}
                    </strong>
                    <span className="text-muted">
                      {person.idVerified ? "ID verified" : "Selfie verified"} · {person.plansDone} plans completed
                    </span>
                  </p>
                </div>
                <p className="mt-3 rounded-xl bg-paper px-3 py-2.5 text-sm leading-relaxed">“{request.note}”</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button type="button" className="btn btn-line btn-sm" onClick={() => decide(request.id, "declined")}>
                    Decline
                  </button>
                  <button type="button" className="btn btn-primary btn-sm" disabled={seatsLeft <= 0} onClick={() => decide(request.id, "approved")}>
                    Approve
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-muted">A declined guest sees only that their request wasn’t accepted. Your reasons stay with you.</p>
      </section>

      <section className="card p-5" aria-labelledby="payout-heading">
        <h2 id="payout-heading" className="flex items-center gap-2 font-display text-2xl">
          <Icon name="wallet" className="size-5 text-forest" />
          Payout
        </h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt>
              {going.length} seats × {rupee(hosted.price)}
            </dt>
            <dd className="font-semibold">{rupee(gross)}</dd>
          </div>
          <div className="flex justify-between gap-4 text-muted">
            <dt>Commission ({Math.round(COMMISSION * 100)}%)</dt>
            <dd>−{rupee(fee)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-line pt-3 text-base font-bold">
            <dt>Estimated payout</dt>
            <dd>{rupee(gross - fee)}</dd>
          </div>
        </dl>
        <div className="mt-3">
          <Proto>This is a sample plan with sample guests. The commission rate is a placeholder and no money moves.</Proto>
        </div>
      </section>
    </>
  );
}
