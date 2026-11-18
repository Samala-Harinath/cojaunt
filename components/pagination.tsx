"use client";

import { useState } from "react";
import { Icon } from "./icon";

/** Lists longer than this are split into pages. */
export const PAGE_SIZE = 10;

/**
 * Slices a list into pages of PAGE_SIZE. Pass a `resetKey` that changes with the filters,
 * so changing a filter starts again from page 1.
 */
export function usePaged<T>(items: T[], resetKey: string) {
  const [at, setAt] = useState({ key: resetKey, page: 1 });
  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const page = Math.min(at.key === resetKey ? at.page : 1, pages);
  return {
    page,
    pages,
    total: items.length,
    items: items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    setPage: (next: number) => setAt({ key: resetKey, page: next }),
  };
}

type PagerProps = { page: number; pages: number; total: number; onPage: (next: number) => void; label: string };

/** Page buttons. Renders nothing until there is more than one page of data. */
export function Pager({ page, pages, total, onPage, label }: PagerProps) {
  if (total <= PAGE_SIZE) return null;

  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(total, page * PAGE_SIZE);
  const go = (next: number) => {
    onPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // First, last and the pages next to the current one. Gaps become an ellipsis.
  const shown = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1);
  const items: (number | "gap")[] = [];
  shown.forEach((n, i) => {
    if (i > 0 && n - shown[i - 1] > 1) items.push("gap");
    items.push(n);
  });

  return (
    <nav aria-label={label} className="flex flex-col items-center gap-3 pt-2">
      <p className="text-xs text-muted">
        Showing {from}–{to} of {total}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button type="button" className="btn btn-line btn-sm" disabled={page <= 1} onClick={() => go(page - 1)}>
          <Icon name="left" className="size-4" />
          Previous
        </button>
        {items.map((item, i) =>
          item === "gap" ? (
            <span key={`gap-${i}`} className="px-1 text-muted" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              className={`chip min-w-10 justify-center ${item === page ? "border-ink bg-ink text-paper" : ""}`}
              onClick={() => go(item)}
            >
              {item}
            </button>
          ),
        )}
        <button type="button" className="btn btn-line btn-sm" disabled={page >= pages} onClick={() => go(page + 1)}>
          Next
          <Icon name="right" className="size-4" />
        </button>
      </div>
    </nav>
  );
}
