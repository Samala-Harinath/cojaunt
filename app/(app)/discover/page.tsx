import type { Metadata } from "next";
import { Suspense } from "react";
import { Feed } from "@/components/feed";
import Loading from "../loading";

export const metadata: Metadata = { title: "Discover" };

// The category tab comes from `?tab=`, so the feed renders inside a Suspense boundary.
export default function DiscoverPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Feed />
    </Suspense>
  );
}
