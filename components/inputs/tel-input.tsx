import InputWrapper from "./input-wrapper";

interface TelInputProps {
  id: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  defaultValue?: string;
}

export default function TelInput({ id, label, required = false, disabled, placeholder, defaultValue }: TelInputProps) {
  return (
    <InputWrapper id={id} label={label}>
      <input
        id={id}
        name={id}
        type="tel"
        defaultValue={defaultValue}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-md border bg-background px-3 py-2 disabled:bg-muted"
      />
    </InputWrapper>
  );
}
