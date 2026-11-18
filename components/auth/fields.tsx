"use client";

import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { Icon } from "@/components/icon";
import { passwordScore } from "@/lib/auth/rules";

type TextProps = Omit<ComponentProps<"input">, "id"> & { label: string; hint?: ReactNode; error?: string; prefix?: string };

/** A labelled input. The label, hint and error are wired to the input for screen readers. */
export function TextField({ label, hint, error, prefix, className = "", ...input }: TextProps) {
  const id = useId();
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <div className="mt-2 flex gap-2">
        {prefix ? <span className="field grid w-16 shrink-0 place-items-center px-0 text-muted">{prefix}</span> : null}
        <input id={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy} className={`field ${className}`} {...input} />
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs leading-relaxed text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-semibold text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"] as const;
const bars = ["bg-danger", "bg-danger", "bg-marigold", "bg-forest", "bg-forest"] as const;

export function StrengthMeter({ password }: { password: string }) {
  if (!password) return null;
  const score = passwordScore(password);
  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1" aria-hidden="true">
        {[1, 2, 3, 4].map((step) => (
          <span key={step} className={`h-1.5 flex-1 rounded-full ${score >= step ? bars[score] : "bg-line"}`} />
        ))}
      </div>
      <p className="mt-1 text-xs text-muted">Password strength: {labels[score]}</p>
    </div>
  );
}

type PasswordProps = Omit<ComponentProps<"input">, "id" | "type"> & { label: string; hint?: ReactNode; error?: string; meter?: boolean; action?: ReactNode };

/** A password input with a show/hide button, and an optional strength meter. */
export function PasswordField({ label, hint, error, meter = false, action, value, className = "", ...input }: PasswordProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold">
          {label}
        </label>
        {action}
      </div>
      <div className="relative mt-2">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className={`field pr-12 ${className}`}
          {...input}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute right-1 top-1 grid size-10 place-items-center rounded-full text-muted hover:text-ink"
        >
          <Icon name={visible ? "eyeOff" : "eye"} />
        </button>
      </div>
      {meter && typeof value === "string" ? <StrengthMeter password={value} /> : null}
      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs leading-relaxed text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-semibold text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type CheckProps = Omit<ComponentProps<"input">, "type" | "id"> & { children: ReactNode; error?: string };

export function CheckField({ children, error, className = "", ...input }: CheckProps) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
        <input type="checkbox" aria-invalid={error ? true : undefined} className={`mt-1 size-4 shrink-0 accent-[var(--color-forest)] ${className}`} {...input} />
        <span>{children}</span>
      </label>
      {error ? <p className="mt-1 pl-7 text-xs font-semibold text-danger">{error}</p> : null}
    </div>
  );
}

/** A form-level message. `tone` picks the colour; errors are announced to screen readers straight away. */
export function Notice({ tone, children }: { tone: "error" | "info" | "success"; children: ReactNode }) {
  const style = tone === "error" ? "bg-spark-soft text-danger" : tone === "success" ? "bg-forest-soft text-forest-deep" : "bg-line text-ink";
  const icon = tone === "error" ? "alert" : tone === "success" ? "check" : "info";
  return (
    <p role={tone === "error" ? "alert" : "status"} className={`flex gap-2 rounded-xl px-3.5 py-3 text-sm font-semibold leading-relaxed ${style}`}>
      <Icon name={icon} className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
