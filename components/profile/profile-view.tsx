"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/avatar";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Icon, type IconName } from "@/components/icon";
import { Top } from "@/components/ui";
import { resetDemo } from "@/lib/actions";
import { getPerson } from "@/lib/directory";
import { getPlan } from "@/lib/plans";
import { reviewsOfMe } from "@/lib/social";
import { useApp } from "@/lib/store";
import { DetailsEditor } from "./details-editor";
import { EditSheet } from "./edit-sheet";
import { PhotoManager } from "./photo-manager";
import { VibeEditor } from "./vibe-editor";

const links: { href: string; icon: IconName; label: string; hint: string }[] = [
  { href: "/safety", icon: "shieldCheck", label: "Safety centre", hint: "Emergency contacts, verification, privacy and your data" },
  { href: "/account", icon: "lock", label: "Account & security", hint: "Password, sign out and delete your account" },
  { href: "/host", icon: "calendar", label: "Host dashboard", hint: "Create a plan, approve requests, see payouts" },
  { href: "/plus", icon: "star", label: "Plus membership", hint: "No platform fee and early access to new trips" },
];

/** S18: badges, completed plans, reviews and editing. */
export function ProfileView() {
  const app = useApp();
  const { me } = app;
  const [editing, setEditing] = useState(false);
  const done = app.bookings.filter((booking) => booking.status === "confirmed" && getPlan(booking.planId)?.past).length;
  // Reviews come from co-travellers on past plans the member actually attended.
  const attended = new Set(app.bookings.filter((booking) => booking.status === "confirmed").map((booking) => booking.planId));
  const reviews = reviewsOfMe.filter((review) => attended.has(review.planId) && !app.blocked.includes(review.from));

  return (
    <div className="mx-auto max-w-2xl">
      <Top
        title="You"
        right={
          <button type="button" className="btn btn-line btn-sm" onClick={() => setEditing(true)}>
            Edit
          </button>
        }
      />
      <div className="space-y-5 px-5">
        <section className="card p-5" aria-label="Your profile">
          <div className="flex items-center gap-4">
            <Avatar name={me.name} hue={me.hue} src={me.photos[0]} size={72} />
            <div className="min-w-0">
              <p className="font-display text-2xl">
                {me.name}, {me.age}
              </p>
              <p className="text-sm text-muted">{[me.pronouns, me.work].filter(Boolean).join(" · ")}</p>
            </div>
          </div>
          {me.bio ? <p className="mt-4 text-sm leading-relaxed">{me.bio}</p> : null}
          <div className="mt-4 flex flex-wrap gap-2">
            {me.selfieVerified ? <span className="tag bg-forest-soft text-forest-deep">Selfie verified</span> : null}
            <span className={`tag ${me.idVerified ? "bg-forest-soft text-forest-deep" : "bg-line text-muted"}`}>{me.idVerified ? "ID verified" : "ID not verified yet"}</span>
            <span className="tag bg-line text-muted">{me.status === "married" ? "Married" : "Single"}</span>
            <span className="tag bg-marigold-soft text-amber-ink">
              {done} {done === 1 ? "plan" : "plans"} completed
            </span>
            {me.plus ? <span className="tag bg-ink text-paper">Plus</span> : null}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {me.interests.map((tag) => (
              <span key={tag} className="chip min-h-8">
                {tag}
              </span>
            ))}
          </div>
        </section>

        <PhotoManager />

        <DetailsEditor />

        <VibeEditor me={me} />

        <section aria-labelledby="reviews-heading">
          <h2 id="reviews-heading" className="font-display text-2xl">
            What co-travellers said
          </h2>
          {reviews.length > 0 ? (
            <ul className="mt-3 space-y-3">
              {reviews.map((review) => (
                <li key={`${review.from}-${review.planId}`} className="card p-4 text-sm">
                  <p className="leading-relaxed">“{review.text}”</p>
                  <p className="mt-2 text-xs text-muted">
                    {getPerson(review.from).name} · {getPlan(review.planId)?.title}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted">Reviews from people you’ve travelled with appear here after your first plan.</p>
          )}
        </section>

        <ul className="card divide-y divide-line">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="flex items-center gap-3 px-4 py-3.5">
                <Icon name={link.icon} className="size-5 text-forest" />
                <span className="min-w-0 flex-1 text-sm">
                  <strong className="block">{link.label}</strong>
                  <span className="text-muted">{link.hint}</span>
                </span>
                <Icon name="right" className="size-4 text-muted" />
              </Link>
            </li>
          ))}
        </ul>

        <section className="rounded-2xl bg-marigold-soft p-4 text-sm text-amber-ink" aria-label="Prototype notice">
          <p>
            <strong>Prototype.</strong> {app.isDemo ? "You’re viewing a sample member." : "This profile is saved on this device only."}
          </p>
          {app.isDemo ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <SignOutButton to="/register" className="btn btn-line btn-sm">
                Create my own account
              </SignOutButton>
              <button type="button" className="btn btn-line btn-sm" onClick={resetDemo}>
                Reset to the sample member
              </button>
            </div>
          ) : null}
        </section>

        <SignOutButton className="btn btn-line w-full">
          <Icon name="logout" className="size-4" />
          Sign out
        </SignOutButton>
      </div>

      {editing ? <EditSheet me={me} onClose={() => setEditing(false)} /> : null}
    </div>
  );
}
