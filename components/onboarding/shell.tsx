"use client";

import type { ReactNode } from "react";
import type { Me } from "@/lib/store";

export type StepProps = { me: Me; set: (patch: Partial<Me>) => void; onNext: () => void };

type ShellProps = {
  title: string;
  lead?: string;
  children: ReactNode;
  onNext: () => void;
  nextLabel?: string;
  disabled?: boolean;
  error?: string;
};

export function Shell({ title, lead, children, onNext, nextLabel = "Continue", disabled = false, error = "" }: ShellProps) {
  return (
    <form
      noValidate
      className="flex flex-1 flex-col px-5 pb-6"
      onSubmit={(event) => {
        event.preventDefault();
        onNext();
      }}
    >
      <h1 className="font-display text-3xl leading-tight">{title}</h1>
      {lead ? <p className="mt-2 text-sm leading-relaxed text-muted">{lead}</p> : null}
      <div className="mt-6 flex-1 space-y-5">{children}</div>
      <p role="alert" className="mt-4 min-h-5 text-sm font-semibold text-danger">
        {error}
      </p>
      <button type="submit" className="btn btn-primary mt-2 w-full" disabled={disabled}>
        {nextLabel}
      </button>
    </form>
  );
}
