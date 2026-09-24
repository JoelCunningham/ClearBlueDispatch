import ErrorMessage from "@/components/alerts/error-message";
import InfoAlert from "@/components/alerts/info-alert";
import PrimaryButton from "@/components/buttons/primary-button";
import DeliveryForm from "@/components/forms/delivery-form";
import Heading from "@/components/wrappers/heading";
import Page from "@/components/wrappers/page";
import { deleteDelivery, updateDelivery } from "@/features/deliveries/actions";
import { getAssignableUsers, getDeliveryContacts, getDeliveryForEdit, getDeliveryLocations } from "@/features/deliveries/queries";
import { DeliveryFormInput } from "@/features/deliveries/types";
import { requireRole } from "@/lib/auth/authorization";
import { inputFormatToDate, isDatePast } from "@/lib/utils/date-utils";
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
    return updateDelivery({ ...input, deliveryId: delivery.deliveryId, hasDocket: delivery.hasDocket, hasUser: delivery.hasUser });
  }

  async function removeDelivery() {
    "use server";
    return deleteDelivery({ deliveryId: delivery.deliveryId });
  }

  return (
    <Page>
      <Heading title="Edit Delivery" backFallback={`/deliveries/${delivery.deliveryId}`} />
      <ErrorMessage assigned="delivery" assignee="user" deleted={delivery.hasUser} past={isDatePast(inputFormatToDate(delivery.date))} />
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
      {!delivery.hasDocket && <PrimaryButton text="Delete delivery" destructive={true} onClick={removeDelivery} />}
      {delivery.hasDocket && <InfoAlert text="This delivery has a docket associated with it and cannot be deleted." />}
    </Page>
  );
}
