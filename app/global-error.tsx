"use client";

/** The last line of defence: replaces the whole page if the root layout itself fails. Needs its own <html>. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#faf6ef", color: "#17241f" }}>
        <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: "1.25rem", textAlign: "center" }}>
          <div style={{ maxWidth: "26rem" }}>
            <h1 style={{ fontSize: "2rem", margin: 0 }}>Something went wrong</h1>
            <p style={{ color: "#5d6a63" }}>Please try again in a moment.</p>
            <button
              type="button"
              onClick={reset}
              style={{ marginTop: "1rem", padding: "0.75rem 1.5rem", border: 0, borderRadius: "999px", background: "#1f4d3f", color: "#fff", fontWeight: 600, cursor: "pointer" }}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
