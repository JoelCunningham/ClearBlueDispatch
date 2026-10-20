"use client";

interface BaseButtonProps {
  text: string;
  disabled?: boolean;
  destructive?: boolean;
  secondary?: boolean;
  onClick?: () => void;
}

export default function PrimaryButton({ text, disabled = false, destructive = false, secondary = false, onClick }: BaseButtonProps) {
  return (
    <button
      type={onClick ? "button" : "submit"}
      disabled={disabled}
      onClick={() => onClick && onClick()}
      className={`w-full text-sm rounded-md px-4 py-3 font-medium disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${destructive ? "bg-destructive hover:bg-destructive/90 text-primary-foreground" : secondary ? "border border-primary text-primary" : "bg-primary hover:bg-primary/90 text-primary-foreground"}`}
    >
      {disabled ? "Loading..." : text}
    </button>
  );
}
