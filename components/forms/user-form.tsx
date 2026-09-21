"use client";

import { useState } from "react";

import BasicInput from "@/components/inputs/basic-input";
import SelectInput from "@/components/inputs/select-input";
import Form from "@/components/wrappers/form";
import { UpdateUserInput } from "@/features/users/types";
import { suppressEvent } from "@/lib/utils/event-utils";
import { UserRole } from "@/types/next-auth";

type UserFormProps = {
  name: string;
  email: string;
  role: UserRole;
  canEditRole: boolean;
  action: (input: UpdateUserInput) => Promise<{ success: boolean; error?: string }>;
};

export default function UserForm({ name, email, role, canEditRole, action }: UserFormProps) {
  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    suppressEvent(event);
    setError(undefined);
    setIsSaving(true);

    try {
      const formData = new FormData(event.currentTarget);

      const input = {
        userId: Number(formData.get("userId") ?? 0),
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        role: (formData.get("role") as UserRole) ?? role
      };

      const result = await action(input);

      if (!result.success && result.success !== undefined) {
        setError(result.error ?? "Unable to save changes.");
        return;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to save changes.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form title="Account details" onSubmit={handleSubmit} isSaving={isSaving} error={error}>
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
        defaultValue={role.toString()}
        required
      />
    </Form>
  );
}
