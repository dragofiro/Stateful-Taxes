import React, { type ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, description, children }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 space-y-4 shadow-sm">
      <div>
        <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">{title}</h3>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
};