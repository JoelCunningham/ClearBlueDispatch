import { issueSignedToken, presignUrl } from "@vercel/blob";

import { requireDeliveryAccess, requireDocketAccess } from "@/lib/auth/authorization";
import { ensurePhotoUploadCapacity, getPhotoPathPrefix } from "@/lib/utils/docket-photo-utils";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      contentType?: string;
      size?: number;
      deliveryId?: number;
      docketId?: number;
    };
    const { contentType, size, deliveryId, docketId } = body;
    const hasValidDeliveryId = typeof deliveryId === "number" && Number.isSafeInteger(deliveryId) && deliveryId > 0;
    const hasValidDocketId = typeof docketId === "number" && Number.isSafeInteger(docketId) && docketId > 0;
    if (
      Number(hasValidDeliveryId) + Number(hasValidDocketId) !== 1 ||
      typeof contentType !== "string" ||
      typeof size !== "number" ||
      !Number.isSafeInteger(size) ||
      size <= 0
    ) {
      throw new Error("Invalid photo upload request.");
    }
    const requestedSize = size;

    let target: { deliveryId: number } | { docketId: number };
    if (deliveryId !== undefined) {
      await requireDeliveryAccess(deliveryId);
      target = { deliveryId };
    } else if (docketId !== undefined) {
      await requireDocketAccess(docketId);
      target = { docketId };
    } else {
      throw new Error("Invalid photo upload request.");
    }

    const allowedContentTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
    if (!allowedContentTypes.includes(contentType)) throw new Error("Photo type is not supported.");
    await ensurePhotoUploadCapacity(requestedSize);

    const pathname = `${getPhotoPathPrefix(target)}${crypto.randomUUID()}`;
    const token = await issueSignedToken({
      allowedContentTypes,
      maximumSizeInBytes: requestedSize,
      operations: ["put"],
      pathname
    });
    const { presignedUrl } = await presignUrl(token, {
      access: "private",
      addRandomSuffix: true,
      allowedContentTypes,
      maximumSizeInBytes: requestedSize,
      operation: "put",
      pathname
    });

    return Response.json({ url: presignedUrl });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to authorize photo upload." }, { status: 400 });
  }
}
