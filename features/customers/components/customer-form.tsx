"use client";

import { useState } from "react";

import type { ContactFormItem, CustomerDetail, CustomerFormInput, InvoiceEmailFormItem, LocationFormItem } from "../types";
import { ContactSection } from "./section-contact";
import { InvoiceEmailSection } from "./section-invoice-email";
import { LocationSection } from "./section-location";

type CustomerFormProps = {
  customer?: CustomerDetail;
  action: (input: CustomerFormInput) => Promise<{ success: boolean; customerId?: number; error?: string }>;
};

export function CustomerForm({ customer, action }: CustomerFormProps) {
  const [name, setName] = useState(customer?.name ?? "");
  const [rate, setRate] = useState(customer?.rate.toString() ?? "");

  const [locations, setLocations] = useState<LocationFormItem[]>(
    customer?.locations.map(location => ({
      id: location.id,
      address: location.address
    })) ?? []
  );

  const [contacts, setContacts] = useState<ContactFormItem[]>(
    customer?.contacts.map(contact => ({
      id: contact.id,
      name: contact.name,
      phoneNumber: contact.phoneNumber
    })) ?? []
  );

  const [invoiceEmails, setInvoiceEmails] = useState<InvoiceEmailFormItem[]>(
    customer?.invoiceEmails.map(invoiceEmail => ({
      id: invoiceEmail.id,
      emailAddress: invoiceEmail.emailAddress
    })) ?? []
  );

  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(undefined);
    setIsSaving(true);

    try {
      const result = await action({
        name,
        rate: Number(rate),
        locations: locations.map(location => ({
          ...(location.id !== undefined && { id: location.id }),
          address: location.address
        })),
        contacts: contacts.map(contact => ({
          ...(contact.id !== undefined && { id: contact.id }),
          name: contact.name,
          phoneNumber: contact.phoneNumber
        })),
        invoiceEmails: invoiceEmails.map(invoiceEmail => ({
          ...(invoiceEmail.id !== undefined && { id: invoiceEmail.id }),
          emailAddress: invoiceEmail.emailAddress
        }))
      });

      if (!result.success) {
        setError(result.error ?? "Unable to save customer.");
        return;
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      setError(error instanceof Error ? error.message : "Unable to save customer.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-2">
        <div>
          <h2 className="text-lg font-semibold">Details</h2>
        </div>

        <div className="space-y-2">
          <label htmlFor="customer-name" className="text-sm font-medium">
            Customer name
          </label>

          <input
            id="customer-name"
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
            required
            className="w-full rounded-md border bg-background px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="customer-rate" className="text-sm font-medium">
            Delivery rate
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>

            <input
              id="customer-rate"
              type="number"
              min="0"
              step="0.01"
              value={rate}
              onChange={event => setRate(event.target.value)}
              required
              className="w-full rounded-md border bg-background py-2 pl-7 pr-3"
            />
          </div>
        </div>
      </section>

      <LocationSection locations={locations} setLocations={setLocations} />

      <ContactSection contacts={contacts} setContacts={setContacts} />

      <InvoiceEmailSection invoiceEmails={invoiceEmails} setInvoiceEmails={setInvoiceEmails} />

      {error && (
        <div role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="border-t bg-background/95 pt-4 backdrop-blur">
        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving..." : customer ? "Save changes" : "Create customer"}
        </button>
      </div>
    </form>
  );
}
