import InputWrapper from "./input-wrapper";

interface TextAreaInputProps {
  id: string;
  label: string;
  initial?: string;
}

export default function TextAreaInput({ id, label, initial }: TextAreaInputProps) {
  return (
    <InputWrapper id={id} label={label}>
      <textarea id={id} name={id} rows={4} className="w-full rounded-md border bg-background px-3 py-2" defaultValue={initial} />
    </InputWrapper>
  );
}
