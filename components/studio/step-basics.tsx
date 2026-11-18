"use client";

import { Icon } from "@/components/icon";
import { Scene } from "@/components/scene";
import { kinds, sceneOptions, switchKind } from "@/lib/listing";
import { interestOptions } from "@/lib/people";
import { Choice, describe, Field, Group, type StepProps } from "./fields";

const TITLE_MAX = 60;
const TAGLINE_MAX = 140;
const MAX_TAGS = 3;

export function StepBasics({ listing, set, issues }: StepProps) {
  function toggleTag(tag: string) {
    const has = listing.tags.includes(tag);
    if (!has && listing.tags.length >= MAX_TAGS) return;
    set({ tags: has ? listing.tags.filter((item) => item !== tag) : [...listing.tags, tag] });
  }

  return (
    <>
      <Group name="kind" legend="Type of plan" hint="Trips need ID-verified guests and a licensed stay. You can switch, but dates and itinerary reset.">
        <div className="grid gap-2 sm:grid-cols-2">
          {kinds.map((kind) => (
            <Choice
              key={kind.id}
              name="kind"
              checked={listing.kind === kind.id}
              onSelect={() => set(switchKind(listing, kind.id))}
              title={kind.title}
              hint={kind.hint}
              icon={<Icon name={kind.id === "trip" ? "map" : "pin"} className="mt-px size-5 text-forest" />}
            />
          ))}
        </div>
      </Group>

      <Field name="title" label="Title" hint="Lead with the place and the activity." error={issues.title} count={[listing.title.length, TITLE_MAX]}>
        <input
          {...describe("title", true, issues.title)}
          value={listing.title}
          maxLength={TITLE_MAX}
          onChange={(event) => set({ title: event.target.value })}
          placeholder={listing.kind === "trip" ? "Coorg Coffee Trail Weekend" : "Sunday Sketchwalk, Basavanagudi"}
          className="field"
          autoComplete="off"
        />
      </Field>

      <Field name="tagline" label="One-line summary" hint="What will guests remember? Shown under the title." error={issues.tagline} count={[listing.tagline.length, TAGLINE_MAX]}>
        <textarea
          {...describe("tagline", true, issues.tagline)}
          value={listing.tagline}
          maxLength={TAGLINE_MAX}
          rows={2}
          onChange={(event) => set({ tagline: event.target.value })}
          placeholder="Estate walks, a waterfall dip and slow filter-coffee mornings."
          className="field resize-none"
        />
      </Field>

      <Group name="tags" legend="Themes" hint={`Up to ${MAX_TAGS}. Members who picked these interests see the plan first.`} error={issues.tags}>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((tag) => {
            const on = listing.tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={on}
                disabled={!on && listing.tags.length >= MAX_TAGS}
                onClick={() => toggleTag(tag)}
                className="chip disabled:opacity-40"
              >
                {on ? <Icon name="check" className="size-3.5" /> : null}
                {tag}
              </button>
            );
          })}
        </div>
      </Group>

      <Group name="scene" legend="Cover" hint="Photo uploads arrive with the backend. Pick the closest illustration for now.">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {sceneOptions.map((option) => {
            const on = listing.scene === option.id;
            return (
              <label key={option.id} className="cursor-pointer text-center text-xs font-semibold">
                <input type="radio" name="scene" checked={on} onChange={() => set({ scene: option.id })} className="peer sr-only" />
                <span
                  className={`block overflow-hidden rounded-xl ring-offset-2 transition peer-focus-visible:ring-2 peer-focus-visible:ring-forest ${
                    on ? "ring-2 ring-forest" : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <Scene name={option.id} className="aspect-[4/3] w-full" />
                </span>
                <span className={`mt-1 block ${on ? "text-forest" : "text-muted"}`}>{option.label}</span>
              </label>
            );
          })}
        </div>
      </Group>
    </>
  );
}
