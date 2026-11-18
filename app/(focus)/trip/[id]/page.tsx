import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/page-skeleton";
import { TripView } from "@/components/trip/trip-view";
import { getPlan, plans } from "@/lib/plans";

export const metadata: Metadata = { title: "Trip Mode" };

export function generateStaticParams() {
  return plans.map((plan) => ({ id: plan.id }));
}

function Trip({ id }: { id: string }) {
  const plan = getPlan(id);
  if (!plan) notFound();
  return <TripView plan={plan} />;
}

// Reads `params` inside Suspense so navigation never blocks on it.
export default function TripPage({ params }: PageProps<"/trip/[id]">) {
  return <Suspense fallback={<PageSkeleton />}>{params.then(({ id }) => <Trip id={id} />)}</Suspense>;
}
