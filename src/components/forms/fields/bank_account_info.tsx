/*
Bank Account Information should ask the user for: 
- Account Type (Personal/Business for a Checking/Savings)
- Routing Number
- Account Number
- optionally a confirmation of the Account Number.
*/ 
import React, { useState } from 'react';
import { useTaxContext } from '../../../context/tax_context.tsx';
import { InputField } from '../bases/input_field.tsx';
import { SelectField } from '../bases/select_field.tsx';

export const BankAccountInfoField: React.FC = () => {
  const { state, dispatch } = useTaxContext();
  const bankInfo = (state as any).bankInfo || {
    accountType: 'Personal Checking',
    routingNumber: '',
    accountNumber: '',
    confirmAccountNumber: '',
  };

  const [confirmError, setConfirmError] = useState<string | null>(null);

  const updateBank = (payload: Partial<typeof bankInfo>) => {
    const updated = { ...bankInfo, ...payload };
    dispatch({ type: 'UPDATE_BANK_INFO', payload: updated as any });

    if (payload.accountNumber !== undefined || payload.confirmAccountNumber !== undefined) {
      const acct = payload.accountNumber ?? bankInfo.accountNumber;
      const confirm = payload.confirmAccountNumber ?? bankInfo.confirmAccountNumber;
      if (confirm && acct !== confirm) {
        setConfirmError('Account numbers do not match.');
      } else {
        setConfirmError(null);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
        Direct Deposit / Refund & Withdrawal Banking Information
      </h4>

      <SelectField
        label="Account Type"
        value={bankInfo.accountType}
        onChange={(e) => updateBank({ accountType: e.target.value })}
        options={[
          { label: 'Personal Checking', value: 'Personal Checking' },
          { label: 'Personal Savings', value: 'Personal Savings' },
          { label: 'Business Checking', value: 'Business Checking' },
          { label: 'Business Savings', value: 'Business Savings' },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Routing Number (9 digits)"
          placeholder="XXXXXXXXX"
          maxLength={9}
          value={bankInfo.routingNumber}
          onChange={(e) => updateBank({ routingNumber: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Account Number"
          placeholder="Account Number"
          type="password"
          value={bankInfo.accountNumber}
          onChange={(e) => updateBank({ accountNumber: e.target.value })}
        />
        <InputField
          label="Confirm Account Number"
          placeholder="Re-enter Account Number"
          value={bankInfo.confirmAccountNumber}
          onChange={(e) => updateBank({ confirmAccountNumber: e.target.value })}
          error={confirmError || undefined}
        />
      </div>
    </div>
  );
};