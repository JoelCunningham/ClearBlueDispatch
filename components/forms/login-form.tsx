"use client";

import { useState } from "react";

import { LoginFormInput } from "@/features/login/types";
import { suppressEvent } from "@/lib/utils/event-utils";
import BasicInput from "../inputs/basic-input";
import Form from "../wrappers/form";

type LoginFormProps = {
  initialError?: string;
  action: (input: LoginFormInput) => Promise<{ success: boolean; error?: string }>;
};

export default function LoginForm({ initialError, action }: LoginFormProps) {
  const [error, setError] = useState<string | undefined>(initialError);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    suppressEvent(event);
    setError(undefined);
    setIsSaving(true);

    try {
      const formData = new FormData(event.currentTarget);

      const input: LoginFormInput = {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? "")
      };

      const result = await action(input);
      if (!result.success) setError(result.error ?? "Invalid credentials.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit} submitText="Sign in" error={error} isSaving={isSaving}>
      <BasicInput type="email" id="email" label="Email" required />
      <BasicInput type="password" id="password" label="Password" required />
    </Form>
  );
}
