"use client";

import BaseForm from "@/components/forms/base-form";
import BasicInput from "@/components/inputs/basic-input";
import { SetupPasswordInput } from "@/features/login/types";
import { ActionResult } from "@/lib/utils/action-utils";

type SetupPasswordFormProps = {
  action: (input: SetupPasswordInput) => Promise<ActionResult>;
};

export default function SetupPasswordForm({ action }: SetupPasswordFormProps) {
  async function handleAction(formData: FormData) {
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      return { success: false, error: "Passwords do not match." };
    }

    const input: SetupPasswordInput = { password, confirmPassword };
    return action(input);
  }

  return (
    <BaseForm action={handleAction} errorMessage="Invalid credentials." submitText="Setup Account">
      <BasicInput type="password" id="password" label="Password" autoComplete="new-password" required />
      <BasicInput type="password" id="confirmPassword" label="Confirm Password" autoComplete="new-password" required />
    </BaseForm>
  );
}
