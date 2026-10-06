import Input from "@/components/wrappers/input";

interface SelectInputProps {
  id: string;
  label?: string;
  items: { id: number | string; name: string }[];
  placeholder?: string;
  initial?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
}

export default function SelectInput({ id, label, items, placeholder, initial, required, disabled, onChange }: SelectInputProps) {
  return (
    <Input id={id} label={label}>
      <select
        id={id}
        name={id}
        required={required}
        disabled={disabled}
        defaultValue={initial}
        onChange={onChange}
        className="w-full rounded-md border bg-background px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">{placeholder || "Select an option"}</option>
        {items.map(item => (
          <option key={item.id} value={item.id.toString()}>
            {item.name}
          </option>
        ))}
      </select>
    </Input>
  );
}
