import type { Metadata } from "next";
import { Suspense } from "react";
import { Studio } from "@/components/studio/studio";

export const metadata: Metadata = { title: "Host Studio" };

// The draft id comes from `?id=`. Drafts live in the browser, so the studio renders on the client.
export default function StudioPage() {
  return (
    <Suspense fallback={<div className="h-dvh animate-pulse bg-paper" aria-busy="true" aria-label="Loading" />}>
      <Studio />
    </Suspense>
  );
}
