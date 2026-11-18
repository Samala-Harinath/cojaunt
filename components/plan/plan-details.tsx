import { Icon } from "@/components/icon";
import { cancellation, type Plan } from "@/lib/plans";

export function PlanDetails({ plan }: { plan: Plan }) {
  const safety = [
    "Every guest is selfie-verified before they can request a seat",
    ...(plan.idRequired ? ["Government ID is checked for every guest on overnight plans"] : []),
    ...(plan.womenOnly ? ["Women-only, with a woman hosting"] : []),
    ...(plan.menOnly ? ["Men-only, hidden from women everywhere in the app"] : []),
    "The host is vetted: identity check, interview, references and a trial plan",
    ...(plan.kind === "trip" ? ["Rooms are never shared across genders unless everyone in the room opts in"] : []),
    "SOS, live location sharing and check-ins are built into Trip Mode",
  ];

  return (
    <>
      <section className="card p-5" aria-labelledby="itinerary-heading">
        <h2 id="itinerary-heading" className="font-display text-2xl">
          Itinerary
        </h2>
        {plan.itinerary.map((day) => (
          <div key={day.label} className="mt-4">
            <h3 className="eyebrow">{day.label}</h3>
            <ol className="mt-2 border-l-2 border-line">
              {day.stops.map((stop) => (
                <li key={`${stop.time}-${stop.title}`} className="relative py-2 pl-5">
                  <span className="absolute -left-[5px] top-[1.05rem] size-2 rounded-full bg-forest" aria-hidden="true" />
                  <p className="text-xs font-semibold text-muted">{stop.time}</p>
                  <p className="text-sm font-semibold">{stop.title}</p>
                  {stop.note ? <p className="text-xs text-muted">{stop.note}</p> : null}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>

      <section className="card p-5" aria-labelledby="included-heading">
        <h2 id="included-heading" className="font-display text-2xl">
          What’s included
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          {plan.inclusions.map((item) => (
            <li key={item} className="flex gap-2.5">
              <Icon name="check" className="mt-px size-4 text-forest" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="card p-5" aria-labelledby="safety-heading">
        <h2 id="safety-heading" className="flex items-center gap-2 font-display text-2xl">
          <Icon name="shieldCheck" className="size-6 text-forest" />
          Safety on this plan
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          {safety.map((item) => (
            <li key={item} className="flex gap-2.5">
              <Icon name="check" className="mt-px size-4 text-forest" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="card p-5" aria-labelledby="cancel-heading">
        <h2 id="cancel-heading" className="font-display text-2xl">
          If plans change
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {cancellation[plan.kind].map((rule) => (
            <li key={rule} className="flex gap-2.5">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted" aria-hidden="true" />
              {rule}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
