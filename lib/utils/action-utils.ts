import { z } from "zod";

export type FieldErrors = Record<string, string[]>;

export type ActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: FieldErrors;
};

export function getErrorMessage(error: unknown, defaultMessage: string): string {
  if (error instanceof Error) return error.message;
  return defaultMessage;
}

export function getValidationResult(error: z.ZodError, defaultMessage: string): ActionResult {
  const fieldErrors: FieldErrors = {};
  let summaryError: string | undefined;

  for (const issue of error.issues) {
    if (issue.path.length === 0) {
      summaryError ??= issue.message;
      continue;
    }

    const path = issue.path.join(".");
    fieldErrors[path] ??= [];
    fieldErrors[path].push(issue.message);
  }

  return {
    success: false,
    error: summaryError ?? (Object.keys(fieldErrors).length === 0 ? defaultMessage : undefined),
    ...(Object.keys(fieldErrors).length > 0 && { fieldErrors })
  };
}
