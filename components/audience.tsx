import { audiences, type Audience } from "@/lib/audience";
import type { Plan } from "@/lib/plans";
import { Icon, type IconName } from "./icon";

export const audienceIcon: Record<Audience, IconName> = { dating: "heart", group: "people" };

/** Solid colours so the tag reads on top of cover art in both themes. */
const tone: Record<Audience, string> = {
  dating: "bg-spark text-white",
  group: "bg-forest text-white",
};

export function AudienceTag({ audience }: { audience: Audience }) {
  return (
    <span className={`tag ${tone[audience]}`}>
      <Icon name={audienceIcon[audience]} className="size-3" />
      {audiences[audience].label}
    </span>
  );
}

const soft: Record<Audience, string> = {
  dating: "bg-spark-soft text-spark",
  group: "bg-forest-soft text-forest",
};

/** "What this kind of plan promises", on the plan page. */
export function AudiencePanel({ plan }: { plan: Plan }) {
  const info = audiences[plan.audience];
  return (
    <section className="card p-5" aria-labelledby="audience-heading">
      <div className="flex items-center gap-3">
        <span className={`grid size-10 shrink-0 place-items-center rounded-full ${soft[plan.audience]}`}>
          <Icon name={audienceIcon[plan.audience]} />
        </span>
        <div className="min-w-0">
          <h2 id="audience-heading" className="font-display text-2xl leading-tight">
            {info.title}
          </h2>
          <p className="text-sm text-muted">
            {info.blurb}
            {plan.ageRange ? ` Ages ${plan.ageRange[0]}–${plan.ageRange[1]}.` : ""}
          </p>
        </div>
      </div>
      <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        {info.promises.map((item) => (
          <li key={item} className="flex gap-2.5">
            <Icon name="check" className="mt-px size-4 text-forest" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
