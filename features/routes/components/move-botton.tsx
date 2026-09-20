import { MoveDown, MoveUp } from "lucide-react";

interface MoveButtonProps {
  index: number;
  items: number;
  isPending: boolean;
  isUp: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>, index: number, direction: -1 | 1) => void;
}

export default function MoveButton({ index, items: totalItems, isPending, isUp, onClick: moveDelivery }: MoveButtonProps) {
  return (
    <button
      type="button"
      onClick={e => moveDelivery(e, index, isUp ? -1 : 1)}
      disabled={isUp ? index === 0 || isPending : index === totalItems - 1 || isPending}
      className="flex size-8 items-center justify-center rounded-md border text-sm disabled:opacity-30"
      aria-label={`Move delivery ${index + 1} ${isUp ? "up" : "down"}`}
    >
      {isUp ? <MoveUp /> : <MoveDown />}
    </button>
  );
}
