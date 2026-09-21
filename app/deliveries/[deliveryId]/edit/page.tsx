import Link from "next/link";

import DeliveryForm from "@/components/forms/delivery-form";
import { updateDelivery } from "@/features/deliveries/actions";
import { getAssignableUsers, getDeliveryContacts, getDeliveryForEdit, getDeliveryLocations } from "@/features/deliveries/queries";
import { DeliveryFormInput } from "@/features/deliveries/types";
import { requireRole } from "@/lib/auth/authorization";
import { idOrNotFound, valueOrNotFound } from "@/lib/utils/validation-utils";

type EditDeliveryPageProps = {
  params: Promise<{
    deliveryId: string;
  }>;
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
    <main className="mx-auto w-full max-w-2xl px-4 py-6 pb-6">
      <div className="mb-6 space-y-2">
        <Link href={`/manage/deliveries/${delivery.deliveryId}`} className="text-sm text-muted-foreground hover:text-foreground">
          ← Delivery
        </Link>

        <div className="pt-2">
          <h1 className="text-2xl font-semibold">Edit Delivery</h1>

          <p className="text-sm text-muted-foreground">Update the delivery details and route assignment.</p>
        </div>
      </div>

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
    </main>
  );
}
