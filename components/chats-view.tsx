"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { senderName, threadsOf, type Thread } from "@/lib/threads";
import { Avatar } from "./avatar";
import { Icon } from "./icon";
import { Pager, usePaged } from "./pagination";
import { Scene } from "./scene";
import { Empty, Top } from "./ui";

function Row({ thread }: { thread: Thread }) {
  const last = thread.messages.at(-1);
  const preview = last ? `${senderName(last.from)}: ${last.text}` : "No messages yet. Say hello.";

  return (
    <li>
      <Link href={`/chats/${thread.id}`} className="flex items-center gap-3 px-4 py-3.5">
        {thread.kind === "group" ? (
          <Scene name={thread.plan.scene} className="size-12 shrink-0 rounded-full" />
        ) : (
          <Avatar name={thread.connection.person.name} hue={thread.connection.person.hue} size={48} />
        )}
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2">
            <span className="truncate text-sm font-bold">{thread.title}</span>
            {thread.kind === "dm" && thread.connection.kind === "spark" ? <span className="tag bg-spark-soft text-spark">Spark</span> : null}
            {thread.kind === "dm" && thread.connection.kind === "friend" ? <span className="tag bg-forest-soft text-forest-deep">Travel buddy</span> : null}
            {thread.kind === "group" && thread.plan.past ? <span className="tag bg-line text-muted">Ended</span> : null}
          </p>
          <p className="mt-0.5 truncate text-sm text-muted">{preview}</p>
        </div>
        <span className="shrink-0 text-xs text-muted">{last?.at}</span>
      </Link>
    </li>
  );
}

export function ChatsView() {
  const app = useApp();
  const all = threadsOf(app);
  const paged = usePaged(all, String(all.length));
  const threads = paged.items;

  return (
    <div className="mx-auto max-w-2xl">
      <Top title="Chats" />
      <div className="space-y-4 px-5">
        {threads.length > 0 ? (
          <>
            <ul className="card divide-y divide-line overflow-hidden">
              {threads.map((thread) => (
                <Row key={thread.id} thread={thread} />
              ))}
            </ul>
            <Pager page={paged.page} pages={paged.pages} total={paged.total} onPage={paged.setPage} label="Chat pages" />
          </>
        ) : (
          <Empty
            title="No chats yet"
            body="A group chat opens when your seat on a plan is confirmed. A private chat opens when someone accepts your Spark or travel request, or you accept theirs."
            href="/discover"
            cta="Find a plan"
          />
        )}
        <p className="flex items-start gap-2 px-1 text-xs leading-relaxed text-muted">
          <Icon name="lock" className="mt-px size-4" />
          Nobody can message you out of the blue. Every chat starts from a plan you joined or a request you accepted.
        </p>
      </div>
    </div>
  );
}
