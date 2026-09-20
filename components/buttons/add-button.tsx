import { Plus } from "lucide-react";

interface AddButtonProps {
  title?: string;
  onClick: () => void;
}

export default function AddButton({ title, onClick }: AddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className="shrink-0 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted mt-auto"
    >
      <Plus className="size-4" />
    </button>
  );
}
