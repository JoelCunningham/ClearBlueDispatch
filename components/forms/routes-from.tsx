"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import Form from "@/components/wrappers/form";
import { suppressEvent } from "@/lib/utils/event-utils";
import { UserRole } from "@/types/next-auth";
import CheckboxInput from "../inputs/checkbox-input";
import SelectInput from "../inputs/select-input";
import MinimalSelectInput from "../inputs/minimal-select-input";

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
  const [error, setError] = useState<string>();

  const currentIncludePast = searchParams.get("includePast") === "true";

  const userOptions = users?.map(user => ({ id: user.id.toString(), name: user.name })) ?? [];
  userOptions.unshift({ id: "All", name: "All drivers" });

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    suppressEvent(event);
    setError(undefined);

    console.log("handleSubmit called");

    try {
      const formData = new FormData(event.currentTarget);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to apply filters.");
    }
  }

  return (
    <Form onSubmit={handleSubmit} isSaving={isPending} error={error}>
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
    </Form>
  );
}
