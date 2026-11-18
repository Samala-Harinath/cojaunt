"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import type { Person } from "@/lib/people";
import { isSafePhoto } from "@/lib/photos";
import { Icon } from "./icon";

/**
 * One of a mock member's photos. The prototype ships no pictures of real people,
 * so each "photo" is an illustrated portrait that varies with its position in the set.
 */
export function PersonPhoto({ person, index = 0, className = "" }: { person: Pick<Person, "name" | "hue">; index?: number; className?: string }) {
  const hue = (person.hue + index * 47) % 360;
  const shift = (index % 3) * 18;
  return (
    <svg viewBox="0 0 160 200" preserveAspectRatio="xMidYMid slice" className={`block ${className}`} aria-hidden="true">
      <rect width="160" height="200" fill={`hsl(${hue} 70% 84%)`} />
      <circle cx={30 + shift * 4} cy={36} r={46} fill={`hsl(${(hue + 40) % 360} 75% 76%)`} opacity="0.7" />
      <circle cx={80} cy={86 - shift / 3} r={30} fill={`hsl(${hue} 40% 34%)`} opacity="0.85" />
      <path d={`M${22 - shift / 2} 200c0-44 26-66 58-66s58 22 58 66z`} fill={`hsl(${hue} 40% 34%)`} opacity="0.85" />
      <text x="80" y="96" textAnchor="middle" fontSize="26" fontWeight="700" fill={`hsl(${hue} 75% 92%)`}>
        {person.name.charAt(0)}
      </text>
    </svg>
  );
}

/** A photo the member uploaded. Only re-encoded JPEGs (lib/photos.ts) are ever rendered. */
export function OwnPhoto({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  if (!isSafePhoto(src)) return null;
  return (
    <span className={`relative block overflow-hidden ${className}`}>
      <Image src={src} alt={alt} fill unoptimized sizes="(min-width: 768px) 32rem, 100vw" className="object-cover" />
    </span>
  );
}

/** Swipe-free photo gallery: one big photo, arrows, a counter and thumbnails. Shows exactly as many photos as there are. */
export function Gallery({ name, slides }: { name: string; slides: ReactNode[] }) {
  const [at, setAt] = useState(0);
  const count = slides.length;
  const index = Math.min(at, Math.max(0, count - 1));

  if (count === 0) {
    return (
      <div className="grid aspect-[4/5] w-full place-items-center rounded-3xl bg-line text-sm text-muted">
        <span className="flex items-center gap-2">
          <Icon name="camera" />
          No photos yet
        </span>
      </div>
    );
  }

  return (
    <section aria-roledescription="carousel" aria-label={`Photos of ${name}`}>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-line">
        <div aria-live="polite" className="size-full [&>*]:size-full">
          {slides[index]}
        </div>
        <span className="absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-bold text-white tabular-nums">
          {index + 1} / {count}
        </span>
        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => setAt((index - 1 + count) % count)}
              className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-surface/90 shadow"
            >
              <Icon name="left" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => setAt((index + 1) % count)}
              className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-surface/90 shadow"
            >
              <Icon name="right" />
            </button>
          </>
        ) : null}
      </div>
      {count > 1 ? (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {slides.map((slide, i) => (
            <li key={i} className="shrink-0">
              <button
                type="button"
                aria-label={`Photo ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => setAt(i)}
                className="block size-14 overflow-hidden rounded-xl opacity-60 ring-offset-2 ring-offset-paper transition aria-[current=true]:opacity-100 aria-[current=true]:ring-2 aria-[current=true]:ring-ink [&>*]:size-full"
              >
                {slide}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
