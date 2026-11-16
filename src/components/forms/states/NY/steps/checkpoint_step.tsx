// Step 9: checkpoint at the end of the middle stage. Shows the estimate and what is left to do.
import React from 'react';
import { useTaxContext } from '../../../../../context/tax_context.tsx';
import { FormSection } from '../../../bases/form_section.tsx';
import { Notice } from '../../../bases/notice.tsx';
import { NY_STEPS, LATER_STEPS, validateStep, type StepId } from '../ny_steps.ts';
import type { StepProps } from './step_props.ts';

const usd = (n: number) => `$${Math.abs(Math.round(n)).toLocaleString('en-US')}`;

interface CheckpointStepProps extends StepProps {
  onEdit: (step: StepId) => void;
  onSaveJson: () => void;
}

export const CheckpointStep: React.FC<CheckpointStepProps> = ({ estimate, onEdit, onSaveJson }) => {
  const { state } = useTaxContext();
  const steps = NY_STEPS.filter((s) => s.id !== 'checkpoint');
  const open = steps.filter((s) => Object.keys(validateStep(s.id, state)).length > 0);

  return (
    <>
      <FormSection title="Your numbers so far" tag={estimate.form}>
        <div className="tf-summary-grid">
          <div className="tf-stat">
            <p className="tf-stat-label">New York AGI</p>
            <p className="tf-stat-value">{usd(estimate.nyAgi.federal)}</p>
          </div>
          <div className="tf-stat">
            <p className="tf-stat-label">Taxable income</p>
            <p className="tf-stat-value">{usd(estimate.taxableIncome)}</p>
          </div>
          <div className="tf-stat">
            <p className="tf-stat-label">Total tax</p>
            <p className="tf-stat-value">{usd(estimate.totalTax)}</p>
          </div>
          <div className="tf-stat">
            <p className="tf-stat-label">Payments and credits</p>
            <p className="tf-stat-value">{usd(estimate.totalPayments)}</p>
          </div>
          {estimate.form === 'IT-203' && (
            <div className="tf-stat">
              <p className="tf-stat-label">Income percentage</p>
              <p className="tf-stat-value">{(estimate.incomePercentage * 100).toFixed(2)}%</p>
            </div>
          )}
          <div className="tf-stat">
            <p className="tf-stat-label">{estimate.balance >= 0 ? 'Estimated refund' : 'Estimated amount owed'}</p>
            <p className="tf-stat-value" style={{ color: estimate.balance >= 0 ? 'var(--tf-good)' : 'var(--tf-owe)' }}>
              {usd(estimate.balance)}
            </p>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Steps"
        description={open.length ? `${open.length} step${open.length > 1 ? 's need' : ' needs'} more information before you can review and print.` : 'Every step has the information it needs.'}
      >
        <ul className="tf-check-list">
          {steps.map((s) => {
            const issues = Object.keys(validateStep(s.id, state)).length;
            return (
              <li key={s.id}>
                <span className="tf-status-dot" data-state={issues ? 'issue' : 'done'} />
                <span>
                  {s.navLabel}
                  {issues > 0 && <span className="tf-hint"> · {issues} to fix</span>}
                </span>
                <button type="button" className="tf-btn tf-btn--quiet" onClick={() => onEdit(s.id)}>
                  {issues ? 'Fix' : 'Edit'}
                </button>
              </li>
            );
          })}
          {LATER_STEPS.map((label) => (
            <li key={label}>
              <span className="tf-status-dot" data-state="later" />
              <span style={{ color: 'var(--tf-faint)' }}>{label}</span>
              <span className="tf-step-later" style={{ marginLeft: 'auto' }}>
                Next stage
              </span>
            </li>
          ))}
        </ul>
      </FormSection>

      <FormSection title="Keep a copy" description="Your draft is saved in this browser. Download it to move to another computer, or to start next year's return faster.">
        <div>
          <button type="button" className="tf-btn tf-btn--ghost" onClick={onSaveJson}>
            Download draft (.json)
          </button>
        </div>
      </FormSection>

      {estimate.notes.length > 0 && (
        <Notice title="About this estimate">
          <ul>
            {estimate.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </Notice>
      )}
    </>
  );
};
