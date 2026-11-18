import type { Metadata } from "next";
import { PlusView } from "@/components/plus-view";

export const metadata: Metadata = { title: "Plus" };

export default function PlusPage() {
  return <PlusView />;
}
