"use client";

import BaseForm from "@/components/forms/base-form";
import BasicInput from "@/components/inputs/basic-input";
import { PasswordFormInput } from "@/features/users/types";
import { ActionResult } from "@/lib/utils/action-utils";

type PasswordFormProps = {
  requireCurrentPassword: boolean;
  action: (input: PasswordFormInput) => Promise<ActionResult>;
};

export default function PasswordForm({ requireCurrentPassword, action }: PasswordFormProps) {
  async function handleAction(formData: FormData) {
    const currentPassword = String(formData.get("currentPassword") ?? "");
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (newPassword !== confirmPassword) {
      return { success: false, error: "New passwords do not match." };
    }

    const input: PasswordFormInput = { currentPassword: requireCurrentPassword ? currentPassword : undefined, newPassword };
    return action(input);
  }

  return (
    <BaseForm
      title="Change password"
      action={handleAction}
      errorMessage="Unable to change password."
      submitText="Change password"
      onSuccess={form => form.reset()}
    >
      {requireCurrentPassword && <BasicInput type="password" id="currentPassword" label="Current password" required />}
      <BasicInput type="password" id="newPassword" label="New password" minLength={12} required />
      <BasicInput type="password" id="confirmPassword" label="Confirm new password" minLength={12} required />
    </BaseForm>
  );
}
