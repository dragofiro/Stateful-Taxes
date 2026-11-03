import React from 'react';

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description?: string;
  error?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  checked,
  onChange,
  description,
  error,
}) => {
  return (
    <div className="space-y-1">
      <label className="flex items-start space-x-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="mt-0.5 h-4 w-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500/20 focus:ring-offset-slate-950 transition"
        />
        <div className="text-sm">
          <span className="font-medium text-slate-200 group-hover:text-white transition">{label}</span>
          {description && <p className="text-xs text-slate-400">{description}</p>}
        </div>
      </label>
      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
    </div>
  );
};