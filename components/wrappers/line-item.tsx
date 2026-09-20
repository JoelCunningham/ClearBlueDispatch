interface LineItemProps {
  name: string;
  value: string;
  vertical?: boolean;
}

export default function LineItem({ name, value, vertical = false }: LineItemProps) {
  return (
    <div className={vertical ? "" : "flex justify-between gap-4 text-sm -mt-1"}>
      <dt className="text-muted-foreground">{name}</dt>
      <dd>{value}</dd>
    </div>
  );
}
