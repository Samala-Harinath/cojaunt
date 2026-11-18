"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { Sheet } from "@/components/ui";
import { patchDetails } from "@/lib/actions";
import { detailLabels, type PrivateDetails } from "@/lib/people";
import { useApp } from "@/lib/store";

const hints: Record<keyof PrivateDetails, string> = {
  surname: "Your family name",
  company: "Where you work or study",
  area: "Your neighbourhood, never a full address",
  instagram: "@yourhandle",
};

const clean = (value: string) => value.replace(/[<>]/g, "").trim().slice(0, 60);

/** Edit form for private details. Mount only while open, so the draft starts from what's saved. */
function EditDetails({ details, onClose }: { details: PrivateDetails; onClose: () => void }) {
  const [draft, setDraft] = useState(details);
  const [error, setError] = useState("");

  function save() {
    const next = Object.fromEntries(detailLabels.map(({ key }) => [key, clean(draft[key])])) as PrivateDetails;
    if (next.instagram && !/^@?[A-Za-z0-9._]{1,30}$/.test(next.instagram)) return setError("Instagram handles use letters, numbers, dots and underscores only.");
    if (next.instagram && !next.instagram.startsWith("@")) next.instagram = `@${next.instagram}`;
    patchDetails(next);
    onClose();
  }

  return (
    <Sheet open onClose={onClose} title="Private details">
      <form
        noValidate
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <p className="text-sm text-muted">All optional. Only people you’ve connected with can see them.</p>
        {detailLabels.map(({ key, label }) => (
          <div key={key}>
            <label htmlFor={`detail-${key}`} className="text-sm font-semibold">
              {label}
            </label>
            <input
              id={`detail-${key}`}
              value={draft[key]}
              maxLength={60}
              placeholder={hints[key]}
              autoComplete="off"
              onChange={(event) => setDraft({ ...draft, [key]: event.target.value })}
              className="field mt-2"
            />
          </div>
        ))}
        <p role="alert" className="min-h-5 text-sm font-semibold text-danger">
          {error}
        </p>
        <button type="submit" className="btn btn-primary w-full">
          Save
        </button>
      </form>
    </Sheet>
  );
}

/** The member's own private details, with who can see them spelled out. */
export function DetailsEditor() {
  const { me } = useApp();
  const [editing, setEditing] = useState(false);

  return (
    <section className="card p-5" aria-labelledby="details-heading">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="details-heading" className="flex items-center gap-2 font-display text-2xl">
            <Icon name="lock" className="size-5 text-forest" />
            Private details
          </h2>
          <p className="mt-1 text-xs text-muted">Hidden from everyone until you accept their request, or they accept yours.</p>
        </div>
        <button type="button" className="btn btn-line btn-sm" onClick={() => setEditing(true)}>
          Edit
        </button>
      </div>
      <dl className="mt-3 divide-y divide-line text-sm">
        {detailLabels.map(({ key, label }) => (
          <div key={key} className="flex justify-between gap-4 py-2">
            <dt className="text-muted">{label}</dt>
            <dd className="text-right font-semibold">{me.details[key] || <span className="font-normal text-muted">Not added</span>}</dd>
          </div>
        ))}
      </dl>
      {editing ? <EditDetails details={me.details} onClose={() => setEditing(false)} /> : null}
    </section>
  );
}
