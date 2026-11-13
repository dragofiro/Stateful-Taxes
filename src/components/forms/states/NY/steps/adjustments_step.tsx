// Step 5: New York additions (lines 20 to 24) and subtractions (lines 25 to 33).
import React from 'react';
import { useTaxContext } from '../../../../../context/tax_context.tsx';
import type { AdditionKey, SubtractionKey } from '../../../../../context/tax_reducer.ts';
import { FormSection } from '../../../bases/form_section.tsx';
import { AmountLine, AmountLines } from '../../../bases/amount_lines.tsx';
import { effectiveIncomeLines } from '../ny_calculator.ts';
import type { StepProps } from './step_props.ts';

const ADDITIONS: Array<{ key: AdditionKey; line: string; label: string; hint?: string }> = [
  { key: 'otherStateBondInterest', line: '20', label: 'Interest on bonds of other states and their cities', hint: 'Bonds of New York State and its localities do not count.' },
  { key: 'publicEmployee414h', line: '21', label: 'Public employee 414(h) retirement contributions', hint: 'Often in W-2 box 14.' },
  { key: 'nys529Distributions', line: '22', label: 'New York 529 college savings distributions not used for school' },
  { key: 'otherAdditions', line: '23', label: 'Other additions', hint: 'From Form IT-225.' },
];

const SUBTRACTIONS: Array<{ key: SubtractionKey; line: string; label: string; hint?: string }> = [
  { key: 'governmentPensions', line: '26', label: 'Pensions from New York State, its localities, or the federal government' },
  { key: 'usBondInterest', line: '28', label: 'Interest on U.S. government bonds' },
  { key: 'pensionExclusion', line: '29', label: 'Pension and annuity income exclusion', hint: 'Up to $20,000 for each person aged 59½ or older.' },
  { key: 'nys529Deduction', line: '30', label: 'New York 529 college savings contributions', hint: 'Up to $5,000, or $10,000 if married filing jointly.' },
  { key: 'otherSubtractions', line: '31', label: 'Other subtractions', hint: 'From Form IT-225.' },
];

export const AdjustmentsStep: React.FC<StepProps> = ({ errors, estimate }) => {
  const { state, updateAddition, updateSubtraction } = useTaxContext();
  const cols = estimate.form === 'IT-203' ? 2 : 1;
  const lines = effectiveIncomeLines(state);
  const copy = (p: { federal: number; nySource: number }) => (cols === 2 ? p : { federal: p.federal, nySource: p.federal });

  return (
    <>
      <FormSection title="Additions" tag="Lines 20–24" description="Income that New York taxes but your federal return did not.">
        <AmountLines columns={cols}>
          {ADDITIONS.map((a) => (
            <AmountLine
              key={a.key}
              line={a.line}
              label={a.label}
              hint={a.hint}
              columns={cols}
              value={state.modifications.additions[a.key]}
              onChange={(v) => updateAddition(a.key, v)}
            />
          ))}
          <AmountLine line="24" label="Total additions" columns={cols} total value={estimate.additions} />
        </AmountLines>
      </FormSection>

      <FormSection title="Subtractions" tag="Lines 25–32" description="Income that your federal return taxed but New York does not.">
        <AmountLines columns={cols}>
          <AmountLine line="25" label="Taxable refunds of state and local income taxes" hint="Copied from line 4." columns={cols} readOnly value={copy(lines.taxableRefunds)} />
          {SUBTRACTIONS.slice(0, 1).map((s) => (
            <AmountLine key={s.key} line={s.line} label={s.label} hint={s.hint} columns={cols} value={state.modifications.subtractions[s.key]} onChange={(v) => updateSubtraction(s.key, v)} />
          ))}
          <AmountLine line="27" label="Taxable Social Security benefits" hint="Copied from line 15." columns={cols} readOnly value={copy(lines.socialSecurity)} />
          {SUBTRACTIONS.slice(1).map((s) => (
            <AmountLine
              key={s.key}
              line={s.line}
              label={s.label}
              hint={s.hint}
              columns={cols}
              value={state.modifications.subtractions[s.key]}
              error={errors[`subtractions.${s.key}`]}
              onChange={(v) => updateSubtraction(s.key, v)}
            />
          ))}
          <AmountLine line="32" label="Total subtractions" columns={cols} total value={estimate.subtractions} />
        </AmountLines>
      </FormSection>

      <FormSection title="New York adjusted gross income" tag="Line 33">
        <AmountLines columns={cols}>
          <AmountLine line="19" label="Federal adjusted gross income" columns={cols} total value={estimate.federalAgi} />
          <AmountLine line="33" label="New York adjusted gross income" hint="Line 19, plus additions, minus subtractions." columns={cols} total value={estimate.nyAgi} />
        </AmountLines>
      </FormSection>
    </>
  );
};
