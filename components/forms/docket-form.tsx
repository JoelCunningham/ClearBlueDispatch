"use client";

import { useState } from "react";

import BasicInput from "@/components/inputs/basic-input";
import Form from "@/components/wrappers/form";
import LineItem from "@/components/wrappers/line-item";
import { DocketFormInput } from "@/features/dockets/types";
import { suppressEvent } from "@/lib/utils/event-utils";

type DocketFormProps = {
  number?: number;
  date: string;
  customerName: string;
  volume?: number;
  batchNumber?: string;
  repName?: string;
  repSignature?: string;
  action: (input: DocketFormInput) => Promise<{ success: boolean; error?: string }>;
};

export default function DocketForm({ number, date, customerName, action, volume, batchNumber, repName, repSignature }: DocketFormProps) {
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
        repName: String(formData.get("repName") ?? ""),
        repSignature: String(formData.get("repSignature") ?? "")
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
        <LineItem name="Date" value={date} />
        <LineItem name="Customer" value={customerName} />
      </section>
      <BasicInput type="number" id="volume" label="Volume" minNumber={1} step={1} initial={volume} />
      <BasicInput type="number" id="batchNumber" label="Batch number" minNumber={1} step={1} initial={batchNumber} />
      <BasicInput type="text" id="repName" label="Name" initial={repName} />
      <BasicInput type="text" id="repSignature" label="Signature" initial={repSignature} />
    </Form>
  );
}
