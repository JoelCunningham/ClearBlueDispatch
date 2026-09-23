interface LineItemProps {
  name: string;
  value?: string;
  vertical?: boolean;
  children?: React.ReactNode;
}

export default function LineItem({ name, value, vertical = false, children }: LineItemProps) {
  return (
    <div className={vertical ? "" : "flex justify-between gap-4 text-sm -mt-1"}>
      <dt className="text-muted-foreground">{name}</dt>
      {value && <dd>{value}</dd>}
      {children && <dd>{children}</dd>}
    </div>
  );
}
