import InputWrapper from "./input-wrapper";

interface NumberInputProps {
  id: string;
  label: string;
  required?: boolean;
  defaultValue?: number;
  step?: number;
  min?: number;
  prefix?: string;
}

export default function NumberInput({ id, label, required = false, defaultValue, step = 1, min = 1, prefix }: NumberInputProps) {
  return (
    <InputWrapper id={id} label={label}>
      <input
        id={id}
        name={id}
        type="number"
        required={required}
        defaultValue={defaultValue}
        step={step}
        min={min}
        className={`w-full rounded-md border bg-background px-3 py-2 ${prefix ? "pl-6" : ""}`}
      />
      {prefix && <span className="pointer-events-none absolute left-7 mt-2 text-muted-foreground">{prefix}</span>}
    </InputWrapper>
  );
}
