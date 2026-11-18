"use client";

import { getOwner, eraseOwnerData, setOwner } from "@/lib/store";
import { legal } from "@/lib/config";
import { findAccount, hashPassword, ITERATIONS, LOCK_MS, MAX_FAILED, newId, newSalt, removeAccount, saveAccount, sameSecret, type Account } from "./accounts";
import { hardNavigate } from "./navigate";
import { checkCode, decoyCode, forgetCode, issueCode } from "./codes";
import { normalizeEmail, normalizePhone, parseIdentifier, passwordProblem, validEmail } from "./rules";

/**
 * The sign-in contract the screens use. Today it is backed by this browser (see accounts.ts and
 * codes.ts) plus the session cookie from /api/auth/session. When the backend exists, keep these
 * function names and result shapes, and make each one call the matching endpoint:
 *
 *   signIn → POST /auth/login          beginSignUp / completeSignUp → POST /auth/register, /auth/verify
 *   beginReset / completeReset → POST /auth/password/forgot, /auth/password/reset
 *   changePassword → POST /me/password    deleteAccount → POST /me/delete    signOut → POST /auth/logout
 */
export type Result<T = void> = { ok: true; data: T } | { ok: false; error: string };
export type AuthUser = { id: string; kind: "member" | "demo"; expiresAt: number };

const ok = <T,>(data: T): Result<T> => ({ ok: true, data });
const fail = (error: string): { ok: false; error: string } => ({ ok: false, error });

const WRONG_LOGIN = "That email, mobile number or password isn’t right.";
const WRONG_CODE = "That code isn’t right, or it has expired.";
const SECURE = "This browser can’t sign you in securely. Open the site over https.";

const secure = () => typeof crypto !== "undefined" && Boolean(crypto.subtle) && typeof crypto.randomUUID === "function";

/* ───────── session cookie (server) ───────── */

async function startSession(sub: string, kind: "member" | "demo", remember: boolean): Promise<string | null> {
  try {
    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ sub, kind, remember }),
    });
    if (response.ok) return null;
    const body: unknown = await response.json().catch(() => null);
    const message = typeof body === "object" && body !== null && "error" in body ? String((body as { error: unknown }).error) : "";
    return message || "We couldn’t sign you in. Please try again.";
  } catch {
    return "We couldn’t reach the server. Check your connection and try again.";
  }
}

async function endSession(): Promise<void> {
  try {
    await fetch("/api/auth/session", { method: "DELETE", credentials: "same-origin" });
  } catch {
    // Offline: the cookie expires on its own, and the local data is cleared below either way.
  }
}

/** Who the server thinks is signed in, or null. */
export async function fetchSession(): Promise<AuthUser | null> {
  try {
    const response = await fetch("/api/auth/session", { cache: "no-store", credentials: "same-origin" });
    if (!response.ok) return null;
    const body = (await response.json()) as { user?: AuthUser | null };
    return body.user ?? null;
  } catch {
    return null;
  }
}

/* ───────── tabs stay in step ───────── */

const channelName = "cojaunt:auth";

function broadcast() {
  if (typeof BroadcastChannel === "undefined") return;
  const channel = new BroadcastChannel(channelName);
  channel.postMessage("changed");
  channel.close();
}

/** Calls back when another tab signs in or out. */
export function onAuthChange(callback: () => void): () => void {
  if (typeof BroadcastChannel === "undefined") return () => {};
  const channel = new BroadcastChannel(channelName);
  channel.onmessage = callback;
  return () => channel.close();
}

/* ───────── sign in ───────── */

/** A hash we never use. Unknown accounts still pay the hashing time, so timing doesn't reveal who exists. */
async function burn(password: string) {
  await hashPassword(password, "AAAAAAAAAAAAAAAAAAAAAA==", ITERATIONS);
}

export async function signIn(input: { identifier: string; password: string; remember: boolean }): Promise<Result<{ profileDone: boolean }>> {
  if (!secure()) return fail(SECURE);
  const id = parseIdentifier(input.identifier);
  if (!id || !input.password) return fail(WRONG_LOGIN);

  const account = findAccount(id.kind === "email" ? { email: id.value } : { phone: id.value });
  if (!account) {
    await burn(input.password);
    return fail(WRONG_LOGIN);
  }
  if (account.lockedUntil > Date.now()) {
    const minutes = Math.ceil((account.lockedUntil - Date.now()) / 60000);
    return fail(`Too many wrong attempts. Try again in ${minutes} ${minutes === 1 ? "minute" : "minutes"}, or reset your password.`);
  }

  const hash = await hashPassword(input.password, account.salt, account.iterations);
  if (!sameSecret(hash, account.hash)) {
    const failed = account.failed + 1;
    saveAccount({ ...account, failed: failed >= MAX_FAILED ? 0 : failed, lockedUntil: failed >= MAX_FAILED ? Date.now() + LOCK_MS : 0 });
    return fail(failed >= MAX_FAILED ? `Too many wrong attempts. Try again in ${LOCK_MS / 60000} minutes, or reset your password.` : WRONG_LOGIN);
  }

  const problem = await startSession(account.id, "member", input.remember);
  if (problem) return fail(problem);
  saveAccount({ ...account, failed: 0, lockedUntil: 0 });
  setOwner(account.id);
  broadcast();
  return ok({ profileDone: account.profileDone });
}

