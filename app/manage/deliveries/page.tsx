import { createDelivery } from "@/features/deliveries/actions";
import { CreateDeliveryForm } from "@/features/deliveries/components/create-delivery-form";
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
      tankDetails: typeof tankDetails === "string" ? tankDetails : "",
    });
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6 pb-24">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-semibold">
          Create delivery
        </h1>

        <p className="text-sm text-muted-foreground">
          Add a delivery to a driver&apos;s route.
        </p>
      </div>

      <CreateDeliveryForm
        users={users}
        locations={locations}
        contacts={contacts}
        action={submitDelivery}
      />
    </main>
  );
}