import { requireDeliveryAccess, requireDocketAccess } from "@/lib/auth/authorization";
import { getPhotoPathPrefix, removeDocketPhotos, verifyDocketPhotos } from "@/lib/utils/docket-photo-utils";
import { db } from "@/prisma/db";

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as {
      blobIds?: unknown;
      deliveryId?: unknown;
      docketId?: unknown;
    };
    const blobIds =
      Array.isArray(body.blobIds) && body.blobIds.every((blobId): blobId is string => typeof blobId === "string") ? body.blobIds : [];
    const deliveryId = typeof body.deliveryId === "number" ? body.deliveryId : undefined;
    const docketId = typeof body.docketId === "number" ? body.docketId : undefined;

    if (blobIds.length === 0 || blobIds.length > 5 || Number(Boolean(deliveryId)) + Number(Boolean(docketId)) !== 1) {
      throw new Error("Invalid photo cleanup request.");
    }

    let expectedPathPrefix: string;
    if (deliveryId !== undefined) {
      await requireDeliveryAccess(deliveryId);
      expectedPathPrefix = getPhotoPathPrefix({ deliveryId });
    } else {
      await requireDocketAccess(docketId!);
      const existingPhotos = await db.orm.public.DocketPhoto.where({ docketId, deleted: false }).all();
      if (existingPhotos.some(photo => blobIds.includes(photo.blobId))) throw new Error("A stored photo cannot be cleaned up.");
      expectedPathPrefix = getPhotoPathPrefix({ docketId });
    }

    const photos = await verifyDocketPhotos(
      blobIds.map(blobId => ({ blobId, contentType: "image/unknown", size: 1 })),
      expectedPathPrefix
    );
    await removeDocketPhotos(photos);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to clean up photos." }, { status: 400 });
  }
}
