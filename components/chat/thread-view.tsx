"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/avatar";
import { Icon } from "@/components/icon";
import { ReportSheet } from "@/components/report-sheet";
import { Empty, Sheet } from "@/components/ui";
import { blockCopy, ConfirmSheet, unfriendCopy } from "@/components/confirm-sheet";
import { blockPerson, unfriend } from "@/lib/actions";
import { companions } from "@/lib/derive";
import { getPerson } from "@/lib/directory";
import { useApp } from "@/lib/store";
import { findThread } from "@/lib/threads";
import { Composer } from "./composer";
import { PollCard } from "./poll";

/** S14: group chat per plan, and 1:1 chats that exist only after a mutual signal. */
export function ThreadView({ id }: { id: string }) {
  const app = useApp();
  const router = useRouter();
  const thread = findThread(app, id);
  const [menu, setMenu] = useState(false);
  const [report, setReport] = useState(false);
  const [confirm, setConfirm] = useState<"unfriend" | "block" | null>(null);
  const end = useRef<HTMLDivElement>(null);
  const count = thread?.messages.length ?? 0;

  useEffect(() => {
    end.current?.scrollIntoView({ block: "end" });
  }, [count]);

  if (!thread) {
    return (
      <div className="px-5 pt-10">
        <Empty
          title="This chat isn’t open"
          body="Group chats open when your seat is confirmed. Private chats open only after you’ve met and both chosen to stay in touch."
          href="/chats"
          cta="Back to chats"
        />
      </div>
    );
  }

  const group = thread.kind === "group";
  const host = group ? getPerson(thread.plan.hostId) : null;
  const members = group ? [getPerson(thread.plan.hostId), ...companions(app, thread.plan)] : [thread.connection.person];
  const sub = group
    ? `${members.length + 1} people · hosted by ${host?.name}`
    : thread.connection.kind === "spark"
      ? "Spark · private to the two of you"
      : "Travel buddy · private to the two of you";

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex items-center gap-3 border-b border-line px-4 py-3">
        <Link href="/chats" aria-label="Back to chats" className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface">
          <Icon name="left" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-xl leading-tight">{thread.title}</h1>
          <p className="truncate text-xs text-muted">{sub}</p>
        </div>
        <button type="button" onClick={() => setMenu(true)} aria-label="Chat options" className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface">
          <Icon name="more" />
        </button>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {group ? (
          <p className="flex gap-2 rounded-2xl bg-forest-soft px-3.5 py-3 text-sm text-forest-deep">
            <Icon name="pinned" className="mt-px size-4" />
            {thread.pinned}
          </p>
        ) : null}
        {group && thread.poll ? <PollCard threadId={thread.id} poll={thread.poll} /> : null}

        <ul className="space-y-3">
          {thread.messages.map((message) => {
            const mine = message.from === "me";
            const person = getPerson(message.from);
            return (
              <li key={message.id} className={`flex items-end gap-2 ${mine ? "justify-end" : ""}`}>
                {mine ? null : <Avatar name={person.name} hue={person.hue} size={32} />}
                <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm ${mine ? "rounded-br-md bg-forest text-white" : "rounded-bl-md border border-line bg-surface"}`}>
                  {group && !mine ? (
                    <p className="mb-0.5 text-xs font-bold text-forest">
                      {person.name}
                      {person.id === host?.id ? " · Host" : ""}
                    </p>
                  ) : null}
                  <p className="leading-relaxed">{message.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <div ref={end} />
      </div>

      <Composer threadId={thread.id} />

      <Sheet open={menu} onClose={() => setMenu(false)} title={group ? "In this chat" : thread.title}>
        <ul className="space-y-3">
          {members.map((person) => (
            <li key={person.id} className="flex items-center gap-3 text-sm font-semibold">
              <Avatar name={person.name} hue={person.hue} size={36} />
              {person.name}
              {person.id === host?.id ? <span className="tag bg-forest-soft text-forest-deep">Host</span> : null}
            </li>
          ))}
        </ul>
        <div className="mt-5 space-y-2">
          {group ? (
            <Link href={`/plans/${thread.plan.id}`} className="btn btn-soft w-full">
              View the plan
            </Link>
          ) : null}
          <button
            type="button"
            className="btn btn-line w-full"
            onClick={() => {
              setMenu(false);
              setReport(true);
            }}
          >
            <Icon name="flag" className="size-4" />
            Report
          </button>
          {group ? null : (
            <>
              <Link href={`/u/${thread.connection.person.id}`} className="btn btn-soft w-full">
                View profile
              </Link>
              <button
                type="button"
                className="btn btn-line w-full"
                onClick={() => {
                  setMenu(false);
                  setConfirm("unfriend");
                }}
              >
                Unfriend {thread.title}
              </button>
              <button
                type="button"
                className="btn btn-line w-full text-danger"
                onClick={() => {
                  setMenu(false);
                  setConfirm("block");
                }}
              >
                Block {thread.title}
              </button>
            </>
          )}
        </div>
      </Sheet>

      {!group && confirm === "unfriend" ? (
        <ConfirmSheet
          {...unfriendCopy(thread.title)}
          onConfirm={() => {
            unfriend(thread.connection.person.id);
            router.push("/chats");
          }}
          onClose={() => setConfirm(null)}
        />
      ) : null}
      {!group && confirm === "block" ? (
        <ConfirmSheet
          {...blockCopy(thread.title)}
          onConfirm={() => {
            blockPerson(thread.connection.person.id);
            router.push("/chats");
          }}
          onClose={() => setConfirm(null)}
        />
      ) : null}

      <ReportSheet
        open={report}
        onClose={() => setReport(false)}
        about={group ? "something in this chat" : thread.title}
        personId={group ? undefined : thread.connection.person.id}
      />
    </div>
  );
}
