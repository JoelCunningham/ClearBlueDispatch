import { requireRole } from "@/lib/auth/authorization";
import { db } from "@/prisma/db";

import type { CustomerDetail, CustomerSummary } from "./types";

export async function getCustomers(search?: string): Promise<CustomerSummary[]> {
  await requireRole("MANAGER");

  const customers = await db.orm.public.Customer.orderBy(customer => customer.name.asc()).all();

  const summaries = customers.map(customer => ({
    id: customer.id,
    name: customer.name,
    rate: customer.rate
  }));

  const query = search?.trim().toLowerCase();
  if (!query) return summaries;

  return customers.filter(customer => [customer.name].some(value => value.toLowerCase().includes(query)));
}

export async function getCustomer(customerId: number): Promise<CustomerDetail | null> {
  await requireRole("MANAGER");

  const customer = await db.orm.public.Customer.where({ id: customerId })
    .include("locations")
    .include("contacts")
    .include("invoiceEmails")
    .first();

  if (!customer) return null;

  return {
    id: customer.id,
    name: customer.name,
    rate: customer.rate,

    locations: customer.locations.filter(location => !location.deleted).map(location => ({ id: location.id, address: location.address })),

    contacts: customer.contacts
      .filter(contact => !contact.deleted)
      .map(contact => ({ id: contact.id, name: contact.name, phoneNumber: contact.phoneNumber })),

    invoiceEmails: customer.invoiceEmails.map(invoiceEmail => ({
      id: invoiceEmail.id,
      emailAddress: invoiceEmail.emailAddress
    }))
  };
}
