"use client";

import { useState } from "react";

import BasicInput from "@/components/inputs/basic-input";
import SignatureInput from "@/components/inputs/signature-input";
import Form from "@/components/wrappers/form";
import LineItem from "@/components/wrappers/line-item";
import { DocketFormInput } from "@/features/dockets/types";
import { dataUrlToBuffer } from "@/lib/utils/buffer-utils";
import { suppressEvent } from "@/lib/utils/event-utils";

type DocketFormProps = {
  number?: number;
  date: string;
  customerName: string;
  volume?: number;
  batchNumber?: string;
  comments?: string;
  repName?: string;
  repSignature?: string;
  action: (input: DocketFormInput) => Promise<{ success: boolean; error?: string }>;
};

export default function DocketForm({
  number,
  date,
  customerName,
  action,
  volume,
  batchNumber,
  comments,
  repName,
  repSignature
}: DocketFormProps) {
  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    suppressEvent(event);
    setError(undefined);
    setIsSaving(true);

    try {
      const formData = new FormData(event.currentTarget);

      const input: DocketFormInput = {
        volume: Number(formData.get("volume") ?? 0),
        batchNumber: String(formData.get("batchNumber") ?? ""),
        comments: String(formData.get("comments") ?? ""),
        repName: String(formData.get("repName") ?? ""),
        repSignature: dataUrlToBuffer(String(formData.get("repSignature") ?? ""))
      };

      const result = await action(input);
      if (!result.success) setError(result.error ?? "Unable to create docket.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create docket.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit} isSaving={isSaving} error={error} submitText={number ? "Save changes" : "Create docket"}>
      <section className="-mt-2 space-y-3 rounded-lg border bg-muted/30 p-4 text-sm">
        <LineItem name="Customer" value={customerName} />
        <LineItem name="Date" value={date} />
      </section>
      <BasicInput type="number" id="volume" label="Volume" minNumber={1} step={1} initial={volume} />
      <BasicInput type="number" id="batchNumber" label="Batch number" minNumber={1} step={1} initial={batchNumber} />
      <BasicInput type="text" id="comments" label="Comments" initial={comments} />
      <BasicInput type="text" id="repName" label="Name" initial={repName} />
      <SignatureInput id="repSignature" label="Signature" initial={repSignature} />
    </Form>
  );
}
