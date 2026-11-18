"use client";

import { Avatar, AvatarStack } from "@/components/avatar";
import { Icon } from "@/components/icon";
import { companions } from "@/lib/derive";
import { mixFor, type Plan } from "@/lib/plans";
import { useApp } from "@/lib/store";

type WhoProps = { plan: Plan; trusted: boolean; going: boolean };

/** Progressive trust: a gender mix and blurred faces first, first names once the host approves you. */
export function Who({ plan, trusted, going }: WhoProps) {
  const app = useApp();
  const mix = mixFor(plan, going ? app.me.gender : null);
  const group = companions(app, plan);
  const parts = [
    { count: mix.women, label: mix.women === 1 ? "woman" : "women", bar: "bg-plum" },
    { count: mix.men, label: mix.men === 1 ? "man" : "men", bar: "bg-forest" },
    { count: mix.others, label: "non-binary", bar: "bg-marigold" },
  ].filter((part) => part.count > 0);

  return (
    <section className="card p-5" aria-labelledby="who-heading">
      <h2 id="who-heading" className="font-display text-2xl">
        Who’s going
      </h2>

      {mix.total === 0 ? (
        <p className="mt-2 text-sm text-muted">Nobody has joined yet. You’d be the first.</p>
      ) : (
        <>
          <div className="mt-4 flex h-2.5 gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
            {parts.map((part) => (
              <span key={part.label} className={part.bar} style={{ flexGrow: part.count }} />
            ))}
          </div>
          <p className="mt-2 text-sm text-muted">
            {parts.map((part) => `${part.count} ${part.label}`).join(" · ")}
            {going ? ", including you" : ""}
          </p>
        </>
      )}

      {trusted ? (
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-3">
          {group.map((person) => (
            <li key={person.id} className="flex items-center gap-2 text-sm font-semibold">
              <Avatar name={person.name} hue={person.hue} size={32} />
              {person.name}
            </li>
          ))}
        </ul>
      ) : group.length > 0 ? (
        <div className="mt-4 flex items-center gap-3">
          <AvatarStack people={group} blurred />
          <p className="flex items-start gap-1.5 text-xs leading-relaxed text-muted">
            <Icon name="lock" className="mt-px size-3.5" />
            First names and photos appear once the host approves you. Full profiles open after the plan.
          </p>
        </div>
      ) : null}
    </section>
  );
}
