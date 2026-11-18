"use client";

import { useEffect, useId, useState } from "react";
import { Proto } from "@/components/ui";
import type { CodeSent, Result } from "@/lib/auth/client";

type Props = {
  value: string;
  onChange: (next: string) => void;
  first: CodeSent;
  onResend: () => Result<CodeSent>;
  /** Where the code went, for example "+91 ••••••3210". Left out when we mustn't say. */
  sentTo?: string;
  error?: string;
};

/** The 6-digit code box, with the resend countdown. In this prototype the code is shown on screen instead of being texted. */
export function CodeInput({ value, onChange, first, onResend, sentTo, error }: Props) {
  const id = useId();
  const [dev, setDev] = useState(first.devCode);
  const [wait, setWait] = useState(first.resendIn);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (wait <= 0) return;
    const timer = setTimeout(() => setWait((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  function resend() {
    const result = onResend();
    if (result.ok) {
      setDev(result.data.devCode);
      setWait(result.data.resendIn);
      setNote("A new code was sent.");
      onChange("");
    } else {
      setNote(result.error);
    }
  }

  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        6-digit code
      </label>
      <input
        id={id}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, ""))}
        placeholder="••••••"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="field mt-2 text-center text-2xl tracking-[0.5em]"
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-semibold text-danger">
          {error}
        </p>
      ) : null}
      <p className="mt-2 text-xs text-muted">{sentTo ? `We sent a code to ${sentTo}. It works for 10 minutes.` : "If an account matches, we’ve sent a code to its mobile number. It works for 10 minutes."}</p>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span aria-live="polite" className="text-xs text-muted">
          {note}
        </span>
        {wait > 0 ? (
          <span className="text-muted">Resend in {wait}s</span>
        ) : (
          <button type="button" className="font-semibold text-forest underline underline-offset-4" onClick={resend}>
            Resend code
          </button>
        )}
      </div>
      <div className="mt-3">
        <Proto>
          No SMS is sent. Your code is <strong className="tabular-nums tracking-widest">{dev}</strong>. The live app texts it to the mobile number instead.
        </Proto>
      </div>
    </div>
  );
}
