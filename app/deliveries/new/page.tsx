import DeliveryForm from "@/components/forms/delivery-form";
import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { createDelivery } from "@/features/deliveries/actions";
import { getAssignableUsers, getDeliveryContacts, getDeliveryLocations } from "@/features/deliveries/queries";
import { CreateDeliveryInput } from "@/features/deliveries/types";

export default async function ManageDeliveriesPage() {
  const [users, locations, contacts] = await Promise.all([getAssignableUsers(), getDeliveryLocations(), getDeliveryContacts()]);

  async function submitDelivery(input: CreateDeliveryInput) {
    "use server";
    return await createDelivery(input);
  }

  return (
    <Page>
      <Heading
        title="Create delivery"
        subtitle="Add a delivery to a driver's route."
        backLink={{ text: "deliveries", href: "/deliveries" }}
      />
      <DeliveryForm users={users} locations={locations} contacts={contacts} action={submitDelivery} />
    </Page>
  );
}
