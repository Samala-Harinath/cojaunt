import type { NextRequest } from "next/server";
import { allow, clientIp } from "@/lib/auth/rate-limit";
import { REMEMBER_SECONDS, SESSION_COOKIE, SHORT_SECONDS, authConfigured, cookieOptions, readSession, signSession } from "@/lib/auth/session-token";

/**
 * The session endpoint: GET reads it, POST starts it, DELETE ends it.
 *
 * BACKEND SEAM: this is the one place that turns "this person signed in" into a cookie. Today the
 * browser vouches for the sign-in (there is no server-side user database yet), so anyone who calls
 * POST gets a session. Replace POST with the backend's real sign-in endpoint, which checks the
 * password or one-time code on the server, before any real member data exists.
 */
const noStore = { "Cache-Control": "no-store, max-age=0", Vary: "Cookie" };

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: noStore });
}

/** Rejects cross-site requests. Browsers always send Sec-Fetch-Site or Origin on a cross-site POST. */
function sameOrigin(request: NextRequest): boolean {
  const site = request.headers.get("sec-fetch-site");
  if (site) return site === "same-origin" || site === "none";
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const session = await readSession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session) return json({ user: null }, 401);
  return json({ user: { id: session.sub, kind: session.kind, expiresAt: session.exp * 1000 } });
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return json({ error: "Request blocked." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return json({ error: "Send JSON." }, 415);
  if (!authConfigured()) return json({ error: "Sign-in isn’t available right now." }, 503);
  if (!allow(`session:${clientIp(request.headers)}`, 30, 10 * 60 * 1000)) return json({ error: "Too many attempts. Try again in a few minutes." }, 429);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Bad request." }, 400);
  }
  const { sub, kind, remember } = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  if (typeof sub !== "string" || !/^[A-Za-z0-9_-]{4,64}$/.test(sub)) return json({ error: "Bad request." }, 400);
  if (kind !== "member" && kind !== "demo") return json({ error: "Bad request." }, 400);
  if (kind === "demo" && process.env.NEXT_PUBLIC_DEMO_MODE === "off") return json({ error: "The demo is turned off." }, 403);

  const seconds = remember === true ? REMEMBER_SECONDS : SHORT_SECONDS;
  const token = await signSession({ sub, kind, seconds });
  if (!token) return json({ error: "Sign-in isn’t available right now." }, 503);

  const response = json({ user: { id: sub, kind } });
  // "Keep me signed in" sets a lifetime; without it the cookie is dropped when the browser closes.
  response.headers.append("Set-Cookie", serialize(token, remember === true ? seconds : undefined));
  return response;
}

export async function DELETE(request: NextRequest) {
  if (!sameOrigin(request)) return json({ error: "Request blocked." }, 403);
  const response = json({ ok: true });
  response.headers.append("Set-Cookie", serialize("", 0));
  return response;
}

function serialize(value: string, maxAge?: number): string {
  const options = cookieOptions(maxAge);
  const parts = [`${SESSION_COOKIE}=${value}`, `Path=${options.path}`, "HttpOnly", "SameSite=Lax"];
  if (options.secure) parts.push("Secure");
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  return parts.join("; ");
}
