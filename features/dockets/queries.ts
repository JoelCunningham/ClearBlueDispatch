import { db } from "@/prisma/db";
import type { DocketDetail, DocketSummary } from "./types";

export async function getDockets(search?: string): Promise<DocketSummary[]> {
  const dockets = await db.orm.public.Docket.include("delivery", delivery =>
    delivery.include("route").include("location", location => location.include("customer"))
  ).all();

  const summaries: DocketSummary[] = [];

  for (const docket of dockets) {
    if (!docket.delivery) throw new Error(`Delivery for docket ${docket.id} not found.`);
    if (!docket.delivery.route) throw new Error(`Route for delivery ${docket.delivery.id} not found.`);
    if (!docket.delivery.location) throw new Error(`Location for delivery ${docket.delivery.id} not found.`);
    if (!docket.delivery.location?.customer) throw new Error(`Customer for location ${docket.delivery.location.id} not found.`);

    summaries.push({
      id: docket.id,
      date: docket.delivery.route.date,
      customerName: docket.delivery.location.customer.name,
      address: docket.delivery.location.address,
      volume: docket.volume
    });
  }

  summaries.sort((a, b) => Temporal.Instant.compare(b.date, a.date));

  const query = search?.trim().toLowerCase();
  if (!query) return summaries;

  return summaries.filter(docket =>
    [docket.customerName, docket.address, docket.date.toString()].some(value => value.toLowerCase().includes(query))
  );
}

export async function getDocket(docketId: number): Promise<DocketDetail | null> {
  const docket = await db.orm.public.Docket.where({ id: docketId })
    .include("delivery", delivery => delivery.include("route").include("location", location => location.include("customer")))
    .first();
  if (!docket) return null;

  if (!docket.delivery) throw new Error(`Delivery ${docket.deliveryId} not found for docket ${docket.id}.`);
  if (!docket.delivery.route) throw new Error(`Route not found for delivery ${docket.delivery.id}.`);
  if (!docket.delivery.location) throw new Error(`Location not found for delivery ${docket.delivery.id}.`);
  if (!docket.delivery.location.customer) throw new Error(`Customer not found for location ${docket.delivery.location.id}.`);

  return {
    id: docket.id,
    deliveryId: docket.deliveryId,
    date: docket.delivery.route.date,
    customerName: docket.delivery.location.customer.name,
    address: docket.delivery.location.address,
    volume: docket.volume,
    batchNumber: docket.batchNumber,
    comments: docket.comments ?? undefined,
    repName: docket.repName,
    repSignature: docket.repSignature
  };
}
