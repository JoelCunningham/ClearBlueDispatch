import { del, head, issueSignedToken, list, presignUrl } from "@vercel/blob";

import { db } from "@/prisma/db";
import { UploadedPhoto } from "@/features/dockets/types";

const cleanupThreshold = 0.9;
const maximumPhotoSize = 5 * 1024 * 1024;
const photoPathRoot = "docket-photos/";

export function getPhotoPathPrefix(target: { deliveryId?: number; docketId?: number }) {
  if (target.deliveryId !== undefined) return `${photoPathRoot}delivery-${target.deliveryId}/`;
  if (target.docketId !== undefined) return `${photoPathRoot}docket-${target.docketId}/`;
  throw new Error("A photo upload target is required.");
}

async function getPhotoBlobUsage(): Promise<number> {
  let cursor: string | undefined;
  let usedBytes = 0;
  do {
    const result = await list({ prefix: photoPathRoot, limit: 1000, cursor });
    usedBytes += result.blobs.reduce((total, blob) => total + blob.size, 0);
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);
  return usedBytes;
}

export async function ensurePhotoUploadCapacity(requiredBytes: number): Promise<void> {
  const blobCapacity = Number(process.env["BLOB_CAPACITY"] ?? 1_000_000_000);
  if (!Number.isSafeInteger(blobCapacity) || blobCapacity <= 0) {
    throw new Error("Photo Blob capacity is not configured correctly.");
  }
  if (!Number.isSafeInteger(requiredBytes) || requiredBytes <= 0 || requiredBytes > maximumPhotoSize) {
    throw new Error("Photo size is invalid or exceeds the 5 MB limit.");
  }

  const usedBytes = await getPhotoBlobUsage();
  if (usedBytes + requiredBytes > blobCapacity * cleanupThreshold) {
    throw new Error("There is not enough photo storage available. Please try again later.");
  }
}

export async function verifyDocketPhotos(
  photos: UploadedPhoto[],
  expectedPathPrefix: string,
  allowedExistingBlobIds: ReadonlySet<string> = new Set()
): Promise<UploadedPhoto[]> {
  const storeId = process.env["PHOTO_BLOB_STORE_ID"];
  if (!process.env["BLOB_READ_WRITE_TOKEN"] && photos.length > 0) {
    throw new Error("Photo Blob storage is not configured.");
  }

  return Promise.all(
    photos.map(async photo => {
      const url = new URL(photo.blobId);
      const hostname = url.hostname.toLowerCase();
      const isVercelBlobHost = hostname.endsWith(".blob.vercel-storage.com");

      if (url.protocol !== "https:" || !isVercelBlobHost) {
        throw new Error("Photo does not belong to the configured Blob store.");
      }
      if (!allowedExistingBlobIds.has(photo.blobId) && !url.pathname.slice(1).startsWith(expectedPathPrefix)) {
        throw new Error("Photo does not belong to the requested docket.");
      }

      const configuredStoreId = storeId?.trim().toLowerCase().replace(/^store_/, "");
      const expectedHostnames = configuredStoreId
        ? [
            `${configuredStoreId}.private.blob.vercel-storage.com`,
            `${configuredStoreId}.public.blob.vercel-storage.com`
          ]
        : [];
      if (expectedHostnames.length > 0 && !expectedHostnames.includes(hostname)) {
        throw new Error("Photo does not belong to the configured Blob store.");
      }

      let blob;
      try {
        blob = await head(photo.blobId);
      } catch (error) {
        console.error("Blob photo ownership validation failed.", {
          hostname,
          error: error instanceof Error ? error.message : "Unknown Blob error"
        });
        throw new Error("Photo does not belong to the configured Blob store.");
      }

      if (!blob.contentType.startsWith("image/") || blob.size <= 0 || blob.size > maximumPhotoSize) {
        throw new Error("Photo is invalid or exceeds the 5 MB limit.");
      }

      return { blobId: photo.blobId, contentType: blob.contentType, size: blob.size };
    })
  );
}

export async function removeDocketPhotos(photos: UploadedPhoto[]): Promise<void> {
  await Promise.all(photos.map(photo => del(photo.blobId)));
}

export async function getPrivatePhotoUrl(blobId: string): Promise<string> {
  const token = await issueSignedToken({ pathname: "*", operations: ["get"] });
  const { presignedUrl } = await presignUrl(token, {
    access: "private",
    operation: "get",
    pathname: new URL(blobId).pathname.slice(1)
  });
  return presignedUrl;
}

export async function makeRoomForPhotos(requiredBytes: number, protectedBlobIds: string[]): Promise<void> {
  const blobCapacity = Number(process.env["BLOB_CAPACITY"] ?? 1_000_000_000);
  if (!Number.isSafeInteger(blobCapacity) || blobCapacity <= 0) {
    throw new Error("Photo Blob capacity is not configured correctly.");
  }

  const photos = await db.orm.public.DocketPhoto.where({ deleted: false }).orderBy(photo => photo.createdAt.asc()).all();
  let usedBytes = await getPhotoBlobUsage();
  const targetBytes = blobCapacity * cleanupThreshold;

  if (usedBytes + requiredBytes <= targetBytes) return;

  for (const photo of photos) {
    if (usedBytes + requiredBytes <= targetBytes) break;
    if (protectedBlobIds.includes(photo.blobId)) continue;

    await db.orm.public.DocketPhoto.where({ id: photo.id, deleted: false }).update({ deleted: true });
    try {
      await del(photo.blobId);
      usedBytes -= photo.size;
    } catch (error) {
      console.error("Failed to remove photo Blob after marking it deleted.", {
        blobId: photo.blobId,
        error: error instanceof Error ? error.message : "Unknown Blob error"
      });
    }
  }

  if (usedBytes + requiredBytes > targetBytes) {
    throw new Error("There is not enough photo storage available. Please try again later.");
  }
}
