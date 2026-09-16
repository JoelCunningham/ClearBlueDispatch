"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { reorderDeliveries } from "@/features/routes/actions";

type Delivery = {
  id: number;
  position: number;
  location: {
    id: number;
    address: string;
    customerName: string;
  };
};

type DeliveryListProps = {
  routeId: number;
  deliveries: Delivery[];
};

function getGoogleMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function DeliveryList({ routeId, deliveries: initialDeliveries }: DeliveryListProps) {
  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [isPending, startTransition] = useTransition();

  function moveDelivery(index: number, direction: -1 | 1) {
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= deliveries.length || isPending) return;

    const previousDeliveries = deliveries;
    const nextDeliveries = [...deliveries];

    const [delivery] = nextDeliveries.splice(index, 1);
    nextDeliveries.splice(newIndex, 0, delivery);

    nextDeliveries.forEach((item, itemIndex) => {
      item.position = itemIndex + 1;
    });

    setDeliveries(nextDeliveries);

    startTransition(async () => {
      const result = await reorderDeliveries(routeId, nextDeliveries.map(delivery => delivery.id));
      if (!result.success) setDeliveries(previousDeliveries);
    });
  }

  return (
    <div className="space-y-3">
      {deliveries.map((delivery, index) => {
        const mapsUrl = getGoogleMapsUrl(delivery.location.address);

        return (
          <div
            key={delivery.id}
            className="flex items-stretch gap-3 rounded-lg border bg-card p-3"
          >
            <Link
              href={`/routes/${routeId}/deliveries/${delivery.id}`}
              className="block"
            >
              <div className="flex size-10 shrink-0 items-center justify-center self-start rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {delivery.position}
              </div>
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                href={`/routes/${routeId}/deliveries/${delivery.id}`}
                className="block"
              >
                <h3 className="font-semibold hover:underline">
                  {delivery.location.customerName}
                </h3>
              </Link>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm text-muted-foreground hover:text-foreground hover:underline"
              >
                {delivery.location.address}
              </a>
            </div>

            <div className="flex shrink-0 flex-col gap-1">
              <button
                type="button"
                onClick={() => {
                  console.log("UP CLICKED");
                  moveDelivery(index, -1);
                }}
                disabled={index === 0 || isPending}
                className="flex size-8 items-center justify-center rounded-md border text-sm disabled:opacity-30"
                aria-label={`Move delivery ${delivery.position} up`}
              >
                ↑
              </button>

              <button
                type="button"
                disabled={index === deliveries.length - 1 || isPending}
                onClick={() => moveDelivery(index, 1)}
                className="flex size-8 items-center justify-center rounded-md border text-sm disabled:opacity-30"
                aria-label={`Move delivery ${delivery.position} down`}
              >
                ↓
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}