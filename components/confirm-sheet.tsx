"use client";

import { Sheet } from "./ui";

type Props = { title: string; body: string; action: string; onConfirm: () => void; onClose: () => void };

/** A plain "are you sure?" for actions that are hard to undo, like unfriending or blocking. Mount only while open. */
export function ConfirmSheet({ title, body, action, onConfirm, onClose }: Props) {
  return (
    <Sheet open onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-muted">{body}</p>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className="btn btn-line" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {action}
          </button>
        </div>
      </div>
    </Sheet>
  );
}

export const unfriendCopy = (name: string) => ({
  title: `Unfriend ${name}?`,
  body: `Your chat with ${name} closes, and your private details are hidden from each other again. ${name} isn’t told. Either of you can send a new request later.`,
  action: "Unfriend",
});

export const blockCopy = (name: string) => ({
  title: `Block ${name}?`,
  body: `You won’t see each other anywhere: profiles, requests, chats and group plans. Any open request closes. ${name} isn’t told.`,
  action: "Block",
});
