"use server";

import { renderToBuffer } from "@react-pdf/renderer";
import { get } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { render } from "react-email";

import CustomerDocketEmail from "@/content/customer-docket-email";
import DocketPdf from "@/content/docket-pdf";
import InternalDocketEmail from "@/content/internal-docket-email";
import { requireDeliveryAccess, requireDocketAccess, requireRole } from "@/lib/auth/authorization";
import { sendEmail } from "@/lib/email/sendEmail";
import { getErrorMessage, getValidationResult } from "@/lib/utils/action-utils";
import { dataUrlToBuffer } from "@/lib/utils/buffer-utils";
import { getPhotoPathPrefix, makeRoomForPhotos, removeDocketPhotos, verifyDocketPhotos } from "@/lib/utils/docket-photo-utils";
import { getPhotoExtension } from "@/lib/utils/photo-utils";
import { getDocketNumber } from "@/lib/utils/string-utils";
import { getLogoBuffer, getLogoUrl } from "@/lib/utils/url-utils";
import { db } from "@/prisma/db";
import { CreateDocketInput, UpdateDocketInput, UploadedPhoto } from "./types";
import { createDocketSchema, updateDocketSchema } from "./validation";

export async function createDocket(input: CreateDocketInput) {
  const result = createDocketSchema.safeParse(input);
  if (!result.success) return getValidationResult(result.error, "Invalid docket details.");

  const { deliveryId, volume, batchNumber, comments, repName, repSignature } = result.data;
  const delivery = await requireDeliveryAccess(deliveryId);
  if (!delivery) return { success: false, error: "Delivery not found." };

  let photos: UploadedPhoto[];
  try {
    photos = await verifyDocketPhotos(result.data.photos, getPhotoPathPrefix({ deliveryId }));
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Invalid docket photos.") };
  }

  let docketId: number;

  try {
    await makeRoomForPhotos(
      photos.reduce((total, photo) => total + photo.size, 0),
      photos.map(photo => photo.blobId)
    );

    docketId = await db.transaction(async tx => {
      const delivery = await tx.orm.public.Delivery.where({ id: deliveryId, deleted: false }).first();
      if (!delivery) throw new Error("Delivery not found.");

      const existingDocket = await tx.orm.public.Docket.where({ deliveryId }).first();
      if (existingDocket) throw new Error("This delivery already has a docket.");

      const signature = dataUrlToBuffer(repSignature);

      const docket = await tx.orm.public.Docket.create({ deliveryId, volume, batchNumber, comments, repName, repSignature: signature });
      await createDocketPhotos(tx, docket.id, photos);
      return docket.id;
    });
  } catch (error) {
    try {
      await removeDocketPhotos(photos);
    } catch (cleanupError) {
      console.error("Failed to clean up docket photo Blobs after creation failed.", cleanupError);
    }
    return { success: false, error: getErrorMessage(error, "Unable to create docket.") };
  }

  try {
    await sendDocketEmail(docketId, photos);
  } catch (error) {
    console.error("Failed to send docket email", error);
  }

  revalidatePath(`/deliveries/${deliveryId}`);
  redirect(`/deliveries/${deliveryId}`);
}

export async function updateDocket(input: UpdateDocketInput) {
  await requireRole("MANAGER");

  const result = updateDocketSchema.safeParse(input);
  if (!result.success) return getValidationResult(result.error, "Invalid docket details.");

  const { docketId, volume, batchNumber, comments, repName, repSignature } = result.data;
  const docket = await requireDocketAccess(docketId);
  if (!docket) return { success: false, error: "Docket not found." };

  let photos: UploadedPhoto[];
  try {
    const existingPhotos = await db.orm.public.DocketPhoto.where({ docketId, deleted: false }).all();
    const existingBlobIds = new Set(existingPhotos.map(photo => photo.blobId));
    photos = await verifyDocketPhotos(result.data.photos, getPhotoPathPrefix({ docketId }), existingBlobIds);
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Invalid docket photos.") };
  }

  const deliveryId = docket.deliveryId;

  try {
    const existingPhotos = await db.orm.public.DocketPhoto.where({ docketId, deleted: false }).all();
    const existingBlobIds = new Set(existingPhotos.map(photo => photo.blobId));
    const newPhotos = photos.filter(photo => !existingBlobIds.has(photo.blobId));
    const removedPhotos = existingPhotos.filter(existing => !photos.some(photo => photo.blobId === existing.blobId));

    await makeRoomForPhotos(
      newPhotos.reduce((total, photo) => total + photo.size, 0),
      photos.map(photo => photo.blobId)
    );

    await db.transaction(async tx => {
      const signature = dataUrlToBuffer(repSignature);
      const currentDocket = await tx.orm.public.Docket.where({ id: docketId, deleted: false }).first();
      if (!currentDocket) throw new Error("Docket not found.");

      await tx.orm.public.Docket.where({ id: docketId, deleted: false }).update({
        volume,
        batchNumber,
        comments,
        repName,
        repSignature: signature
      });
      await Promise.all(
        removedPhotos.map(photo => tx.orm.public.DocketPhoto.where({ id: photo.id, deleted: false }).update({ deleted: true }))
      );
      await createDocketPhotos(tx, docketId, newPhotos);
    });

    try {
      await removeDocketPhotos(removedPhotos);
    } catch (error) {
      console.error("Failed to remove deleted docket photo Blobs.", error);
    }
  } catch (error) {
    const existingPhotos = await db.orm.public.DocketPhoto.where({ docketId, deleted: false }).all();
    const existingBlobIds = new Set(existingPhotos.map(photo => photo.blobId));
    try {
      await removeDocketPhotos(photos.filter(photo => !existingBlobIds.has(photo.blobId)));
    } catch (cleanupError) {
      console.error("Failed to clean up new docket photo Blobs after update failed.", cleanupError);
    }
    console.error("Failed to save docket photos", error);
    return { success: false, error: getErrorMessage(error, "Unable to save docket photos.") };
  }

  try {
    await sendDocketEmail(docketId, photos, true);
  } catch (error) {
    console.error("Failed to send docket email", error);
  }

  revalidatePath(`/dockets/${docketId}`);
  revalidatePath("/dockets");
  revalidatePath(`/deliveries/${deliveryId}`);

  redirect(`/dockets/${docketId}`);
}

