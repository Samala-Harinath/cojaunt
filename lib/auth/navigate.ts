/**
 * A full page load, not a client-side route change. After signing in or out the browser must
 * ask the server again so the proxy sees the new (or removed) session cookie, and so nothing
 * from the previous member stays in memory or in the router cache.
 */
export function hardNavigate(path: string): void {
  window.location.assign(path);
}
