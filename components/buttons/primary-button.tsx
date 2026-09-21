"use client";

interface BaseButtonProps {
  text: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function PrimaryButton({ text, disabled = false, onClick }: BaseButtonProps) {
  return (
    <button
      type={onClick ? "button" : "submit"}
      disabled={disabled}
      onClick={() => onClick && onClick()}
      className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
    >
      {disabled ? "Loading..." : text}
    </button>
  );
}
