"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "@/lib/auth/client";
import { hardNavigate } from "@/lib/auth/navigate";
import { parseIdentifier, safeNext } from "@/lib/auth/rules";
import { site } from "@/lib/config";
import { AuthLayout } from "./auth-layout";
import { DemoButton } from "./demo-button";
import { CheckField, Notice, PasswordField, TextField } from "./fields";
import { useQueryParam } from "./use-query";

export function LoginForm() {
  const signedOut = useQueryParam("signedout");
  const reset = useQueryParam("reset");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    if (!parseIdentifier(identifier) || !password) {
      setError("Enter your email or mobile number, and your password.");
      return;
    }
    setError("");
    setBusy(true);
    const result = await signIn({ identifier, password, remember });
    if (!result.ok) {
      setBusy(false);
      setPassword("");
      setError(result.error);
      return;
    }
    // A full page load, so the server checks the new session cookie before showing anything.
    const next = safeNext(new URLSearchParams(window.location.search).get("next"));
    hardNavigate(result.data.profileDone ? next : "/welcome");
  }

  return (
    <AuthLayout
      title="Welcome back"
      lead="Sign in to see your plans, requests and chats."
      footer={
        <>
          New to Cojaunt?{" "}
          <Link href="/register" className="font-semibold text-forest underline underline-offset-4">
            Create an account
          </Link>
        </>
      }
    >
      <form noValidate onSubmit={submit} className="space-y-5">
        {signedOut ? <Notice tone="success">You’ve been signed out.</Notice> : null}
        {reset ? <Notice tone="success">Your password was updated. Sign in with the new one.</Notice> : null}

        <TextField
          label="Email or mobile number"
          name="username"
          autoComplete="username"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder="you@example.com or 98765 43210"
          autoFocus
        />
        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          action={
            <Link href="/forgot-password" className="text-xs font-semibold text-forest underline underline-offset-4">
              Forgot password?
            </Link>
          }
        />
        <CheckField checked={remember} onChange={(event) => setRemember(event.target.checked)}>
          Keep me signed in on this device
          <span className="block text-xs text-muted">Don’t tick this on a shared or public computer.</span>
        </CheckField>

        {error ? <Notice tone="error">{error}</Notice> : null}

        <button type="submit" className="btn btn-primary w-full" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>

      {site.demo ? (
        <div className="mt-6 border-t border-line pt-6 text-center">
          <p className="mb-3 text-xs text-muted">Just looking around?</p>
          <DemoButton className="btn btn-line w-full" />
        </div>
      ) : null}
    </AuthLayout>
  );
}
