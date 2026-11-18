import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/page-skeleton";
import { PlanView } from "@/components/plan/plan-view";
import { getPlan, plans } from "@/lib/plans";

export function generateStaticParams() {
  return plans.map((plan) => ({ id: plan.id }));
}

// A fixed title: a per-plan one made the production build fail (URL data in generateMetadata).
export const metadata: Metadata = { title: "Plan" };

function Plan({ id }: { id: string }) {
  const plan = getPlan(id);
  if (!plan) notFound();
  return <PlanView plan={plan} />;
}

// The page stays synchronous and reads `params` inside Suspense, so navigation never blocks on it.
export default function PlanPage({ params }: PageProps<"/plans/[id]">) {
  return <Suspense fallback={<PageSkeleton />}>{params.then(({ id }) => <Plan id={id} />)}</Suspense>;
}
