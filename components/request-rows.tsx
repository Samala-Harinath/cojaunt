"use client";

import Link from "next/link";
import { useState } from "react";
import { acceptAsk, declineAsk, unfriend, withdrawAsk } from "@/lib/actions";
import { askInfo } from "@/lib/asks";
import type { Connection } from "@/lib/derive";
import { getPerson } from "@/lib/directory";
import { getPlan } from "@/lib/plans";
import type { Ask } from "@/lib/store";
import { ConfirmSheet, unfriendCopy } from "./confirm-sheet";
import { Icon } from "./icon";
import { PersonPhoto } from "./photo";

function Face({ personId, size = "size-14" }: { personId: string; size?: string }) {
  const person = getPerson(personId);
  return (
    <Link href={`/u/${person.id}`} aria-label={`Open ${person.name}’s profile`} className={`${size} shrink-0 overflow-hidden rounded-2xl`}>
      <PersonPhoto person={person} className="size-full" />
    </Link>
  );
}

function KindTag({ ask }: { ask: Ask }) {
  const info = askInfo[ask.kind];
  return (
    <span className={`tag ${info.tone}`}>
      <Icon name={info.icon} className="size-3" />
      {info.name}
    </span>
  );
}

/** Someone who sent the member a request. Accept or decline right here, or tap the photo to see the profile first. */
export function ReceivedRow({ ask }: { ask: Ask }) {
  const person = getPerson(ask.personId);
  return (
    <li className="card p-4">
      <div className="flex items-start gap-3">
        <Face personId={person.id} />
        <div className="min-w-0 flex-1">
          <p className="font-bold">
            {person.name}, {person.age}
          </p>
          <p className="truncate text-sm text-muted">{person.work}</p>
          <div className="mt-1.5">
            <KindTag ask={ask} />
          </div>
        </div>
      </div>
      {ask.note ? <p className="mt-3 rounded-xl bg-paper p-3 text-sm leading-relaxed">“{ask.note}”</p> : null}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" className="btn btn-line btn-sm" onClick={() => declineAsk(ask.id)}>
          Not now
        </button>
        <button type="button" className={`btn btn-sm ${ask.kind === "spark" ? "btn-spark" : "btn-primary"}`} onClick={() => acceptAsk(ask.id)}>
          Accept
        </button>
      </div>
    </li>
  );
}

const sentLabel = { pending: "Waiting for a reply", accepted: "Accepted", declined: "Not this time", ended: "No longer connected" } as const;

export function SentRow({ ask, unfriendedIds }: { ask: Ask; unfriendedIds: string[] }) {
  const person = getPerson(ask.personId);
  return (
    <li className="card flex items-center gap-3 p-3">
      <Face personId={person.id} size="size-12" />
      <div className="min-w-0 flex-1">
        <p className="font-bold">{person.name}</p>
        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <KindTag ask={ask} />
          {sentLabel[ask.status]}
        </p>
      </div>
      {ask.status === "pending" ? (
        <button type="button" className="btn btn-line btn-sm" onClick={() => withdrawAsk(ask.id)}>
          Withdraw
        </button>
      ) : ask.status === "accepted" && !unfriendedIds.includes(person.id) ? (
        <Link href={`/chats/dm-${person.id}`} className="btn btn-soft btn-sm">
          Message
        </Link>
      ) : null}
    </li>
  );
}

export function ConnectedRow({ connection }: { connection: Connection }) {
  const { person } = connection;
  const [confirm, setConfirm] = useState(false);
  const where = connection.via === "plan" ? `Met on ${getPlan(connection.planId ?? "")?.title ?? "a plan"}` : "Accepted a request";
  return (
    <li className="card flex flex-wrap items-center gap-3 p-3">
      <Face personId={person.id} size="size-12" />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 font-bold">
          {person.name}
          <span className={`tag ${connection.kind === "spark" ? "bg-spark-soft text-spark" : "bg-forest-soft text-forest-deep"}`}>
            {connection.kind === "spark" ? "Spark" : "Travel buddy"}
          </span>
        </p>
        <p className="truncate text-xs text-muted">{where}</p>
      </div>
      <div className="flex gap-2">
        <Link href={`/chats/dm-${person.id}`} className="btn btn-soft btn-sm">
          <Icon name="chat" className="size-4" />
          Message
        </Link>
        <button type="button" className="btn btn-line btn-sm" onClick={() => setConfirm(true)} aria-label={`Unfriend ${person.name}`}>
          Unfriend
        </button>
      </div>
      {confirm ? <ConfirmSheet {...unfriendCopy(person.name)} onConfirm={() => unfriend(person.id)} onClose={() => setConfirm(false)} /> : null}
    </li>
  );
}
