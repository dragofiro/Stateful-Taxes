// Step 6: standard or itemized deduction (line 34) and dependent exemptions (line 36).
import React from 'react';
import { useTaxContext } from '../../../../../context/tax_context.tsx';
import { FormSection } from '../../../bases/form_section.tsx';
import { ChoiceGroup } from '../../../bases/choice_group.tsx';
import { CurrencyField } from '../../../bases/currency_field.tsx';
import { AmountLine, AmountLines } from '../../../bases/amount_lines.tsx';
import { Notice } from '../../../bases/notice.tsx';
import type { StepProps } from './step_props.ts';

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
const one = (n: number) => ({ federal: n, nySource: n });

export const DeductionsStep: React.FC<StepProps> = ({ errors, estimate }) => {
  const { state, updateDeductions } = useTaxContext();
  const d = state.deductions;
  const itemizedBetter = d.itemizedAmount > estimate.standardDeduction;

  return (
    <>
      <FormSection
        title="Your deduction"
        tag="Line 34"
        description="You can itemize on your New York return even if you took the standard deduction on your federal return."
      >
        {!state.filingStatus && (
          <Notice>
            <p>Choose a filing status in the “You and filing status” step to see your standard deduction.</p>
          </Notice>
        )}
        <ChoiceGroup<'standard' | 'itemized'>
          legend="Deduction method"
          value={d.choice}
          columns={2}
          onChange={(choice) => updateDeductions({ choice })}
          choices={[
            {
              value: 'standard',
              title: `Standard deduction`,
              description: state.filingStatus ? `${usd(estimate.standardDeduction)} for your filing status.` : 'Set by your filing status.',
            },
            {
              value: 'itemized',
              title: 'Itemized deduction',
              description: 'Your New York itemized deduction from Form IT-196.',
            },
          ]}
        />
        {d.choice === 'itemized' && (
          <CurrencyField
            label="New York itemized deduction (Form IT-196, line 49)"
            value={d.itemizedAmount}
            error={errors['deductions.itemizedAmount']}
            onValueChange={(itemizedAmount) => updateDeductions({ itemizedAmount })}
          />
        )}
        {d.choice === 'itemized' && d.itemizedAmount > 0 && !itemizedBetter && (
          <Notice>
            <p>
              Your itemized deduction is smaller than the standard deduction of {usd(estimate.standardDeduction)}. The
              standard deduction gives you a lower tax.
            </p>
          </Notice>
        )}
      </FormSection>

      <FormSection title="Taxable income" tag="Lines 33–38">
        <AmountLines columns={1}>
          <AmountLine line="33" label="New York adjusted gross income" columns={1} total value={one(estimate.nyAgi.federal)} />
          <AmountLine line="34" label={d.choice === 'itemized' ? 'Itemized deduction' : 'Standard deduction'} columns={1} readOnly value={one(estimate.deduction)} />
          <AmountLine
            line="36"
            label="Dependent exemptions"
            hint={`${state.dependents.length} × $1,000`}
            columns={1}
            readOnly
            value={one(estimate.dependentExemptions)}
          />
          <AmountLine line="38" label="Taxable income" columns={1} total value={one(estimate.taxableIncome)} />
        </AmountLines>
        {estimate.form === 'IT-203' && (
          <Notice>
            <p>
              On IT-203 the tax is first computed on all your income, as if you were a resident. It is then multiplied by
              your income percentage: {(estimate.incomePercentage * 100).toFixed(2)}%.
            </p>
          </Notice>
        )}
      </FormSection>
    </>
  );
};
