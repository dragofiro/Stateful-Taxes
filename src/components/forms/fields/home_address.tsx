/*
The Home Address field asks the user for their permanent home address, if it differs from the mailing address:
- Street Address
- Apartment/Suite Number (optional)
- City, State (Abbreviation), ZIP Code
*/
import React from 'react';
import { useTaxContext } from '../../../context/tax_context.tsx';
import { InputField } from '../bases/input_field.tsx';
import { CheckboxField } from '../bases/checkbox_field.tsx';
import type { FieldErrors } from './field_errors.ts';

export const HomeAddressField: React.FC<{ errors?: FieldErrors }> = ({ errors = {} }) => {
  const { state, updatePersonalInfo } = useTaxContext();
  const info = state.personalInfo;

  return (
    <div className="tf-stack">
      <CheckboxField
        label="My permanent home address is the same as my mailing address"
        checked={info.homeSameAsMailing}
        onChange={(e) => updatePersonalInfo({ homeSameAsMailing: e.target.checked })}
      />
      {!info.homeSameAsMailing && (
        <>
          <div className="tf-grid" style={{ gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 1fr)' }}>
            <InputField
              label="Permanent home address"
              hint="Do not use a PO box."
              value={info.homeAddress}
              error={errors['personalInfo.homeAddress']}
              onChange={(e) => updatePersonalInfo({ homeAddress: e.target.value })}
            />
            <InputField
              label="Apt."
              optional
              value={info.homeApartment}
              onChange={(e) => updatePersonalInfo({ homeApartment: e.target.value })}
            />
          </div>
          <div className="tf-grid" style={{ gridTemplateColumns: 'minmax(0, 3fr) 88px minmax(0, 1.4fr)' }}>
            <InputField
              label="City, village or post office"
              value={info.homeCity}
              error={errors['personalInfo.homeCity']}
              onChange={(e) => updatePersonalInfo({ homeCity: e.target.value })}
            />
            <InputField
              label="State"
              maxLength={2}
              value={info.homeState}
              onChange={(e) => updatePersonalInfo({ homeState: e.target.value.toUpperCase() })}
            />
            <InputField
              label="ZIP code"
              inputMode="numeric"
              value={info.homeZip}
              onChange={(e) => updatePersonalInfo({ homeZip: e.target.value })}
            />
          </div>
        </>
      )}
    </div>
  );
};
