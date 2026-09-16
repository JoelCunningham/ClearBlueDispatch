import Link from "next/link";

import { requireRole } from "@/lib/auth/require-role";

export default async function ManagePage() {
  await requireRole("MANAGER");

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 pb-6">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-semibold">Manage</h1>

        <p className="text-sm text-muted-foreground">Manage customers, deliveries, and other dispatch data.</p>
      </div>

      <div className="space-y-3">
        <Link href="/manage/deliveries" className="block rounded-lg border p-4 transition-colors hover:bg-muted">
          <h2 className="font-semibold">Deliveries</h2>

          <p className="mt-1 text-sm text-muted-foreground">Create and manage deliveries.</p>
        </Link>

        <Link href="/manage/customers" className="block rounded-lg border p-4 transition-colors hover:bg-muted">
          <h2 className="font-semibold">Customers</h2>

          <p className="mt-1 text-sm text-muted-foreground">Manage customers, locations, and contacts.</p>
        </Link>
      </div>
    </main>
  );
}
