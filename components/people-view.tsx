"use client";

import { useState } from "react";
import { inbox, outbox } from "@/lib/asks";
import { connectionsOf } from "@/lib/derive";
import { useApp } from "@/lib/store";
import { Icon } from "./icon";
import { Pager, usePaged } from "./pagination";
import { ConnectedRow, ReceivedRow, SentRow } from "./request-rows";
import { panelId, tabId, Tabs } from "./tabs";
import { Empty, Top } from "./ui";

type Tab = "received" | "sent" | "connected";

/** Requests in, requests out, and everyone the member is connected with. Opens on Received when something is waiting. */
export function PeopleView() {
  const app = useApp();
  const received = inbox(app);
  const sent = outbox(app).toSorted((a, b) => Number(b.status === "pending") - Number(a.status === "pending"));
  const connected = connectionsOf(app);
  const [picked, setPicked] = useState<Tab | null>(null);
  const tab: Tab = picked ?? (received.length > 0 ? "received" : "connected");
  const paged = usePaged(connected, tab);

  return (
    <div className="mx-auto max-w-2xl">
      <Top title="Requests" sub="Sparks and travel requests, sent and received." />
      <div className="space-y-5 px-5">
        <Tabs
          label="Requests"
          idBase="people"
          value={tab}
          onChange={setPicked}
          items={[
            { id: "received", label: "Received", count: received.length },
            { id: "sent", label: "Sent", count: sent.filter((ask) => ask.status === "pending").length },
            { id: "connected", label: "Connected", count: connected.length },
          ]}
        />

        <div id={panelId("people")} role="tabpanel" aria-labelledby={tabId("people", tab)}>
          {tab === "received" ? (
            received.length > 0 ? (
              <ul className="space-y-3">
                {received.map((ask) => (
                  <ReceivedRow key={ask.id} ask={ask} />
                ))}
              </ul>
            ) : (
              <Empty title="No new requests" body="When someone sends you a Spark or asks to travel with you, it shows up here." href="/discover" cta="Discover people" />
            )
          ) : null}

          {tab === "sent" ? (
            sent.length > 0 ? (
              <ul className="space-y-3">
                {sent.map((ask) => (
                  <SentRow key={ask.id} ask={ask} unfriendedIds={app.unfriended} />
                ))}
              </ul>
            ) : (
              <Empty title="You haven’t sent anything yet" body="Open someone’s profile and send a Spark or a travel request." href="/discover" cta="Discover people" />
            )
          ) : null}

          {tab === "connected" ? (
            connected.length > 0 ? (
              <>
                <ul className="space-y-3">
                  {paged.items.map((connection) => (
                    <ConnectedRow key={connection.person.id} connection={connection} />
                  ))}
                </ul>
                <Pager page={paged.page} pages={paged.pages} total={paged.total} onPage={paged.setPage} label="Connection pages" />
              </>
            ) : (
              <Empty title="No connections yet" body="Accept a request, or have one of yours accepted, and they’ll appear here." href="/discover" cta="Discover people" />
            )
          ) : null}
        </div>

        <p className="flex items-start gap-2 px-1 text-xs leading-relaxed text-muted">
          <Icon name="lock" className="mt-px size-4" />
          Declining is silent: they only see “Not this time” and can’t ask again. You can unfriend anyone in Connected, and mute or block anyone from the “…” on their profile. Nobody is told.
        </p>
      </div>
    </div>
  );
}
