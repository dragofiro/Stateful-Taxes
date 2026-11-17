// Step 7: New York State and New York City credits.
import React from 'react';
import { useTaxContext } from '../../../../../context/tax_context.tsx';
import type { TaxState } from '../../../../../context/tax_reducer.ts';
import { FormSection } from '../../../bases/form_section.tsx';
import { CurrencyField } from '../../../bases/currency_field.tsx';
import { Notice } from '../../../bases/notice.tsx';
import type { StepProps } from './step_props.ts';

type CreditKey = keyof TaxState['credits'];

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

export const CreditsStep: React.FC<StepProps> = ({ estimate }) => {
  const { state, updateCredits } = useTaxContext();
  const c = state.credits;
  const r = state.residency;
  const field = (key: CreditKey, label: string, hint?: string) => (
    <CurrencyField label={label} hint={hint} value={c[key]} onValueChange={(v) => updateCredits({ [key]: v })} />
  );

  const it203 = estimate.form === 'IT-203';
  const householdHint = r.claimedAsDependent
    ? 'Not allowed, because someone can claim you as a dependent.'
    : 'Worked out for you from the table in the instructions.';

  return (
    <>
      <FormSection
        title="Credits that lower your tax"
        description="These credits can reduce your New York State tax to zero, but not below. Enter the amounts from the credit forms named under each field. The household credit is worked out for you."
      >
        <div className="tf-grid">
          <CurrencyField
            label="New York State household credit"
            hint={householdHint}
            value={estimate.nysHouseholdCredit}
            onValueChange={() => undefined}
            readOnly
          />
          {it203 && field('childCareCredit', 'Child and dependent care credit', 'From Form IT-216.')}
          {it203 && r.status === 'part' && field('nysEitcOverride', 'New York State earned income credit', 'From Form IT-215.')}
          {field('residentCredit', 'Credit for taxes paid to another state', 'Form IT-112-R. Residents only.')}
          {field('otherNonrefundable', 'Other New York State credits', 'From Form IT-201-ATT or IT-203-ATT.')}
        </div>
      </FormSection>

      <FormSection
        title="Credits paid to you as a refund"
        description="These credits are paid even if they are more than your tax."
      >
        {r.status === 'full' && (
          <>
            {field('federalEic', 'Federal earned income credit', 'From your federal Form 1040.')}
            <Notice>
              <p>
                New York pays 30% of your federal credit, less the household credit. Your New York State earned income credit is{' '}
                <strong>{usd(estimate.nysEitc)}</strong>.
              </p>
            </Notice>
          </>
        )}
        <div className="tf-grid">
          {field('empireStateChildCredit', 'Empire State child credit', 'From Form IT-213.')}
          {!it203 && field('childCareCredit', 'Child and dependent care credit', 'From Form IT-216.')}
          {r.status !== 'non' && field('collegeTuitionCredit', 'College tuition credit', 'From Form IT-272.')}
          {r.status === 'full' && field('realPropertyCredit', 'Real property tax credit', 'From Form IT-214.')}
          {field('otherRefundable', 'Other refundable credits', 'From Form IT-201-ATT or IT-203-ATT.')}
        </div>
      </FormSection>

      {(r.nyc === 'full' || r.nyc === 'part') && (
        <FormSection title="New York City credits">
          <Notice>
            <p>
              {estimate.nycSchoolCredit > 0
                ? `You get the New York City school tax credit of ${usd(estimate.nycSchoolCredit)}${
                    estimate.nycSchoolRateReduction > 0
                      ? ` and the rate reduction amount of ${usd(estimate.nycSchoolRateReduction)}`
                      : ''
                  }. They are added for you.`
                : 'The New York City school tax credit does not apply, because your income is over $250,000 or someone can claim you as a dependent.'}
            </p>
          </Notice>
          <div className="tf-grid">
            {r.nyc === 'full' && (
              <CurrencyField
                label="New York City household credit"
                hint={householdHint}
                value={estimate.nycHouseholdCredit}
                onValueChange={() => undefined}
                readOnly
              />
            )}
            {field('nycEitc', 'New York City earned income credit', 'From Form IT-215.')}
            {field('nycOtherNonrefundable', 'Other New York City credits', 'From Form IT-201-ATT.')}
          </div>
        </FormSection>
      )}
    </>
  );
};
