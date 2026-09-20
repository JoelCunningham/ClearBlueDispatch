import CustomerForm from "@/components/forms/customer-form";
import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { createCustomer } from "@/features/customers/actions";

export default function CreateCustomerPage() {
  async function submitCustomer(input: Parameters<typeof createCustomer>[0]) {
    "use server";
    return createCustomer(input);
  }

  return (
    <Page>
      <Heading title="Create customer" backLink={{ text: "customers", href: "/manage/customers" }} />
      <CustomerForm action={submitCustomer} />
    </Page>
  );
}
