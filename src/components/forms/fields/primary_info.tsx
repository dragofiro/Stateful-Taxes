/*
Primary Information asks the user for:
- First Name, Middle Initial, Last Name
- Date of Birth
- Social Security Number
- County of Residence, School District Name and School District Code (New York residents)
*/
import React from 'react';
import { useTaxContext } from '../../../context/tax_context.tsx';
import { InputField } from '../bases/input_field.tsx';
import type { FieldErrors } from './field_errors.ts';
import { formatSsn } from './field_errors.ts';

interface PrimaryInfoFieldProps {
  errors?: FieldErrors;
  /** Shows county and school district. Nonresidents do not fill these in. */
  showResidenceFields?: boolean;
}

export const PrimaryInfoField: React.FC<PrimaryInfoFieldProps> = ({ errors = {}, showResidenceFields = true }) => {
  const { state, updatePersonalInfo } = useTaxContext();
  const info = state.personalInfo;

  return (
    <div className="tf-stack">
      <div className="tf-grid" style={{ gridTemplateColumns: 'minmax(0, 2fr) 72px minmax(0, 2fr)' }}>
        <InputField
          label="First name"
          autoComplete="given-name"
          value={info.firstName}
          error={errors['personalInfo.firstName']}
          onChange={(e) => updatePersonalInfo({ firstName: e.target.value })}
        />
        <InputField
          label="M.I."
          maxLength={1}
          value={info.middleInitial}
          onChange={(e) => updatePersonalInfo({ middleInitial: e.target.value.toUpperCase() })}
        />
        <InputField
          label="Last name"
          autoComplete="family-name"
          value={info.lastName}
          error={errors['personalInfo.lastName']}
          onChange={(e) => updatePersonalInfo({ lastName: e.target.value })}
        />
      </div>

      <div className="tf-grid">
        <InputField
          label="Social Security number"
          placeholder="123-45-6789"
          inputMode="numeric"
          autoComplete="off"
          value={info.ssn}
          error={errors['personalInfo.ssn']}
          onChange={(e) => updatePersonalInfo({ ssn: formatSsn(e.target.value) })}
        />
        <InputField
          label="Date of birth"
          type="date"
          value={info.dateOfBirth}
          error={errors['personalInfo.dateOfBirth']}
          onChange={(e) => updatePersonalInfo({ dateOfBirth: e.target.value })}
        />
      </div>

      {showResidenceFields && (
        <div className="tf-grid tf-grid--3">
          <InputField
            label="New York county"
            placeholder="e.g. Albany"
            value={info.countyOfResidence}
            error={errors['personalInfo.countyOfResidence']}
            onChange={(e) => updatePersonalInfo({ countyOfResidence: e.target.value })}
          />
          <InputField
            label="School district"
            placeholder="e.g. Albany City"
            value={info.schoolDistrictName}
            error={errors['personalInfo.schoolDistrictName']}
            onChange={(e) => updatePersonalInfo({ schoolDistrictName: e.target.value })}
          />
          <InputField
            label="School district code"
            placeholder="e.g. 051"
            inputMode="numeric"
            maxLength={3}
            hint="Listed in the IT-201 instructions."
            value={info.schoolDistrictCode}
            error={errors['personalInfo.schoolDistrictCode']}
            onChange={(e) => updatePersonalInfo({ schoolDistrictCode: e.target.value.replace(/\D/g, '') })}
          />
        </div>
      )}
    </div>
  );
};
