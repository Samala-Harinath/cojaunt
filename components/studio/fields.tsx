"use client";

import type { ReactNode } from "react";
import { Icon } from "@/components/icon";
import type { Issues } from "@/lib/listing-check";
import type { Listing } from "@/lib/listing";

/** Every step gets the listing, an autosaving setter and the problems to show. */
export type StepProps = { listing: Listing; set: (patch: Partial<Listing>) => void; issues: Issues };

/** Field ids are `f-<issue key>`, so a failed Continue can move focus to the first problem. */
export const fid = (key: string) => `f-${key}`;

/** aria wiring that ties an input to its hint and its error. */
export function describe(key: string, hint: boolean, error?: string) {
  const ids = [hint ? `${fid(key)}-hint` : "", error ? `${fid(key)}-error` : ""].filter(Boolean).join(" ");
  return { id: fid(key), "aria-invalid": error ? true : undefined, "aria-describedby": ids || undefined };
}

export function Err({ name, error }: { name: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${fid(name)}-error`} className="mt-1.5 flex items-start gap-1.5 text-xs font-semibold text-danger">
      <Icon name="alert" className="mt-px size-3.5" />
      {error}
    </p>
  );
}

type FieldProps = { name: string; label: string; hint?: string; error?: string; count?: [number, number]; optional?: boolean; children: ReactNode };

export function Field({ name, label, hint, error, count, optional = false, children }: FieldProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={fid(name)} className="text-sm font-semibold">
          {label}
          {optional ? <span className="ml-1.5 font-normal text-muted">Optional</span> : null}
        </label>
        {count ? <span className="text-xs tabular-nums text-muted">{`${count[0]}/${count[1]}`}</span> : null}
      </div>
      {hint ? (
        <p id={`${fid(name)}-hint`} className="mt-0.5 text-xs leading-relaxed text-muted">
          {hint}
        </p>
      ) : null}
      <div className="mt-2">{children}</div>
      <Err name={name} error={error} />
    </div>
  );
}

type GroupProps = { name: string; legend: string; hint?: string; error?: string; children: ReactNode };

/** A fieldset that can take focus, so a failed Continue can land on it. */
export function Group({ name, legend, hint, error, children }: GroupProps) {
  return (
    <fieldset id={fid(name)} tabIndex={-1} aria-describedby={error ? `${fid(name)}-error` : undefined} className="rounded-lg">
      <legend className="text-sm font-semibold">{legend}</legend>
      {hint ? <p className="mt-0.5 text-xs leading-relaxed text-muted">{hint}</p> : null}
      <div className="mt-2">{children}</div>
      <Err name={name} error={error} />
    </fieldset>
  );
}

type ChoiceProps = { name: string; checked: boolean; onSelect: () => void; title: string; hint?: string; icon?: ReactNode; disabled?: boolean };

/** Radio card. The native radio stays in the tab order and arrow-key group. */
export function Choice({ name, checked, onSelect, title, hint, icon, disabled = false }: ChoiceProps) {
  return (
    <label
      className={`flex items-start gap-3 rounded-2xl border p-4 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-forest ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${checked ? "border-forest bg-forest-soft" : "border-line bg-surface hover:border-muted"}`}
    >
      <input type="radio" name={name} checked={checked} disabled={disabled} onChange={onSelect} className="sr-only" />
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block font-bold">{title}</span>
        {hint ? <span className="mt-0.5 block text-xs text-muted">{hint}</span> : null}
      </span>
      <span
        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 ${checked ? "border-forest bg-forest text-white" : "border-line"}`}
        aria-hidden="true"
      >
        {checked ? <Icon name="check" className="size-3" /> : null}
      </span>
    </label>
  );
}

type CounterProps = { name: string; label: string; value: number; min: number; max: number; onChange: (next: number) => void };

export function Counter({ name, label, value, min, max, onChange }: CounterProps) {
  const round = "grid size-11 place-items-center rounded-full border border-line bg-surface transition-colors hover:border-forest disabled:opacity-40";
  return (
    <div className="flex items-center gap-4">
      <button type="button" className={round} aria-label={`One fewer ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)}>
        <Icon name="minus" />
      </button>
      <output id={fid(name)} aria-live="polite" className="min-w-8 text-center text-2xl font-bold tabular-nums">
        {value}
      </output>
      <button type="button" className={round} aria-label={`One more ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Icon name="plus" />
      </button>
    </div>
  );
}
