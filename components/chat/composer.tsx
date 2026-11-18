"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { sendMessage } from "@/lib/actions";
import { scanMessage, type Flag } from "@/lib/safety";

/** Message box with scam screening. A flagged message is held for a second look, never blocked. */
export function Composer({ threadId }: { threadId: string }) {
  const [text, setText] = useState("");
  const [flag, setFlag] = useState<Flag | null>(null);

  function send(force: boolean) {
    const body = text.trim();
    if (!body) return;
    const found = force ? null : scanMessage(body);
    if (found) {
      setFlag(found);
      return;
    }
    sendMessage(threadId, body);
    setText("");
    setFlag(null);
  }

  return (
    <div className="border-t border-line bg-paper px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
      {flag ? (
        <div role="alert" className="mb-3 rounded-2xl bg-marigold-soft p-3.5 text-amber-ink">
          <p className="flex items-center gap-2 text-sm font-bold">
            <Icon name="alert" className="size-4" />
            {flag.title}
          </p>
          <p className="mt-1 text-xs leading-relaxed">{flag.advice}</p>
          <div className="mt-3 flex gap-2">
            <button type="button" className="btn btn-line btn-sm" onClick={() => setFlag(null)}>
              Edit message
            </button>
            <button type="button" className="btn btn-sm bg-amber-ink text-paper" onClick={() => send(true)}>
              Send anyway
            </button>
          </div>
        </div>
      ) : null}

      <form
        className="flex items-end gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          send(false);
        }}
      >
        <label htmlFor="message" className="sr-only">
          Message
        </label>
        <input
          id="message"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setFlag(null);
          }}
          placeholder="Write a message"
          autoComplete="off"
          maxLength={500}
          className="field rounded-full"
        />
        <button type="submit" aria-label="Send message" disabled={!text.trim()} className="btn btn-primary size-12 shrink-0 px-0">
          <Icon name="send" />
        </button>
      </form>
      <p className="mt-2 text-center text-[0.6875rem] text-muted">Prototype: messages are saved on this device only. Nobody receives them.</p>
    </div>
  );
}
