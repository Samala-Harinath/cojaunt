import Link from "next/link";
import { ThemeToggle } from "@/components/theme";
import { Logo } from "@/components/ui";
import { SiteFooter } from "@/components/site-footer";
import { brand } from "@/lib/brand";

/** Public pages for policies. Readable without an account, and linked from sign-up. */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5">
      <header className="sticky top-0 z-30 -mx-5 flex items-center gap-2 border-b border-line bg-paper/85 px-5 py-3 backdrop-blur">
        <Link href="/" aria-label={`${brand.name} home`}>
          <Logo />
        </Link>
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <Link href="/login" className="btn btn-line btn-sm">
            Sign in
          </Link>
          <Link href="/register" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Get started
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
