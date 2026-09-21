import { requireRouteAccess } from "@/lib/auth/authorization";
import { requireRole } from "@/lib/auth/authorization";
import { db } from "@/prisma/db";
import { DeliveryDetail, DeliverySummary } from "./types";

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
    .include("location")
    .include("contact")
    .include("route")
    .include("docket")
    .first();
  if (!delivery) return null;

  await requireRouteAccess(delivery.routeId);

  const location = await db.orm.public.Location.where({ id: delivery.locationId }).include("customer").first();
  if (!location) throw new Error(`Location ${delivery.locationId} not found.`);

  return {
    id: delivery.id,
    position: delivery.position,
    notes: delivery.notes,
    tankDetails: delivery.tankDetails,
    date: delivery.route?.date ?? "",
    routeId: delivery.routeId,

    location: {
      address: location.address,
      customerName: location.customer.name
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
          repName: delivery.docket.repName,
          repSignature: delivery.docket.repSignature
        }
      : null
  };
}

export async function getDeliveries(): Promise<DeliverySummary[]> {
  await requireRole("MANAGER");

  const deliveries = await db.orm.public.Delivery.include("location", location => location.include("customer"))
    .include("contact")
    .include("route", route => route.include("assignedUser"))
    .all();

  return deliveries
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
    .sort((a, b) => b.date.localeCompare(a.date));
}
