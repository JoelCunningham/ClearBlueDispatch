"use client";

import { useState, useTransition } from "react";

import Card from "@/components/wrappers/card";
import List from "@/components/wrappers/list";
import { reorderDeliveries } from "@/features/routes/actions";
import { getCustomerName } from "@/lib/utils/string-utils";
import { suppressEvent } from "@/lib/utils/event-utils";
import MoveButton from "./move-botton";

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

export default function DeliveryList({ routeId, deliveries: initialDeliveries }: DeliveryListProps) {
  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [isPending, startTransition] = useTransition();

  function moveDelivery(e: React.MouseEvent<HTMLButtonElement>, index: number, direction: -1 | 1) {
    suppressEvent(e);

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
      const result = await reorderDeliveries(
        routeId,
        nextDeliveries.map(delivery => delivery.id)
      );
      if (!result.success) setDeliveries(previousDeliveries);
    });
  }

  return (
    <List title="Deliveries" subtitle={`${deliveries.length} ${deliveries.length === 1 ? "delivery" : "deliveries"}`}>
      {deliveries.map((delivery, index) => (
        <Card
          key={delivery.id.toString()}
          href={`/deliveries/${delivery.id}`}
          title={getCustomerName(delivery.location.customerName, delivery.location.address)}
          subtitle={delivery.location.address}
          avatar={delivery.position.toString()}
        >
          <div className="flex flex-col gap-1">
            <MoveButton index={index} items={deliveries.length} isPending={isPending} isUp={true} onClick={moveDelivery} />
            <MoveButton index={index} items={deliveries.length} isPending={isPending} isUp={false} onClick={moveDelivery} />
          </div>
        </Card>
      ))}
    </List>
  );
}
