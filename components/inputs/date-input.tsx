import InputWrapper from "./input-wrapper";

interface DateInputProps {
  id: string;
  label: string;
}

export default function DateInput({ id, label }: DateInputProps) {
  return (
    <InputWrapper id={id} label={label}>
      <input id="date" name="date" type="date" required className="w-full rounded-md border bg-background px-3 py-2" />
    </InputWrapper>
  );
}
