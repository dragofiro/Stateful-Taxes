/*
The Mailing Address field asks the user for:
- Street Address or PO Box
- Apartment/Suite Number (optional)
- City, State (Abbreviation), ZIP Code
- Country (only if not the United States)
 */
import React from 'react';
import { useTaxContext } from '../../../context/tax_context.tsx';
import { InputField } from '../bases/input_field.tsx';
import type { FieldErrors } from './field_errors.ts';

export const MailingAddressField: React.FC<{ errors?: FieldErrors }> = ({ errors = {} }) => {
  const { state, updatePersonalInfo } = useTaxContext();
  const info = state.personalInfo;

  return (
    <div className="tf-stack">
      <div className="tf-grid" style={{ gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 1fr)' }}>
        <InputField
          label="Street address or PO box"
          autoComplete="address-line1"
          value={info.mailingAddress}
          error={errors['personalInfo.mailingAddress']}
          onChange={(e) => updatePersonalInfo({ mailingAddress: e.target.value })}
        />
        <InputField
          label="Apt."
          optional
          autoComplete="address-line2"
          value={info.apartmentNumber ?? ''}
          onChange={(e) => updatePersonalInfo({ apartmentNumber: e.target.value })}
        />
      </div>
      <div className="tf-grid" style={{ gridTemplateColumns: 'minmax(0, 3fr) 88px minmax(0, 1.4fr)' }}>
        <InputField
          label="City, village or post office"
          autoComplete="address-level2"
          value={info.city}
          error={errors['personalInfo.city']}
          onChange={(e) => updatePersonalInfo({ city: e.target.value })}
        />
        <InputField
          label="State"
          maxLength={2}
          autoComplete="address-level1"
          value={info.state}
          error={errors['personalInfo.state']}
          onChange={(e) => updatePersonalInfo({ state: e.target.value.toUpperCase() })}
        />
        <InputField
          label="ZIP code"
          inputMode="numeric"
          autoComplete="postal-code"
          value={info.zipCode}
          error={errors['personalInfo.zipCode']}
          onChange={(e) => updatePersonalInfo({ zipCode: e.target.value })}
        />
      </div>
      <InputField
        label="Country"
        optional
        hint="Leave empty for an address in the United States."
        autoComplete="country-name"
        value={info.country}
        onChange={(e) => updatePersonalInfo({ country: e.target.value })}
      />
    </div>
  );
};
