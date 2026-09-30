"use client";

import { useState } from "react";

import BasicInput from "@/components/inputs/basic-input";
import Form from "@/components/wrappers/form";
import { SetupPasswordInput } from "@/features/login/types";
import { suppressEvent } from "@/lib/utils/event-utils";

type SetupPasswordFormProps = {
  action: (input: SetupPasswordInput) => Promise<{ success: boolean; error?: string }>;
};

export default function SetupPasswordForm({ action }: SetupPasswordFormProps) {
  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    suppressEvent(event);
    setError(undefined);

    try {
      const formData = new FormData(event.currentTarget);

      const password = String(formData.get("password") ?? "");
      const confirmPassword = String(formData.get("confirmPassword") ?? "");

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      setIsSaving(true);

      const result = await action({ password, confirmPassword });
      if (!result.success) setError(result.error ?? "Invalid credentials.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit} submitText="Setup Account" error={error} isSaving={isSaving}>
      <BasicInput type="password" id="password" label="Password" autoComplete="new-password" required />
      <BasicInput type="password" id="confirmPassword" label="Confirm Password" autoComplete="new-password" required />
    </Form>
  );
}
