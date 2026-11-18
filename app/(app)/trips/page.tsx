import type { Metadata } from "next";
import { TripsView } from "@/components/trips-view";

export const metadata: Metadata = { title: "My plans" };

export default function TripsPage() {
  return <TripsView />;
}
