"use client";

import BaseForm from "@/components/forms/base-form";
import BasicInput from "@/components/inputs/basic-input";
import PhotoInput from "@/components/inputs/photo-input";
import SignatureInput from "@/components/inputs/signature-input";
import LineItem from "@/components/wrappers/line-item";
import { DocketFormInput, DocketPhotoPreview, UploadedPhoto } from "@/features/dockets/types";
import { ActionResult } from "@/lib/utils/action-utils";

type DocketFormProps = {
  uploadTarget: { deliveryId?: number; docketId?: number };
  number?: number;
  date: string;
  customerName: string;
  volume?: number;
  batchNumber?: string;
  comments?: string;
  repName?: string;
  repSignature?: string;
  initialPhotos?: DocketPhotoPreview[];
  action: (input: DocketFormInput) => Promise<ActionResult>;
};

export default function DocketForm({
  uploadTarget,
  number,
  date,
  customerName,
  action,
  volume,
  batchNumber,
  comments,
  repName,
  repSignature,
  initialPhotos = []
}: DocketFormProps) {
  async function handleAction(formData: FormData) {
    const input: DocketFormInput = {
      volume: Number(formData.get("volume") ?? 0),
      batchNumber: String(formData.get("batchNumber") ?? ""),
      comments: String(formData.get("comments") ?? ""),
      repName: String(formData.get("repName") ?? ""),
      repSignature: String(formData.get("repSignature") ?? ""),
      photos: []
    };

    const files = formData.getAll("photos").filter((value): value is File => value instanceof File && value.size > 0);
    const existingPhotos = formData.getAll("photos-existing").map(value => JSON.parse(String(value)) as UploadedPhoto);
    const uploadedBlobIds: string[] = [];

    async function cleanupUploadedPhotos() {
      if (uploadedBlobIds.length === 0) return;
      const response = await fetch("/api/photos/upload/cleanup", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...uploadTarget, blobIds: uploadedBlobIds })
      });
      if (!response.ok) {
        console.error("Unable to clean up uploaded photos.", await response.text());
      }
    }

    let newPhotos: UploadedPhoto[];
    try {
      newPhotos = [];
      for (const file of files) {
        const response = await fetch("/api/photos/upload", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ...uploadTarget, contentType: file.type, size: file.size })
        });
        const uploadAuthorization = (await response.json()) as { url?: string; error?: string };
        if (!response.ok || !uploadAuthorization.url) {
          throw new Error(uploadAuthorization.error ?? "Unable to authorize photo upload.");
        }

        const { url } = uploadAuthorization;
        const uploadResponse = await fetch(url, {
          method: "PUT",
          headers: {
            "content-type": file.type,
            "x-vercel-blob-access": "private"
          },
          body: file
        });
        if (!uploadResponse.ok) throw new Error(`Photo upload failed (${uploadResponse.status}).`);
        const blob = (await uploadResponse.json()) as { url: string };

        uploadedBlobIds.push(blob.url);
        newPhotos.push({ blobId: blob.url, contentType: file.type, size: file.size });
      }
    } catch (error) {
      await cleanupUploadedPhotos();
      throw error;
    }

    input.photos = [...existingPhotos, ...newPhotos];

    const result = await action(input);
    if (!result.success) await cleanupUploadedPhotos();

    return result;
  }

  return (
    <BaseForm action={handleAction} errorMessage="Unable to create docket." submitText={number ? "Save changes" : "Create docket"}>
      <section className="-mt-2 space-y-3 rounded-lg border bg-muted/30 p-4 text-sm">
        <LineItem name="Customer" value={customerName} />
        <LineItem name="Date" value={date} />
      </section>
      <BasicInput type="number" id="volume" label="Volume" minNumber={1} step={1} initial={volume} />
      <BasicInput type="text" id="batchNumber" label="Batch number" initial={batchNumber} />
      <BasicInput type="text" id="comments" label="Comments" initial={comments} />
      <BasicInput type="text" id="repName" label="Name" initial={repName} />
      <SignatureInput id="repSignature" label="Signature" initial={repSignature} />
      <PhotoInput id="photos" maxPhotos={5} maxSizeMb={5} initialPhotos={initialPhotos} />
    </BaseForm>
  );
}
