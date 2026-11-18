"use client";

import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { Icon } from "@/components/icon";
import { Proto } from "@/components/ui";
import { connectionsOf } from "@/lib/derive";
import type { Plan } from "@/lib/plans";
import { useApp } from "@/lib/store";

/** Shown once the member has reflected. Only mutual choices appear, in both directions. */
export function Done({ plan }: { plan: Plan }) {
  const app = useApp();
  const mutual = connectionsOf(app).filter((connection) => connection.planId === plan.id);

  return (
    <div className="rise flex flex-1 flex-col px-5 pb-8 pt-10">
      <span className="grid size-14 place-items-center rounded-full bg-forest-soft text-forest">
        <Icon name="check" className="size-7" />
      </span>
      <h1 className="mt-5 font-display text-4xl leading-tight">Saved, and private.</h1>
      <p className="mt-2 text-muted">Choices that weren’t mutual stay hidden, on both sides. Nobody is told who you picked or skipped.</p>

      {mutual.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {mutual.map(({ person, kind }) => (
            <li key={person.id} className={`flex items-center gap-3 rounded-2xl p-4 ${kind === "spark" ? "bg-spark-soft" : "bg-forest-soft"}`}>
              <Avatar name={person.name} hue={person.hue} size={48} />
              <p className="min-w-0 flex-1 text-sm">
                <strong className="block">{kind === "spark" ? `You and ${person.name} both chose Spark` : `${person.name} wants to travel again too`}</strong>
                <span className="text-muted">{kind === "spark" ? "A private chat is open." : "You’re now travel buddies."}</span>
              </p>
              <Link href={`/chats/dm-${person.id}`} className="btn btn-primary btn-sm">
                Say hello
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="card mt-6 p-5 text-sm leading-relaxed text-muted">
          Nothing mutual from this plan, which is common. Most plans end with a good day out and nothing more.
        </p>
      )}

      <div className="mt-6">
        <Proto>
          Other members’ choices are sample data. In the live app, results appear when the 7-day reflection window closes.
        </Proto>
      </div>

      <div className="mt-auto space-y-2 pt-8">
        <Link href="/people" className="btn btn-primary w-full">
          See your people
        </Link>
        <Link href="/discover" className="btn btn-line w-full">
          Find your next plan
        </Link>
      </div>
    </div>
  );
}
