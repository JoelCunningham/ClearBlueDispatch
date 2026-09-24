interface WarningAlertProps {
  text: string;
}

export default function WarningAlert({ text }: WarningAlertProps) {
  return (
    <div role="alert" className="rounded-md border border-caution/50 bg-caution/10 p-3 text-sm text-caution">
      {text}
    </div>
  );
}
