import Link from "next/link";
import { notFound } from "next/navigation";

import { updateCustomer } from "@/features/customers/actions";
import { CustomerForm } from "@/features/customers/components/customer-form";
import type { CustomerFormInput } from "@/features/customers/types";
import { getCustomer } from "@/features/customers/queries";

type PageProps = {
  params: Promise<{ customerId: string }>;
};

export default async function EditCustomerPage({ params }: PageProps) {
  const { customerId } = await params;
  const customerIdNumber = Number(customerId);

  if (!Number.isInteger(customerIdNumber) || customerIdNumber <= 0) notFound();

  const customer = await getCustomer(customerIdNumber);
  if (!customer) notFound();

  const existingCustomer = customer;

  async function submitCustomer(input: CustomerFormInput) {
    "use server";
    return updateCustomer({ ...input, customerId: existingCustomer.id });
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6 pb-6">
      <div className="mb-6 space-y-2">
        <Link href={`/manage/customers/${customer.id}`} className="text-sm text-muted-foreground hover:text-foreground">
          ← {customer.name}
        </Link>
        <h1 className="text-2xl font-semibold">Edit customer</h1>
      </div>
      <CustomerForm customer={existingCustomer} action={submitCustomer} />
    </main>
  );
}
