"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { inbox } from "@/lib/asks";
import { brand } from "@/lib/brand";
import { useApp, useHydrated } from "@/lib/store";
import { AccountMenu } from "./auth/account-menu";
import { Icon, type IconName } from "./icon";
import { HeaderLocation } from "./location-bar";
import { ThemeToggle } from "./theme";
import { Logo } from "./ui";

const tabs: { href: string; label: string; icon: IconName; also: string[] }[] = [
  { href: "/discover", label: "Discover", icon: "compass", also: ["/plans"] },
  { href: "/trips", label: "My plans", icon: "ticket", also: [] },
  { href: "/chats", label: "Chats", icon: "chat", also: [] },
  { href: "/people", label: "Requests", icon: "bell", also: ["/u"] },
  { href: "/profile", label: "You", icon: "user", also: ["/host", "/safety", "/plus"] },
];

/** Unread request count on the Requests tab. Waits for hydration so the server and first client render agree. */
function Badge({ inline = false }: { inline?: boolean }) {
  const app = useApp();
  const count = useHydrated() ? inbox(app).length : 0;
  if (count === 0) return null;
  // Quiet by design: a soft forest chip beside the label on desktop, a small forest dot-count over the icon on phones.
  const style = inline
    ? "ml-1.5 inline-grid bg-forest-soft text-forest-deep"
    : "absolute -right-2 -top-1.5 grid bg-forest text-white ring-2 ring-surface";
  return (
    <span className={`min-w-4.5 place-items-center rounded-full px-1 text-[0.625rem] font-bold leading-4.5 tabular-nums ${style}`}>
      <span className="sr-only">, </span>
      {count}
      <span className="sr-only"> new</span>
    </span>
  );
}

const iconLink = "grid size-10 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink";

function Bars({ pathname }: { pathname: string }) {
  const active = (tab: (typeof tabs)[number]) =>
    [tab.href, ...tab.also].some((root) => pathname === root || pathname.startsWith(`${root}/`));

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur supports-[backdrop-filter]:bg-paper/70">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-2 px-5">
          <Link href="/discover" aria-label={`${brand.name} home`} className="mr-1 shrink-0 sm:mr-2">
            <Logo />
          </Link>

          <HeaderLocation />

          <nav aria-label="Main" className="mx-auto hidden items-center gap-1 md:flex">
            {tabs.slice(0, 4).map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active(tab) ? "page" : undefined}
                className="relative rounded-full px-3.5 py-2 text-sm font-semibold text-muted transition-colors hover:text-ink aria-[current=page]:bg-surface aria-[current=page]:text-ink aria-[current=page]:shadow-sm"
              >
                <span className="relative">
                  {tab.label}
                  {tab.href === "/people" ? <Badge inline /> : null}
                </span>
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1 md:ml-0">
            <Link href="/safety" aria-label="Safety centre" title="Safety centre" className={`${iconLink} hidden sm:grid`}>
              <Icon name="shieldCheck" />
            </Link>
            <ThemeToggle className={iconLink} />
            <Link href="/host" className="btn btn-primary btn-sm ml-1 hidden md:inline-flex">
              <Icon name="plus" className="size-4" />
              Host a plan
            </Link>
            <span className="ml-1">
              <AccountMenu />
            </span>
          </div>
        </div>
      </header>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active(tab) ? "page" : undefined}
            className="flex min-h-16 flex-col items-center justify-center gap-1 text-[0.6875rem] font-semibold text-muted aria-[current=page]:text-forest-deep"
          >
            <span className="relative">
              <Icon name={tab.icon} className="size-6" />
              {tab.href === "/people" ? <Badge /> : null}
            </span>
            {tab.label}
          </Link>
        ))}
      </nav>
    </>
  );
}

function Live() {
  return <Bars pathname={usePathname()} />;
}

/**
 * Sticky header on every size (logo, main sections, safety, theme, host, profile) plus a bottom
 * tab bar on phones. The fallback renders the same bars with no tab highlighted while the pathname resolves.
 */
export function Nav() {
  return (
    <Suspense fallback={<Bars pathname="" />}>
      <Live />
    </Suspense>
  );
}
