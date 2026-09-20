import InputWrapper from "./input-wrapper";

interface TextInputProps {
  id: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  defaultValue?: string;
}

export default function TextInput({ id, label, required = false, disabled, placeholder, defaultValue }: TextInputProps) {
  return (
    <InputWrapper id={id} label={label}>
      <input
        id={id}
        name={id}
        type="text"
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-md border bg-background px-3 py-2 disabled:bg-muted"
      />
    </InputWrapper>
  );
}
