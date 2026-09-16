import Link from "next/link";
import { notFound } from "next/navigation";

import { getDelivery } from "@/features/deliveries/queries";

type DeliveryPageProps = {
  params: Promise<{ routeId: string; deliveryId: string }>;
};

export default async function DeliveryPage({ params }: DeliveryPageProps) {
  const { routeId, deliveryId } = await params;

  const routeIdNumber = Number(routeId);
  const deliveryIdNumber = Number(deliveryId);

  if (!Number.isInteger(routeIdNumber) || !Number.isInteger(deliveryIdNumber)) {
    notFound();
  }

  const delivery = await getDelivery(routeIdNumber, deliveryIdNumber);
  if (!delivery) notFound();

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(delivery.location.address)}`;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6 pb-24">
      <div className="mb-6 space-y-2">
        <Link href={`/routes/${routeIdNumber}`} className="text-sm text-muted-foreground hover:text-foreground">
          ← Route
        </Link>

        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {delivery.position}
          </div>

          <div>
            <h1 className="text-2xl font-semibold">{delivery.location.customerName}</h1>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-sm text-muted-foreground hover:text-foreground hover:underline"
            >
              {delivery.location.address}
            </a>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">Tank details</h2>

          <p className="whitespace-pre-wrap text-sm text-muted-foreground">
            {delivery.tankDetails || "No tank details."}
          </p>
        </section>

        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">Notes</h2>

          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{delivery.notes || "No notes."}</p>
        </section>

        {delivery.contact && (
          <section className="rounded-lg border p-4">
            <h2 className="mb-3 font-semibold">Contact</h2>

            <p>{delivery.contact.name}</p>

            <p className="mt-1 text-sm text-muted-foreground">{delivery.contact.phoneNumber}</p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <a
                href={`tel:${delivery.contact.phoneNumber}`}
                className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground"
              >
                Call
              </a>

              <a
                href={`sms:${delivery.contact.phoneNumber}`}
                className="rounded-md border px-4 py-2 text-center text-sm font-medium"
              >
                Text
              </a>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
