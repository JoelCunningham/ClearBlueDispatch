import Link from "next/link";

import { getDeliveries } from "@/features/deliveries/queries";

export default async function ManageDeliveriesPage() {
  const deliveries = await getDeliveries();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 pb-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Deliveries</h1>
          <p className="text-sm text-muted-foreground">Manage deliveries and their delivery information.</p>
        </div>

        <Link
          href="/manage/deliveries/new"
          className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Create
        </Link>
      </div>

      {deliveries.length === 0 ? (
        <div className="rounded-lg border p-6 text-center">
          <p className="text-sm text-muted-foreground">No deliveries have been created yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {deliveries.map(delivery => (
            <Link
              key={delivery.id}
              href={`/manage/deliveries/${delivery.id}`}
              className="block rounded-lg border p-4 transition-colors hover:bg-muted"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium">{delivery.customerName}</p>

                  <p className="mt-1 text-sm text-muted-foreground">{delivery.locationAddress}</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {delivery.date}
                    {" · "}
                    {delivery.assignedUserName}
                  </p>

                  {delivery.contactName && <p className="mt-1 text-sm text-muted-foreground">Contact: {delivery.contactName}</p>}
                </div>

                <span className="shrink-0 text-muted-foreground" aria-hidden="true">
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
