// Step 2: filing status, name, spouse and addresses.
import React from 'react';
import { useTaxContext } from '../../../../../context/tax_context.tsx';
import type { FilingStatus } from '../../../../../context/tax_reducer.ts';
import { FormSection } from '../../../bases/form_section.tsx';
import { ChoiceGroup } from '../../../bases/choice_group.tsx';
import { CheckboxField } from '../../../bases/checkbox_field.tsx';
import { InputField } from '../../../bases/input_field.tsx';
import { PrimaryInfoField } from '../../../fields/primary_info.tsx';
import { SpouseInfoField } from '../../../fields/spouse_info.tsx';
import { MailingAddressField } from '../../../fields/mailing_address.tsx';
import { HomeAddressField } from '../../../fields/home_address.tsx';
import type { StepProps } from './step_props.ts';

export const FILING_STATUS_LABELS: Record<Exclude<FilingStatus, ''>, string> = {
  '1': 'Single',
  '2': 'Married filing jointly',
  '3': 'Married filing separately',
  '4': 'Head of household',
  '5': 'Qualifying surviving spouse',
};

export const FilerStep: React.FC<StepProps> = ({ errors }) => {
  const { state, updateFilingStatus, updateResidency, updatePersonalInfo } = useTaxContext();
  const status = state.filingStatus;
  const married = status === '2' || status === '3';
  const r = state.residency;

  return (
    <>
      <FormSection title="Filing status" tag="Item A" description="Use the same filing status as on your federal return, with one exception: some married couples must file separately in New York. The instructions explain when.">
        <ChoiceGroup<Exclude<FilingStatus, ''>>
          legend="Filing status"
          value={status}
          error={errors['filingStatus']}
          onChange={updateFilingStatus}
          choices={[
            { value: '1', title: FILING_STATUS_LABELS['1'], code: '①' },
            { value: '2', title: FILING_STATUS_LABELS['2'], description: 'One return for both spouses.', code: '②' },
            { value: '3', title: FILING_STATUS_LABELS['3'], code: '③' },
            { value: '4', title: FILING_STATUS_LABELS['4'], description: 'Unmarried, and you paid more than half the cost of a home for a qualifying person.', code: '④' },
            { value: '5', title: FILING_STATUS_LABELS['5'], description: 'Your spouse died in 2023 or 2024 and you have a dependent child.', code: '⑤' },
          ]}
        />
        {status === '1' && (
          <CheckboxField
            label="Someone else can claim me as a dependent"
            description="For example, a parent. This lowers your standard deduction to $3,100."
            checked={r.claimedAsDependent}
            onChange={(e) => updateResidency({ claimedAsDependent: e.target.checked })}
          />
        )}
      </FormSection>

      <FormSection title="Your information" description="Enter your name as it appears on your Social Security card.">
        <PrimaryInfoField errors={errors} showResidenceFields={r.status !== 'non'} />
        {r.nyc === 'part' && (
          <InputField
            label="Months you lived in New York City in 2025"
            inputMode="numeric"
            maxLength={2}
            hint="Item F on the return."
            value={state.personalInfo.nycMonthsLived}
            error={errors['personalInfo.nycMonthsLived']}
            onChange={(e) => updatePersonalInfo({ nycMonthsLived: e.target.value.replace(/\D/g, '') })}
          />
        )}
      </FormSection>

      {married && (
        <FormSection title="Your spouse" description={status === '3' ? 'Married filing separately still needs your spouse’s name and SSN.' : undefined}>
          <SpouseInfoField errors={errors} />
        </FormSection>
      )}

      <FormSection title="Mailing address" description="The Tax Department sends letters and paper refund checks here.">
        <MailingAddressField errors={errors} />
      </FormSection>

      <FormSection title="Permanent home address">
        <HomeAddressField errors={errors} />
      </FormSection>
    </>
  );
};
