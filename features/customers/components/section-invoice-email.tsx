"use client";

import type { Dispatch, SetStateAction } from "react";

import type { InvoiceEmailFormItem } from "../types";
import { Plus, Trash } from "lucide-react";

type InvoiceEmailSectionProps = {
  invoiceEmails: InvoiceEmailFormItem[];
  setInvoiceEmails: Dispatch<SetStateAction<InvoiceEmailFormItem[]>>;
};

export function InvoiceEmailSection({ invoiceEmails, setInvoiceEmails }: InvoiceEmailSectionProps) {
  function addInvoiceEmail() {
    setInvoiceEmails(current => [...current, { emailAddress: "" }]);
  }

  function removeInvoiceEmail(index: number) {
    setInvoiceEmails(current => current.filter((_, currentIndex) => currentIndex !== index));
  }

  function updateInvoiceEmail(index: number, emailAddress: string) {
    setInvoiceEmails(current =>
      current.map((invoiceEmail, currentIndex) => (currentIndex === index ? { ...invoiceEmail, emailAddress } : invoiceEmail))
    );
  }

  return (
    <section className="space-y-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Invoice emails</h2>
          <p className="text-sm text-muted-foreground">Add addresses to receive invoices.</p>
        </div>

        <button
          type="button"
          onClick={addInvoiceEmail}
          className="shrink-0 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          <Plus />
        </button>
      </div>

      {invoiceEmails.length === 0 ? (
        <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
          No invoice emails added.
        </div>
      ) : (
        <div className="space-y-3">
          {invoiceEmails.map((invoiceEmail, index) => (
            <div key={invoiceEmail.id ?? `new-${index}`} className="flex gap-2">
              <input
                type="email"
                value={invoiceEmail.emailAddress}
                onChange={event => updateInvoiceEmail(index, event.target.value)}
                disabled={invoiceEmail.id !== undefined}
                placeholder="email@example.com"
                className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2 disabled:bg-muted"
              />

              <button
                type="button"
                onClick={() => removeInvoiceEmail(index)}
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
