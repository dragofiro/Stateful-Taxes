import React, { type ReactNode } from 'react';

interface FormWrapperProps {
  title: string;
  formCode: string;
  stateName?: string;
  children: ReactNode;
  onGeneratePdf?: () => void;
}

export const FormWrapper: React.FC<FormWrapperProps> = ({
  title,
  formCode,
  stateName,
  children,
  onGeneratePdf,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-md">
              {formCode}
            </span>
            {stateName && <span className="text-sm font-medium text-slate-400">• {stateName}</span>}
          </div>
          <h2 className="text-xl font-bold text-white mt-1">{title}</h2>
        </div>

        {onGeneratePdf && (
          <button
            onClick={onGeneratePdf}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2"
          >
            <span>Generate Official PDF</span>
          </button>
        )}
      </div>

      <div className="space-y-6">{children}</div>
    </div>
  );
};