"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import BaseForm from "@/components/forms/base-form";
import CheckboxInput from "@/components/inputs/checkbox-input";
import MinimalSelectInput from "@/components/inputs/minimal-select-input";
import { UserRole } from "@/types/next-auth";

type RoutesFormProps = {
  role?: UserRole;
  users?: {
    id: number;
    name: string;
  }[];
};

export default function RoutesForm({ role, users }: RoutesFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const currentIncludePast = searchParams.get("includePast") === "true";

  const userOptions = users?.map(user => ({ id: user.id.toString(), name: user.name })) ?? [];
  userOptions.unshift({ id: "All", name: "All drivers" });

  function handleAction(formData: FormData) {
    const userId = String(formData.get("user") ?? "");
    const includePast = formData.get("includePast");

    const params = new URLSearchParams();

    if (userId && userId !== "0" && userId !== "All") {
      params.set("assignedUserId", userId);
    }

    if (includePast === "on" || includePast === "true") {
      params.set("includePast", "true");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <BaseForm action={handleAction} isSaving={isPending} errorMessage="Unable to apply filters.">
      <div className="flex items-center justify-between align-middle">
        {role === "MANAGER" && (
          <MinimalSelectInput id="user" items={userOptions} initial={"All"} onChange={e => e.currentTarget.form?.requestSubmit()} />
        )}
        <CheckboxInput
          id="includePast"
          label="Show past routes"
          initial={currentIncludePast}
          onChange={e => e.currentTarget.form?.requestSubmit()}
        />
      </div>
    </BaseForm>
  );
}
