/**
 * The session cookie: a signed, expiring token set by the server only (httpOnly, so page scripts can't read it).
 * Used by proxy.ts and /api/auth/session. Runs on the server and uses Web Crypto only.
 *
 * Token shape:  v1.<base64url JSON payload>.<base64url HMAC-SHA256 signature>
 *
 * BACKEND SEAM: when the real backend issues sessions, keep the cookie name and the checks in
 * proxy.ts, and swap `readSession` for a verification of the backend's own token.
 */
export const SESSION_COOKIE = process.env.NODE_ENV === "production" ? "__Host-cojaunt_session" : "cojaunt_session";

export type SessionKind = "member" | "demo";
export type Session = { sub: string; kind: SessionKind; iat: number; exp: number };

/** "Keep me signed in" lasts 30 days. Otherwise the cookie dies with the browser and the token lasts 12 hours. */
export const REMEMBER_SECONDS = 60 * 60 * 24 * 30;
export const SHORT_SECONDS = 60 * 60 * 12;

const encoder = new TextEncoder();

/** In production a missing or short secret makes every session invalid (fail closed). */
function secret(): string | null {
  const value = process.env.AUTH_SECRET;
  if (value && value.length >= 32) return value;
  return process.env.NODE_ENV === "production" ? null : "development-only-secret-do-not-use-in-production";
}

export function authConfigured(): boolean {
  return secret() !== null;
}

function toBase64Url(bytes: Uint8Array): string {
  let text = "";
  for (const byte of bytes) text += String.fromCharCode(byte);
  return btoa(text).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> | null {
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
    const text = atob(padded);
    const bytes = new Uint8Array(text.length);
    for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

async function hmacKey(): Promise<CryptoKey | null> {
  const value = secret();
  if (!value) return null;
  return crypto.subtle.importKey("raw", encoder.encode(value), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function signSession(input: { sub: string; kind: SessionKind; seconds: number }): Promise<string | null> {
  const key = await hmacKey();
  if (!key) return null;
  const now = Math.floor(Date.now() / 1000);
  const session: Session = { sub: input.sub, kind: input.kind, iat: now, exp: now + input.seconds };
  const body = toBase64Url(encoder.encode(JSON.stringify(session)));
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(`v1.${body}`)));
  return `v1.${body}.${toBase64Url(signature)}`;
}

/** The session in a cookie value, or null when it's missing, tampered with, or expired. */
export async function readSession(token: string | undefined): Promise<Session | null> {
  if (!token || token.length > 1024) return null;
  const [version, body, signature, extra] = token.split(".");
  if (version !== "v1" || !body || !signature || extra !== undefined) return null;
  const key = await hmacKey();
  const given = fromBase64Url(signature);
  const payload = fromBase64Url(body);
  if (!key || !given || !payload) return null;
  // verify() compares in constant time.
  const genuine = await crypto.subtle.verify("HMAC", key, given, encoder.encode(`v1.${body}`));
  if (!genuine) return null;
  try {
    const data: unknown = JSON.parse(new TextDecoder().decode(payload));
    if (typeof data !== "object" || data === null) return null;
    const { sub, kind, iat, exp } = data as Record<string, unknown>;
    if (typeof sub !== "string" || (kind !== "member" && kind !== "demo")) return null;
    if (typeof iat !== "number" || typeof exp !== "number") return null;
    if (exp <= Math.floor(Date.now() / 1000)) return null;
    return { sub, kind, iat, exp };
  } catch {
    return null;
  }
}

export function cookieOptions(maxAge?: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    ...(maxAge === undefined ? {} : { maxAge }),
  };
}
