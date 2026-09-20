import InputWrapper from "./input-wrapper";

interface EmailInputProps {
  id: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  defaultValue?: string;
}

export default function EmailInput({ id, label, required = false, disabled, placeholder, defaultValue }: EmailInputProps) {
  return (
    <InputWrapper id={id} label={label}>
      <input
        id={id}
        name={id}
        type="email"
        defaultValue={defaultValue}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-md border bg-background px-3 py-2 disabled:bg-muted"
      />
    </InputWrapper>
  );
}
