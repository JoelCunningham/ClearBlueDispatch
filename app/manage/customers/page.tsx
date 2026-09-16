import Link from "next/link";

import { getCustomers } from "@/features/customers/queries";

export default async function ManageCustomersPage() {
  const customers = await getCustomers();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 pb-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Customers</h1>
          <p className="text-sm text-muted-foreground">Manage customers and their delivery information.</p>
        </div>
        <Link
          href="/manage/customers/new"
          className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Create
        </Link>
      </div>

      {customers.length === 0 ? (
        <div className="rounded-lg border p-6 text-center">
          <p className="text-sm text-muted-foreground">No customers have been created yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {customers.map(customer => (
            <Link
              key={customer.id}
              href={`/manage/customers/${customer.id}`}
              className="block rounded-lg border p-4 transition-colors hover:bg-muted"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">${customer.rate.toFixed(2)} per delivery</p>
                </div>
                <span className="text-muted-foreground" aria-hidden="true">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
