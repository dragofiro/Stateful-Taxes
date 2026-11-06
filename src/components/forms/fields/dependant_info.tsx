/*
Dependant Information should ask the user for:
- First name
- Last Name
- Middle Initial
- Date of Birth
- Relationship to the taxpayer
- Social Security Number
The user should be able to add multiple dependants (all with the information above).
*/
import React, { useState } from 'react';
import { useTaxContext } from '../../../context/tax_context.tsx';
import { InputField } from '../bases/input_field.tsx';
import { SelectField } from '../bases/select_field.tsx';

export interface Dependent {
  id: string;
  firstName: string;
  middleInitial: string;
  lastName: string;
  ssn: string;
  dateOfBirth: string;
  relationship: string;
}

export const DependantInfoField: React.FC = () => {
  const { state, dispatch } = useTaxContext();
  const dependents: Dependent[] = (state as any).dependents || [];

  const [firstName, setFirstName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [lastName, setLastName] = useState('');
  const [ssn, setSsn] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [relationship, setRelationship] = useState('Child');

  const handleAddDependent = () => {
    if (!firstName || !lastName || !ssn) {
      alert('Please fill out required dependent fields.');
      return;
    }

    const newDep: Dependent = {
      id: Date.now().toString(),
      firstName,
      middleInitial,
      lastName,
      ssn,
      dateOfBirth,
      relationship,
    };

    dispatch({ type: 'UPDATE_DEPENDENTS', payload: [...dependents, newDep] as any });

    // Reset form
    setFirstName('');
    setMiddleInitial('');
    setLastName('');
    setSsn('');
    setDateOfBirth('');
    setRelationship('Child');
  };

  const handleRemoveDependent = (id: string) => {
    const updated = dependents.filter((d) => d.id !== id);
    dispatch({ type: 'UPDATE_DEPENDENTS', payload: updated as any });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
        Dependent Information (Item H)
      </h4>

      {dependents.map((dep, idx) => (
        <div key={dep.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-sm">
          <div>
            <span className="font-semibold text-slate-200">{idx + 1}. {dep.firstName} {dep.lastName}</span>
            <span className="text-xs text-slate-400 ml-2">({dep.relationship} • SSN: {dep.ssn})</span>
          </div>
          <button
            onClick={() => handleRemoveDependent(dep.id)}
            className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 bg-rose-500/10 rounded border border-rose-500/20"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField
            label="First Name"
            placeholder="Dependent First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <InputField
            label="Middle Initial"
            placeholder="M"
            maxLength={1}
            value={middleInitial}
            onChange={(e) => setMiddleInitial(e.target.value)}
          />
          <InputField
            label="Last Name"
            placeholder="Dependent Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField
            label="Social Security Number"
            placeholder="XXX-XX-XXXX"
            value={ssn}
            onChange={(e) => setSsn(e.target.value)}
          />
          <InputField
            label="Date of Birth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
          <SelectField
            label="Relationship"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            options={[
              { label: 'Child', value: 'Child' },
              { label: 'Stepchild', value: 'Stepchild' },
              { label: 'Grandchild', value: 'Grandchild' },
              { label: 'Sibling', value: 'Sibling' },
              { label: 'Parent', value: 'Parent' },
              { label: 'Other', value: 'Other' },
            ]}
          />
        </div>

        <button
          onClick={handleAddDependent}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-4 py-2 rounded-lg border border-slate-700 transition"
        >
          + Add Dependent
        </button>
      </div>
    </div>
  );
};