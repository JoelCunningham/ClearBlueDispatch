import InputWrapper from "./input-wrapper";

interface InputProps {
  type: "text" | "email" | "password" | "date" | "tel" | "number";
  id: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  initial?: string | number;
  step?: number;
  minNumber?: number;
  minLength?: number;
  prefix?: string;
}

export default function BasicInput({
  type,
  id,
  label,
  required,
  disabled,
  placeholder,
  initial,
  step,
  minNumber,
  minLength,
  prefix
}: InputProps) {
  return (
    <InputWrapper id={id} label={label}>
      <div className="flex">
        {prefix && <span className="rounded-l-md border border-r-0 justify-center p-2 ">{prefix}</span>}
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          defaultValue={initial}
          step={step}
          min={minNumber}
          minLength={minLength}
          className={`w-full rounded-md border bg-background px-3 py-2 disabled:bg-muted ${prefix ? "border-l-0 rounded-l-none pl-0" : ""}`}
        />
      </div>
    </InputWrapper>
  );
}
