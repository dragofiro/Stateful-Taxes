/*
Dependant Information asks the user for:
- First name, Middle Initial, Last Name
- Date of Birth
- Relationship to the taxpayer
- Social Security Number
The user can add multiple dependants (all with the information above).
*/
import React, { useState } from 'react';
import { useTaxContext } from '../../../context/tax_context.tsx';
import type { Dependent } from '../../../context/tax_reducer.ts';
import { InputField } from '../bases/input_field.tsx';
import { SelectField } from '../bases/select_field.tsx';
import { formatSsn, maskSsn, newId, type FieldErrors } from './field_errors.ts';

export type { Dependent };

const RELATIONSHIPS = ['Son', 'Daughter', 'Stepchild', 'Foster child', 'Grandchild', 'Sibling', 'Parent', 'Other'];

const emptyDraft = (): Omit<Dependent, 'id'> => ({
  firstName: '',
  middleInitial: '',
  lastName: '',
  ssn: '',
  dateOfBirth: '',
  relationship: '',
});

export const DependantInfoField: React.FC = () => {
  const { state, dispatch } = useTaxContext();
  const dependents = state.dependents;
  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(dependents.length === 0);
  const [errors, setErrors] = useState<FieldErrors>({});

  const set = (patch: Partial<Dependent>) => setDraft((d) => ({ ...d, ...patch }));

  const save = () => {
    const next: FieldErrors = {};
    if (!draft.firstName.trim()) next.firstName = 'Enter a first name.';
    if (!draft.lastName.trim()) next.lastName = 'Enter a last name.';
    if (!/^\d{3}-\d{2}-\d{4}$/.test(draft.ssn)) next.ssn = 'Use the format 123-45-6789.';
    if (!draft.relationship) next.relationship = 'Choose a relationship.';
    if (!draft.dateOfBirth) next.dateOfBirth = 'Enter a date of birth.';
    setErrors(next);
    if (Object.keys(next).length) return;

    const updated = editingId
      ? dependents.map((d) => (d.id === editingId ? { ...draft, id: editingId } : d))
      : [...dependents, { ...draft, id: newId() }];
    dispatch({ type: 'UPDATE_DEPENDENTS', payload: updated });
    setDraft(emptyDraft());
    setEditingId(null);
    setOpen(false);
  };

  const edit = (dep: Dependent) => {
    const { id, ...rest } = dep;
    setDraft(rest);
    setEditingId(id);
    setErrors({});
    setOpen(true);
  };

  const remove = (id: string) => {
    dispatch({ type: 'UPDATE_DEPENDENTS', payload: dependents.filter((d) => d.id !== id) });
  };

  const cancel = () => {
    setDraft(emptyDraft());
    setEditingId(null);
    setErrors({});
    setOpen(false);
  };

  return (
    <div>
      {dependents.length > 0 ? (
        <ul className="tf-list">
          {dependents.map((dep, idx) => (
            <li key={dep.id} className="tf-list-item">
              <span className="tf-list-index">{String(idx + 1).padStart(2, '0')}</span>
              <div className="tf-list-main">
                <div className="tf-list-title">
                  {dep.firstName} {dep.middleInitial && `${dep.middleInitial}. `}
                  {dep.lastName}
                </div>
                <div className="tf-list-meta">
                  {dep.relationship} · {maskSsn(dep.ssn)} · born {dep.dateOfBirth}
                </div>
              </div>
              <button type="button" className="tf-btn tf-btn--quiet" onClick={() => edit(dep)}>
                Edit
              </button>
              <button type="button" className="tf-btn tf-btn--quiet tf-btn--danger" onClick={() => remove(dep.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !open && <p className="tf-empty">No dependents added. Skip this step if you have none.</p>
      )}

      {open ? (
        <div className="tf-card tf-stack">
          <p className="tf-subhead">{editingId ? 'Edit dependent' : 'Add a dependent'}</p>
          <div className="tf-grid" style={{ gridTemplateColumns: 'minmax(0, 2fr) 72px minmax(0, 2fr)' }}>
            <InputField label="First name" value={draft.firstName} error={errors.firstName} onChange={(e) => set({ firstName: e.target.value })} />
            <InputField label="M.I." maxLength={1} value={draft.middleInitial} onChange={(e) => set({ middleInitial: e.target.value.toUpperCase() })} />
            <InputField label="Last name" value={draft.lastName} error={errors.lastName} onChange={(e) => set({ lastName: e.target.value })} />
          </div>
          <div className="tf-grid tf-grid--3">
            <SelectField
              label="Relationship to you"
              value={draft.relationship}
              error={errors.relationship}
              onChange={(e) => set({ relationship: e.target.value })}
              options={RELATIONSHIPS.map((r) => ({ label: r, value: r }))}
            />
            <InputField
              label="SSN"
              placeholder="123-45-6789"
              inputMode="numeric"
              autoComplete="off"
              value={draft.ssn}
              error={errors.ssn}
              onChange={(e) => set({ ssn: formatSsn(e.target.value) })}
            />
            <InputField label="Date of birth" type="date" value={draft.dateOfBirth} error={errors.dateOfBirth} onChange={(e) => set({ dateOfBirth: e.target.value })} />
          </div>
          <div className="tf-card-actions">
            {(dependents.length > 0 || editingId) && (
              <button type="button" className="tf-btn tf-btn--ghost tf-btn--small" onClick={cancel}>
                Cancel
              </button>
            )}
            <button type="button" className="tf-btn tf-btn--small" onClick={save}>
              {editingId ? 'Save changes' : 'Add dependent'}
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="tf-btn tf-btn--ghost tf-btn--small" onClick={() => setOpen(true)}>
          + Add a dependent
        </button>
      )}
    </div>
  );
};
