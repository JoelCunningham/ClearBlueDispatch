import { requireRole, requireRouteAccess } from "@/lib/auth/authorization";
import { db } from "@/prisma/db";
import { DeliveryDetail, DeliverySummary, UpdateDeliveryInput } from "./types";

export async function getAssignableUsers() {
  await requireRole("MANAGER");

  const users = await db.orm.public.User.orderBy(user => user.name.asc()).all();

  return users.map(user => ({
    id: user.id,
    name: user.name
  }));
}

export async function getDeliveryLocations() {
  await requireRole("MANAGER");

  const locations = await db.orm.public.Location.include("customer")
    .orderBy(location => location.address.asc())
    .all();

  if (locations.some(location => !location.customer)) {
    throw new Error("Some locations are missing associated customers.");
  }

  return locations.map(location => ({
    id: location.id,
    address: location.address,
    customerId: location.customerId,
    customerName: location.customer.name
  }));
}

export async function getDeliveryContacts(customerId?: number) {
  await requireRole("MANAGER");

  const contacts = await db.orm.public.Contact.where(customerId === undefined ? {} : { customerId })
    .orderBy(contact => contact.name.asc())
    .all();

  return contacts.map(contact => ({
    id: contact.id,
    name: contact.name,
    phoneNumber: contact.phoneNumber,
    customerId: contact.customerId
  }));
}

export async function getDelivery(deliveryId: number): Promise<DeliveryDetail | null> {
  const delivery = await db.orm.public.Delivery.where({ id: deliveryId })
    .include("location", location => location.include("customer"))
    .include("contact")
    .include("route")
    .include("docket")
    .first();
  if (!delivery) return null;

  await requireRouteAccess(delivery.routeId);
  if (!delivery.location) throw new Error(`Location ${delivery.locationId} not found.`);
  if (!delivery.location.customer) throw new Error(`Customer ${delivery.location.customerId} not found for ${delivery.location.id}.`);
  if (!delivery.route) throw new Error(`Route ${delivery.routeId} not found for ${delivery.id}.`);

  return {
    id: delivery.id,
    position: delivery.position,
    notes: delivery.notes,
    tankDetails: delivery.tankDetails,
    date: delivery.route.date,
    routeId: delivery.routeId,

    location: {
      address: delivery.location.address,
      customerName: delivery.location.customer.name
    },

    contact: delivery.contact
      ? {
          name: delivery.contact.name,
          phoneNumber: delivery.contact.phoneNumber
        }
      : null,

    docket: delivery.docket
      ? {
          id: delivery.docket.id,
          volume: delivery.docket.volume,
          batchNumber: delivery.docket.batchNumber,
          repName: delivery.docket.repName
        }
      : null
  };
}

export async function getDeliveries(search?: string): Promise<DeliverySummary[]> {
  await requireRole("MANAGER");

  const deliveries = await db.orm.public.Delivery.include("location", location => location.include("customer"))
    .include("contact")
    .include("route", route => route.include("assignedUser"))
    .all();

  const summaries = deliveries
    .map(delivery => {
      if (!delivery.route) {
        throw new Error(`Delivery ${delivery.id} has no route.`);
      }

      if (!delivery.location) {
        throw new Error(`Delivery ${delivery.id} has no location.`);
      }

      if (!delivery.location.customer) {
        throw new Error(`Location ${delivery.location.id} has no customer.`);
      }

      if (!delivery.route.assignedUser) {
        throw new Error(`Route ${delivery.route.id} has no assigned user.`);
      }

      return {
        id: delivery.id,
        date: delivery.route.date,
        customerName: delivery.location.customer.name,
        locationAddress: delivery.location.address,
        contactName: delivery.contact?.name ?? null,
        assignedUserName: delivery.route.assignedUser.name
      };
    })
    .sort((a, b) => Temporal.Instant.compare(b.date, a.date));

  const query = search?.trim().toLowerCase();
  if (!query) return summaries;

  return summaries.filter(delivery =>
    [delivery.date.toString(), delivery.customerName, delivery.locationAddress, delivery.contactName ?? "", delivery.assignedUserName].some(
      value => value.toLowerCase().includes(query)
    )
  );
}

export async function getDeliveryForEdit(deliveryId: number): Promise<UpdateDeliveryInput | null> {
  const delivery = await db.orm.public.Delivery.where({ id: deliveryId }).include("route").first();
  if (!delivery) return null;

  if (!delivery.route) throw new Error(`Route not found for delivery ${deliveryId}.`);

  return {
    deliveryId: delivery.id,
    assignedUserId: delivery.route.assignedUserId,
    date: delivery.route.date.toLocaleString("en-AU"),
    locationId: delivery.locationId,
    contactId: delivery.contactId ?? undefined,
    notes: delivery.notes,
    tankDetails: delivery.tankDetails
  };
}
