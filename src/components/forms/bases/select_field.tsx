import React from 'react';

interface Option {
  label: string;
  value: string | number;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, options, error, className = '', ...props }) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-300">{label}</label>
      <select
        className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 transition ${
          error
            ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
        } ${className}`}
        {...props}
      >
        <option value="" disabled>
          Select an option...
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
    </div>
  );
};