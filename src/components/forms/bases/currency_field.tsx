import React from 'react';

interface CurrencyFieldProps {
  label: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
}

export const CurrencyField: React.FC<CurrencyFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = '0.00',
  error,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-300">{label}</label>
      <div className="relative rounded-lg shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 text-sm font-mono">
          $
        </div>
        <input
          type="number"
          step="0.01"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-slate-950 border rounded-lg pl-7 pr-3 py-2 text-sm text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:ring-1 transition ${
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
          }`}
        />
      </div>
      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
    </div>
  );
};