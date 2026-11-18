"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { brand } from "@/lib/brand";
import { Icon } from "./icon";

const show = (node: HTMLDialogElement | null) => {
  if (node && !node.open) node.showModal();
};

type SheetProps = { open: boolean; onClose: () => void; title: string; children: ReactNode };

/** Bottom sheet on phones, centred dialog on larger screens. Native <dialog> gives focus trapping and Esc. */
export function Sheet({ open, onClose, title, children }: SheetProps) {
  if (!open) return null;
  return (
    <dialog
      ref={show}
      className="sheet"
      aria-label={title}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="sheet-body p-5 pb-8">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl leading-tight">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-10 shrink-0 place-items-center rounded-full bg-paper">
            <Icon name="x" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}

/** Marks anything that is simulated, so nobody mistakes the prototype for a working service. */
export function Proto({ children }: { children: ReactNode }) {
  return (
    <p className="flex gap-2 rounded-xl bg-marigold-soft px-3 py-2.5 text-xs leading-relaxed text-amber-ink">
      <Icon name="info" className="mt-px size-4" />
      <span>
        <strong>Prototype.</strong> {children}
      </span>
    </p>
  );
}

type TopProps = { title: string; back?: string; sub?: string; right?: ReactNode };

export function Top({ title, back, sub, right }: TopProps) {
  return (
    <header className="flex items-center gap-3 px-5 pb-4 pt-6">
      {back ? (
        <Link href={back} aria-label="Back" className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface">
          <Icon name="left" />
        </Link>
      ) : null}
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-display text-3xl leading-tight">{title}</h1>
        {sub ? <p className="mt-0.5 truncate text-sm text-muted">{sub}</p> : null}
      </div>
      {right}
    </header>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display text-xl font-semibold tracking-tight ${className}`}>
      {/* Two files, one per theme: a dark-green mark for light mode, a cream mark for dark mode (public/brand). */}
      <Image src="/brand/logo-light.png" alt="" width={375} height={375} priority className="size-7 dark:hidden" />
      <Image src="/brand/logo-dark.png" alt="" width={378} height={378} priority className="hidden size-7 dark:block" />
      {brand.name}
    </span>
  );
}

type EmptyProps = { title: string; body: string; href?: string; cta?: string };

export function Empty({ title, body, href, cta }: EmptyProps) {
  return (
    <div className="card px-6 py-10 text-center">
      <p className="font-display text-xl">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{body}</p>
      {href && cta ? (
        <Link href={href} className="btn btn-soft btn-sm mt-5">
          {cta}
        </Link>
      ) : null}
    </div>
  );
}

type SwitchProps = { checked: boolean; onChange: (next: boolean) => void; label: string; hint?: string };

export function Switch({ checked, onChange, label, hint }: SwitchProps) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 py-3">
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        {hint ? <span className="mt-0.5 block text-xs leading-relaxed text-muted">{hint}</span> : null}
      </span>
      <input type="checkbox" role="switch" checked={checked} onChange={(event) => onChange(event.target.checked)} className="peer sr-only" />
      <span className="relative mt-0.5 h-7 w-12 shrink-0 rounded-full bg-line transition-colors after:absolute after:left-1 after:top-1 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-forest peer-checked:after:translate-x-5 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-forest" />
    </label>
  );
}
