interface ListSeparatorProps {
  title?: string;
}

export default function ListSeparator({ title }: ListSeparatorProps) {
  return <div className="mb-2 text-sm font-semibold text-muted-foreground">{title}</div>;
}
