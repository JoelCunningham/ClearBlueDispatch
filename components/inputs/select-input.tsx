import InputWrapper from "./input-wrapper";

interface SelectInputProps {
  id: string;
  label: string;
  items: { id: number; name: string }[];
  placeholder?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export default function SelectInput({ id, label, items, placeholder, onChange, required, disabled }: SelectInputProps) {
  return (
    <InputWrapper id={id} label={label}>
      <select
        id={id}
        name={id}
        required={required}
        disabled={disabled}
        onChange={e => onChange?.(e.target.value)}
        className="w-full rounded-md border bg-background px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">{placeholder || "Select an option"}</option>
        {items.map(item => (
          <option key={item.id} value={item.id.toString()}>
            {item.name}
          </option>
        ))}
      </select>
    </InputWrapper>
  );
}
