// Adds a simple checkbox for form construction.
import React from 'react';

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description?: string;
  error?: string | undefined;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, checked, onChange, description, error }) => {
  return (
    <div className="tf-field">
      <label className="tf-check">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span>
          <span className="tf-check-label">{label}</span>
          {description && <p className="tf-hint">{description}</p>}
        </span>
      </label>
      {error && <p className="tf-error">{error}</p>}
    </div>
  );
};
