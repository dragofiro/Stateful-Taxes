/*
The Spouse Information field asks the user for:
- First Name, Middle Initial, Last Name
- Social Security Number
- Date of Birth
- Date of Death (if applicable)
 */
import React from 'react';
import { useTaxContext } from '../../../context/tax_context.tsx';
import { InputField } from '../bases/input_field.tsx';
import { formatSsn, type FieldErrors } from './field_errors.ts';

export const SpouseInfoField: React.FC<{ errors?: FieldErrors }> = ({ errors = {} }) => {
  const { state, updatePersonalInfo } = useTaxContext();
  const info = state.personalInfo;

  return (
    <div className="tf-stack">
      <div className="tf-grid" style={{ gridTemplateColumns: 'minmax(0, 2fr) 72px minmax(0, 2fr)' }}>
        <InputField
          label="Spouse's first name"
          value={info.spouseFirstName ?? ''}
          error={errors['personalInfo.spouseFirstName']}
          onChange={(e) => updatePersonalInfo({ spouseFirstName: e.target.value })}
        />
        <InputField
          label="M.I."
          maxLength={1}
          value={info.spouseMiddleInitial ?? ''}
          onChange={(e) => updatePersonalInfo({ spouseMiddleInitial: e.target.value.toUpperCase() })}
        />
        <InputField
          label="Spouse's last name"
          value={info.spouseLastName ?? ''}
          error={errors['personalInfo.spouseLastName']}
          onChange={(e) => updatePersonalInfo({ spouseLastName: e.target.value })}
        />
      </div>
      <div className="tf-grid tf-grid--3">
        <InputField
          label="Spouse's SSN"
          placeholder="123-45-6789"
          inputMode="numeric"
          autoComplete="off"
          value={info.spouseSsn ?? ''}
          error={errors['personalInfo.spouseSsn']}
          onChange={(e) => updatePersonalInfo({ spouseSsn: formatSsn(e.target.value) })}
        />
        <InputField
          label="Spouse's date of birth"
          type="date"
          value={info.spouseDateOfBirth ?? ''}
          onChange={(e) => updatePersonalInfo({ spouseDateOfBirth: e.target.value })}
        />
        <InputField
          label="Spouse's date of death"
          type="date"
          optional
          value={info.spouseDateOfDeath ?? ''}
          onChange={(e) => updatePersonalInfo({ spouseDateOfDeath: e.target.value })}
        />
      </div>
    </div>
  );
};
