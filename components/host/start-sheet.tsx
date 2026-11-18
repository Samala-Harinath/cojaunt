"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/icon";
import { Scene } from "@/components/scene";
import { Sheet } from "@/components/ui";
import { addListing } from "@/lib/actions";
import { audiences, type Audience } from "@/lib/audience";
import { canDate } from "@/lib/derive";
import { kinds, newListing, templates, type Seed } from "@/lib/listing";
import { useApp } from "@/lib/store";

/**
 * Starts a new listing. The host first chooses what it is (Group trip or Singles trip), because the
 * two follow different rules and appear in different lists, then picks a template or a blank plan.
 */
export function StartSheet({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { me } = useApp();
  const singlesAllowed = canDate(me);
  const [audience, setAudience] = useState<Audience>("group");

  function start(seed: Seed) {
    const listing = newListing({ ...seed, audience });
    addListing(listing);
    router.push(`/host/studio?id=${listing.id}`);
  }

  return (
    <Sheet open onClose={onClose} title="What would you like to host?">
      <h3 className="eyebrow">1. Who is it for?</h3>
      <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Who is it for">
        {(["group", "dating"] as const).map((id) => {
          const locked = id === "dating" && !singlesAllowed;
          const on = audience === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={on}
              disabled={locked}
              onClick={() => setAudience(id)}
              className={`flex flex-col items-start gap-1.5 rounded-2xl border-2 p-3.5 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                on ? (id === "dating" ? "border-spark bg-spark-soft" : "border-forest bg-forest-soft") : "border-line bg-surface hover:border-muted"
              }`}
            >
              <Icon name={id === "dating" ? "heart" : "people"} className={id === "dating" ? "text-spark" : "text-forest"} />
              <strong>{audiences[id].label}</strong>
              <span className="text-xs leading-relaxed text-muted">
                {id === "dating" ? (locked ? "Only single members open to dating can host these." : "Only singles can join.") : "Anyone can join, alone or with friends."}
              </span>
            </button>
          );
        })}
      </div>

      <h3 className="eyebrow mt-6">2. Start blank</h3>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {kinds.map((kind) => (
          <button
            key={kind.id}
            type="button"
            onClick={() => start({ kind: kind.id })}
            className="flex flex-col items-start gap-2 rounded-2xl border border-line bg-surface p-4 text-left text-sm transition-colors hover:border-forest"
          >
            <span className="grid size-10 place-items-center rounded-full bg-forest-soft text-forest">
              <Icon name={kind.id === "trip" ? "map" : "pin"} />
            </span>
            <span>
              <strong className="block">{kind.id === "trip" ? "Overnight trip" : "Day plan"}</strong>
              <span className="text-xs text-muted">{kind.hint}</span>
            </span>
          </button>
        ))}
      </div>

      <h3 className="eyebrow mt-6">Or use a template</h3>
      <ul className="mt-2 space-y-2">
        {templates.map((template) => (
          <li key={template.id}>
            <button
              type="button"
              onClick={() => start(template.seed)}
              className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-2.5 text-left text-sm transition-colors hover:border-forest"
            >
              <Scene name={template.seed.scene ?? "city"} className="h-12 w-16 shrink-0 rounded-xl" />
              <span className="min-w-0 flex-1">
                <strong className="block">{template.label}</strong>
                <span className="text-xs text-muted">
                  {template.seed.kind === "trip" ? "Overnight trip" : "Day plan"} · {template.hint}
                </span>
              </span>
              <Icon name="right" className="size-4 text-muted" />
            </button>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}
