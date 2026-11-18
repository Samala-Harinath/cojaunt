"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { OwnPhoto } from "@/components/photo";
import { Proto } from "@/components/ui";
import { MAX_PHOTOS, photoAccept, preparePhoto } from "@/lib/photos";
import { Shell, type StepProps } from "./shell";

/**
 * Photos and the selfie check. At least one photo is required: a profile without a photo can't
 * continue, so every member others see has a real picture. The selfie check is simulated.
 */
export function Identity({ me, set, onNext }: StepProps) {
  const [checking, setChecking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);

  function submit() {
    if (me.photos.length === 0) return setError("Add at least one photo of yourself to continue.");
    if (!me.selfieVerified) return setError("Run the selfie check to continue.");
    setError("");
    onNext();
  }

  async function onFiles(files: FileList | null) {
    if (!files) return;
    setBusy(true);
    setPhotoError("");
    const added: string[] = [];
    for (const file of Array.from(files).slice(0, MAX_PHOTOS - me.photos.length)) {
      try {
        added.push(await preparePhoto(file));
      } catch (caught) {
        setPhotoError(caught instanceof Error ? caught.message : "That photo couldn’t be used.");
      }
    }
    if (added.length > 0) {
      set({ photos: [...me.photos, ...added] });
      setError("");
    }
    if (input.current) input.current.value = "";
    setBusy(false);
  }

  function runCheck() {
    setChecking(true);
    setTimeout(() => {
      set({ selfieVerified: true });
      setChecking(false);
    }, 1200);
  }

  return (
    <Shell title="Show you’re real" lead="Everyone here is a verified person with a real photo. That’s the whole point." onNext={submit} error={error}>
      <section className="card p-4" aria-labelledby="photo-heading">
        <h2 id="photo-heading" className="flex flex-wrap items-center gap-2 text-sm font-bold">
          Your photos
          <span className="tag bg-spark-soft text-spark">Required</span>
          <span className="font-normal text-muted">1 to {MAX_PHOTOS}</span>
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Add at least one clear photo of your face. People see as many photos as you add. Location data is removed from each one.
        </p>
        <ul className="mt-3 grid grid-cols-3 gap-2">
          {me.photos.map((src, i) => (
            <li key={`${i}-${src.length}`} className="relative">
              <OwnPhoto src={src} alt={`Your photo ${i + 1}`} className="aspect-[4/5] rounded-2xl" />
              <button
                type="button"
                aria-label={`Remove photo ${i + 1}`}
                onClick={() => set({ photos: me.photos.filter((_, index) => index !== i) })}
                className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-surface/95 shadow"
              >
                <Icon name="x" className="size-4" />
              </button>
            </li>
          ))}
          {me.photos.length < MAX_PHOTOS ? (
            <li>
              <button
                type="button"
                disabled={busy}
                onClick={() => input.current?.click()}
                className="grid aspect-[4/5] w-full place-items-center rounded-2xl border-2 border-dashed border-line text-sm font-semibold text-muted hover:border-forest hover:text-forest disabled:opacity-50"
              >
                <span className="flex flex-col items-center gap-1">
                  <Icon name={busy ? "clock" : "plus"} />
                  {busy ? "Adding…" : "Add"}
                </span>
              </button>
            </li>
          ) : null}
        </ul>
        <input ref={input} type="file" accept={photoAccept} multiple className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(event) => onFiles(event.target.files)} />
        <p role="alert" className="mt-2 min-h-5 text-sm font-semibold text-danger">
          {photoError}
        </p>
      </section>

      <section className="card p-4" aria-labelledby="selfie-heading">
        <h2 id="selfie-heading" className="flex items-center gap-2 text-sm font-bold">
          <Icon name="camera" className="size-5 text-forest" />
          Selfie check
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          A short selfie video proves a real person is behind the profile and that your photos are of you. Every member does this before they can request a seat.
        </p>
        {me.selfieVerified ? (
          <p className="mt-3 flex items-center gap-2 text-sm font-bold text-forest">
            <Icon name="shieldCheck" />
            Selfie verified
          </p>
        ) : (
          <button type="button" className="btn btn-soft mt-3 w-full" onClick={runCheck} disabled={checking}>
            {checking ? "Checking…" : "Run selfie check (simulated)"}
          </button>
        )}
        <div className="mt-3">
          <Proto>No camera is used and nothing is recorded. The real check runs through a licensed verification partner.</Proto>
        </div>
      </section>
    </Shell>
  );
}
