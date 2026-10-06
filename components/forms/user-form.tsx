"use client";

import BaseForm from "@/components/forms/base-form";
import BasicInput from "@/components/inputs/basic-input";
import SelectInput from "@/components/inputs/select-input";
import { UserFormInput } from "@/features/users/types";
import { ActionResult } from "@/lib/utils/action-utils";
import { UserRole } from "@/types/next-auth";

type UserFormProps = {
  name?: string;
  email?: string;
  role?: UserRole;
  canEditRole: boolean;
  hideTitle?: boolean;
  action: (input: UserFormInput) => Promise<ActionResult>;
};

export default function UserForm({ name, email, role, canEditRole, hideTitle, action }: UserFormProps) {
  async function handleAction(formData: FormData) {
    const input: UserFormInput = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      role: (formData.get("role") as UserRole) ?? role
    };

    return action(input);
  }

  return (
    <BaseForm
      title={hideTitle ? undefined : "Account details"}
      action={handleAction}
      submitText={email ? "Save changes" : "Create user"}
      errorMessage="Unable to save changes."
    >
      <BasicInput type="text" id="name" label="Name" initial={name} required />
      <BasicInput type="email" id="email" label="Email" initial={email} required />
      <SelectInput
        id="role"
        label="Role"
        items={[
          { id: "DRIVER", name: "Driver" },
          { id: "MANAGER", name: "Manager" }
        ]}
        disabled={!canEditRole}
        initial={role?.toString()}
        required
      />
    </BaseForm>
  );
}
