"use client";

import BaseForm from "@/components/forms/base-form";
import BasicInput from "@/components/inputs/basic-input";
import SignatureInput from "@/components/inputs/signature-input";
import LineItem from "@/components/wrappers/line-item";
import { DocketFormInput } from "@/features/dockets/types";
import { ActionResult } from "@/lib/utils/action-utils";

type DocketFormProps = {
  number?: number;
  date: string;
  customerName: string;
  volume?: number;
  batchNumber?: string;
  comments?: string;
  repName?: string;
  repSignature?: string;
  action: (input: DocketFormInput) => Promise<ActionResult>;
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
  async function handleAction(formData: FormData) {
    const input: DocketFormInput = {
      volume: Number(formData.get("volume") ?? 0),
      batchNumber: String(formData.get("batchNumber") ?? ""),
      comments: String(formData.get("comments") ?? ""),
      repName: String(formData.get("repName") ?? ""),
      repSignature: String(formData.get("repSignature") ?? "")
    };

    return action(input);
  }

  return (
    <BaseForm action={handleAction} errorMessage="Unable to create docket." submitText={number ? "Save changes" : "Create docket"}>
      <section className="-mt-2 space-y-3 rounded-lg border bg-muted/30 p-4 text-sm">
        <LineItem name="Customer" value={customerName} />
        <LineItem name="Date" value={date} />
      </section>
      <BasicInput type="number" id="volume" label="Volume" minNumber={1} step={1} initial={volume} />
      <BasicInput type="number" id="batchNumber" label="Batch number" minNumber={1} step={1} initial={batchNumber} />
      <BasicInput type="text" id="comments" label="Comments" initial={comments} />
      <BasicInput type="text" id="repName" label="Name" initial={repName} />
      <SignatureInput id="repSignature" label="Signature" initial={repSignature} />
    </BaseForm>
  );
}
