import type { Metadata } from "next";
import { HostView } from "@/components/host/host-view";

export const metadata: Metadata = { title: "Hosting" };

export default function HostPage() {
  return <HostView />;
}
