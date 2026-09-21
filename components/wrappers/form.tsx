import ErrorAlert from "@/components/alerts/error-alert";
import PrimaryButton from "@/components/buttons/primary-button";

interface FormProps {
  title?: string;
  isSaving?: boolean;
  error?: string;
  children: React.ReactNode;
  submitText?: string;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
}

export default function Form({ title, isSaving, error, onSubmit, submitText, children }: FormProps) {
  return (
    <form onSubmit={onSubmit} className={`w-full space-y-3 ${title ? "rounded-lg border p-4" : ""}`}>
      {title && <h2 className="mb-4 font-semibold">{title}</h2>}
      {children}
      {error && <ErrorAlert text={error} />}
      <PrimaryButton text={isSaving ? "Saving..." : submitText || "Save changes"} disabled={isSaving} />
    </form>
  );
}
