"use client";

import { useState, type ReactNode } from "react";
import { signOut } from "@/lib/auth/client";

/** Ends the session on this device and returns to the sign-in page. */
export function SignOutButton({ className = "btn btn-line", children = "Sign out", to }: { className?: string; children?: ReactNode; to?: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className={className}
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void signOut(to);
      }}
    >
      {busy ? "Signing out…" : children}
    </button>
  );
}
