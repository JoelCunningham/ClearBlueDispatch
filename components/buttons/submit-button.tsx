interface SubmitButtonProps {
  text: string;
  isSubmitting?: boolean;
}

export default function SubmitButton({ text, isSubmitting = false }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isSubmitting ? "Loading..." : text}
    </button>
  );
}
