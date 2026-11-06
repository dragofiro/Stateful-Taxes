/*
The Home Address field should ask the user for:
- Street Address
- City
- State (Abreviation)
- ZIP Code
- Apartment/Suite Number (optional)
*/
import React from 'react';
import { useTaxContext } from '../../../context/tax_context.tsx';
import { InputField } from '../bases/input_field.tsx';

export const HomeAddressField: React.FC = () => {
  const { state, updatePersonalInfo } = useTaxContext();
  const info = state.personalInfo;

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
        Permanent Home Address
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <InputField
            label="Street Address"
            placeholder="123 Main St"
            value={info.mailingAddress} // Map to primary mailing/home address
            onChange={(e) => updatePersonalInfo({ mailingAddress: e.target.value })}
          />
        </div>
        <InputField
          label="Apt / Suite Number"
            placeholder="Apt 4B"
            value={info.apartmentNumber || ''}
            onChange={(e) => updatePersonalInfo({ apartmentNumber: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField
          label="City"
          placeholder="City"
          value={info.city}
          onChange={(e) => updatePersonalInfo({ city: e.target.value })}
        />
        <InputField
          label="State"
          placeholder="NY"
          maxLength={2}
          value={info.state}
          onChange={(e) => updatePersonalInfo({ state: e.target.value })}
        />
        <InputField
          label="ZIP Code"
          placeholder="12207"
          maxLength={5}
          value={info.zipCode}
          onChange={(e) => updatePersonalInfo({ zipCode: e.target.value })}
        />
      </div>
    </div>
  );
};