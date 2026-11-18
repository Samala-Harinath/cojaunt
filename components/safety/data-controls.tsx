"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icon";
import { resetDemo } from "@/lib/actions";
import { brand } from "@/lib/brand";
import { useApp, type State } from "@/lib/store";

function download(state: State) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${brand.name.toLowerCase()}-my-data.json`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Access and erasure. Both act on the copy held in this browser, which is all the prototype stores.
 * A real account is erased from Account & security (it asks for the password); the sample member is just reset here.
 */
export function DataControls() {
  const app = useApp();
  const [confirming, setConfirming] = useState(false);

  return (
    <section className="card p-5" aria-labelledby="data-heading">
      <h2 id="data-heading" className="font-display text-2xl">
        Your data
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        Everything this prototype knows about you is stored in this browser and nowhere else. You can take a copy or erase it at any time.
      </p>

      <div className="mt-4 space-y-2">
        <button type="button" className="btn btn-line w-full" onClick={() => download(app)}>
          <Icon name="download" className="size-4" />
          Download my data
        </button>

        {!app.isDemo ? (
          <Link href="/account#delete" className="btn btn-line w-full text-danger">
            <Icon name="trash" className="size-4" />
            Delete my account and data
          </Link>
        ) : confirming ? (
          <div role="alert" className="rounded-2xl bg-spark-soft p-4">
            <p className="text-sm font-bold">Erase everything on this device?</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Your profile, bookings, messages and reflections are removed, and the app returns to the sample member. This can’t be undone.
            </p>
            <div className="mt-3 flex gap-2">
              <button type="button" className="btn btn-line btn-sm flex-1" onClick={() => setConfirming(false)}>
                Keep my data
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm flex-1"
                onClick={() => {
                  resetDemo();
                  setConfirming(false);
                }}
              >
                Erase
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className="btn btn-line w-full text-danger" onClick={() => setConfirming(true)}>
            <Icon name="trash" className="size-4" />
            Erase my data
          </button>
        )}
      </div>
    </section>
  );
}
