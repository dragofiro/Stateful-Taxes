// Step 4: federal income (lines 1 to 19), with the New York amount column for IT-203.
import React from 'react';
import { useTaxContext } from '../../../../../context/tax_context.tsx';
import type { IncomeLineKey } from '../../../../../context/tax_reducer.ts';
import { FormSection } from '../../../bases/form_section.tsx';
import { AmountLine, AmountLines } from '../../../bases/amount_lines.tsx';
import { Notice } from '../../../bases/notice.tsx';
import { EmployerWitholdingField } from '../../../fields/employer_witholding.tsx';
import type { StepProps } from './step_props.ts';

interface LineDef {
  key: IncomeLineKey;
  line: string;
  label: string;
  hint?: string;
  negative?: boolean;
}

const OTHER_LINES: LineDef[] = [
  { key: 'taxableInterest', line: '2', label: 'Taxable interest' },
  { key: 'ordinaryDividends', line: '3', label: 'Ordinary dividends' },
  { key: 'taxableRefunds', line: '4', label: 'Taxable refunds of state and local income taxes', hint: 'Subtracted again on line 25.' },
  { key: 'alimonyReceived', line: '5', label: 'Alimony received' },
  { key: 'businessIncome', line: '6', label: 'Business income or loss', hint: 'From federal Schedule C.', negative: true },
  { key: 'capitalGain', line: '7', label: 'Capital gain or loss', negative: true },
  { key: 'otherGains', line: '8', label: 'Other gains or losses', negative: true },
  { key: 'iraDistributions', line: '9', label: 'Taxable IRA distributions' },
  { key: 'pensionsAnnuities', line: '10', label: 'Taxable pensions and annuities' },
  { key: 'rentalPartnership', line: '11', label: 'Rental real estate, royalties, partnerships, S corporations, trusts', negative: true },
  { key: 'farmIncome', line: '13', label: 'Farm income or loss', negative: true },
  { key: 'unemployment', line: '14', label: 'Unemployment compensation' },
  { key: 'socialSecurity', line: '15', label: 'Taxable Social Security benefits', hint: 'New York does not tax these. Subtracted again on line 27.' },
  { key: 'otherIncome', line: '16', label: 'Other income', negative: true },
];

export const IncomeStep: React.FC<StepProps> = ({ estimate }) => {
  const { state, updateIncomeLine, updateAdjustments } = useTaxContext();
  const cols = estimate.form === 'IT-203' ? 2 : 1;
  const hasW2 = state.employers.length > 0;
  const lines = state.income.lines;

  return (
    <>
      <FormSection title="W-2 wages" tag="Line 1" description="Add each W-2. The withholding on it also counts as tax already paid.">
        <EmployerWitholdingField />
      </FormSection>

      <FormSection
        title="Other income"
        tag="Lines 1–19"
        description={
          cols === 2
            ? 'Copy each amount from your federal return. In the New York column, enter only the part from New York sources, or earned while you lived in New York.'
            : 'Copy each amount from your federal Form 1040 and its schedules. Leave lines that do not apply empty.'
        }
      >
        {cols === 2 && (
          <Notice>
            <p>
              Part-year residents: the New York amount is all income from the time you lived in New York, plus New York
              source income from the rest of the year.
            </p>
          </Notice>
        )}
        <AmountLines columns={cols}>
          <AmountLine
            line="1"
            label="Wages, salaries, tips"
            hint={hasW2 ? 'Total of your W-2 forms (box 1 and box 16).' : 'Or add your W-2 forms above.'}
            columns={cols}
            readOnly={hasW2}
            value={hasW2 ? estimate.wagesFromW2 : lines.wages}
            onChange={(v) => updateIncomeLine('wages', v)}
          />
          {OTHER_LINES.map((l) => (
            <AmountLine
              key={l.key}
              line={l.line}
              label={l.label}
              hint={l.hint}
              columns={cols}
              allowNegative={l.negative ?? false}
              value={lines[l.key]}
              onChange={(v) => updateIncomeLine(l.key, v)}
            />
          ))}
          <AmountLine line="17" label="Total income" columns={cols} total value={estimate.federalIncome} />
          <AmountLine
            line="18"
            label="Total federal adjustments to income"
            hint="From federal Schedule 1, for example student loan interest or IRA contributions."
            columns={cols}
            value={state.income.adjustments}
            onChange={updateAdjustments}
          />
          <AmountLine line="19" label="Federal adjusted gross income" columns={cols} total value={estimate.federalAgi} />
        </AmountLines>
      </FormSection>
    </>
  );
};
