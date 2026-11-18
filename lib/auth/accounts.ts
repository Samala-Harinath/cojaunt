"use client";

/**
 * PROTOTYPE account vault. With no backend yet, accounts live in this browser's localStorage.
 * Passwords are never stored: only a salted PBKDF2-SHA256 hash (310,000 rounds). The backend
 * replaces this file; the functions in lib/auth/client.ts are the contract it must keep.
 */
export type Consent = { version: string; at: number; marketing: boolean };

export type Account = {
  id: string;
  email: string;
  /** 10-digit Indian mobile number. */
  phone: string;
  salt: string;
  hash: string;
  iterations: number;
  createdAt: number;
  consent: Consent;
  failed: number;
  lockedUntil: number;
  /** True once the member finished the sign-up steps (photos, quiz, privacy). */
  profileDone: boolean;
};

const KEY = "cojaunt:accounts:v1";
export const ITERATIONS = 310_000;
export const MAX_FAILED = 5;
export const LOCK_MS = 15 * 60 * 1000;

export function readAccounts(): Account[] {
  try {
    const data: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(data) ? (data as Account[]) : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: Account[]): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(accounts));
    return true;
  } catch {
    return false;
  }
}

export function findAccount(match: { id?: string; email?: string; phone?: string }): Account | undefined {
  return readAccounts().find((a) => (match.id && a.id === match.id) || (match.email && a.email === match.email) || (match.phone && a.phone === match.phone));
}

export function saveAccount(account: Account): boolean {
  const rest = readAccounts().filter((a) => a.id !== account.id);
  return writeAccounts([...rest, account]);
}

export function removeAccount(id: string): void {
  writeAccounts(readAccounts().filter((a) => a.id !== id));
}

const encoder = new TextEncoder();

function toBase64(bytes: Uint8Array): string {
  let text = "";
  for (const byte of bytes) text += String.fromCharCode(byte);
  return btoa(text);
}

function fromBase64(text: string): Uint8Array<ArrayBuffer> {
  const raw = atob(text);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

export function newSalt(): string {
  return toBase64(crypto.getRandomValues(new Uint8Array(16)));
}

export async function hashPassword(password: string, salt: string, iterations = ITERATIONS): Promise<string> {
  const material = await crypto.subtle.importKey("raw", encoder.encode(password.normalize("NFKC")), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: fromBase64(salt), iterations }, material, 256);
  return toBase64(new Uint8Array(bits));
}

/** Compares two strings without stopping at the first difference. */
export function sameSecret(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

export function newId(): string {
  return `m_${crypto.randomUUID().replace(/-/g, "")}`;
}
