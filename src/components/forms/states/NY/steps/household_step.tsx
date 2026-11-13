// Step 3: dependents (Item H).
import React from 'react';
import { FormSection } from '../../../bases/form_section.tsx';
import { Notice } from '../../../bases/notice.tsx';
import { DependantInfoField } from '../../../fields/dependant_info.tsx';
import { NYS_DEPENDENT_EXEMPTION } from '../ny_rates_2025.ts';
import type { StepProps } from './step_props.ts';

export const HouseholdStep: React.FC<StepProps> = ({ estimate }) => (
  <>
    <FormSection
      title="Dependents"
      tag="Item H"
      description="List everyone you claim as a dependent on your federal return. Do not list yourself or your spouse."
    >
      <DependantInfoField />
    </FormSection>
    <Notice title="What this changes">
      <p>
        Each dependent lowers your New York taxable income by ${NYS_DEPENDENT_EXEMPTION.toLocaleString()}. Your
        dependents now reduce it by ${estimate.dependentExemptions.toLocaleString()}. Children can also qualify you for
        the Empire State child credit, which you enter in the Credits step.
      </p>
    </Notice>
  </>
);
