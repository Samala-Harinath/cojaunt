"use client";

import { useState } from "react";
import { startDemo } from "@/lib/auth/client";
import { hardNavigate } from "@/lib/auth/navigate";

/** Opens the app as a sample member, for looking around. Hidden in a real launch with NEXT_PUBLIC_DEMO_MODE=off. */
export function DemoButton({ className = "btn btn-soft", label = "Explore the demo" }: { className?: string; label?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function open() {
    setBusy(true);
    setError("");
    const result = await startDemo();
    if (!result.ok) {
      setBusy(false);
      setError(result.error);
      return;
    }
    hardNavigate("/discover");
  }

  return (
    <>
      <button type="button" className={className} onClick={open} disabled={busy}>
        {busy ? "Opening…" : label}
      </button>
      {error ? (
        <span role="alert" className="mt-2 block text-xs font-semibold text-danger">
          {error}
        </span>
      ) : null}
    </>
  );
}
