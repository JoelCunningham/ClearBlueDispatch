"use client";

interface BaseButtonProps {
  text: string;
  disabled?: boolean;
  destructive?: boolean;
  onClick?: () => void;
}

export default function PrimaryButton({ text, disabled = false, destructive = false, onClick }: BaseButtonProps) {
  return (
    <button
      type={onClick ? "button" : "submit"}
      disabled={disabled}
      onClick={() => onClick && onClick()}
      className={`w-full rounded-md px-4 py-2 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 ${destructive ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"}`}
    >
      {disabled ? "Loading..." : text}
    </button>
  );
}
