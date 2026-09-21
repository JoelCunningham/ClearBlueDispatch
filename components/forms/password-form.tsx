"use client";

import { useState } from "react";

import BasicInput from "@/components/inputs/basic-input";
import Form from "@/components/wrappers/form";
import { PasswordFormInput } from "@/features/users/types";
import { suppressEvent } from "@/lib/utils/event-utils";

type PasswordFormProps = {
  requireCurrentPassword: boolean;
  action: (input: PasswordFormInput) => Promise<{ success: boolean; error?: string }>;
};

export default function PasswordForm({ requireCurrentPassword, action }: PasswordFormProps) {
  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    suppressEvent(event);
    setError(undefined);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const currentPassword = String(formData.get("currentPassword") ?? "");
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setIsSaving(true);

    try {
      const result = await action({ currentPassword: requireCurrentPassword ? currentPassword : undefined, newPassword });
      if (!result.success && result.success !== undefined) {
        setError(result.error ?? "Unable to change password.");
        return;
      }
      form.reset();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to change password.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form title="Change password" onSubmit={handleSubmit} isSaving={isSaving} error={error} submitText="Change password">
      {requireCurrentPassword && <BasicInput type="password" id="currentPassword" label="Current password" required />}
      <BasicInput type="password" id="newPassword" label="New password" minLength={12} required />
      <BasicInput type="password" id="confirmPassword" label="Confirm new password" minLength={12} required />
    </Form>
  );
}
