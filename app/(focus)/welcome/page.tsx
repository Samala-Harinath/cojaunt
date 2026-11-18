import type { Metadata } from "next";
import { Onboarding } from "@/components/onboarding/onboarding";

export const metadata: Metadata = { title: "Join" };

export default function WelcomePage() {
  return <Onboarding />;
}
