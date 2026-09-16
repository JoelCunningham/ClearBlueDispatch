"use client";

import type { Dispatch, SetStateAction } from "react";

import { ContactFormItem } from "../types";
import { Plus, Trash } from "lucide-react";

type ContactSectionProps = {
  contacts: ContactFormItem[];
  setContacts: Dispatch<SetStateAction<ContactFormItem[]>>;
};

export function ContactSection({ contacts, setContacts }: ContactSectionProps) {
  function addContact() {
    setContacts(current => [...current, { name: "", phoneNumber: "" }]);
  }

  function removeContact(index: number) {
    setContacts(current => current.filter((_, currentIndex) => currentIndex !== index));
  }

  function updateContact(index: number, field: "name" | "phoneNumber", value: string) {
    setContacts(current =>
      current.map((contact, currentIndex) => (currentIndex === index ? { ...contact, [field]: value } : contact))
    );
  }

  return (
    <section className="space-y-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Contacts</h2>
          <p className="text-sm text-muted-foreground">Add contacts for this customer.</p>
        </div>

        <button
          type="button"
          onClick={addContact}
          className="shrink-0 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          <Plus />
        </button>
      </div>

      {contacts.length === 0 ? (
        <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">No contacts added.</div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact, index) => (
            <div key={contact.id ?? `new-${index}`} className="space-y-3 rounded-md border p-3">
              <input
                type="text"
                value={contact.name}
                onChange={event => updateContact(index, "name", event.target.value)}
                disabled={contact.id !== undefined}
                placeholder="Name"
                className="w-full rounded-md border bg-background px-3 py-2 disabled:bg-muted"
              />

              <input
                type="tel"
                value={contact.phoneNumber}
                onChange={event => updateContact(index, "phoneNumber", event.target.value)}
                disabled={contact.id !== undefined}
                placeholder="Phone number"
                className="w-full rounded-md border bg-background px-3 py-2 disabled:bg-muted"
              />

              <button
                type="button"
                onClick={() => removeContact(index)}
                title="Remove contact"
                className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
              >
                <Trash />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
