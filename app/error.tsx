"use client";

import Link from "next/link";

/** Shown when a screen crashes. The error itself is never shown to the member. */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-5 text-center">
      <h1 className="font-display text-4xl">Something went wrong</h1>
      <p className="mt-3 text-muted">That’s on us, not you. Try again, and if it keeps happening, let us know.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <button type="button" className="btn btn-primary" onClick={reset}>
          Try again
        </button>
        <Link href="/" className="btn btn-line">
          Go home
        </Link>
      </div>
    </main>
  );
}
