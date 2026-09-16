import Link from "next/link";
import { notFound } from "next/navigation";

import { createDocket } from "@/features/dockets/actions";
import { getDelivery } from "@/features/deliveries/queries";
import { DocketFormInput } from "@/features/dockets/types";
import { DocketForm } from "@/features/dockets/components/docket-form";

type DocketPageProps = {
  params: Promise<{ routeId: string; deliveryId: string }>;
};

export default async function CreateDocketPage({ params }: DocketPageProps) {
  const { routeId, deliveryId } = await params;

  const routeIdNumber = Number(routeId);
  const deliveryIdNumber = Number(deliveryId);

  if (!Number.isInteger(routeIdNumber) || !Number.isInteger(deliveryIdNumber)) notFound();

  const delivery = await getDelivery(routeIdNumber, deliveryIdNumber);

  if (!delivery) notFound();
  if (delivery.docket) notFound();

  const addressParts = delivery.location.address.split(",").map(part => part.trim());
  const suburb = addressParts.length >= 3 ? addressParts[addressParts.length - 3] : delivery.location.address;

  async function submitDocket(input: DocketFormInput) {
    "use server";
    return createDocket({ ...input, deliveryId: deliveryIdNumber, routeId: routeIdNumber });
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6 pb-24">
      <div className="mb-6 space-y-2">
        <Link
          href={`/routes/${routeIdNumber}/deliveries/${deliveryIdNumber}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Delivery
        </Link>

        <h1 className="text-2xl font-semibold">Create docket</h1>
      </div>
      <DocketForm
        docketNumber={delivery.id}
        date={delivery.date}
        customerName={delivery.location.customerName}
        suburb={suburb}
        action={submitDocket}
      />{" "}
    </main>
  );
}
