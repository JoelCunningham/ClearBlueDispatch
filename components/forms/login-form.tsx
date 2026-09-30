"use client";

import { useState } from "react";

import BasicInput from "@/components/inputs/basic-input";
import Form from "@/components/wrappers/form";
import { LoginUserInput } from "@/features/login/types";
import { suppressEvent } from "@/lib/utils/event-utils";

type LoginFormProps = {
  initialError?: string;
  action: (input: LoginUserInput) => Promise<{ success: boolean; error?: string }>;
};

export default function LoginForm({ initialError, action }: LoginFormProps) {
  const [error, setError] = useState<string | undefined>(initialError);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    suppressEvent(event);
    setError(undefined);

    try {
      const formData = new FormData(event.currentTarget);

      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");

      setIsSaving(true);

      const result = await action({ email, password });
      if (!result.success) setError(result.error ?? "Invalid credentials.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit} submitText="Sign in" error={error} isSaving={isSaving}>
      <BasicInput type="email" id="email" label="Email" autoComplete="username" required />
      <BasicInput type="password" id="password" label="Password" autoComplete="current-password" required />
    </Form>
  );
}
