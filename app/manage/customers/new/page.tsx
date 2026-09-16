import Link from "next/link";

import { createCustomer } from "@/features/customers/actions";
import { CustomerForm } from "@/features/customers/components/customer-form";

export default function CreateCustomerPage() {
  async function submitCustomer(input: Parameters<typeof createCustomer>[0]) {
    "use server";
    return createCustomer(input);
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6 pb-6">
      <div className="mb-6 space-y-2">
        <Link href="/manage/customers" className="text-sm text-muted-foreground hover:text-foreground">
          ← Customers
        </Link>

        <h1 className="text-2xl font-semibold">Create customer</h1>

        <p className="text-sm text-muted-foreground">Add a new customer and their delivery information.</p>
      </div>

      <CustomerForm action={submitCustomer} />
    </main>
  );
}
