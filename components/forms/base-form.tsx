"use client";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useState } from "react";

import Form from "@/components/wrappers/form";
import { suppressEvent } from "@/lib/utils/event-utils";

export type BaseFormResult = {
  success: boolean;
  error?: string;
};

export type BaseFormAction = (formData: FormData, form: HTMLFormElement) => BaseFormResult | void | Promise<BaseFormResult | void>;

type BaseFormProps = {
  title?: string;
  submitText?: string;
  initialError?: string;
  errorMessage?: string;
  isSaving?: boolean;
  action: BaseFormAction;
  onSuccess?: (form: HTMLFormElement) => void;
  children: React.ReactNode;
};

export default function BaseForm({
  title,
  submitText,
  initialError,
  errorMessage = "Unable to save changes.",
  isSaving: externalIsSaving = false,
  action,
  onSuccess,
  children
}: BaseFormProps) {
  const [error, setError] = useState<string | undefined>(initialError);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    suppressEvent(event);
    setError(undefined);
    setIsSubmitting(true);

    try {
      const form = event.currentTarget;
      const result = await action(new FormData(form), form);

      if (result && !result.success) {
        setError(result.error ?? errorMessage);
        return;
      }

      onSuccess?.(form);
    } catch (caughtError) {
      if (isRedirectError(caughtError)) throw caughtError;
      setError(caughtError instanceof Error ? caughtError.message : errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form title={title} onSubmit={handleSubmit} isSaving={isSubmitting || externalIsSaving} error={error} submitText={submitText}>
      {children}
    </Form>
  );
}
