"use client";

import { Icon } from "@/components/icon";
import { castVote } from "@/lib/actions";
import type { Poll } from "@/lib/social";
import { useApp } from "@/lib/store";

export function PollCard({ threadId, poll }: { threadId: string; poll: Poll }) {
  const { votes } = useApp();
  const mine = votes[threadId];
  const counts = poll.votes.map((count, i) => count + (mine === i ? 1 : 0));
  const total = counts.reduce((sum, count) => sum + count, 0);

  return (
    <section className="card p-4" aria-label={`Poll: ${poll.question}`}>
      <p className="eyebrow flex items-center gap-1.5">
        <Icon name="poll" className="size-3.5" />
        Poll
      </p>
      <p className="mt-1 font-semibold">{poll.question}</p>
      <div className="mt-3 space-y-2">
        {poll.options.map((option, i) => (
          <button
            key={option}
            type="button"
            onClick={() => castVote(threadId, i)}
            aria-pressed={mine === i}
            className="relative block w-full overflow-hidden rounded-xl border border-line px-3.5 py-2.5 text-left text-sm aria-pressed:border-forest"
          >
            <span className="absolute inset-y-0 left-0 bg-forest-soft transition-[width] duration-300" style={{ width: `${total ? (counts[i] / total) * 100 : 0}%` }} aria-hidden="true" />
            <span className="relative flex items-center justify-between gap-3">
              <span className="font-semibold">{option}</span>
              <span className="text-xs text-muted">
                {counts[i]} {counts[i] === 1 ? "vote" : "votes"}
              </span>
            </span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">{mine === undefined ? "Tap an option to vote." : "You can change your vote."}</p>
    </section>
  );
}
