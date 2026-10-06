"use client";

import BaseForm from "@/components/forms/base-form";
import BasicInput from "@/components/inputs/basic-input";
import { ResetPasswordInput } from "@/features/login/types";
import { ActionResult } from "@/lib/utils/action-utils";

type ResetPasswordFormProps = {
  initialError?: string;
  action: (input: ResetPasswordInput) => Promise<ActionResult>;
};

export default function ResetPasswordForm({ initialError, action }: ResetPasswordFormProps) {
  async function handleAction(formData: FormData) {
    const input: ResetPasswordInput = {
      email: String(formData.get("email") ?? "")
    };

    return action(input);
  }

  return (
    <BaseForm action={handleAction} initialError={initialError} errorMessage="Invalid credentials." submitText="Reset Password">
      <BasicInput type="email" id="email" label="Email" autoComplete="username" required />
    </BaseForm>
  );
}
