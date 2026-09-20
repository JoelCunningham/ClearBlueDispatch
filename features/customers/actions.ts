"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/require-role";
import { db } from "@/prisma/db";

import { redirect } from "next/navigation";
import type { CreateCustomerInput, UpdateCustomerInput } from "./types";
import { createCustomerSchema, updateCustomerSchema } from "./validation";

export async function createCustomer(input: CreateCustomerInput) {
  await requireRole("MANAGER");

  const result = createCustomerSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: "Invalid customer details." };
  }

  const customer = await db.transaction(async tx => {
    const customer = await tx.orm.public.Customer.create({ name: result.data.name, rate: result.data.rate });

    for (const location of result.data.locations) {
      if (location.id !== undefined) {
        throw new Error("New customers cannot contain existing locations.");
      }

      await tx.orm.public.Location.create({ customerId: customer.id, address: location.address, deleted: false });
    }

    for (const contact of result.data.contacts) {
      if (contact.id !== undefined) {
        throw new Error("New customers cannot contain existing contacts.");
      }

      await tx.orm.public.Contact.create({
        customerId: customer.id,
        name: contact.name,
        phoneNumber: contact.phoneNumber,
        deleted: false
      });
    }

    for (const invoiceEmail of result.data.emails) {
      if (invoiceEmail.id !== undefined) {
        throw new Error("New customers cannot contain existing invoice emails.");
      }

      await tx.orm.public.InvoiceEmail.create({ customerId: customer.id, emailAddress: invoiceEmail.emailAddress });
    }

    return customer;
  });

  revalidatePath("/manage/customers");
  revalidatePath("/manage");

  redirect(`/manage/customers/${customer.id}`);
}

export async function updateCustomer(input: UpdateCustomerInput) {
  await requireRole("MANAGER");

  const result = updateCustomerSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: "Invalid customer details." };
  }

  const { customerId, name, rate, locations, contacts, emails: invoiceEmails } = result.data;

  try {
    await db.transaction(async tx => {
      const customer = await tx.orm.public.Customer.first({ id: customerId });
      if (!customer) throw new Error("Customer not found.");

      const existingLocations = await tx.orm.public.Location.where({ customerId, deleted: false }).all();
      const existingContacts = await tx.orm.public.Contact.where({ customerId, deleted: false }).all();
      const existingInvoiceEmails = await tx.orm.public.InvoiceEmail.where({ customerId }).all();

      const submittedLocationIds = new Set(locations.map(location => location.id).filter((id): id is number => id !== undefined));
      const submittedContactIds = new Set(contacts.map(contact => contact.id).filter((id): id is number => id !== undefined));
      const submittedInvoiceEmailIds = new Set(
        invoiceEmails.map(invoiceEmail => invoiceEmail.id).filter((id): id is number => id !== undefined)
      );

      const locationsToDelete = existingLocations.filter(location => !submittedLocationIds.has(location.id));
      const contactsToDelete = existingContacts.filter(contact => !submittedContactIds.has(contact.id));
      const invoiceEmailsToDelete = existingInvoiceEmails.filter(invoiceEmail => !submittedInvoiceEmailIds.has(invoiceEmail.id));

      const existingLocationIds = new Set(existingLocations.map(location => location.id));
      const existingContactIds = new Set(existingContacts.map(contact => contact.id));
      const existingInvoiceEmailIds = new Set(existingInvoiceEmails.map(invoiceEmail => invoiceEmail.id));

      for (const location of locations) {
        if (location.id !== undefined && !existingLocationIds.has(location.id)) {
          throw new Error("Location does not belong to this customer.");
        }
      }

      for (const contact of contacts) {
        if (contact.id !== undefined && !existingContactIds.has(contact.id)) {
          throw new Error("Contact does not belong to this customer.");
        }
      }

      for (const invoiceEmail of invoiceEmails) {
        if (invoiceEmail.id !== undefined && !existingInvoiceEmailIds.has(invoiceEmail.id)) {
          throw new Error("Invoice email does not belong to this customer.");
        }
      }

      await tx.orm.public.Customer.where({ id: customerId }).update({ name, rate });

      for (const location of locations) {
        if (location.id === undefined) {
          await tx.orm.public.Location.create({ customerId, address: location.address, deleted: false });
        }
      }

      for (const contact of contacts) {
        if (contact.id === undefined) {
          await tx.orm.public.Contact.create({
            customerId,
            name: contact.name,
            phoneNumber: contact.phoneNumber,
            deleted: false
          });
        }
      }

      for (const invoiceEmail of invoiceEmails) {
        if (invoiceEmail.id === undefined) {
          await tx.orm.public.InvoiceEmail.create({ customerId, emailAddress: invoiceEmail.emailAddress });
        }
      }

      for (const location of locationsToDelete) {
        await tx.orm.public.Location.where({ id: location.id }).update({ deleted: true });
      }

      for (const contact of contactsToDelete) {
        await tx.orm.public.Contact.where({ id: contact.id }).update({ deleted: true });
      }

      for (const invoiceEmail of invoiceEmailsToDelete) {
        await tx.orm.public.InvoiceEmail.where({ id: invoiceEmail.id }).delete();
      }
    });
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unable to save customer." };
  }

  revalidatePath("/manage/customers");
  revalidatePath(`/manage/customers/${customerId}`);
  revalidatePath(`/manage/customers/${customerId}/edit`);
  revalidatePath("/manage");

  redirect(`/manage/customers/${result.data.customerId}`);
}
