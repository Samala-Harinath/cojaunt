"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { addContact, removeContact } from "@/lib/actions";
import { useApp } from "@/lib/store";

const MAX = 3;

export function Contacts() {
  const { contacts } = useApp();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function add() {
    const digits = phone.replace(/\D/g, "");
    if (name.trim().length < 2) return setError("Enter their name.");
    if (!/^[6-9]\d{9}$/.test(digits)) return setError("Enter a 10-digit Indian mobile number.");
    addContact({ name: name.trim(), phone: `${digits.slice(0, 5)} ${digits.slice(5)}` });
    setName("");
    setPhone("");
    setError("");
  }

  return (
    <section className="card p-5" aria-labelledby="contacts-heading">
      <h2 id="contacts-heading" className="font-display text-2xl">
        Emergency contacts
      </h2>
      <p className="mt-1 text-sm text-muted">The people who hear from us if you raise an SOS, and who can receive your trip details.</p>

      {contacts.length > 0 ? (
        <ul className="mt-3 divide-y divide-line">
          {contacts.map((contact, i) => (
            <li key={`${contact.name}-${contact.phone}`} className="flex items-center gap-3 py-2.5 text-sm">
              <Icon name="phone" className="size-4 text-forest" />
              <span className="min-w-0 flex-1">
                <strong>{contact.name}</strong> <span className="text-muted">+91 {contact.phone}</span>
              </span>
              <button type="button" className="btn btn-line btn-sm" onClick={() => removeContact(i)} aria-label={`Remove ${contact.name}`}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-xl bg-marigold-soft px-3 py-2.5 text-sm text-amber-ink">Add at least one contact before your first overnight trip.</p>
      )}

      {contacts.length < MAX ? (
        <form
          noValidate
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            add();
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="text-sm font-semibold">
                Name
              </label>
              <input id="contact-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={40} className="field mt-2" />
            </div>
            <div>
              <label htmlFor="contact-phone" className="text-sm font-semibold">
                Mobile number
              </label>
              <input id="contact-phone" type="tel" inputMode="numeric" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="98765 43210" className="field mt-2" />
            </div>
          </div>
          <p role="alert" className="min-h-5 text-sm font-semibold text-danger">
            {error}
          </p>
          <button type="submit" className="btn btn-soft btn-sm">
            <Icon name="plus" className="size-4" />
            Add contact
          </button>
        </form>
      ) : (
        <p className="mt-3 text-xs text-muted">You can have up to {MAX} contacts. Remove one to add another.</p>
      )}
    </section>
  );
}
