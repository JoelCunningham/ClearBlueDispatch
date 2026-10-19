"use client";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { createContext, useContext, useState } from "react";

import Form from "@/components/wrappers/form";
import { FieldErrors } from "@/lib/utils/action-utils";
import { suppressEvent } from "@/lib/utils/event-utils";

export type BaseFormResult = {
  success: boolean;
  error?: string;
  fieldErrors?: FieldErrors;
};

export type BaseFormAction = (formData: FormData, form: HTMLFormElement) => BaseFormResult | void | Promise<BaseFormResult | void>;

const FormErrorsContext = createContext<FieldErrors | undefined>(undefined);

export function useFormFieldErrors(id: string): string[] {
  return useContext(FormErrorsContext)?.[id] ?? [];
}

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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    suppressEvent(event);
    setError(undefined);
    setFieldErrors(undefined);
    setIsSubmitting(true);

    try {
      const form = event.currentTarget;
      const result = await action(new FormData(form), form);

      if (result && !result.success) {
        setError(result.error ?? (result.fieldErrors ? undefined : errorMessage));
        setFieldErrors(result.fieldErrors);
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
    <FormErrorsContext.Provider value={fieldErrors}>
      <Form title={title} onSubmit={handleSubmit} isSaving={isSubmitting || externalIsSaving} error={error} submitText={submitText}>
        {children}
      </Form>
    </FormErrorsContext.Provider>
  );
}
