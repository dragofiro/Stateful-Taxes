/*
Bank Account Information asks the user for:
- Account Type (Personal/Business for a Checking/Savings)
- Routing Number
- Account Number
- optionally a confirmation of the Account Number.
*/
import React from 'react';
import { useTaxContext } from '../../../context/tax_context.tsx';
import type { BankInfo } from '../../../context/tax_reducer.ts';
import { InputField } from '../bases/input_field.tsx';
import { SelectField } from '../bases/select_field.tsx';

export const BankAccountInfoField: React.FC = () => {
  const { state, dispatch } = useTaxContext();
  const bankInfo = state.bankInfo;
  const updateBank = (payload: Partial<BankInfo>) => dispatch({ type: 'UPDATE_BANK_INFO', payload });
  const mismatch =
    bankInfo.confirmAccountNumber && bankInfo.accountNumber !== bankInfo.confirmAccountNumber
      ? 'Account numbers do not match.'
      : undefined;

  return (
    <div className="tf-stack">
      <SelectField
        label="Account type"
        value={bankInfo.accountType}
        onChange={(e) => updateBank({ accountType: e.target.value })}
        options={[
          { label: 'Personal checking', value: 'Personal Checking' },
          { label: 'Personal savings', value: 'Personal Savings' },
          { label: 'Business checking', value: 'Business Checking' },
          { label: 'Business savings', value: 'Business Savings' },
        ]}
      />
      <InputField
        label="Routing number"
        hint="9 digits"
        inputMode="numeric"
        maxLength={9}
        value={bankInfo.routingNumber}
        onChange={(e) => updateBank({ routingNumber: e.target.value.replace(/\D/g, '') })}
      />
      <div className="tf-grid">
        <InputField
          label="Account number"
          type="password"
          autoComplete="off"
          value={bankInfo.accountNumber}
          onChange={(e) => updateBank({ accountNumber: e.target.value })}
        />
        <InputField
          label="Confirm account number"
          autoComplete="off"
          value={bankInfo.confirmAccountNumber}
          error={mismatch}
          onChange={(e) => updateBank({ confirmAccountNumber: e.target.value })}
        />
      </div>
    </div>
  );
};
