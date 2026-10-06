"use client";

import BaseForm from "@/components/forms/base-form";
import BasicInput from "@/components/inputs/basic-input";
import { LoginUserInput } from "@/features/login/types";
import { ActionResult } from "@/lib/utils/action-utils";

type LoginFormProps = {
  initialError?: string;
  action: (input: LoginUserInput) => Promise<ActionResult>;
};

export default function LoginForm({ initialError, action }: LoginFormProps) {
  async function handleAction(formData: FormData) {
    const input: LoginUserInput = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? "")
    };

    return action(input);
  }

  return (
    <BaseForm action={handleAction} initialError={initialError} errorMessage="Invalid credentials." submitText="Sign in">
      <BasicInput type="email" id="email" label="Email" autoComplete="username" required />
      <BasicInput type="password" id="password" label="Password" autoComplete="current-password" required />
    </BaseForm>
  );
}
