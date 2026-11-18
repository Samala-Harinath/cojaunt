"use client";

import Link from "next/link";
import { useState } from "react";
import { beginReset, cancelReset, completeReset, resendReset, type CodeSent } from "@/lib/auth/client";
import { hardNavigate } from "@/lib/auth/navigate";
import { parseIdentifier } from "@/lib/auth/rules";
import { AuthLayout } from "./auth-layout";
import { CodeInput } from "./code-input";
import { Notice, PasswordField, TextField } from "./fields";

export function ForgotForm() {
  const [phase, setPhase] = useState<"find" | "reset">("find");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState<CodeSent | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function find(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    if (!parseIdentifier(identifier)) return setError("Enter the email or mobile number you signed up with.");
    setBusy(true);
    setError("");
    const result = await beginReset(identifier);
    setBusy(false);
    if (!result.ok) return setError(result.error);
    setSent(result.data);
    setCode("");
    setPassword("");
    setPhase("reset");
  }

  async function reset(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    if (code.length !== 6) return setError("Enter the 6-digit code.");
    setBusy(true);
    setError("");
    const result = await completeReset({ code, password });
    if (!result.ok) {
      setBusy(false);
      setError(result.error);
      return;
    }
    hardNavigate("/login?reset=1");
  }

  if (phase === "reset" && sent) {
    return (
      <AuthLayout title="Set a new password" lead="Enter the code we sent, then choose a new password.">
        <form noValidate onSubmit={reset} className="space-y-5">
          <CodeInput value={code} onChange={setCode} first={sent} onResend={resendReset} />
          <PasswordField
            label="New password"
            name="new-password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            meter
            hint="At least 8 characters, with a letter and a number."
          />
          {error ? <Notice tone="error">{error}</Notice> : null}
          <button type="submit" className="btn btn-primary w-full" disabled={busy}>
            {busy ? "Saving…" : "Reset password"}
          </button>
          <button
            type="button"
            className="w-full text-sm font-semibold text-forest underline underline-offset-4"
            onClick={() => {
              cancelReset();
              setPhase("find");
              setError("");
            }}
          >
            Use a different email or number
          </button>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      lead="Enter your email or mobile number. If it matches an account, we’ll text a code to the mobile number on it."
      footer={
        <Link href="/login" className="font-semibold text-forest underline underline-offset-4">
          Back to sign in
        </Link>
      }
    >
      <form noValidate onSubmit={find} className="space-y-5">
        <TextField
          label="Email or mobile number"
          name="username"
          autoComplete="username"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder="you@example.com or 98765 43210"
          autoFocus
        />
        {error ? <Notice tone="error">{error}</Notice> : null}
        <button type="submit" className="btn btn-primary w-full" disabled={busy}>
          {busy ? "Sending code…" : "Send code"}
        </button>
      </form>
    </AuthLayout>
  );
}
