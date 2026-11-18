/**
 * Light and dark theme.
 *
 * The choice lives in localStorage. With no saved choice the OS setting is used. An inline script
 * in the root layout applies it before first paint (see Next's "preventing flash before hydration"
 * guide), so there is no flash of the wrong theme and no hydration mismatch.
 * This module has no "use client" so the server layout can import the script string.
 */
export type Theme = "light" | "dark";

export const THEME_KEY = "cojaunt:theme";

/** Browser-chrome colour per theme. Matches --color-paper in globals.css. */
export const themeColors: Record<Theme, string> = { light: "#faf6ef", dark: "#0f1613" };

export const themeScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_KEY)});if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export function storedTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => meta.setAttribute("content", themeColors[theme]));
}

/** An explicit choice from the toggle. Saved, so it wins over the OS setting from now on. */
export function setTheme(theme: Theme) {
  applyTheme(theme);
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage blocked: the theme still applies for this visit.
  }
}
