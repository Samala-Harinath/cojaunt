"use client";

import { Icon } from "@/components/icon";
import type { ListingStop } from "@/lib/listing";
import { describe, Err } from "./fields";

const small = "grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-paper hover:text-ink disabled:opacity-30";

type StopProps = {
  stop: ListingStop;
  index: number;
  count: number;
  error?: string;
  onChange: (patch: Partial<ListingStop>) => void;
  onMove: (by: -1 | 1) => void;
  onRemove: () => void;
};

export function StopRow({ stop, index, count, error, onChange, onMove, onRemove }: StopProps) {
  const label = stop.title.trim() || `stop ${index + 1}`;
  return (
    <li className="relative pl-6">
      <span className="absolute left-0 top-5 size-3 rounded-full border-2 border-forest bg-surface" aria-hidden="true" />
      <div className="rounded-2xl border border-line bg-surface p-3">
        <div className="flex gap-2">
          <input
            type="time"
            aria-label={`Time for ${label}`}
            value={stop.time}
            onChange={(event) => onChange({ time: event.target.value })}
            className="field w-32 shrink-0 px-3"
          />
          <input
            {...describe(`stop-${stop.id}`, false, error)}
            aria-label={`Stop ${index + 1}`}
            data-stop-title=""
            value={stop.title}
            maxLength={70}
            onChange={(event) => onChange({ title: event.target.value })}
            placeholder={index === 0 ? "Meet the group" : "What happens here?"}
            className="field min-w-0 flex-1"
            autoComplete="off"
          />
        </div>
        <div className="mt-2 flex items-center gap-1">
          <input
            aria-label={`Note for ${label}`}
            value={stop.note}
            maxLength={100}
            onChange={(event) => onChange({ note: event.target.value })}
            placeholder="Note for guests (optional)"
            className="field min-h-10 min-w-0 flex-1 py-2 text-sm"
            autoComplete="off"
          />
          <button type="button" className={small} disabled={index === 0} onClick={() => onMove(-1)} aria-label={`Move ${label} up`}>
            <Icon name="up" className="size-4" />
          </button>
          <button type="button" className={small} disabled={index === count - 1} onClick={() => onMove(1)} aria-label={`Move ${label} down`}>
            <Icon name="down" className="size-4" />
          </button>
          <button type="button" className={small} disabled={count === 1} onClick={onRemove} aria-label={`Remove ${label}`}>
            <Icon name="trash" className="size-4" />
          </button>
        </div>
        <Err name={`stop-${stop.id}`} error={error} />
      </div>
    </li>
  );
}
