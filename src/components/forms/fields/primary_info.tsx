/*
Primary Information should ask the user for:
- First Name
- Last Name
- Date of Birth
- Social Security Number
- County of Residence
- School District of Residence
- School District Code
*/

import React from 'react';
import { useTaxContext } from '../../../context/tax_context.tsx';
import { InputField } from '../bases/input_field.tsx';

export const PrimaryInfoField: React.FC = () => {
  const { state, updatePersonalInfo } = useTaxContext();
  const info = state.personalInfo;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField
          label="First Name"
          placeholder="e.g. John"
          value={info.firstName}
          onChange={(e) => updatePersonalInfo({ firstName: e.target.value })}
        />
        <InputField
          label="Middle Initial"
          placeholder="A"
          maxLength={1}
          value={info.middleInitial}
          onChange={(e) => updatePersonalInfo({ middleInitial: e.target.value })}
        />
        <InputField
          label="Last Name"
          placeholder="e.g. Doe"
          value={info.lastName}
          onChange={(e) => updatePersonalInfo({ lastName: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Social Security Number (SSN)"
          placeholder="XXX-XX-XXXX"
          value={info.ssn}
          onChange={(e) => updatePersonalInfo({ ssn: e.target.value })}
        />
        <InputField
          label="Date of Birth"
          type="date"
          value={info.dateOfBirth || ''}
          onChange={(e) => updatePersonalInfo({ dateOfBirth: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField
          label="County of Residence"
          placeholder="e.g. Albany"
          value={info.countyOfResidence}
          onChange={(e) => updatePersonalInfo({ countyOfResidence: e.target.value })}
        />
        <InputField
          label="School District Name"
          placeholder="e.g. Albany City SD"
          value={info.schoolDistrictName || ''}
          onChange={(e) => updatePersonalInfo({ schoolDistrictName: e.target.value })}
        />
        <InputField
          label="School District Code"
          placeholder="e.g. 051"
          value={info.schoolDistrictCode}
          onChange={(e) => updatePersonalInfo({ schoolDistrictCode: e.target.value })}
        />
      </div>
    </div>
  );
};