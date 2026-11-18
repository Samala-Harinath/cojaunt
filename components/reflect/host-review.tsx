"use client";

import { Icon } from "@/components/icon";

type Props = { host: string; stars: number; onStars: (next: number) => void; text: string; onText: (next: string) => void };

/** The public half of reflection: a rating and a few words about the host. */
export function HostReview({ host, stars, onStars, text, onText }: Props) {
  return (
    <section className="card p-5" aria-labelledby="review-heading">
      <h2 id="review-heading" className="font-display text-2xl">
        How was {host} as a host?
      </h2>
      <p className="mt-1 text-xs text-muted">Public. Shown on {host}’s profile with your first name.</p>

      <div className="mt-3 flex gap-1" role="group" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onStars(value)}
            aria-pressed={stars === value}
            aria-label={`${value} out of 5`}
            className={`grid size-11 place-items-center rounded-full ${value <= stars ? "text-marigold" : "text-line"}`}
          >
            <Icon name="star" filled className="size-8" />
          </button>
        ))}
      </div>

      <label htmlFor="review" className="sr-only">
        Your review
      </label>
      <textarea
        id="review"
        value={text}
        onChange={(event) => onText(event.target.value)}
        rows={3}
        maxLength={300}
        placeholder="What made the plan work, or what would have made it better?"
        className="field mt-3 resize-none"
      />
    </section>
  );
}
