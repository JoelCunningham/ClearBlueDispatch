import { requireRouteAccess } from "@/lib/auth/authorization";
import { requireRole } from "@/lib/auth/require-role";
import { db } from "@/prisma/db";
import { DeliveryDetail } from "./types";

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

  return locations.map(location => {
    const addressParts = location.address.split(",").map(part => part.trim());

    return {
      id: location.id,
      address: location.address,
      suburb: addressParts.length >= 3 ? addressParts[addressParts.length - 3] : location.address,
      customerId: location.customerId,
      customerName: location.customer.name
    };
  });
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

export async function getDelivery(routeId: number, deliveryId: number): Promise<DeliveryDetail | null> {
  await requireRouteAccess(routeId);

  const delivery = await db.orm.public.Delivery.where({ id: deliveryId, routeId })
    .include("location")
    .include("contact")
    .first();
  if (!delivery) return null;

  const location = await db.orm.public.Location.where({ id: delivery.locationId }).include("customer").first();
  if (!location) throw new Error(`Location ${delivery.locationId} not found.`);

  return {
    id: delivery.id,
    position: delivery.position,
    notes: delivery.notes,
    tankDetails: delivery.tankDetails,
    location: {
      address: location.address,
      customerName: location.customer.name
    },
    contact: delivery.contact
      ? {
          name: delivery.contact.name,
          phoneNumber: delivery.contact.phoneNumber
        }
      : null
  };
}
