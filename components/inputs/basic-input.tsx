import React from "react";
import InputWrapper from "./input-wrapper";

interface SuffixProps {
  icon: React.ReactNode;
  onClick?: () => void;
}

interface InputProps {
  type: "text" | "email" | "password" | "date" | "tel" | "number" | "search";
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
  suffix?: SuffixProps;
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
  prefix,
  suffix,
  value,
  onChange
}: InputProps) {
  return (
    <InputWrapper id={id} label={label}>
      <div className="flex rounded-md border bg-background disabled:bg-muted focus-within:ring-2 focus-within:ring-ring">
        {prefix && <span className="justify-center p-2">{prefix}</span>}
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
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2 focus:outline-none"
        />
        {suffix && (
          <span className="justify-center p-2" onClick={suffix.onClick}>
            {suffix.icon}
          </span>
        )}
      </div>
    </InputWrapper>
  );
}
