"use client";

import { useState } from "react";

import BaseForm from "@/components/forms/base-form";
import BasicInput from "@/components/inputs/basic-input";
import { ResetPasswordInput } from "@/features/login/types";
import { ActionResult } from "@/lib/utils/action-utils";
import InfoAlert from "../alerts/info-alert";

type ResetPasswordFormProps = {
  initialError?: string;
  action: (input: ResetPasswordInput) => Promise<ActionResult>;
};

export default function ResetPasswordForm({ initialError, action }: ResetPasswordFormProps) {
  const [success, setSuccess] = useState(false);

  async function handleAction(formData: FormData) {
    const input: ResetPasswordInput = {
      email: String(formData.get("email") ?? "")
    };

    const result = await action(input);
    if (result.success) setSuccess(true);
    return result;
  }

  if (success) {
    return (
      <InfoAlert text="Please check your inbox. You'll receive instructions to reset your password if an account is associated with your email." />
    );
  }

  return (
    <BaseForm action={handleAction} initialError={initialError} errorMessage="Unable to process your request." submitText="Reset Password">
      <BasicInput type="email" id="email" label="Email" autoComplete="username" required />
    </BaseForm>
  );
}
