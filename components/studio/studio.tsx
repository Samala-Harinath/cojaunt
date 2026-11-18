"use client";

import { useSearchParams } from "next/navigation";
import { Empty } from "@/components/ui";
import { useApp, useHydrated } from "@/lib/store";
import { Editor } from "./editor";

const loading = <div className="h-dvh animate-pulse bg-paper" aria-busy="true" aria-label="Loading" />;

/** Host Studio: finds the draft from `?id=` once saved state has loaded, then opens the editor. */
export function Studio() {
  const id = useSearchParams().get("id");
  const app = useApp();
  const hydrated = useHydrated();
  const listing = app.listings.find((item) => item.id === id);

  if (!hydrated) return loading;
  if (!listing) {
    return (
      <div className="mx-auto max-w-xl px-5 pt-16">
        <Empty title="We couldn’t find that draft" body="It may have been deleted, or it was saved in a different browser." href="/host" cta="Back to hosting" />
      </div>
    );
  }
  if (listing.status === "review") {
    return (
      <div className="mx-auto max-w-xl px-5 pt-16">
        <Empty title="This plan is in review" body="To make changes, withdraw it from review on the hosting dashboard." href="/host" cta="Back to hosting" />
      </div>
    );
  }
  return <Editor key={listing.id} listing={listing} me={app.me} />;
}
