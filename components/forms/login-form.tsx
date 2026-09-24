"use client";

import { useEffect, useState } from "react";

import { LoginFormInput } from "@/features/login/types";
import { suppressEvent } from "@/lib/utils/event-utils";
import BasicInput from "../inputs/basic-input";
import Form from "../wrappers/form";

type LoginFormProps = {
  email?: string;
  initialError?: string;
  requiresNewPassword?: boolean;
  action: (input: LoginFormInput) => Promise<{ success: boolean; error?: string }>;
};

export default function LoginForm({ email, initialError, requiresNewPassword, action }: LoginFormProps) {
  const [error, setError] = useState<string | undefined>(initialError);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (requiresNewPassword) {
      setError("You are required to set a new password for your account.");
    }
  }, [requiresNewPassword]);

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
      <BasicInput type="email" id="email" label="Email" initial={email} required />
      <BasicInput type="password" id="password" label={requiresNewPassword ? "Current password" : "Password"} required />
      {requiresNewPassword && (
        <>
          <BasicInput type="password" id="newPassword" label="New password" required />
          <BasicInput type="password" id="confirmPassword" label="Confirm new password" required />
        </>
      )}
    </Form>
  );
}
