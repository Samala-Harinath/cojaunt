"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";

type Phase = "idle" | "holding" | "countdown" | "raised";
type Props = { contacts: string[]; hostName: string };

const RING = 289;

/**
 * SOS, following the blueprint's incident journey: hold for 2 seconds, then a 5-second window to cancel.
 * PROTOTYPE: nothing is sent. The only real action on this screen is the 112 call link.
 */
export function Sos({ contacts, hostName }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [left, setLeft] = useState(5);

  useEffect(() => {
    if (phase === "holding") {
      const timer = setTimeout(() => setPhase("countdown"), 2000);
      return () => clearTimeout(timer);
    }
    if (phase === "countdown") {
      const timer = setTimeout(() => (left <= 1 ? setPhase("raised") : setLeft(left - 1)), 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, left]);

  function press() {
    if (phase !== "idle") return;
    setLeft(5);
    setPhase("holding");
  }

  function release() {
    if (phase === "holding") setPhase("idle");
  }

  const who = contacts.length > 0 ? contacts.join(" and ") : "your emergency contacts (you haven’t added any yet)";
  const call = (
    <a href="tel:112" className="btn btn-danger w-full">
      <Icon name="phone" />
      Call 112 now
    </a>
  );

  if (phase === "raised") {
    return (
      <section className="rounded-3xl bg-surface p-5 text-ink" role="alert">
        <h2 className="font-display text-2xl">SOS raised (simulated)</h2>
        <p className="mt-2 rounded-xl bg-marigold-soft px-3 py-2.5 text-sm leading-relaxed text-amber-ink">
          <strong>Nobody has been alerted.</strong> This is a prototype. If you are in danger, call 112.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          In the live app this would text your live location to {who}, alert {hostName}, and alert our safety team, who call you within 2 minutes.
        </p>
        <div className="mt-4 space-y-2">
          {call}
          <button type="button" className="btn btn-line w-full" onClick={() => setPhase("idle")}>
            I’m safe
          </button>
        </div>
      </section>
    );
  }

  if (phase === "countdown") {
    return (
      <section className="rounded-3xl bg-danger p-6 text-center text-white" role="alert">
        <p className="font-display text-6xl">{left}</p>
        <p className="mt-2 text-sm">Raising SOS. Cancel if this was a mistake.</p>
        <button type="button" className="btn mt-4 w-full bg-white text-[#b3261e]" onClick={() => setPhase("idle")}>
          Cancel
        </button>
      </section>
    );
  }

  return (
    <section className="text-center" aria-label="Emergency">
      <button
        type="button"
        onPointerDown={press}
        onPointerUp={release}
        onPointerLeave={release}
        onPointerCancel={release}
        onContextMenu={(event) => event.preventDefault()}
        onKeyDown={(event) => {
          if ((event.key === " " || event.key === "Enter") && !event.repeat) press();
        }}
        onKeyUp={release}
        className="relative mx-auto grid size-44 touch-none select-none place-items-center rounded-full bg-danger text-white shadow-[0_0_0_12px_rgb(196_38_27/0.25)]"
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#fff"
            strokeWidth="5"
            strokeDasharray={RING}
            strokeDashoffset={RING}
            style={phase === "holding" ? { animation: "hold 2s linear forwards" } : undefined}
          />
        </svg>
        <span>
          <span className="block font-display text-4xl font-semibold">SOS</span>
          <span className="block text-xs font-semibold">Hold for 2 seconds</span>
        </span>
      </button>
      <p className="mt-4 text-sm text-white/80" aria-live="polite">
        {phase === "holding" ? "Keep holding…" : "You get 5 seconds to cancel before anything is sent."}
      </p>
      <div className="mt-4">{call}</div>
    </section>
  );
}
