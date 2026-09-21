"use client";

import { useState } from "react";

import DeleteButton from "@/components/buttons/delete-button";
import MiniForm from "@/components/forms/mini-form";
import BasicInput from "@/components/inputs/basic-input";
import Form from "@/components/wrappers/form";
import type { ContactItem, CustomerDetail, CustomerFormInput, InvoiceEmailItem, LocationItem } from "@/features/customers/types";
import { suppressEvent } from "@/lib/utils/event-utils";

type CustomerFormProps = {
  customer?: CustomerDetail;
  action: (input: CustomerFormInput) => Promise<{ success: boolean; customerId?: number; error?: string }>;
};

export default function CustomerForm({ customer, action }: CustomerFormProps) {
  const [locations, setLocations] = useState<LocationItem[]>(customer?.locations ?? []);
  const [contacts, setContacts] = useState<ContactItem[]>(customer?.contacts ?? []);
  const [emails, setEmails] = useState<InvoiceEmailItem[]>(customer?.invoiceEmails ?? []);

  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    suppressEvent(event);
    setError(undefined);
    setIsSaving(true);

    try {
      const formData = new FormData(event.currentTarget);

      const input: CustomerFormInput = {
        name: String(formData.get("name") ?? ""),
        rate: Number(formData.get("rate") ?? 0),

        locations: locations.map((location, index) => ({
          ...(location.id !== undefined && { id: location.id }),
          address: location.id !== undefined ? location.address : String(formData.get(`locations.${index}.address`) ?? "")
        })),

        contacts: contacts.map((contact, index) => ({
          ...(contact.id !== undefined && { id: contact.id }),
          name: contact.id !== undefined ? contact.name : String(formData.get(`contacts.${index}.name`) ?? ""),
          phoneNumber: contact.id !== undefined ? contact.phoneNumber : String(formData.get(`contacts.${index}.phoneNumber`) ?? "")
        })),

        emails: emails.map((email, index) => ({
          ...(email.id !== undefined && { id: email.id }),
          emailAddress: email.id !== undefined ? email.emailAddress : String(formData.get(`invoiceEmails.${index}.emailAddress`) ?? "")
        }))
      };

      const result = await action(input);
      if (!result.success) setError(result.error ?? "Unable to save customer.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to save customer.");
    } finally {
      setIsSaving(false);
    }
  }

  function addLocation() {
    setLocations(current => [...current, { address: "", clientId: crypto.randomUUID() }]);
  }

  function removeLocation(index: number) {
    setLocations(current => current.filter((_, i) => i !== index));
  }

  function addContact() {
    setContacts(current => [...current, { name: "", phoneNumber: "", clientId: crypto.randomUUID() }]);
  }

  function removeContact(index: number) {
    setContacts(current => current.filter((_, i) => i !== index));
  }

  function addInvoiceEmail() {
    setEmails(current => [...current, { emailAddress: "", clientId: crypto.randomUUID() }]);
  }

  function removeInvoiceEmail(index: number) {
    setEmails(current => current.filter((_, i) => i !== index));
  }

  return (
    <Form onSubmit={handleSubmit} isSaving={isSaving} error={error} submitText={customer ? "Save changes" : "Create customer"}>
      <BasicInput type="text" id="name" label="Customer name" initial={customer?.name ?? ""} required />
      <BasicInput
        type="number"
        id="rate"
        label="Delivery rate"
        initial={customer?.rate ?? 0}
        minNumber={0}
        step={0.01}
        prefix="$"
        required
      />
      <MiniForm title="Locations" subtitle="Add locations for deliveries." onAdd={addLocation}>
        {locations.length === 0 ? (
          <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">No locations added.</div>
        ) : (
          <div className="space-y-3">
            {locations.map((location, index) => (
              <div key={location.clientId === undefined ? location.id : location.clientId} className="flex gap-2">
                {location.id !== undefined && <input type="hidden" name={`locations.${index}.id`} value={location.id} />}
                <BasicInput
                  type="text"
                  id={`locations.${index}.address`}
                  placeholder="Address"
                  initial={location.address}
                  disabled={location.id !== undefined}
                  required
                />
                <DeleteButton onClick={() => removeLocation(index)} title="Remove location" />
              </div>
            ))}
          </div>
        )}
      </MiniForm>
      <MiniForm title="Contacts" subtitle="Add contacts for this customer." onAdd={addContact}>
        {contacts.length === 0 ? (
          <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">No contacts added.</div>
        ) : (
          <div className="space-y-3">
            {contacts.map((contact, index) => (
              <div key={contact.clientId === undefined ? contact.id : contact.clientId} className="space-y-3 rounded-md border p-3">
                {contact.id !== undefined && <input type="hidden" name={`contacts.${index}.id`} value={contact.id} />}
                <BasicInput
                  type="text"
                  id={`contacts.${index}.name`}
                  placeholder="Name"
                  initial={contact.name}
                  disabled={contact.id !== undefined}
                  required
                />
                <BasicInput
                  type="tel"
                  id={`contacts.${index}.phoneNumber`}
                  placeholder="Phone number"
                  initial={contact.phoneNumber}
                  disabled={contact.id !== undefined}
                  required
                />
                <DeleteButton onClick={() => removeContact(index)} title="Remove contact" />
              </div>
            ))}
          </div>
        )}
      </MiniForm>
      <MiniForm title="Invoice emails" subtitle="Add addresses to receive invoices." onAdd={addInvoiceEmail}>
        {emails.length === 0 ? (
          <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">No invoice emails added.</div>
        ) : (
          <div className="space-y-3">
            {emails.map((invoiceEmail, index) => (
              <div key={invoiceEmail.clientId === undefined ? invoiceEmail.id : invoiceEmail.clientId} className="flex gap-2">
                {invoiceEmail.id !== undefined && <input type="hidden" name={`invoiceEmails.${index}.id`} value={invoiceEmail.id} />}
                <BasicInput
                  type="email"
                  id={`invoiceEmails.${index}.emailAddress`}
                  placeholder="Email address"
                  initial={invoiceEmail.emailAddress}
                  disabled={invoiceEmail.id !== undefined}
                  required
                />
                <DeleteButton onClick={() => removeInvoiceEmail(index)} title="Remove invoice email" />
              </div>
            ))}
          </div>
        )}
      </MiniForm>
    </Form>
  );
}
