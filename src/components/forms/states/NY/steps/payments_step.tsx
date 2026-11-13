// Step 8: withholding, estimated tax payments and use tax.
import React from 'react';
import { useTaxContext } from '../../../../../context/tax_context.tsx';
import type { TaxState } from '../../../../../context/tax_reducer.ts';
import { FormSection } from '../../../bases/form_section.tsx';
import { CurrencyField } from '../../../bases/currency_field.tsx';
import { AmountLine, AmountLines } from '../../../bases/amount_lines.tsx';
import type { StepProps } from './step_props.ts';

type PaymentKey = keyof TaxState['payments'];
const one = (n: number) => ({ federal: n, nySource: n });

export const PaymentsStep: React.FC<StepProps> = ({ estimate }) => {
  const { state, updatePayments } = useTaxContext();
  const p = state.payments;
  const field = (key: PaymentKey, label: string, hint?: string) => (
    <CurrencyField label={label} hint={hint} value={p[key]} onValueChange={(v) => updatePayments({ [key]: v })} />
  );
  const showNyc = state.residency.nyc !== 'none' && state.residency.nyc !== '';
  const showYonkers = state.residency.yonkers !== 'none' && state.residency.yonkers !== '';

  return (
    <>
      <FormSection
        title="Other tax withheld"
        description="Tax withheld on your W-2 forms is already counted. Add withholding from other forms here, for example 1099-R, 1099-G or W-2G."
      >
        <div className="tf-grid">
          {field('stateTaxWithheld', 'New York State tax withheld')}
          {showNyc && field('nycTaxWithheld', 'New York City tax withheld')}
          {showYonkers && field('yonkersTaxWithheld', 'Yonkers tax withheld')}
        </div>
      </FormSection>

      <FormSection title="Payments you made" description="Include the overpayment from your 2024 return that you applied to 2025.">
        <div className="tf-grid">
          {field('estimatedPayments', 'Estimated tax payments', 'Form IT-2105 payments for 2025.')}
          {field('extensionPayment', 'Payment with an extension', 'Form IT-370.')}
        </div>
      </FormSection>

      <FormSection
        title="Sales or use tax"
        description="You owe use tax on purchases from out-of-state sellers that did not charge New York sales tax. Enter 0 if you owe none."
      >
        {field('salesUseTax', 'Sales or use tax owed')}
      </FormSection>

      <FormSection title="Total payments">
        <AmountLines columns={1}>
          <AmountLine line="" label="New York State tax withheld" columns={1} readOnly value={one(estimate.withholding.state)} />
          {showNyc && <AmountLine line="" label="New York City tax withheld" columns={1} readOnly value={one(estimate.withholding.nyc)} />}
          {showYonkers && <AmountLine line="" label="Yonkers tax withheld" columns={1} readOnly value={one(estimate.withholding.yonkers)} />}
          <AmountLine line="" label="Estimated and extension payments" columns={1} readOnly value={one(estimate.estimatedPayments)} />
          <AmountLine line="" label="Refundable credits" columns={1} readOnly value={one(estimate.refundableCredits)} />
          <AmountLine line="" label="Total payments and refundable credits" columns={1} total value={one(estimate.totalPayments)} />
        </AmountLines>
      </FormSection>
    </>
  );
};
