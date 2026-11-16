/*
The Employer Withholding Information field asks the user for each W-2:
- Employer Name and Employer Identification Number (EIN)
- Box 1 wages and box 16 New York State wages
- Box 17 State Withholding Amount
- Box 19 Local Withholding Amount and box 20 locality (if applicable)
*/
import React, { useState } from 'react';
import { useTaxContext } from '../../../context/tax_context.tsx';
import type { EmployerWithholding, W2Locality } from '../../../context/tax_reducer.ts';
import { InputField } from '../bases/input_field.tsx';
import { CurrencyField } from '../bases/currency_field.tsx';
import { SelectField } from '../bases/select_field.tsx';
import { formatEin, newId, type FieldErrors } from './field_errors.ts';

export type { EmployerWithholding };

const emptyDraft = (): Omit<EmployerWithholding, 'id'> => ({
  employerName: '',
  ein: '',
  wages: 0,
  stateWages: 0,
  stateWithheld: 0,
  localWithheld: 0,
  locality: '',
});

const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

export const EmployerWitholdingField: React.FC = () => {
  const { state, dispatch } = useTaxContext();
  const employers = state.employers;
  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const set = (patch: Partial<EmployerWithholding>) => setDraft((d) => ({ ...d, ...patch }));

  const save = () => {
    const next: FieldErrors = {};
    if (!draft.employerName.trim()) next.employerName = 'Enter the employer name from box c.';
    if (!/^\d{2}-\d{7}$/.test(draft.ein)) next.ein = 'Use the format 12-3456789 (box b).';
    if (draft.localWithheld > 0 && !draft.locality) next.locality = 'Choose the locality from box 20.';
    setErrors(next);
    if (Object.keys(next).length) return;

    const updated = editingId
      ? employers.map((e) => (e.id === editingId ? { ...draft, id: editingId } : e))
      : [...employers, { ...draft, id: newId() }];
    dispatch({ type: 'UPDATE_EMPLOYERS', payload: updated });
    setDraft(emptyDraft());
    setEditingId(null);
    setOpen(false);
  };

  const edit = (w2: EmployerWithholding) => {
    const { id, ...rest } = w2;
    setDraft(rest);
    setEditingId(id);
    setErrors({});
    setOpen(true);
  };

  const cancel = () => {
    setDraft(emptyDraft());
    setEditingId(null);
    setErrors({});
    setOpen(false);
  };

  return (
    <div>
      {employers.length > 0 ? (
        <ul className="tf-list">
          {employers.map((w2, idx) => (
            <li key={w2.id} className="tf-list-item">
              <span className="tf-list-index">W-2 {String(idx + 1).padStart(2, '0')}</span>
              <div className="tf-list-main">
                <div className="tf-list-title">{w2.employerName}</div>
                <div className="tf-list-meta">
                  Wages {money(w2.wages)} · NYS withheld {money(w2.stateWithheld)}
                  {w2.localWithheld > 0 && ` · ${w2.locality} withheld ${money(w2.localWithheld)}`}
                </div>
              </div>
              <button type="button" className="tf-btn tf-btn--quiet" onClick={() => edit(w2)}>
                Edit
              </button>
              <button
                type="button"
                className="tf-btn tf-btn--quiet tf-btn--danger"
                onClick={() => dispatch({ type: 'UPDATE_EMPLOYERS', payload: employers.filter((e) => e.id !== w2.id) })}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !open && <p className="tf-empty">No W-2 forms added. Add one for each job you had in 2025.</p>
      )}

      {open ? (
        <div className="tf-card tf-stack">
          <p className="tf-subhead">{editingId ? 'Edit W-2' : 'Add a W-2'}</p>
          <div className="tf-grid" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)' }}>
            <InputField label="Employer name (box c)" value={draft.employerName} error={errors.employerName} onChange={(e) => set({ employerName: e.target.value })} />
            <InputField
              label="EIN (box b)"
              placeholder="12-3456789"
              inputMode="numeric"
              value={draft.ein}
              error={errors.ein}
              onChange={(e) => set({ ein: formatEin(e.target.value) })}
            />
          </div>
          <div className="tf-grid">
            <CurrencyField label="Wages (box 1)" value={draft.wages} onValueChange={(wages) => set({ wages })} />
            <CurrencyField
              label="New York State wages (box 16)"
              value={draft.stateWages}
              onValueChange={(stateWages) => set({ stateWages })}
            />
            <CurrencyField
              label="New York State tax withheld (box 17)"
              value={draft.stateWithheld}
              onValueChange={(stateWithheld) => set({ stateWithheld })}
            />
            <div />
            <CurrencyField label="Local tax withheld (box 19)" value={draft.localWithheld} onValueChange={(localWithheld) => set({ localWithheld })} />
            <SelectField
              label="Locality (box 20)"
              value={draft.locality}
              error={errors.locality}
              placeholder="None"
              onChange={(e) => set({ locality: e.target.value as W2Locality })}
              options={[
                { label: 'New York City', value: 'NYC' },
                { label: 'Yonkers', value: 'Yonkers' },
                { label: 'Other', value: 'Other' },
              ]}
            />
          </div>
          <div className="tf-card-actions">
            <button type="button" className="tf-btn tf-btn--ghost tf-btn--small" onClick={cancel}>
              Cancel
            </button>
            <button type="button" className="tf-btn tf-btn--small" onClick={save}>
              {editingId ? 'Save changes' : 'Add W-2'}
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="tf-btn tf-btn--ghost tf-btn--small" onClick={() => setOpen(true)}>
          + Add a W-2
        </button>
      )}
    </div>
  );
};
