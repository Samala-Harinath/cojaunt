"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui";
import { patchMe } from "@/lib/actions";
import { interestOptions } from "@/lib/people";
import type { Me } from "@/lib/store";

/** Mount this only while open, so the draft starts from the saved profile each time. */
export function EditSheet({ me, onClose }: { me: Me; onClose: () => void }) {
  const [work, setWork] = useState(me.work);
  const [bio, setBio] = useState(me.bio);
  const [interests, setInterests] = useState(me.interests);
  const [error, setError] = useState("");

  function toggle(tag: string) {
    setInterests((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  }

  function save() {
    if (interests.length < 3) return setError("Keep at least three interests.");
    patchMe({ work: work.trim(), bio: bio.trim(), interests });
    onClose();
  }

  return (
    <Sheet open onClose={onClose} title="Edit profile">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <div>
          <label htmlFor="work" className="text-sm font-semibold">
            What you do
          </label>
          <input id="work" value={work} onChange={(event) => setWork(event.target.value)} maxLength={60} className="field mt-2" />
        </div>
        <div>
          <label htmlFor="bio" className="text-sm font-semibold">
            About you
          </label>
          <textarea id="bio" value={bio} onChange={(event) => setBio(event.target.value)} rows={3} maxLength={200} className="field mt-2 resize-none" />
          <p className="mt-1 text-right text-xs text-muted">{bio.length}/200</p>
        </div>
        <fieldset>
          <legend className="text-sm font-semibold">Interests</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {interestOptions.map((tag) => (
              <button key={tag} type="button" className="chip" aria-pressed={interests.includes(tag)} onClick={() => toggle(tag)}>
                {tag}
              </button>
            ))}
          </div>
        </fieldset>
        <p role="alert" className="min-h-5 text-sm font-semibold text-danger">
          {error}
        </p>
        <button type="submit" className="btn btn-primary w-full">
          Save
        </button>
      </form>
    </Sheet>
  );
}