/* ───────── sign up ───────── */

type Draft = { email: string; phone: string; password: string; marketing: boolean; at: number };
let draft: Draft | null = null;
const DRAFT_MS = 15 * 60 * 1000;

export type SignUpInput = { email: string; phone: string; password: string; acceptTerms: boolean; acceptPrivacy: boolean; marketing: boolean };
export type CodeSent = { devCode: string; resendIn: number };

/** Checks the form and "sends" a code to the mobile number. The account is created only after the code is confirmed. */
export async function beginSignUp(input: SignUpInput): Promise<Result<CodeSent>> {
  if (!secure()) return fail(SECURE);
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);
  if (!validEmail(email)) return fail("Enter a valid email address.");
  if (!phone) return fail("Enter a 10-digit Indian mobile number.");
  const problem = passwordProblem(input.password, [email.split("@")[0] ?? "", phone]);
  if (problem) return fail(problem);
  if (!input.acceptTerms) return fail("Please confirm you’re 18 or older and accept the Terms of Service.");
  if (!input.acceptPrivacy) return fail("We need your consent to process your details, as set out in the Privacy Policy.");

  if (findAccount({ email, phone })) return fail("We couldn’t create an account with those details. If you already have one, sign in or reset your password.");

  const sent = issueCode("signup", phone);
  if (!sent.ok) return fail(sent.error);
  draft = { email, phone, password: input.password, marketing: input.marketing, at: Date.now() };
  return ok({ devCode: sent.code, resendIn: sent.resendIn });
}

export function resendSignUp(): Result<CodeSent> {
  if (!draft) return fail("Your sign-up timed out. Please start again.");
  const sent = issueCode("signup", draft.phone);
  return sent.ok ? ok({ devCode: sent.code, resendIn: sent.resendIn }) : fail(sent.error);
}

export function signUpPhone(): string | null {
  return draft?.phone ?? null;
}

export function cancelSignUp() {
  if (draft) forgetCode("signup", draft.phone);
  draft = null;
}

export async function completeSignUp(input: { code: string; remember: boolean }): Promise<Result> {
  if (!draft || Date.now() - draft.at > DRAFT_MS) {
    draft = null;
    return fail("Your sign-up timed out. Please start again.");
  }
  const current = draft;
  const checked = checkCode("signup", current.phone, input.code);
  if (checked === "locked") {
    draft = null;
    return fail("Too many wrong codes. Please start again.");
  }
  if (checked !== "ok") return fail(WRONG_CODE);
  if (findAccount({ email: current.email, phone: current.phone })) {
    draft = null;
    return fail("We couldn’t create an account with those details. If you already have one, sign in.");
  }

  const salt = newSalt();
  const account: Account = {
    id: newId(),
    email: current.email,
    phone: current.phone,
    salt,
    hash: await hashPassword(current.password, salt),
    iterations: ITERATIONS,
    createdAt: Date.now(),
    consent: { version: legal.version, at: Date.now(), marketing: current.marketing },
    failed: 0,
    lockedUntil: 0,
    profileDone: false,
  };
  if (!saveAccount(account)) return fail("Your browser wouldn’t save the account. Free up space or turn off private mode and try again.");
  const problem = await startSession(account.id, "member", input.remember);
  if (problem) {
    removeAccount(account.id);
    return fail(problem);
  }
  draft = null;
  setOwner(account.id);
  broadcast();
  return ok(undefined);
}

/* ───────── forgot password ───────── */

let resetFor: { accountId: string | null; phone: string | null } | null = null;

/**
 * Always reports success, so the screen never reveals whether an account exists.
 * PROTOTYPE: the code is returned so it can be shown on screen. The live app texts it instead.
 */
