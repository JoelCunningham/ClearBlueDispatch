"use client";

import { useState } from "react";

import BasicInput from "@/components/inputs/basic-input";
import Form from "@/components/wrappers/form";
import { ResetPasswordInput } from "@/features/login/types";
import { suppressEvent } from "@/lib/utils/event-utils";

type ResetPasswordFormProps = {
  initialError?: string;
  action: (input: ResetPasswordInput) => Promise<{ success: boolean; error?: string }>;
};

export default function ResetPasswordForm({ initialError, action }: ResetPasswordFormProps) {
  const [error, setError] = useState<string | undefined>(initialError);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    suppressEvent(event);
    setError(undefined);

    try {
      const formData = new FormData(event.currentTarget);

      const email = String(formData.get("email") ?? "");

      setIsSaving(true);

      const result = await action({ email });
      if (!result.success) setError(result.error ?? "Invalid credentials.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit} submitText="Reset Password" error={error} isSaving={isSaving}>
      <BasicInput type="email" id="email" label="Email" autoComplete="username" required />
    </Form>
  );
}
