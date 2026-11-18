"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/icon";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Logo } from "@/components/ui";
import { startFresh } from "@/lib/actions";
import { markProfileDone } from "@/lib/auth/client";
import { noDetails, vibe } from "@/lib/people";
import type { Me, Privacy } from "@/lib/store";
import { About } from "./about";
import { Basics } from "./basics";
import { Identity } from "./identity";
import { PrivacyStep } from "./privacy-step";
import { VibeQuiz } from "./vibe-quiz";

/** The account (email, mobile, password, code) is created at /register. These are the profile steps that follow. */
const steps = ["basics", "identity", "vibe", "about", "privacy"] as const;

const blank: Me = {
  name: "",
  age: 0,
  gender: "woman",
  pronouns: "",
  work: "",
  bio: "",
  hue: 28,
  photos: [],
  details: noDetails,
  interests: [],
  vibe: vibe(1, 1, 1, 1, 1, 1),
  intent: "friends",
  status: "single",
  selfieVerified: false,
  idVerified: false,
  plus: false,
};

const round = "grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface";

/** Profile steps after sign-up: basics, photo and selfie check, vibe quiz, interests and intent, privacy. */
export function Onboarding() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [me, setMe] = useState<Me>(blank);
  const [privacy, setPrivacy] = useState<Privacy>({ hideFromContacts: true, preciseLocation: false, visibility: "plans" });

  const step = steps[index];
  const set = (patch: Partial<Me>) => setMe((current) => ({ ...current, ...patch }));
  const next = () => setIndex((current) => Math.min(current + 1, steps.length - 1));

  function finish() {
    startFresh(me, privacy);
    markProfileDone();
    router.push("/discover");
  }

  return (
    <>
      <header className="flex items-center gap-3 px-5 pb-3 pt-5">
        {index > 0 ? (
          <button type="button" onClick={() => setIndex(index - 1)} aria-label="Previous step" className={round}>
            <Icon name="left" />
          </button>
        ) : null}
        <Logo className="flex-1" />
        <SignOutButton className="text-sm font-semibold text-forest underline underline-offset-4">Sign out</SignOutButton>
      </header>

      <div className="px-5 pb-6">
        <div
          role="progressbar"
          aria-label="Profile progress"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={index + 1}
          className="h-1.5 overflow-hidden rounded-full bg-line"
        >
          <div className="h-full rounded-full bg-forest transition-[width] duration-300" style={{ width: `${((index + 1) / steps.length) * 100}%` }} />
        </div>
        <p className="mt-2 text-xs text-muted">
          Step {index + 1} of {steps.length}
        </p>
      </div>

      <div key={step} className="rise flex flex-1 flex-col">
        {step === "basics" ? <Basics me={me} set={set} onNext={next} /> : null}
        {step === "identity" ? <Identity me={me} set={set} onNext={next} /> : null}
        {step === "vibe" ? <VibeQuiz me={me} set={set} onNext={next} /> : null}
        {step === "about" ? <About me={me} set={set} onNext={next} /> : null}
        {step === "privacy" ? (
          <PrivacyStep privacy={privacy} onChange={(patch) => setPrivacy((current) => ({ ...current, ...patch }))} onFinish={finish} />
        ) : null}
      </div>
    </>
  );
}
