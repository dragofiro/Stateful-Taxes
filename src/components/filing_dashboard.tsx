import React from 'react';
import { STATE_REGISTRY } from './forms/states/registry.ts';

interface FilingDashboardProps {
  /** Postal code of the state picked on the landing page, for example 'NY'. */
  stateCode: string;
  onBack: () => void;
}

export function FilingDashboard({ stateCode, onBack }: FilingDashboardProps) {
  const upperCode = stateCode.toUpperCase();
  const stateConfig = (STATE_REGISTRY as Record<string, any>)[upperCode];

  if (!stateConfig || !stateConfig.component) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md text-center space-y-4">
          <h2 className="text-xl font-bold text-rose-400">State Form Unavailable</h2>
          <p className="text-slate-400 text-sm">
            Form support for jurisdiction code <code className="text-indigo-400 font-mono">{upperCode}</code> has not been implemented or registered yet.
          </p>
          <button
            onClick={onBack}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-xl text-sm transition"
          >
            ← Return to Interactive Map
          </button>
        </div>
      </div>
    );
  }

  const StateForm = stateConfig.component;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onBack}
              className="whitespace-nowrap text-sm text-slate-400 hover:text-slate-100 border border-slate-700 hover:border-slate-500 rounded-lg px-3 py-1.5 transition"
            >
              ← All states
            </button>
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              ST
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight">Stateful Taxes</span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                100% Client-Side
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
            <span>{stateConfig.name} ({stateConfig.formName})</span>
          </div>
        </div>
      </header>

      {/* Main Form Work Area */}
      <main className="max-w-4xl mx-auto px-6 py-10 flex-1 w-full">
        <StateForm />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        Stateful Taxes • Designed for secure, offline desktop tax preparation.
      </footer>
    </div>
  );
}

export default FilingDashboard;