function createDocketPhotos(tx: Parameters<Parameters<typeof db.transaction>[0]>[0], docketId: number, photos: UploadedPhoto[]) {
  return Promise.all(
    photos.map(photo =>
      tx.orm.public.DocketPhoto.create({
        docketId,
        blobId: photo.blobId,
        contentType: photo.contentType,
        size: photo.size
      })
    )
  );
}

async function sendDocketEmail(docketId: number, photos: UploadedPhoto[], isUpdate: boolean = false) {
  const docket = await db.orm.public.Docket.where({ id: docketId, deleted: false }).first();
  if (!docket) throw new Error(`Docket ${docketId} not found.`);

  const delivery = await db.orm.public.Delivery.where({ id: docket.deliveryId, deleted: false })
    .include("route")
    .include("location", location => location.include("customer"))
    .first();

  if (!delivery) throw new Error(`Delivery ${docket.deliveryId} not found.`);
  if (!delivery.route) throw new Error(`Route not found for delivery ${delivery.id}.`);
  if (!delivery.location) throw new Error(`Location not found for delivery ${delivery.id}.`);
  if (!delivery.location.customer) throw new Error(`Customer not found for location ${delivery.location.id}.`);

  const docketNumber = getDocketNumber(docket.id);

  const logoUrl = getLogoUrl();
  const logoBuffer = await getLogoBuffer();

  const [managers, invoiceEmails] = await Promise.all([
    db.orm.public.User.where({ role: "MANAGER", deleted: false }).all(),
    db.orm.public.InvoiceEmail.where({ customerId: delivery.location.customer.id, deleted: false }).all()
  ]);

  const managerRecipients = managers.map(manager => manager.email);
  const customerRecipients = invoiceEmails.map(invoiceEmail => invoiceEmail.emailAddress);

  const docketPdf = await renderToBuffer(
    DocketPdf({
      docketNumber: docketNumber,
      date: delivery.route.date,
      customerName: delivery.location.customer.name,
      address: delivery.location.address,
      volume: docket.volume,
      batchNumber: docket.batchNumber,
      comments: docket.comments ?? undefined,
      repName: docket.repName,
      repSignature: docket.repSignature,
      logo: logoBuffer
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
      customerRate: delivery.location.customer.rate,
      address: delivery.location.address,
      volume: docket.volume,
      batchNumber: docket.batchNumber,
      repName: docket.repName,
      logoUrl: logoUrl,
      isUpdate
    })
  );

  const docketAttachment = {
    filename: `ClearBlue Solutions Docket-${docketNumber}.pdf`,
    content: docketPdf,
    contentType: "application/pdf"
  };

  const photoAttachments = await Promise.all(
    photos.map(async (photo, index) => ({
      filename: `Docket-${docketNumber}-Photo-${index + 1}.${getPhotoExtension(photo.contentType)}`,
      content: Buffer.from(await getPhotoBuffer(photo.blobId)),
      contentType: photo.contentType
    }))
  );

  const emailPromises: Promise<void>[] = [];

  if (customerRecipients.length > 0) {
    emailPromises.push(
      sendEmail({
        to: customerRecipients,
        subject: `${isUpdate ? "Updated: " : ""}Delivery Docket ${docketNumber} - ClearBlue Solutions`,
        html: customerEmailHtml,
        attachments: [...photoAttachments, docketAttachment]
      })
    );
  }

  if (managerRecipients.length > 0) {
    emailPromises.push(
      sendEmail({
        to: managerRecipients,
        subject: `[Internal] ${isUpdate ? "Updated Docket" : "New Docket"} ${docketNumber} - ${delivery.location.customer.name}`,
        html: internalEmailHtml,
        attachments: [...photoAttachments, docketAttachment]
      })
    );
  }

  await Promise.all(emailPromises);
}

async function getPhotoBuffer(blobId: string): Promise<ArrayBuffer> {
  const blob = await get(blobId, { access: "private" });
  if (!blob) throw new Error("Unable to retrieve photo (not found).");
  return new Response(blob.stream).arrayBuffer();
}
