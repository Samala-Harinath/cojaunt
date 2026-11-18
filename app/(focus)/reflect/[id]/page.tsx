import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/page-skeleton";
import { ReflectView } from "@/components/reflect/reflect-view";
import { getPlan, plans } from "@/lib/plans";

export const metadata: Metadata = { title: "Reflect" };

export function generateStaticParams() {
  return plans.map((plan) => ({ id: plan.id }));
}

function Reflect({ id }: { id: string }) {
  const plan = getPlan(id);
  if (!plan) notFound();
  return <ReflectView plan={plan} />;
}

// Reads `params` inside Suspense so navigation never blocks on it.
export default function ReflectPage({ params }: PageProps<"/reflect/[id]">) {
  return <Suspense fallback={<PageSkeleton />}>{params.then(({ id }) => <Reflect id={id} />)}</Suspense>;
}
