"use client";

import { useState } from "react";

import type { DocketFormInput } from "../types";

type DocketFormProps = {
  docketNumber: number;
  date: string;
  customerName: string;
  suburb: string;
  action: (input: DocketFormInput) => Promise<{ success: boolean; error?: string }>;
};

export function DocketForm({ docketNumber, date, customerName, suburb, action }: DocketFormProps) {
  const [volume, setVolume] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [repName, setRepName] = useState("");
  const [repSignature, setRepSignature] = useState("");

  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(undefined);
    setIsSaving(true);

    try {
      const result = await action({ volume: Number(volume), batchNumber, repName, repSignature });
      if (!result.success) setError(result.error ?? "Unable to create docket.");
    } catch (error) {
      console.error("Error creating docket:", error);

      setError(error instanceof Error ? error.message : "Unable to create docket.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-lg border bg-muted/30 p-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Docket number</dt>
            <dd className="mt-1 font-medium">#{docketNumber}</dd>
          </div>

          <div>
            <dt className="text-muted-foreground">Date</dt>
            <dd className="mt-1 font-medium">{date}</dd>
          </div>

          <div className="col-span-2">
            <dt className="text-muted-foreground">Customer</dt>
            <dd className="mt-1 font-medium">
              {customerName} ({suburb})
            </dd>
          </div>
        </dl>
      </section>

      <div className="space-y-2">
        <label htmlFor="docket-volume" className="text-sm font-medium">
          Volume
        </label>

        <input
          id="docket-volume"
          type="number"
          min="1"
          step="1"
          value={volume}
          onChange={event => setVolume(event.target.value)}
          required
          className="w-full rounded-md border bg-background px-3 py-2"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="docket-batch-number" className="text-sm font-medium">
          Batch number
        </label>

        <input
          id="docket-batch-number"
          type="text"
          value={batchNumber}
          onChange={event => setBatchNumber(event.target.value)}
          required
          className="w-full rounded-md border bg-background px-3 py-2"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="docket-rep-name" className="text-sm font-medium">
          Representative name
        </label>

        <input
          id="docket-rep-name"
          type="text"
          value={repName}
          onChange={event => setRepName(event.target.value)}
          required
          className="w-full rounded-md border bg-background px-3 py-2"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="docket-rep-signature" className="text-sm font-medium">
          Representative signature
        </label>

        <input
          id="docket-rep-signature"
          type="text"
          value={repSignature}
          onChange={event => setRepSignature(event.target.value)}
          required
          className="w-full rounded-md border bg-background px-3 py-2"
        />
      </div>

      {error && (
        <div role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSaving ? "Creating..." : "Create docket"}
      </button>
    </form>
  );
}
