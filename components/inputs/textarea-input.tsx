import { useFormFieldErrors } from "@/components/forms/base-form";
import Input from "@/components/wrappers/input";

interface TextAreaInputProps {
  id: string;
  label: string;
  initial?: string;
}

export default function TextAreaInput({ id, label, initial }: TextAreaInputProps) {
  const errors = useFormFieldErrors(id);
  const errorId = `${id}-error`;

  return (
    <Input id={id} label={label}>
      <textarea
        id={id}
        name={id}
        rows={4}
        className="w-full rounded-md border bg-background px-3 py-2"
        defaultValue={initial}
        aria-invalid={errors.length > 0}
        aria-describedby={errors.length > 0 ? errorId : undefined}
      />
    </Input>
  );
}
