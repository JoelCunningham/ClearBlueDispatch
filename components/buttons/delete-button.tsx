import { Trash } from "lucide-react";

interface DeleteButtonProps {
  title?: string;
  onClick: () => void;
}

export default function DeleteButton({ title, onClick }: DeleteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
    >
      <Trash className="size-4" />
    </button>
  );
}
