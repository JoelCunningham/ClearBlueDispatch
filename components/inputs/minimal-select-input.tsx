import { ChevronDown } from "lucide-react";
import InputWrapper from "./input-wrapper";

interface MinimalSelectInputProps {
  id: string;
  label?: string;
  items: { id: number | string; name: string }[];
  initial?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function MinimalSelectInput({ id, label, items, initial, onChange }: MinimalSelectInputProps) {
  return (
    <InputWrapper id={id} label={label}>
      <div className="relative w-fit flex -mt-1">
        <ChevronDown />
        <select
          id={id}
          name={id}
          defaultValue={initial}
          onChange={onChange}
          className="appearance-none cursor-pointer px-3 -mx-2 outline-none border-0 focus:ring-0"
        >
          {items.map(item => (
            <option key={item.id} value={item.id.toString()}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </InputWrapper>
  );
}
