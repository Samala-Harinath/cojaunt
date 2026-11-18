import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/page-skeleton";
import { PersonProfile } from "@/components/person-profile";
import { findPerson, people } from "@/lib/directory";

export function generateStaticParams() {
  return people.map((person) => ({ id: person.id }));
}

// A fixed title: a per-person one made the production build fail (URL data in generateMetadata), and
// names in page titles end up in browser history and tab lists, which is a privacy cost anyway.
export const metadata: Metadata = { title: "Profile" };

function Profile({ id }: { id: string }) {
  const person = findPerson(id);
  if (!person) notFound();
  return <PersonProfile person={person} />;
}

// Reads `params` inside Suspense so navigation never blocks on it.
export default function PersonPage({ params }: PageProps<"/u/[id]">) {
  return <Suspense fallback={<PageSkeleton />}>{params.then(({ id }) => <Profile id={id} />)}</Suspense>;
}
