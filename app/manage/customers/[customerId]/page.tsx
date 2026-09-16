import Link from "next/link";
import { notFound } from "next/navigation";

import { getCustomer } from "@/features/customers/queries";

type PageProps = {
  params: Promise<{ customerId: string }>;
};

export default async function CustomerPage({ params }: PageProps) {
  const { customerId } = await params;
  const customerIdNumber = Number(customerId);

  if (!Number.isInteger(customerIdNumber) || customerIdNumber <= 0) notFound();

  const customer = await getCustomer(customerIdNumber);
  if (!customer) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6 pb-6">
      <div className="mb-6 space-y-2">
        <Link href="/manage/customers" className="text-sm text-muted-foreground hover:text-foreground">
          ← Customers
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{customer.name}</h1>
          </div>

          <Link
            href={`/manage/customers/${customer.id}/edit`}
            className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Customer details</h2>

          <div className="rounded-lg border p-4">
            <dl className="space-y-3">
              <div className="flex justify-between gap-4">
                <dt className="text-sm text-muted-foreground">Delivery rate</dt>
                <dd className="text-sm font-medium">${customer.rate.toFixed(2)}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Locations</h2>

          {customer.locations.length === 0 ? (
            <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No locations.</div>
          ) : (
            <div className="space-y-2">
              {customer.locations.map(location => (
                <div key={location.id} className="rounded-lg border p-4">
                  {location.address}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Contacts</h2>

          {customer.contacts.length === 0 ? (
            <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No contacts.</div>
          ) : (
            <div className="space-y-2">
              {customer.contacts.map(contact => (
                <div key={contact.id} className="rounded-lg border p-4">
                  <p className="font-medium">{contact.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{contact.phoneNumber}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Invoice emails</h2>

          {customer.invoiceEmails.length === 0 ? (
            <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No invoice emails.</div>
          ) : (
            <div className="space-y-2">
              {customer.invoiceEmails.map(invoiceEmail => (
                <div key={invoiceEmail.id} className="rounded-lg border p-4">
                  {invoiceEmail.emailAddress}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
