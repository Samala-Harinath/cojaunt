"use client";

/**
 * PROTOTYPE one-time codes. The live app texts a 6-digit code to the member's mobile number and
 * checks it on the server. Here the code is made in the browser and shown on screen, held in memory
 * only (never saved), so the rules around it can be tried: 10-minute expiry, 5 wrong tries,
 * a 30-second wait before resending, and at most 5 codes an hour.
 */
export type Purpose = "signup" | "reset";

type Challenge = { code: string; expires: number; tries: number; sentAt: number; sends: number[] };

const EXPIRES_MS = 10 * 60 * 1000;
const RESEND_MS = 30 * 1000;
const MAX_TRIES = 5;
const MAX_PER_HOUR = 5;

const challenges = new Map<string, Challenge>();

function sixDigits(): string {
  const [value = 0] = crypto.getRandomValues(new Uint32Array(1));
  return String(value % 1_000_000).padStart(6, "0");
}

export type Issued = { ok: true; code: string; resendIn: number } | { ok: false; error: string };

/** Makes a fresh code for this purpose and mobile number. */
export function issueCode(purpose: Purpose, phone: string): Issued {
  const key = `${purpose}:${phone}`;
  const now = Date.now();
  const last = challenges.get(key);
  const sends = (last?.sends ?? []).filter((time) => now - time < 60 * 60 * 1000);
  if (last && now - last.sentAt < RESEND_MS) return { ok: false, error: `Wait ${Math.ceil((RESEND_MS - (now - last.sentAt)) / 1000)} seconds before asking for another code.` };
  if (sends.length >= MAX_PER_HOUR) return { ok: false, error: "Too many codes requested. Try again in an hour." };
  const code = sixDigits();
  challenges.set(key, { code, expires: now + EXPIRES_MS, tries: 0, sentAt: now, sends: [...sends, now] });
  return { ok: true, code, resendIn: RESEND_MS / 1000 };
}

/** Pretends to send a code for a number with no account, so the screen looks the same either way. */
export function decoyCode(): string {
  return sixDigits();
}

export type Checked = "ok" | "wrong" | "expired" | "locked";

export function checkCode(purpose: Purpose, phone: string, given: string): Checked {
  const key = `${purpose}:${phone}`;
  const challenge = challenges.get(key);
  if (!challenge) return "expired";
  if (challenge.expires < Date.now()) {
    challenges.delete(key);
    return "expired";
  }
  if (challenge.tries >= MAX_TRIES) return "locked";
  if (given.length === 6 && given === challenge.code) {
    challenges.delete(key);
    return "ok";
  }
  challenge.tries += 1;
  if (challenge.tries >= MAX_TRIES) {
    challenges.delete(key);
    return "locked";
  }
  return "wrong";
}

export function forgetCode(purpose: Purpose, phone: string): void {
  challenges.delete(`${purpose}:${phone}`);
}
