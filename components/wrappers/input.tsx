"use client";

import { useFormFieldErrors } from "@/components/forms/base-form";

interface InputProps {
  id: string;
  label?: string;
  children?: React.ReactNode;
}

export default function Input({ id, label, children }: InputProps) {
  const errors = useFormFieldErrors(id);
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium align-top">
          {label}
        </label>
      )}
      {children}
      {errors.length > 0 && (
        <div id={errorId} className="space-y-1 text-sm text-destructive" role="alert">
          {errors.map(error => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
}
