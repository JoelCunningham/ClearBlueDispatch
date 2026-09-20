"use client";

import SubmitButton from "@/components/buttons/submit-button";
import NumberInput from "@/components/inputs/number-input";
import TextInput from "@/components/inputs/text-input";
import LineItem from "@/components/wrappers/line-item";

type DocketFormProps = {
  docketNumber: number;
  date: string;
  customerName: string;
  action: (formData: FormData) => void | Promise<void>;
};

export function DocketForm({ docketNumber, date, customerName, action }: DocketFormProps) {
  return (
    <form action={action} className="space-y-3">
      <section className="rounded-lg border bg-muted/30 p-4 grid grid-cols-2 gap-x-4 gap-y-4 text-sm -mt-2">
        <LineItem name="Docket number" value={`#${docketNumber}`} vertical />
        <LineItem name="Date" value={date} vertical />
        <LineItem name="Customer" value={customerName} vertical />
      </section>

      <NumberInput id="volume" label="Volume" />
      <NumberInput id="batchNumber" label="Batch number" />
      <TextInput id="repName" label="Name" />
      <TextInput id="repSignature" label="Signature" />

      <SubmitButton text="Create docket" />
    </form>
  );
}
