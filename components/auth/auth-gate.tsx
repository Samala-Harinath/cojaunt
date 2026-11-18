"use client";

import { useEffect, useState, type ReactNode } from "react";
import { accountExists, fetchSession, isProfileDone, onAuthChange, signOut } from "@/lib/auth/client";
import { getOwner, setOwner } from "@/lib/store";

/**
 * Wraps every signed-in screen. The proxy has already refused anyone without a valid session cookie;
 * this adds what only the browser knows:
 *  - loads the signed-in member's saved data (and never anyone else's),
 *  - sends a member who hasn't finished sign-up to /welcome,
 *  - checks again when the tab comes back, when another tab signs out, or when the browser restores
 *    the page from its back-forward cache, so a signed-out screen can't be viewed by pressing Back.
 * Nothing private renders until the check passes.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    let checkedAt = 0;

    async function verify() {
      const user = await fetchSession();
      if (!alive) return;
      checkedAt = Date.now();

      if (!user) {
        setOwner(null);
        const here = window.location.pathname + window.location.search;
        window.location.replace(`/login?next=${encodeURIComponent(here)}`);
        return;
      }
      // PROTOTYPE: accounts live in this browser. A session for an account that isn't here is stale, so end it.
      if (!accountExists(user.id)) return void signOut("/login");
      if (getOwner() !== user.id) setOwner(user.id);

      const path = window.location.pathname;
      const done = user.kind === "demo" || isProfileDone(user.id);
      if (!done && path !== "/welcome") return void window.location.replace("/welcome");
      if (done && path === "/welcome") return void window.location.replace("/discover");
      setReady(true);
    }

    verify();

    const stop = onAuthChange(verify);
    const onShow = (event: PageTransitionEvent) => {
      if (event.persisted) verify();
    };
    const onVisible = () => {
      // Re-check when the tab comes back after a while, so an expired session is noticed.
      if (document.visibilityState === "visible" && Date.now() - checkedAt > 5 * 60 * 1000) verify();
    };
    window.addEventListener("pageshow", onShow);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive = false;
      stop();
      window.removeEventListener("pageshow", onShow);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  if (!ready) {
    return (
      <div className="grid min-h-dvh place-items-center" aria-busy="true" aria-label="Loading">
        <span className="size-8 animate-spin rounded-full border-2 border-line border-t-forest" />
      </div>
    );
  }
  return <>{children}</>;
}
