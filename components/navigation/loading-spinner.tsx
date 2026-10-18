import { LoaderCircle } from "lucide-react";

type LoadingSpinnerProps = {
  message?: string;
  fullScreen?: boolean;
};

export default function LoadingSpinner({ message = "Loading...", fullScreen = false }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-3 ${fullScreen ? "min-h-[60vh]" : "py-8"}`}
    >
      <LoaderCircle className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  );
}
