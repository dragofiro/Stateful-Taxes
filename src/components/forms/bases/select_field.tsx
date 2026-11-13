// Drop-down list with a label, an optional hint and an error message.
import React, { useId } from 'react';

interface Option {
  label: string;
  value: string | number;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  hint?: string | undefined;
  error?: string | undefined;
  placeholder?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  hint,
  error,
  placeholder = 'Select an option',
  className = '',
  id,
  ...props
}) => {
  const autoId = useId();
  const selectId = id ?? autoId;
  return (
    <div className="tf-field" data-invalid={error ? 'true' : undefined}>
      <label className="tf-label" htmlFor={selectId}>
        {label}
      </label>
      <select id={selectId} className={`tf-select ${className}`} aria-invalid={error ? true : undefined} {...props}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && <p className="tf-hint">{hint}</p>}
      {error && <p className="tf-error">{error}</p>}
    </div>
  );
};
