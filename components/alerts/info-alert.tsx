interface InfoAlertProps {
  text: string;
}

export default function InfoAlert({ text }: InfoAlertProps) {
  return (
    <div className="rounded-lg border p-4 text-center">
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
