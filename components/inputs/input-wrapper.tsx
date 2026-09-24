interface InputWrapperProps {
  id: string;
  label?: string;
  children?: React.ReactNode;
}

export default function InputWrapper({ id, label, children }: InputWrapperProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium align-top">
          {label}
        </label>
      )}
      {children}
    </div>
  );
}
