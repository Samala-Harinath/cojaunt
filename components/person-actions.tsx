"use client";

import Link from "next/link";
import { acceptAsk, declineAsk, simulateReply, unblockPerson, withdrawAsk } from "@/lib/actions";
import { askInfo, type Relation } from "@/lib/asks";
import { canSpark } from "@/lib/derive";
import type { Person } from "@/lib/people";
import { useApp, type AskKind } from "@/lib/store";
import { Icon } from "./icon";
import { Proto } from "./ui";

type Props = { person: Person; relation: Relation; onAsk: (kind: AskKind) => void };

/** What the member can do with this person right now. One clear block, never more than two main buttons. */
export function PersonActions({ person, relation, onAsk }: Props) {
  const app = useApp();
  const spark = canSpark(app.me, person);

  switch (relation.kind) {
    case "blocked":
      return (
        <div className="card space-y-3 p-4 text-sm">
          <p>You’ve blocked {person.name}. You won’t see each other anywhere.</p>
          <button type="button" className="btn btn-line btn-sm" onClick={() => unblockPerson(person.id)}>
            Unblock
          </button>
        </div>
      );
    case "connected":
      return (
        <Link href={`/chats/dm-${person.id}`} className="btn btn-primary w-full">
          <Icon name="chat" />
          Message {person.name}
        </Link>
      );
    case "incoming": {
      const { ask } = relation;
      const info = askInfo[ask.kind];
      return (
        <div className={`space-y-3 rounded-2xl p-4 ${ask.kind === "spark" ? "bg-spark-soft" : "bg-forest-soft"}`}>
          <p className="flex items-center gap-2 text-sm font-bold">
            <Icon name={info.icon} className="size-4" />
            {person.name} {info.received}
          </p>
          {ask.note ? <p className="rounded-xl bg-surface p-3 text-sm leading-relaxed">“{ask.note}”</p> : null}
          <p className="text-xs text-muted">Accepting opens a private chat and shows each of you the other’s private details.</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className="btn btn-line" onClick={() => declineAsk(ask.id)}>
              Not now
            </button>
            <button type="button" className={`btn ${ask.kind === "spark" ? "btn-spark" : "btn-primary"}`} onClick={() => acceptAsk(ask.id)}>
              Accept
            </button>
          </div>
        </div>
      );
    }
    case "outgoing": {
      const { ask } = relation;
      return (
        <div className="card space-y-3 p-4">
          <p className="flex items-center gap-2 text-sm font-bold">
            <Icon name="clock" className="size-4 text-forest" />
            {askInfo[ask.kind].name} sent. Waiting for {person.name}.
          </p>
          <button type="button" className="btn btn-line btn-sm" onClick={() => withdrawAsk(ask.id)}>
            Withdraw
          </button>
          <Proto>
            There’s nobody on the other end yet.{" "}
            <button type="button" className="font-bold underline underline-offset-2" onClick={() => simulateReply(ask.id, "accepted")}>
              Simulate accept
            </button>{" "}
            ·{" "}
            <button type="button" className="font-bold underline underline-offset-2" onClick={() => simulateReply(ask.id, "declined")}>
              Simulate decline
            </button>
          </Proto>
        </div>
      );
    }
    case "closed":
      return <p className="card p-4 text-sm text-muted">Not this time. This request is closed.</p>;
    case "ended":
    case "none":
      return (
        <div className={`grid gap-2 ${spark ? "grid-cols-2" : ""}`}>
          {relation.kind === "ended" ? (
            <p className={`text-xs text-muted ${spark ? "col-span-2" : ""}`}>You’re no longer connected. You can send a new request if you’d like to reconnect.</p>
          ) : null}
          {spark ? (
            <button type="button" className="btn btn-spark" onClick={() => onAsk("spark")}>
              <Icon name="spark" />
              Spark
            </button>
          ) : null}
          <button type="button" className="btn btn-primary" onClick={() => onAsk("travel")}>
            <Icon name="compass" />
            Travel together
          </button>
        </div>
      );
  }
}
