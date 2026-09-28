"use client";

import { useState } from "react";

import InfoAlert from "@/components/alerts/info-alert";
import BasicInput from "@/components/inputs/basic-input";
import Form from "@/components/wrappers/form";
import { LoginFormInput } from "@/features/login/types";
import { suppressEvent } from "@/lib/utils/event-utils";

type LoginFormProps = {
  email?: string;
  initialError?: string;
  requiresNewPassword?: boolean;
  action: (input: LoginFormInput) => Promise<{ success: boolean; error?: string }>;
};

export default function LoginForm({ email, initialError, requiresNewPassword, action }: LoginFormProps) {
  const [error, setError] = useState<string | undefined>(initialError);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    suppressEvent(event);
    setError(undefined);

    try {
      const formData = new FormData(event.currentTarget);

      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");
      const newPassword = String(formData.get("newPassword") ?? "");
      const confirmPassword = String(formData.get("confirmPassword") ?? "");

      if (newPassword !== confirmPassword) {
        setError("New passwords do not match.");
        return;
      }

      setIsSaving(true);

      const result = await action({ email, password, newPassword });
      if (!result.success) setError(result.error ?? "Invalid credentials.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit} submitText="Sign in" error={error} isSaving={isSaving}>
      {requiresNewPassword && <InfoAlert text="You are required to set a new password." />}
      <BasicInput type="email" id="email" label="Email" initial={email} autoComplete="username" required />
      <BasicInput
        type="password"
        id="password"
        label={requiresNewPassword ? "Current password" : "Password"}
        autoComplete="current-password"
        required
      />
      {requiresNewPassword && (
        <>
          <BasicInput type="password" id="newPassword" label="New password" autoComplete="new-password" required />
          <BasicInput type="password" id="confirmPassword" label="Confirm new password" autoComplete="new-password" required />
        </>
      )}
    </Form>
  );
}