export async function beginReset(identifier: string): Promise<Result<CodeSent>> {
  if (!secure()) return fail(SECURE);
  const id = parseIdentifier(identifier);
  if (!id) return fail("Enter the email or mobile number you signed up with.");
  const account = findAccount(id.kind === "email" ? { email: id.value } : { phone: id.value });
  resetFor = { accountId: account?.id ?? null, phone: account?.phone ?? null };
  if (!account) return ok({ devCode: decoyCode(), resendIn: 30 });
  const sent = issueCode("reset", account.phone);
  return sent.ok ? ok({ devCode: sent.code, resendIn: sent.resendIn }) : fail(sent.error);
}

export function resendReset(): Result<CodeSent> {
  if (!resetFor) return fail("Start again from the first step.");
  if (!resetFor.phone) return ok({ devCode: decoyCode(), resendIn: 30 });
  const sent = issueCode("reset", resetFor.phone);
  return sent.ok ? ok({ devCode: sent.code, resendIn: sent.resendIn }) : fail(sent.error);
}

export async function completeReset(input: { code: string; password: string }): Promise<Result> {
  if (!resetFor) return fail("Start again from the first step.");
  const target = resetFor;
  const account = target.accountId ? findAccount({ id: target.accountId }) : undefined;
  // Check the new password first, so a weak one doesn't use up the one-time code.
  const problem = passwordProblem(input.password, account ? [account.email.split("@")[0] ?? "", account.phone] : []);
  if (problem) return fail(problem);

  const checked = target.phone ? checkCode("reset", target.phone, input.code) : "expired";
  if (checked === "locked") {
    resetFor = null;
    return fail("Too many wrong codes. Start again to get a new one.");
  }
  if (checked !== "ok" || !account) return fail(WRONG_CODE);

  const salt = newSalt();
  saveAccount({ ...account, salt, hash: await hashPassword(input.password, salt), iterations: ITERATIONS, failed: 0, lockedUntil: 0 });
  resetFor = null;
  return ok(undefined);
}

export function cancelReset() {
  if (resetFor?.phone) forgetCode("reset", resetFor.phone);
  resetFor = null;
}

/* ───────── signed-in account ───────── */

export function currentAccount(): Account | null {
  const id = getOwner();
  return id && id !== "demo" ? (findAccount({ id }) ?? null) : null;
}

/** False when a session names a member whose account isn't on this device (cleared browser data, another browser). */
export function accountExists(id: string): boolean {
  return id === "demo" || Boolean(findAccount({ id }));
}

export function isProfileDone(id: string): boolean {
  if (id === "demo") return true;
  return findAccount({ id })?.profileDone ?? false;
}

export function markProfileDone() {
  const account = currentAccount();
  if (account) saveAccount({ ...account, profileDone: true });
}

export async function changePassword(input: { current: string; next: string }): Promise<Result> {
  const account = currentAccount();
  if (!account) return fail("Sign in again to change your password.");
  if (account.lockedUntil > Date.now()) return fail("Too many wrong attempts. Try again later.");
  const hash = await hashPassword(input.current, account.salt, account.iterations);
  if (!sameSecret(hash, account.hash)) {
    const failed = account.failed + 1;
    saveAccount({ ...account, failed: failed >= MAX_FAILED ? 0 : failed, lockedUntil: failed >= MAX_FAILED ? Date.now() + LOCK_MS : 0 });
    return fail("Your current password isn’t right.");
  }
  const problem = passwordProblem(input.next, [account.email.split("@")[0] ?? "", account.phone]);
  if (problem) return fail(problem);
  if (input.next === input.current) return fail("Choose a password you haven’t used just now.");
  const salt = newSalt();
  saveAccount({ ...account, salt, hash: await hashPassword(input.next, salt), iterations: ITERATIONS, failed: 0, lockedUntil: 0 });
  return ok(undefined);
}

/* ───────── demo, sign out, delete ───────── */

export async function startDemo(): Promise<Result> {
  const problem = await startSession("demo", "demo", false);
  if (problem) return fail(problem);
  setOwner("demo");
  broadcast();
  return ok(undefined);
}

/** Ends the session here, clears what's on screen, and returns to the sign-in page. */
export async function signOut(to = "/login?signedout=1"): Promise<void> {
  await endSession();
  setOwner(null);
  broadcast();
  hardNavigate(to);
}

/** Permanently removes the account and its data from this device. Asks for the password again. */
export async function deleteAccount(password: string): Promise<Result> {
  const account = currentAccount();
  if (!account) return fail("Sign in again to delete your account.");
  const hash = await hashPassword(password, account.salt, account.iterations);
  if (!sameSecret(hash, account.hash)) return fail("That password isn’t right.");
  removeAccount(account.id);
  eraseOwnerData(account.id);
  await endSession();
  setOwner(null);
  broadcast();
  hardNavigate("/?deleted=1");
  return ok(undefined);
}
