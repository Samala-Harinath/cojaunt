"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { OwnPhoto } from "@/components/photo";
import { addPhoto, makeMainPhoto, removePhoto } from "@/lib/actions";
import { MAX_PHOTOS, photoAccept, preparePhoto } from "@/lib/photos";
import { useApp } from "@/lib/store";

/**
 * Add, reorder and remove the member's photos. Others see exactly as many photos as are added here.
 * Every file goes through preparePhoto, which checks it and strips location data before it is stored.
 */
export function PhotoManager() {
  const { me } = useApp();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const room = MAX_PHOTOS - me.photos.length;

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError("");
    for (const file of Array.from(files).slice(0, room)) {
      try {
        const problem = addPhoto(await preparePhoto(file));
        if (problem) {
          setError(problem);
          break;
        }
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "That photo couldn’t be used.");
        break;
      }
    }
    if (files.length > room) setError(`Only ${MAX_PHOTOS} photos fit. The extra ones were skipped.`);
    if (input.current) input.current.value = "";
    setBusy(false);
  }

  return (
    <section className="card p-5" aria-labelledby="photos-heading">
      <h2 id="photos-heading" className="font-display text-2xl">
        Your photos
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-muted">

        1 to {MAX_PHOTOS}. At least one photo is required, so your last photo can’t be removed (replace it by adding another first). The first one is your main photo. Location data is removed before it’s saved.
      </p>

      <ul className="mt-4 grid grid-cols-3 gap-2">
        {me.photos.map((src, i) => (
          <li key={`${i}-${src.length}`} className="relative">
            <OwnPhoto src={src} alt={`Your photo ${i + 1}`} className="aspect-[4/5] rounded-2xl" />
            {i === 0 ? <span className="tag absolute left-1.5 top-1.5 bg-ink text-paper">Main</span> : null}
            <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between">
              {i > 0 ? (
                <button type="button" onClick={() => makeMainPhoto(i)} className="rounded-full bg-surface/95 px-2 py-1 text-[0.6875rem] font-bold shadow">
                  Make main
                </button>
              ) : (
                <span />
              )}
              {me.photos.length > 1 ? (
                <button type="button" onClick={() => removePhoto(i)} aria-label={`Remove photo ${i + 1}`} className="grid size-7 place-items-center rounded-full bg-surface/95 shadow">
                  <Icon name="trash" className="size-4" />
                </button>
              ) : null}
            </div>
          </li>
        ))}
        {room > 0 ? (
          <li>
            <button
              type="button"
              onClick={() => input.current?.click()}
              disabled={busy}
              className="grid aspect-[4/5] w-full place-items-center rounded-2xl border-2 border-dashed border-line text-sm font-semibold text-muted hover:border-forest hover:text-forest disabled:opacity-50"
            >
              <span className="flex flex-col items-center gap-1">
                <Icon name={busy ? "clock" : "plus"} />
                {busy ? "Adding…" : "Add photo"}
              </span>
            </button>
          </li>
        ) : null}
      </ul>

      <input ref={input} type="file" accept={photoAccept} multiple className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(event) => onFiles(event.target.files)} />

      <p role="alert" className="mt-2 min-h-5 text-sm font-semibold text-danger">
        {error}
      </p>
      <p className="text-xs leading-relaxed text-muted">
        Clear photos of you only. No children, no nudity, nothing that shows your home address or car number plate.
      </p>
    </section>
  );
}
