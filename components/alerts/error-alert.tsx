interface ErrorAlertProps {
  text: string;
}

export default function ErrorAlert({ text }: ErrorAlertProps) {
  return (
    <div role="alert" className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
      {text}
    </div>
  );
}
