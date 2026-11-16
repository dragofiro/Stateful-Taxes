// Step 1: residency. Decides between IT-201 and IT-203, and whether city taxes apply.
import React from 'react';
import { useTaxContext } from '../../../../../context/tax_context.tsx';
import type { LocalResidency, ResidencyStatus } from '../../../../../context/tax_reducer.ts';
import { FormSection } from '../../../bases/form_section.tsx';
import { ChoiceGroup } from '../../../bases/choice_group.tsx';
import { InputField } from '../../../bases/input_field.tsx';
import { Notice } from '../../../bases/notice.tsx';
import type { StepProps } from './step_props.ts';

const LOCAL_CHOICES = (place: string) =>
  [
    { value: 'full', title: 'All year' },
    { value: 'part', title: 'Part of the year' },
    { value: 'none', title: `Not in ${place}` },
  ] as const;

export const ResidencyStep: React.FC<StepProps> = ({ errors }) => {
  const { state, updateResidency, updatePersonalInfo } = useTaxContext();
  const r = state.residency;

  const setStatus = (status: ResidencyStatus) => {
    // Nonresidents do not pay New York City or Yonkers resident tax.
    updateResidency(status === 'non' ? { status, nyc: 'none', yonkers: 'none' } : { status });
  };

  const setNyc = (nyc: LocalResidency) => {
    updateResidency({ nyc });
    if (nyc === 'full') updatePersonalInfo({ nycMonthsLived: '12' });
    if (nyc === 'none') updatePersonalInfo({ nycMonthsLived: '' });
  };

  return (
    <>
      <FormSection title="New York State" description="Your residency decides which return you file. A resident is someone whose permanent home (domicile) is in New York.">
        <ChoiceGroup<Exclude<ResidencyStatus, ''>>
          legend="In 2025, I was a"
          value={r.status}
          error={errors['residency.status']}
          onChange={setStatus}
          choices={[
            {
              value: 'full',
              title: 'Full-year resident',
              description: 'New York was my permanent home for all of 2025.',
              code: 'IT-201',
            },
            {
              value: 'part',
              title: 'Part-year resident',
              description: 'I moved into or out of New York State during 2025.',
              code: 'IT-203',
            },
            {
              value: 'non',
              title: 'Nonresident with New York income',
              description: 'I lived in another state but earned income from New York sources.',
              code: 'IT-203',
            },
          ]}
        />

        {r.status === 'part' && (
          <div className="tf-grid">
            <InputField
              label="Date you moved into New York State"
              type="date"
              optional
              value={r.movedInDate}
              error={errors['residency.movedInDate']}
              onChange={(e) => updateResidency({ movedInDate: e.target.value })}
            />
            <InputField
              label="Date you moved out of New York State"
              type="date"
              optional
              value={r.movedOutDate}
              onChange={(e) => updateResidency({ movedOutDate: e.target.value })}
            />
          </div>
        )}

        {r.status === 'non' && (
          <InputField
            label="State of residence"
            placeholder="e.g. New Jersey"
            value={r.otherStateOfResidence}
            error={errors['residency.otherStateOfResidence']}
            onChange={(e) => updateResidency({ otherStateOfResidence: e.target.value })}
          />
        )}
      </FormSection>

      {r.status && r.status !== 'non' && (
        <FormSection title="New York City and Yonkers" description="Both cities charge their own income tax on residents. It goes on the same return.">
          <ChoiceGroup<Exclude<LocalResidency, ''>>
            legend="Did you live in New York City (the five boroughs)?"
            value={r.nyc}
            columns={3}
            error={errors['residency.nyc']}
            onChange={setNyc}
            choices={LOCAL_CHOICES('New York City')}
          />
          <ChoiceGroup<Exclude<LocalResidency, ''>>
            legend="Did you live in the City of Yonkers?"
            value={r.yonkers}
            columns={3}
            error={errors['residency.yonkers']}
            onChange={(yonkers) => updateResidency({ yonkers })}
            choices={LOCAL_CHOICES('Yonkers')}
          />
        </FormSection>
      )}

      {r.status === 'non' && (
        <Notice title="City taxes">
          <p>
            Nonresidents do not pay New York City resident tax. If you worked in Yonkers, the Yonkers nonresident
            earnings tax (Form Y-203) is not part of this estimate yet.
          </p>
        </Notice>
      )}
    </>
  );
};
