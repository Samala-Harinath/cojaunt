import type { Metadata } from "next";
import { SafetyView } from "@/components/safety/safety-view";

export const metadata: Metadata = { title: "Safety centre" };

export default function SafetyPage() {
  return <SafetyView />;
}
