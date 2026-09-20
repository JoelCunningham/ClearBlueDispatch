import AddButton from "../buttons/add-button";

interface MiniFormProps {
  title: string;
  subtitle?: string;
  onAdd: () => void;
  children?: React.ReactNode;
}

export default function MiniForm({ title, subtitle, onAdd, children }: MiniFormProps) {
  return (
    <section className="space-y-3 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <AddButton title={`Add ${title.toLowerCase()}`} onClick={onAdd} />
      </div>
      {children}
    </section>
  );
}
