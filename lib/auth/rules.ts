/**
 * Pure rules for sign-in and registration. No browser or server APIs, so the proxy, the API route
 * and the forms all use the same checks. A backend must repeat every one of these.
 */

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;

/** Pages anyone can open without signing in. Everything else needs a session (deny by default). */
const publicExact = new Set(["/", "/login", "/register", "/forgot-password", "/privacy", "/terms", "/cookies", "/community-guidelines", "/refunds", "/grievance", "/contact"]);

/** Sign-in pages: a signed-in member is sent on to the app instead of seeing them. */
const authExact = new Set(["/login", "/register", "/forgot-password"]);

/** The session endpoint decides for itself, so the proxy lets it through. */
const publicApi = new Set(["/api/auth/session"]);

export function isAuthPage(pathname: string): boolean {
  return authExact.has(trimSlash(pathname));
}

export function isPublicPath(pathname: string): boolean {
  const path = trimSlash(pathname);
  return publicExact.has(path) || publicApi.has(path);
}

function trimSlash(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

/**
 * Where to go after signing in. Only same-site paths are accepted, so a crafted
 * /login?next=https://evil.example link can never send a member to another site.
 */
export function safeNext(raw: string | null | undefined, fallback = "/discover"): string {
  if (typeof raw !== "string" || raw.length === 0 || raw.length > 512) return fallback;
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return fallback;
  if (/[\u0000-\u001f\u007f\\]/.test(raw)) return fallback;
  // Encoded control characters, backslashes and slashes can be decoded into the tricks above later on.
  if (/%(?:[01][0-9a-f]|7f|5c|2f)/i.test(raw.split("?")[0] ?? raw)) return fallback;
  try {
    const url = new URL(raw, "http://cojaunt.invalid");
    if (url.origin !== "http://cojaunt.invalid") return fallback;
    if (isAuthPage(url.pathname) || url.pathname === "/") return fallback;
    return url.pathname + url.search + url.hash;
  } catch {
    return fallback;
  }
}

export const normalizeEmail = (value: string): string => value.trim().toLowerCase();

export function validEmail(value: string): boolean {
  const email = normalizeEmail(value);
  return email.length <= 254 && /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i.test(email);
}

/** The 10-digit Indian mobile number, or null when the input isn't one. Accepts +91, 91 and 0 prefixes. */
export function normalizePhone(value: string): string | null {
  let digits = value.replace(/[\s\-().]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export type Identifier = { kind: "email"; value: string } | { kind: "phone"; value: string };

/** Sign-in accepts either an email address or a mobile number. */
export function parseIdentifier(raw: string): Identifier | null {
  const text = raw.trim();
  if (text.includes("@")) return validEmail(text) ? { kind: "email", value: normalizeEmail(text) } : null;
  const phone = normalizePhone(text);
  return phone ? { kind: "phone", value: phone } : null;
}

const common = new Set(
  [
    "password", "password1", "password123", "passw0rd", "12345678", "123456789", "1234567890", "qwerty123", "qwertyuiop", "iloveyou", "welcome1", "welcome123",
    "admin123", "letmein1", "abc12345", "11111111", "00000000", "987654321", "india123", "india@123", "cojaunt1", "cojaunt123", "travel123", "monkey123", "dragon123",
    "football1", "sunshine1", "princess1", "whatever1", "trustno1",
  ].map((word) => word.toLowerCase()),
);

/** The reason a password can't be used, or an empty string when it's fine. */
export function passwordProblem(password: string, personal: string[] = []): string {
  if (password.length < PASSWORD_MIN) return `Use at least ${PASSWORD_MIN} characters.`;
  if (password.length > PASSWORD_MAX) return `Use at most ${PASSWORD_MAX} characters.`;
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "Include at least one letter and one number.";
  const lower = password.toLowerCase();
  if (common.has(lower)) return "That password is too common. Choose something harder to guess.";
  if (/^(.)\1+$/.test(password)) return "Don’t repeat one character.";
  for (const item of personal) {
    const bit = item.toLowerCase().trim();
    if (bit.length >= 4 && lower.includes(bit)) return "Don’t include your email or mobile number in your password.";
  }
  return "";
}

/** 0 (weak) to 4 (strong). Length matters most; mixing character types helps a little. */
export function passwordScore(password: string): 0 | 1 | 2 | 3 | 4 {
  if (!password) return 0;
  let score = 0;
  if (password.length >= PASSWORD_MIN) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  const kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((rule) => rule.test(password)).length;
  if (kinds >= 3) score += 1;
  if (common.has(password.toLowerCase()) || password.length < PASSWORD_MIN) score = Math.min(score, 1);
  return Math.min(score, 4) as 0 | 1 | 2 | 3 | 4;
}

export function maskEmail(email: string): string {
  const [name = "", domain = ""] = email.split("@");
  if (!domain) return "";
  return `${name.slice(0, 1)}${"•".repeat(Math.max(name.length - 1, 2))}@${domain}`;
}

export function maskPhone(phone: string): string {
  return phone.length === 10 ? `+91 ${"•".repeat(6)}${phone.slice(6)}` : "";
}
