"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckField, Notice, PasswordField } from "@/components/auth/fields";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Icon } from "@/components/icon";
import { Sheet, Top } from "@/components/ui";
import { changePassword, currentAccount, deleteAccount } from "@/lib/auth/client";
import { maskEmail, maskPhone, passwordProblem } from "@/lib/auth/rules";
import { legalPages } from "@/lib/config";
import { useApp, useHydrated } from "@/lib/store";

/** Sign-in details, password, sessions, legal documents and account deletion. */
export function AccountView() {
  const { isDemo } = useApp();
  const hydrated = useHydrated();
  const account = hydrated ? currentAccount() : null;

  return (
    <div className="mx-auto max-w-2xl">
      <Top title="Account & security" back="/profile" />
      <div className="space-y-5 px-5">
        <section className="card p-5" aria-labelledby="signin-heading">
          <h2 id="signin-heading" className="font-display text-2xl">
            Sign-in details
          </h2>
          {account ? (
            <dl className="mt-3 divide-y divide-line text-sm">
              <Row label="Email" value={maskEmail(account.email)} />
              <Row label="Mobile" value={maskPhone(account.phone)} />
              <Row label="Member since" value={new Date(account.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} />
              <Row label="Accepted terms" value={`Version ${account.consent.version}`} />
            </dl>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {isDemo ? "You’re in the demo as a sample member, so there’s no account to manage. Create one to keep your own profile." : "Loading…"}
            </p>
          )}
          {isDemo ? (
            <div className="mt-4">
              <SignOutButton to="/register" className="btn btn-primary btn-sm">Sign out and create an account</SignOutButton>
            </div>
          ) : null}
        </section>

        {account ? <PasswordCard /> : null}

        <section className="card p-5" aria-labelledby="session-heading">
          <h2 id="session-heading" className="font-display text-2xl">
            This device
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            You’re signed in here. Sign out on shared or borrowed devices when you’re done. If you ever suspect someone else has your password, change it above.
          </p>
          <div className="mt-4">
            <SignOutButton className="btn btn-line w-full sm:w-auto">
              <Icon name="logout" className="size-4" />
              Sign out
            </SignOutButton>
          </div>
        </section>

        <section className="card p-5" aria-labelledby="legal-heading">
          <h2 id="legal-heading" className="font-display text-2xl">
            Policies
          </h2>
          <ul className="mt-2 divide-y divide-line">
            {legalPages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="flex items-center justify-between py-3 text-sm font-semibold">
                  {page.label}
                  <Icon name="right" className="size-4 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted">Download a copy of your data from the Safety centre.</p>
        </section>

        {account ? <DeleteCard /> : null}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-muted">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}

function PasswordCard() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setDone(false);
    const account = currentAccount();
    const problem = passwordProblem(next, account ? [account.email.split("@")[0] ?? "", account.phone] : []);
    if (!current) return setError("Enter your current password.");
    if (problem) return setError(problem);
    setBusy(true);
    setError("");
    const result = await changePassword({ current, next });
    setBusy(false);
    if (!result.ok) return setError(result.error);
    setCurrent("");
    setNext("");
    setDone(true);
  }

  return (
    <section className="card p-5" aria-labelledby="password-heading">
      <h2 id="password-heading" className="font-display text-2xl">
        Change password
      </h2>
      <form noValidate onSubmit={submit} className="mt-4 space-y-4">
        <PasswordField label="Current password" name="current-password" autoComplete="current-password" value={current} onChange={(event) => setCurrent(event.target.value)} />
        <PasswordField label="New password" name="new-password" autoComplete="new-password" value={next} onChange={(event) => setNext(event.target.value)} meter hint="At least 8 characters, with a letter and a number." />
        {error ? <Notice tone="error">{error}</Notice> : null}
        {done ? <Notice tone="success">Your password was changed.</Notice> : null}
        <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={busy}>
          {busy ? "Saving…" : "Update password"}
        </button>
      </form>
    </section>
  );
}

function DeleteCard() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [sure, setSure] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function close() {
    setOpen(false);
    setPassword("");
    setSure(false);
    setError("");
  }

  async function erase(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    if (!password) return setError("Enter your password to confirm.");
    if (!sure) return setError("Tick the box to confirm.");
    setBusy(true);
    setError("");
    const result = await deleteAccount(password);
    // On success the page navigates away; only a failure comes back here.
    if (!result.ok) {
      setBusy(false);
      setError(result.error);
    }
  }

  return (
    <section id="delete" className="card border-danger/30 p-5" aria-labelledby="delete-heading">
      <h2 id="delete-heading" className="font-display text-2xl text-danger">
        Delete my account
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        This permanently removes your account, profile, photos, requests, chats and settings. It can’t be undone. Plans you’ve paid for may have refund rules, so check{" "}
        <Link href="/refunds" className="font-semibold text-forest underline underline-offset-4">
          Refunds &amp; Cancellations
        </Link>{" "}
        first.
      </p>
      <button type="button" className="btn btn-line mt-4 text-danger" onClick={() => setOpen(true)}>
        <Icon name="trash" className="size-4" />
        Delete my account
      </button>

      <Sheet open={open} onClose={close} title="Delete your account?">
        <form noValidate onSubmit={erase} className="space-y-4">
          <p className="text-sm leading-relaxed text-muted">Everything on this account is erased straight away. Other members aren’t told why you left.</p>
          <PasswordField label="Your password" name="current-password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <CheckField checked={sure} onChange={(event) => setSure(event.target.checked)}>
            I understand this can’t be undone.
          </CheckField>
          {error ? <Notice tone="error">{error}</Notice> : null}
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className="btn btn-line" onClick={close}>
              Keep my account
            </button>
            <button type="submit" className="btn btn-danger" disabled={busy}>
              {busy ? "Deleting…" : "Delete"}
            </button>
          </div>
        </form>
      </Sheet>
    </section>
  );
}
