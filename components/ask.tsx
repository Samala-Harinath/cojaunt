"use client";

import { askExamples, type Facet } from "@/lib/concierge";
import { Icon } from "./icon";

type AskProps = {
  query: string;
  facets: Facet[];
  onQuery: (next: string) => void;
  onDrop: (key: string) => void;
  /** Just the search field: no card, heading or example prompts. */
  compact?: boolean;
};

/**
 * Plain-language search. In `compact` mode only the field renders; the caller shows the facets.
 * Whatever the member types is shown back as explicit, removable filters,
 * so they can always see and correct how they were understood.
 */
export function Ask({ query, facets, onQuery, onDrop, compact = false }: AskProps) {
  const missed = query.trim().length > 2 && facets.length === 0;

  return (
    <section aria-label="Describe the plan you want" className={compact ? "" : "card p-4"}>
      <label htmlFor="ask" className={compact ? "sr-only" : "eyebrow flex items-center gap-1.5"}>
        <Icon name="spark" className="size-3.5 text-amber-ink" />
        Describe your ideal plan
      </label>
      <div className={compact ? "relative" : "relative mt-2"}>
        <Icon name="search" className={`pointer-events-none absolute left-3.5 size-5 text-muted ${compact ? "top-2.5" : "top-3.5"}`} />
        <input
          id="ask"
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder={compact ? "Search, e.g. slow women-only trip under 7k" : "e.g. a slow women-only trip under 7k"}
          className={`field pl-11 ${compact ? "min-h-10 rounded-full py-1.5 text-sm" : ""}`}
          autoComplete="off"
        />
      </div>

      {compact ? null : facets.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">Understood as:</span>
          {facets.map((facet) => (
            <button key={facet.key} type="button" onClick={() => onDrop(facet.key)} className="chip min-h-8 border-forest bg-forest-soft text-forest-deep" aria-label={`Remove filter: ${facet.label}`}>
              {facet.label}
              <Icon name="x" className="size-3.5" />
            </button>
          ))}
        </div>
      ) : compact ? null : (
        <div className="mt-3 flex flex-wrap gap-2">
          {askExamples.map((example) => (
            <button key={example} type="button" onClick={() => onQuery(example)} className="chip min-h-8 text-muted">
              {example}
            </button>
          ))}
        </div>
      )}

      {missed && !compact ? (
        <p className="mt-3 text-xs text-muted">
          I couldn’t turn that into filters yet. Try words like trek, beach, women-only, slow, this weekend or “under 5k”.
        </p>
      ) : null}
    </section>
  );
}
