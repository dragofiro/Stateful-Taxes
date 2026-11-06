/*
The Employer Withholding Information field should ask the user for:
- Employer Name
- Employer Identification Number (EIN)
- State Withholding Amount
- Local Withholding Amount (if applicable)
*/
import React, { useState } from 'react';
import { useTaxContext } from '../../../context/tax_context.tsx';
import { InputField } from '../bases/input_field.tsx';
import { CurrencyField } from '../bases/currency_field.tsx';

export interface EmployerWithholding {
  id: string;
  employerName: string;
  ein: string;
  stateWithheld: number;
  localWithheld: number;
}

export const EmployerWitholdingField: React.FC = () => {
  const { state, dispatch } = useTaxContext();
  const employers: EmployerWithholding[] = (state as any).employers || [];

  const [employerName, setEmployerName] = useState('');
  const [ein, setEin] = useState('');
  const [stateWithheld, setStateWithheld] = useState<number>(0);
  const [localWithheld, setLocalWithheld] = useState<number>(0);

  const handleAddEmployer = () => {
    if (!employerName || !ein) {
      alert('Please enter Employer Name and EIN.');
      return;
    }

    const newEmp: EmployerWithholding = {
      id: Date.now().toString(),
      employerName,
      ein,
      stateWithheld,
      localWithheld,
    };

    dispatch({ type: 'UPDATE_EMPLOYERS', payload: [...employers, newEmp] as any });

    setEmployerName('');
    setEin('');
    setStateWithheld(0);
    setLocalWithheld(0);
  };

  const handleRemoveEmployer = (id: string) => {
    const updated = employers.filter((e) => e.id !== id);
    dispatch({ type: 'UPDATE_EMPLOYERS', payload: updated as any });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
        Employer Withholding & W-2 Information
      </h4>

      {employers.map((emp, idx) => (
        <div key={emp.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-sm">
          <div>
            <span className="font-semibold text-slate-200">{idx + 1}. {emp.employerName}</span>
            <span className="text-xs text-slate-400 ml-2">(EIN: {emp.ein} • State Withheld: ${emp.stateWithheld})</span>
          </div>
          <button
            onClick={() => handleRemoveEmployer(emp.id)}
            className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 bg-rose-500/10 rounded border border-rose-500/20"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Employer Name"
            placeholder="e.g. Acme Corp"
            value={employerName}
            onChange={(e) => setEmployerName(e.target.value)}
          />
          <InputField
            label="Employer Identification Number (EIN)"
            placeholder="XX-XXXXXXX"
            value={ein}
            onChange={(e) => setEin(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CurrencyField
            label="State Withholding Amount"
            value={stateWithheld}
            onChange={(e) => setStateWithheld(parseFloat(e.target.value) || 0)}
          />
          <CurrencyField
            label="Local Withholding Amount (if applicable)"
            value={localWithheld}
            onChange={(e) => setLocalWithheld(parseFloat(e.target.value) || 0)}
          />
        </div>

        <button
          onClick={handleAddEmployer}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-4 py-2 rounded-lg border border-slate-700 transition"
        >
          + Add Employer W-2
        </button>
      </div>
    </div>
  );
};