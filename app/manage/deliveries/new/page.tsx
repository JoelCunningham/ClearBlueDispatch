import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { createDelivery } from "@/features/deliveries/actions";
import { DeliveryForm } from "@/components/forms/delivery-form";
import { getAssignableUsers, getDeliveryContacts, getDeliveryLocations } from "@/features/deliveries/queries";

export default async function ManageDeliveriesPage() {
  const [users, locations, contacts] = await Promise.all([getAssignableUsers(), getDeliveryLocations(), getDeliveryContacts()]);

  async function submitDelivery(formData: FormData) {
    "use server";

    const assignedUserId = formData.get("assignedUserId");
    const date = formData.get("date");
    const locationId = formData.get("locationId");
    const contactId = formData.get("contactId");
    const notes = formData.get("notes");
    const tankDetails = formData.get("tankDetails");

    await createDelivery({
      assignedUserId: typeof assignedUserId === "string" ? Number(assignedUserId) : 0,
      date: typeof date === "string" ? date : "",
      locationId: typeof locationId === "string" ? Number(locationId) : 0,
      contactId: typeof contactId === "string" && contactId !== "" ? Number(contactId) : undefined,
      notes: typeof notes === "string" ? notes : "",
      tankDetails: typeof tankDetails === "string" ? tankDetails : ""
    });
  }

  return (
    <Page>
      <Heading
        title="Create delivery"
        subtitle="Add a delivery to a driver's route."
        backLink={{ text: "deliveries", href: "/manage/deliveries" }}
      />
      <DeliveryForm users={users} locations={locations} contacts={contacts} action={submitDelivery} />
    </Page>
  );
}
