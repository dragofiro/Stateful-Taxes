// Text input with a label, an optional hint and an error message.
import React, { useId } from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string | undefined;
  error?: string | undefined;
  optional?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({ label, hint, error, optional, className = '', id, ...props }) => {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  return (
    <div className="tf-field" data-invalid={error ? 'true' : undefined}>
      <label className="tf-label" htmlFor={inputId}>
        {label}
        {optional && <span className="tf-optional">Optional</span>}
      </label>
      <input
        id={inputId}
        className={`tf-input ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        {...props}
      />
      {hint && (
        <p className="tf-hint" id={hintId}>
          {hint}
        </p>
      )}
      {error && (
        <p className="tf-error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
};
