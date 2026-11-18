"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { applyTheme, setTheme, storedTheme, systemTheme, type Theme } from "@/lib/theme";
import { Icon } from "./icon";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const current = (): Theme => (document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");

/** The theme on <html>. The server renders "light"; the client corrects it right after hydration. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, current, () => "light");
}

/**
 * Mounted once in the root layout. Re-applies the theme after React's dev-mode remount clears the
 * attribute the inline script set, and follows OS changes until the member picks a theme.
 */
export function ThemeSync() {
  useLayoutEffect(() => {
    applyTheme(storedTheme() ?? systemTheme());
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const follow = () => {
      if (!storedTheme()) applyTheme(media.matches ? "dark" : "light");
    };
    media.addEventListener("change", follow);
    return () => media.removeEventListener("change", follow);
  }, []);
  return null;
}

const round = "grid size-10 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink";

export function ThemeToggle({ className = round }: { className?: string }) {
  const theme = useTheme();
  const next: Theme = theme === "dark" ? "light" : "dark";
  return (
    <button type="button" onClick={() => setTheme(next)} aria-label={`Switch to ${next} theme`} title={`Switch to ${next} theme`} className={className}>
      <Icon name={theme === "dark" ? "sun" : "moon"} />
    </button>
  );
}
