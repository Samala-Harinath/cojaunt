"use client";

import Link from "next/link";
import { useState } from "react";
import { beginSignUp, cancelSignUp, completeSignUp, resendSignUp, type CodeSent } from "@/lib/auth/client";
import { hardNavigate } from "@/lib/auth/navigate";
import { maskPhone, normalizePhone, passwordProblem, validEmail, normalizeEmail } from "@/lib/auth/rules";
import { AuthLayout } from "./auth-layout";
import { CodeInput } from "./code-input";
import { CheckField, Notice, PasswordField, TextField } from "./fields";

type Errors = Partial<Record<"phone" | "email" | "password" | "terms" | "privacy", string>>;

export function RegisterForm() {
  const [phase, setPhase] = useState<"details" | "code">("details");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<CodeSent | null>(null);
  const [code, setCode] = useState("");

  async function details(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    const next: Errors = {};
    const digits = normalizePhone(phone);
    if (!digits) next.phone = "Enter a 10-digit Indian mobile number.";
    if (!validEmail(email)) next.email = "Enter a valid email address.";
    const problem = passwordProblem(password, [normalizeEmail(email).split("@")[0] ?? "", digits ?? ""]);
    if (problem) next.password = problem;
    if (!terms) next.terms = "Please confirm this to continue.";
    if (!privacy) next.privacy = "We need your consent to continue.";
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length > 0) return;

    setBusy(true);
    const result = await beginSignUp({ email, phone, password, acceptTerms: terms, acceptPrivacy: privacy, marketing });
    setBusy(false);
    if (!result.ok) return setFormError(result.error);
    setSent(result.data);
    setCode("");
    setPhase("code");
  }

  async function verify(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    if (code.length !== 6) return setFormError("Enter the 6-digit code.");
    setBusy(true);
    setFormError("");
    const result = await completeSignUp({ code, remember: true });
    if (!result.ok) {
      setBusy(false);
      setCode("");
      setFormError(result.error);
      return;
    }
    hardNavigate("/welcome");
  }

  function back() {
    cancelSignUp();
    setPhase("details");
    setFormError("");
    setPassword("");
  }

  if (phase === "code" && sent) {
    const digits = normalizePhone(phone) ?? "";
    return (
      <AuthLayout title="Check your phone" lead="One quick step to confirm this number is yours.">
        <form noValidate onSubmit={verify} className="space-y-5">
          <CodeInput value={code} onChange={setCode} first={sent} onResend={resendSignUp} sentTo={maskPhone(digits)} />
          {formError ? <Notice tone="error">{formError}</Notice> : null}
          <button type="submit" className="btn btn-primary w-full" disabled={busy}>
            {busy ? "Creating your account…" : "Verify and create account"}
          </button>
          <button type="button" className="w-full text-sm font-semibold text-forest underline underline-offset-4" onClick={back}>
            Change my details
          </button>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      lead="Meet people by doing things together. It takes about three minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-forest underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <form noValidate onSubmit={details} className="space-y-5">
        <TextField
          label="Mobile number"
          name="tel"
          prefix="+91"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="98765 43210"
          error={errors.phone}
          hint="We’ll text a code to confirm it. It’s never shown to other members."
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          error={errors.email}
          hint="For receipts and account notices."
        />
        <PasswordField
          label="Password"
          name="new-password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          meter
          hint="At least 8 characters, with a letter and a number. A short phrase is easy to remember and hard to guess."
        />

        <fieldset className="space-y-3.5 rounded-2xl border border-line bg-surface p-4">
          <legend className="sr-only">Agreements</legend>
          <CheckField checked={terms} onChange={(event) => setTerms(event.target.checked)} error={errors.terms}>
            I’m 18 or older and I accept the{" "}
            <Link href="/terms" target="_blank" rel="noopener" className="font-semibold text-forest underline underline-offset-4">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/community-guidelines" target="_blank" rel="noopener" className="font-semibold text-forest underline underline-offset-4">
              Community Guidelines
            </Link>
            .
          </CheckField>
          <CheckField checked={privacy} onChange={(event) => setPrivacy(event.target.checked)} error={errors.privacy}>
            I consent to Cojaunt using my details as explained in the{" "}
            <Link href="/privacy" target="_blank" rel="noopener" className="font-semibold text-forest underline underline-offset-4">
              Privacy Policy
            </Link>
            . I can withdraw this at any time.
          </CheckField>
          <CheckField checked={marketing} onChange={(event) => setMarketing(event.target.checked)}>
            Send me trip ideas and product news by email. <span className="text-muted">(Optional)</span>
          </CheckField>
        </fieldset>

        {formError ? <Notice tone="error">{formError}</Notice> : null}

        <button type="submit" className="btn btn-primary w-full" disabled={busy}>
          {busy ? "Sending code…" : "Continue"}
        </button>
      </form>
    </AuthLayout>
  );
}
