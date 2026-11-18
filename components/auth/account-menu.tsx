"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/avatar";
import { Icon, type IconName } from "@/components/icon";
import { currentAccount, signOut } from "@/lib/auth/client";
import { maskEmail } from "@/lib/auth/rules";
import { useApp, useHydrated } from "@/lib/store";

const items: { href: string; label: string; icon: IconName }[] = [
  { href: "/profile", label: "Your profile", icon: "user" },
  { href: "/account", label: "Account & security", icon: "lock" },
  { href: "/safety", label: "Safety centre", icon: "shieldCheck" },
  { href: "/host", label: "Host dashboard", icon: "calendar" },
];

/** The avatar in the header. Opens a small menu with profile, account and sign out. */
export function AccountMenu() {
  const { me, isDemo } = useApp();
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (box.current && !box.current.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  const email = hydrated ? currentAccount()?.email : undefined;

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="block rounded-full ring-2 ring-transparent transition hover:ring-line"
      >
        <Avatar name={me.name} hue={me.hue} src={me.photos[0]} size={36} />
      </button>

      {open ? (
        <div role="menu" aria-label="Account" className="absolute right-0 top-full z-40 mt-2 w-64 overflow-hidden rounded-2xl border border-line bg-surface shadow-xl">
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-bold">{me.name}</p>
            <p className="truncate text-xs text-muted">{isDemo && !email ? "Sample member (demo)" : email ? maskEmail(email) : ""}</p>
          </div>
          <div className="p-1.5">
            {items.map((item) => (
              <Link key={item.href} href={item.href} role="menuitem" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-paper">
                <Icon name={item.icon} className="size-4.5 text-muted" />
                {item.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-line p-1.5">
            <button
              type="button"
              role="menuitem"
              disabled={busy}
              onClick={() => {
                setBusy(true);
                void signOut();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-danger hover:bg-paper disabled:opacity-50"
            >
              <Icon name="logout" className="size-4.5" />
              {busy ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
