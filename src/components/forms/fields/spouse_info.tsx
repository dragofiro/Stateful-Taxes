/*
The Spouse Information field should ask the user for:
- First Name
- Last Name
- Date of Birth
- Social Security Number
- Date of Death (if applicable)
 */
import React from 'react';
import { useTaxContext } from '../../../context/tax_context.tsx';
import { InputField } from '../bases/input_field.tsx';

export const SpouseInfoField: React.FC = () => {
  const { state, updatePersonalInfo } = useTaxContext();
  const info = state.personalInfo;

  return (
    <div className="space-y-4 border-t border-slate-800 pt-4 mt-4">
      <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
        Spouse Information (For Married Filing Joint/Separate)
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField
          label="Spouse First Name"
          placeholder="e.g. Jane"
          value={info.spouseFirstName || ''}
          onChange={(e) => updatePersonalInfo({ spouseFirstName: e.target.value })}
        />
        <InputField
          label="Spouse Middle Initial"
          placeholder="B"
          maxLength={1}
          value={info.spouseMiddleInitial || ''}
          onChange={(e) => updatePersonalInfo({ spouseMiddleInitial: e.target.value })}
        />
        <InputField
          label="Spouse Last Name"
          placeholder="e.g. Doe"
          value={info.spouseLastName || ''}
          onChange={(e) => updatePersonalInfo({ spouseLastName: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField
          label="Spouse SSN"
          placeholder="XXX-XX-XXXX"
          value={info.spouseSsn || ''}
          onChange={(e) => updatePersonalInfo({ spouseSsn: e.target.value })}
        />
        <InputField
          label="Spouse Date of Birth"
          type="date"
          value={info.spouseDateOfBirth || ''}
          onChange={(e) => updatePersonalInfo({ spouseDateOfBirth: e.target.value })}
        />
        <InputField
          label="Spouse Date of Death (if applicable)"
          type="date"
          value={info.spouseDateOfDeath || ''}
          onChange={(e) => updatePersonalInfo({ spouseDateOfDeath: e.target.value })}
        />
      </div>
    </div>
  );
};