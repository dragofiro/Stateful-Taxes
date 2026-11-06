/* 
The Mailing Address field should ask the user for:
- Street Address or PO Box
- City
- State (Abbreviation)
- ZIP Code
- Country
- Apartment/Suite Number (optional)
 */
import React from 'react';
import { useTaxContext } from '../../../context/tax_context.tsx';
import { InputField } from '../bases/input_field.tsx';
import { CheckboxField } from '../bases/checkbox_field.tsx';

export const MailingAddressField: React.FC = () => {
  const { state, updatePersonalInfo } = useTaxContext();
  const info = state.personalInfo;

  // Optional state toggle if mailing address differs from home address
  const [differentMailing, setDifferentMailing] = React.useState(false);

  return (
    <div className="space-y-4 border-t border-slate-800 pt-4 mt-4">
      <CheckboxField
        label="Mailing address is different from permanent home address"
        checked={differentMailing}
        onChange={(e) => setDifferentMailing(e.target.checked)}
      />

      {differentMailing && (
        <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <InputField
                label="Street Address or PO Box"
                placeholder="PO Box 456"
                value={info.mailingAddress || ''}
                onChange={(e) => updatePersonalInfo({ mailingAddress: e.target.value })}
              />
            </div>
            <InputField
              label="Apt / Suite Number"
              placeholder="Ste 100"
              value={info.apartmentNumber || ''}
              onChange={(e) => updatePersonalInfo({ apartmentNumber: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <InputField
              label="City"
              placeholder="City"
              value={info.city || ''}
              onChange={(e) => updatePersonalInfo({ city: e.target.value })}
            />
            <InputField
              label="State"
              placeholder="NY"
              maxLength={2}
              value={info.state || ''}
              onChange={(e) => updatePersonalInfo({ state: e.target.value })}
            />
            <InputField
              label="ZIP Code"
              placeholder="12207"
              maxLength={5}
              value={info.zipCode || ''}
              onChange={(e) => updatePersonalInfo({ zipCode: e.target.value })}
            />
            <InputField
              label="Country"
              placeholder="USA"
              value={info.country || 'USA'}
              onChange={(e) => updatePersonalInfo({ country: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
};