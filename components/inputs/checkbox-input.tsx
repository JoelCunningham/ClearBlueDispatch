import InputWrapper from "./input-wrapper";

interface CheckboxInputProps {
  id: string;
  label?: string;
  initial?: boolean;
  required?: boolean;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CheckboxInput({ id, label, initial, required, disabled, onChange }: CheckboxInputProps) {
  return (
    <InputWrapper id={id} label={label}>
      <input
        type="checkbox"
        id={id}
        name={id}
        defaultChecked={initial}
        required={required}
        disabled={disabled}
        className="h-4 w-4 rounded border text-primary focus:ring-primary ml-2"
        onChange={onChange}
      />
    </InputWrapper>
  );
}
