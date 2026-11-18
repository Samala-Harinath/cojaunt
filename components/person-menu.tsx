"use client";

import { useState } from "react";
import { blockPerson, mutePerson, unfriend, unmutePerson } from "@/lib/actions";
import type { Person } from "@/lib/people";
import { useApp } from "@/lib/store";
import { blockCopy, ConfirmSheet, unfriendCopy } from "./confirm-sheet";
import { Icon } from "./icon";
import { ReportSheet } from "./report-sheet";
import { Sheet } from "./ui";

type Props = { person: Person; blocked: boolean; connected: boolean };

/**
 * The "…" menu on a profile, from gentlest to strongest: Mute (unfollow), Unfriend, Report, Block.
 * Unfriend and Block ask for confirmation. The other person is never told.
 */
export function PersonMenu({ person, blocked, connected }: Props) {
  const app = useApp();
  const [menu, setMenu] = useState(false);
  const [confirm, setConfirm] = useState<"unfriend" | "block" | null>(null);
  const [report, setReport] = useState(false);
  const muted = app.muted.includes(person.id);
  const close = () => setMenu(false);
  const then = (next: () => void) => () => {
    close();
    next();
  };

  return (
    <>
      <button type="button" aria-label="More options" onClick={() => setMenu(true)} className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface">
        <Icon name="more" />
      </button>

      <Sheet open={menu} onClose={close} title={person.name}>
        <div className="space-y-2">
          {blocked ? null : (
            <button type="button" className="btn btn-line w-full" onClick={then(() => (muted ? unmutePerson(person.id) : mutePerson(person.id)))}>
              <Icon name={muted ? "bell" : "eyeOff"} className="size-4" />
              {muted ? `Unmute ${person.name}` : `Mute ${person.name}`}
            </button>
          )}
          {connected && !blocked ? (
            <button type="button" className="btn btn-line w-full" onClick={then(() => setConfirm("unfriend"))}>
              <Icon name="x" className="size-4" />
              Unfriend {person.name}
            </button>
          ) : null}
          <button type="button" className="btn btn-line w-full" onClick={then(() => setReport(true))}>
            <Icon name="flag" className="size-4" />
            Report {person.name}
          </button>
          {blocked ? null : (
            <button type="button" className="btn btn-line w-full text-danger" onClick={then(() => setConfirm("block"))}>
              Block {person.name}
            </button>
          )}
          <ul className="space-y-1 pt-2 text-xs leading-relaxed text-muted">
            <li>
              <strong className="text-ink">Mute</strong> hides them from Discover and silences their requests.
            </li>
            {connected ? (
              <li>
                <strong className="text-ink">Unfriend</strong> ends the connection and closes your chat.
              </li>
            ) : null}
            <li>
              <strong className="text-ink">Block</strong> hides you from each other everywhere.
            </li>
            <li>They’re never told.</li>
          </ul>
        </div>
      </Sheet>

      {confirm === "unfriend" ? <ConfirmSheet {...unfriendCopy(person.name)} onConfirm={() => unfriend(person.id)} onClose={() => setConfirm(null)} /> : null}
      {confirm === "block" ? <ConfirmSheet {...blockCopy(person.name)} onConfirm={() => blockPerson(person.id)} onClose={() => setConfirm(null)} /> : null}

      <ReportSheet open={report} onClose={() => setReport(false)} about={person.name} personId={person.id} />
    </>
  );
}
