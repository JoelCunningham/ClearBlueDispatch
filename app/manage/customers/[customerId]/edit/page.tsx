import CustomerForm from "@/components/forms/customer-form";
import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { updateCustomer } from "@/features/customers/actions";
import { getCustomer } from "@/features/customers/queries";
import type { CustomerFormInput } from "@/features/customers/types";
import { idOrNotFound, valueOrNotFound } from "@/lib/utils/validation-utils";

type PageProps = {
  params: Promise<{ customerId: string }>;
};

export default async function EditCustomerPage({ params }: PageProps) {
  const { customerId } = await params;

  const customerIdNumber = idOrNotFound(customerId);
  const customer = valueOrNotFound(await getCustomer(customerIdNumber));

  async function submitCustomer(input: CustomerFormInput) {
    "use server";
    return updateCustomer({ ...input, customerId: customer.id });
  }

  return (
    <Page>
      <Heading title="Edit customer" backLink={{ text: "customers", href: "/manage/customers" }} />
      <CustomerForm customer={customer} action={submitCustomer} />
    </Page>
  );
}
