import DeliveryForm from "@/components/forms/delivery-form";
import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { updateDelivery } from "@/features/deliveries/actions";
import { getAssignableUsers, getDeliveryContacts, getDeliveryForEdit, getDeliveryLocations } from "@/features/deliveries/queries";
import { DeliveryFormInput } from "@/features/deliveries/types";
import { requireRole } from "@/lib/auth/authorization";
import { idOrNotFound, valueOrNotFound } from "@/lib/utils/validation-utils";

type EditDeliveryPageProps = {
  params: Promise<{ deliveryId: string }>;
};

export default async function EditDeliveryPage({ params }: EditDeliveryPageProps) {
  await requireRole("MANAGER");

  const { deliveryId } = await params;

  const deliveryIdNumber = idOrNotFound(deliveryId);
  const delivery = valueOrNotFound(await getDeliveryForEdit(deliveryIdNumber));

  const [users, locations, contacts] = await Promise.all([getAssignableUsers(), getDeliveryLocations(), getDeliveryContacts()]);

  async function submitDelivery(input: DeliveryFormInput) {
    "use server";
    return updateDelivery({ ...input, deliveryId: delivery.deliveryId });
  }

  return (
    <Page>
      <Heading title="Edit Delivery" backFallback={`/deliveries/${delivery.deliveryId}`} />
      <DeliveryForm
        users={users}
        locations={locations}
        contacts={contacts}
        userId={delivery.assignedUserId}
        date={delivery.date}
        locationId={delivery.locationId}
        contactId={delivery.contactId ?? undefined}
        notes={delivery.notes}
        tankDetails={delivery.tankDetails}
        action={submitDelivery}
      />
    </Page>
  );
}
