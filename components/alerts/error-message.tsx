import ErrorAlert from "@/components/alerts/error-alert";
import WarningAlert from "./warning-alert";

interface ErrorMessageProps {
  assigned: string;
  assignee: string;
  deleted: boolean;
  past: boolean;
}

export default function ErrorMessage({ assigned, assignee, deleted, past }: ErrorMessageProps): React.ReactNode | null {
  if (!deleted) return null;

  if (past) return <WarningAlert text={`The ${assignee} assigned to this ${assigned} has been deleted.`} />;

  return (
    <ErrorAlert text={`The ${assignee} assigned to this ${assigned} has been deleted. Please assign it to a different ${assignee}.`} />
  );
}
