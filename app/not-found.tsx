import Link from "next/link";
import { Logo } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-5 text-center">
      <Logo />
      <h1 className="mt-8 font-display text-4xl">We couldn’t find that page</h1>
      <p className="mt-3 text-muted">The link may be out of date, or the plan may have been removed.</p>
      <Link href="/" className="btn btn-primary mt-8">
        Go to the home page
      </Link>
    </main>
  );
}
