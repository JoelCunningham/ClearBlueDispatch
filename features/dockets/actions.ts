"use server";

import { renderToBuffer } from "@react-pdf/renderer";
import { readFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import { render } from "react-email";

import CustomerDocketEmail from "@/content/customer-docket-email";
import DocketPdf from "@/content/docket-pdf";
import { sendEmail } from "@/lib/email/sendEmail";
import { getDocketNumber } from "@/lib/utils/string-utils";
import { db } from "@/prisma/db";
import { UpdateDocketInput } from "./types";
import { CreateDocketInput, createDocketSchema, updateDocketSchema } from "./validation";
import { InternalDocketEmail } from "@/content/internal-docket-email";

export async function createDocket(input: CreateDocketInput) {
  const result = createDocketSchema.safeParse(input);
  if (!result.success) return { success: false, error: "Invalid docket details." };

  const { deliveryId, volume, batchNumber, repName, repSignature } = result.data;
  let docketId: number;

  try {
    docketId = await db.transaction(async tx => {
      const delivery = await tx.orm.public.Delivery.where({ id: deliveryId }).first();
      if (!delivery) throw new Error("Delivery not found.");

      const existingDocket = await tx.orm.public.Docket.where({ deliveryId }).first();
      if (existingDocket) throw new Error("This delivery already has a docket.");

      const docket = await tx.orm.public.Docket.create({ deliveryId, volume, batchNumber, repName, repSignature });
      return docket.id;
    });
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unable to create docket." };
  }

  try {
    await sendDocketEmail(docketId);
  } catch (error) {
    console.error("Failed to send docket email", error);
  }

  revalidatePath(`/deliveries/${deliveryId}`);
  redirect(`/deliveries/${deliveryId}`);
}

export async function updateDocket(input: UpdateDocketInput) {
  const result = updateDocketSchema.safeParse(input);
  if (!result.success) return { success: false, error: "Invalid docket details." };

  const { docketId, volume, batchNumber, repName, repSignature } = result.data;
  let deliveryId: number;

  try {
    deliveryId = await db.transaction(async tx => {
      const docket = await tx.orm.public.Docket.where({ id: docketId }).first();
      if (!docket) throw new Error("Docket not found.");

      await tx.orm.public.Docket.where({ id: docketId }).update({ volume, batchNumber, repName, repSignature });
      return docket.deliveryId;
    });
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unable to update docket." };
  }

  try {
    await sendDocketEmail(docketId, true);
  } catch (error) {
    console.error("Failed to send docket email", error);
  }

  revalidatePath(`/dockets/${docketId}`);
  revalidatePath("/dockets");
  revalidatePath(`/deliveries/${deliveryId}`);

  redirect(`/dockets/${docketId}`);
}

async function sendDocketEmail(docketId: number, isUpdate: boolean = false) {
  const docket = await db.orm.public.Docket.where({ id: docketId }).first();
  if (!docket) throw new Error(`Docket ${docketId} not found.`);

  const delivery = await db.orm.public.Delivery.where({ id: docket.deliveryId })
    .include("route")
    .include("location", location => location.include("customer"))
    .first();

  if (!delivery) throw new Error(`Delivery ${docket.deliveryId} not found.`);
  if (!delivery.route) throw new Error(`Route not found for delivery ${delivery.id}.`);
  if (!delivery.location) throw new Error(`Location not found for delivery ${delivery.id}.`);
  if (!delivery.location.customer) throw new Error(`Customer not found for location ${delivery.location.id}.`);

  const docketNumber = getDocketNumber(docket.id);

  const logoBytes = await readFile(path.join(process.cwd(), "public", "icons", "logo.png"));
  const logoUrl = `${process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_APP_URL : "http://localhost:3000"}/icons/logo.png`;

  const [managers, invoiceEmails] = await Promise.all([
    db.orm.public.User.where({ role: "MANAGER" }).all(),
    db.orm.public.InvoiceEmail.where({ customerId: delivery.location.customer.id }).all()
  ]);

  const managerRecipients = managers.map(manager => manager.email);
  const customerRecipients = invoiceEmails.map(invoiceEmail => invoiceEmail.emailAddress);

  const docketPdf = await renderToBuffer(
    DocketPdf({
      number: docketNumber,
      date: delivery.route.date,
      customerName: delivery.location.customer.name,
      address: delivery.location.address,
      volume: docket.volume,
      batchNumber: docket.batchNumber,
      repName: docket.repName,
      signature: docket.repSignature,
      logo: logoBytes
    })
  );

  const customerEmailHtml = await render(
    CustomerDocketEmail({
      number: docketNumber,
      date: delivery.route.date,
      customerName: delivery.location.customer.name,
      volume: docket.volume,
      batchNumber: docket.batchNumber,
      logoUrl: logoUrl,
      isUpdate
    })
  );

  const internalEmailHtml = await render(
    InternalDocketEmail({
      number: docketNumber,
      date: delivery.route.date,
      customerName: delivery.location.customer.name,
      address: delivery.location.address,
      volume: docket.volume,
      batchNumber: docket.batchNumber,
      repName: docket.repName,
      logoUrl: logoUrl,
      isUpdate
    })
  );

  const attachment = {
    filename: `ClearBlue Solutions Docket-${docketNumber}.pdf`,
    content: docketPdf,
    contentType: "application/pdf"
  };

  const emailPromises: Promise<void>[] = [];

  if (customerRecipients.length > 0) {
    emailPromises.push(
      sendEmail({
        to: customerRecipients,
        subject: `${isUpdate ? "Updated: " : ""}Delivery Docket ${docketNumber} - ClearBlue Solutions`,
        html: customerEmailHtml,
        attachments: [attachment]
      })
    );
  }

  if (managerRecipients.length > 0) {
    emailPromises.push(
      sendEmail({
        to: managerRecipients,
        subject: `[Internal] ${isUpdate ? "Updated Docket" : "New Docket"} ${docketNumber} - ${delivery.location.customer.name}`,
        html: internalEmailHtml,
        attachments: [attachment]
      })
    );
  }

  await Promise.all(emailPromises);
}
