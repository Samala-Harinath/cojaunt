import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/icon";
import { ThemeToggle } from "@/components/theme";
import { Logo } from "@/components/ui";
import { brand } from "@/lib/brand";
import { legalPages } from "@/lib/config";

const promises = [
  "Every member passes a photo and selfie check",
  "Private details stay hidden until you both say yes",
  "Nobody can message you unless you accept",
  "Block, mute and report are one tap away",
];

/** The shared frame for sign in, sign up and password reset: a calm form next to what members can count on. */
export function AuthLayout({ title, lead, children, footer }: { title: string; lead?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_minmax(0,32rem)]">
      <aside className="relative hidden overflow-hidden bg-band p-12 text-white lg:flex lg:flex-col lg:justify-between" aria-hidden="true">
        <div className="absolute -right-24 -top-24 size-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 size-[28rem] rounded-full bg-marigold/10" />
        <p className="relative font-display text-2xl font-semibold">{brand.name}</p>
        <div className="relative max-w-md">
          <h2 className="font-display text-5xl leading-[1.05]">
            Plans, <em>not</em> profiles.
          </h2>
          <ul className="mt-8 space-y-3.5">
            {promises.map((line) => (
              <li key={line} className="flex gap-3 text-sm leading-relaxed text-white/90">
                <Icon name="shieldCheck" className="mt-px size-5 shrink-0 text-marigold" />
                {line}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-white/60">Small-group trips and weekend plans across {brand.region}.</p>
      </aside>

      <div className="flex min-h-dvh flex-col px-5 py-5 sm:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" aria-label={`${brand.name} home`}>
            <Logo />
          </Link>
          <ThemeToggle />
        </header>

        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="font-display text-4xl leading-tight">{title}</h1>
          {lead ? <p className="mt-2 text-sm leading-relaxed text-muted">{lead}</p> : null}
          <div className="mt-7">{children}</div>
          {footer ? <div className="mt-6 text-center text-sm text-muted">{footer}</div> : null}
        </main>

        <footer className="mx-auto w-full max-w-md pb-2 text-center text-xs text-muted">
          <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {legalPages.slice(0, 3).map((page) => (
              <Link key={page.href} href={page.href} className="underline-offset-4 hover:text-ink hover:underline">
                {page.label}
              </Link>
            ))}
          </nav>
        </footer>
      </div>
    </div>
  );
}
