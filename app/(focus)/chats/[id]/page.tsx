import type { Metadata } from "next";
import { Suspense } from "react";
import { ThreadView } from "@/components/chat/thread-view";
import { PageSkeleton } from "@/components/page-skeleton";
import { people } from "@/lib/directory";
import { plans } from "@/lib/plans";

export const metadata: Metadata = { title: "Chat" };

export function generateStaticParams() {
  return [...plans.map((plan) => ({ id: `g-${plan.id}` })), ...people.map((person) => ({ id: `dm-${person.id}` }))];
}

// Reads `params` inside Suspense so navigation never blocks on it.
export default function ChatPage({ params }: PageProps<"/chats/[id]">) {
  return <Suspense fallback={<PageSkeleton />}>{params.then(({ id }) => <ThreadView id={id} />)}</Suspense>;
}
