import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-300">{label}</label>
      <input
        className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 transition ${
          error
            ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
    </div>
  );
};