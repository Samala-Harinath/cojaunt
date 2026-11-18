import { detailLabels, type PrivateDetails } from "@/lib/people";
import { Icon } from "./icon";

/** The locked or unlocked private-details block on a profile. `details` is null until the two members connect. */
export function PrivateDetailsCard({ details }: { details: PrivateDetails | null }) {
  return (
    <section className="card p-5" aria-labelledby="private-heading">
      <h2 id="private-heading" className="flex items-center gap-2 font-display text-xl">
        <Icon name={details ? "check" : "lock"} className="size-5 text-forest" />
        {details ? "Private details" : "Private details are hidden"}
      </h2>
      {details ? (
        <dl className="mt-3 divide-y divide-line text-sm">
          {detailLabels.map(({ key, label }) =>
            details[key] ? (
              <div key={key} className="flex justify-between gap-4 py-2">
                <dt className="text-muted">{label}</dt>
                <dd className="text-right font-semibold">{details[key]}</dd>
              </div>
            ) : null,
          )}
        </dl>
      ) : (
        <>
          <p className="mt-1 text-sm text-muted">They unlock for both of you once a request is accepted.</p>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {detailLabels.map(({ key, label }) => (
              <li key={key} className="flex items-center gap-2 rounded-xl bg-paper px-3 py-2 text-muted">
                <Icon name="lock" className="size-3.5" />
                {label}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
