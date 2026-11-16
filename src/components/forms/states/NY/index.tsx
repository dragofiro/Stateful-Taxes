// New York filing workflow: the beginning stage (residency, filer, household) and the middle stage
// (income, New York adjustments, deductions, credits, payments), with a running estimate beside each step.
// The final stage (review, sign and print the PDF) comes later.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '@fontsource-variable/newsreader/opsz.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '../../bases/forms.css';
import { useTaxContext } from '../../../../context/tax_context.tsx';
import { FormWrapper } from '../../bases/form_wrapper.tsx';
import { Notice } from '../../bases/notice.tsx';
import { estimateNyReturn } from './ny_calculator.ts';
import { NY_TAX_YEAR } from './ny_rates_2025.ts';
import { NY_STEPS, isStepId, validateStep, type StepId } from './ny_steps.ts';
import { StepList, type StepState } from './step_list.tsx';
import { EstimateRail } from './estimate_rail.tsx';
import { ResidencyStep } from './steps/residency_step.tsx';
import { FilerStep } from './steps/filer_step.tsx';
import { HouseholdStep } from './steps/household_step.tsx';
import { IncomeStep } from './steps/income_step.tsx';
import { AdjustmentsStep } from './steps/adjustments_step.tsx';
import { DeductionsStep } from './steps/deductions_step.tsx';
import { CreditsStep } from './steps/credits_step.tsx';
import { PaymentsStep } from './steps/payments_step.tsx';
import { CheckpointStep } from './steps/checkpoint_step.tsx';

const LEDES: Record<StepId, string> = {
  start: 'New York has one return for full-year residents and another for everyone else. Three questions decide which one is yours.',
  filer: 'Your filing status sets your standard deduction and your tax rates.',
  household: 'Dependents lower your taxable income and can qualify you for credits.',
  income: 'New York starts from the income on your federal return. Have your federal Form 1040 and your W-2 forms ready.',
  'ny-adjustments': 'New York taxes some income that the federal return does not, and the other way round.',
  deductions: 'Your deduction and dependent exemptions come off your New York AGI to give your taxable income.',
  credits: 'Credits come off your tax dollar for dollar. Some are paid to you even if you owe no tax.',
  payments: 'Everything you already paid toward your 2025 New York tax.',
  checkpoint: 'You finished the income and credits stage. Fix any open steps, then review and print in the next stage.',
};

interface NYStateFormProps {
  onBack?: () => void;
}

export const NYStateForm: React.FC<NYStateFormProps> = ({ onBack }) => {
  const { state, goToStep, loadFullData, resetForm } = useTaxContext();
  const current: StepId = isStepId(state.workflow.currentStep) ? state.workflow.currentStep : 'start';
  const [attempted, setAttempted] = useState<ReadonlySet<StepId>>(() => new Set());
  const [message, setMessage] = useState<string | null>(null);
  const issuesRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const estimate = useMemo(() => estimateNyReturn(state), [state]);
  const index = NY_STEPS.findIndex((s) => s.id === current);
  const step = NY_STEPS[index] ?? NY_STEPS[0]!;
  const errors = attempted.has(current) ? validateStep(current, state) : {};
  const errorList = Object.values(errors);

  // The landing page and this workflow are white. The dark dashboard keeps its own body.
  useEffect(() => {
    document.body.classList.add('tf-body');
    return () => document.body.classList.remove('tf-body');
  }, []);

  // Move to the top of the new step and put focus on its title, so screen readers announce it.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    document.querySelector<HTMLElement>('[data-step-title]')?.focus({ preventScroll: true });
  }, [current]);

  const stepStates = useMemo(() => {
    const out = {} as Record<StepId, StepState>;
    for (const s of NY_STEPS) {
      const visited = state.workflow.visited.includes(s.id);
      if (!visited) out[s.id] = 'todo';
      else out[s.id] = Object.keys(validateStep(s.id, state)).length > 0 ? 'issue' : 'done';
    }
    return out;
  }, [state]);

  const go = useCallback(
    (id: StepId) => {
      // Leaving a step marks it as attempted, so its problems show when the filer comes back.
      setAttempted((prev) => new Set(prev).add(current));
      goToStep(id);
    },
    [current, goToStep],
  );

  const next = () => {
    const problems = validateStep(current, state);
    if (Object.keys(problems).length > 0) {
      setAttempted((prev) => new Set(prev).add(current));
      requestAnimationFrame(() => issuesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
      return;
    }
    const following = NY_STEPS[index + 1];
    if (following) go(following.id);
  };

  const back = () => {
    const previous = NY_STEPS[index - 1];
    if (previous) go(previous.id);
  };

  const saveJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stateful-taxes-ny-${NY_TAX_YEAR}-draft.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const openJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    file
      .text()
      .then((text) => {
        loadFullData(JSON.parse(text));
        setAttempted(new Set());
        setMessage(`Opened ${file.name}.`);
      })
      .catch(() => setMessage('That file is not a Stateful Taxes draft.'));
  };

  const startOver = () => {
    if (window.confirm('Start over? This deletes the draft saved in this browser. Download a copy first if you want to keep it.')) {
      resetForm();
      setAttempted(new Set());
      setMessage(null);
    }
  };

  const stepProps = { errors, estimate };
  const nextStep = NY_STEPS[index + 1];

  return (
    <div className="tf">
      <header className="tf-topbar">
        <div className="tf-topbar-inner">
          {onBack && (
            <button type="button" className="tf-btn tf-btn--ghost tf-btn--small" onClick={onBack}>
              ← All states
            </button>
          )}
          <span className="tf-wordmark">Stateful Taxes</span>
          <span className="tf-topbar-meta">
            New York · {NY_TAX_YEAR} · {estimate.form}
          </span>
          <span className="tf-topbar-spacer" />
          <span className="tf-saved">Saved in this browser</span>
          <label className="tf-btn tf-btn--quiet tf-file-btn tf-topbar-hide-narrow">
            Open draft
            <input type="file" accept=".json,application/json" onChange={openJson} />
          </label>
          <button type="button" className="tf-btn tf-btn--quiet" onClick={saveJson}>
            Download draft
          </button>
          <button type="button" className="tf-btn tf-btn--quiet tf-topbar-hide-narrow" onClick={startOver}>
            Start over
          </button>
        </div>
      </header>

      <div className="tf-layout">
        <StepList current={current} states={stepStates} onSelect={go} />

        <main className="tf-main">
          {message && (
            <Notice>
              <p>{message}</p>
            </Notice>
          )}
          <FormWrapper
            eyebrow={`Step ${index + 1} of ${NY_STEPS.length} · ${step.navLabel}`}
            title={step.title}
            lede={LEDES[current]}
          >
            {errorList.length > 0 && (
              <div ref={issuesRef}>
                <Notice tone="error" title="Before you continue">
                  <ul>
                    {errorList.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </Notice>
              </div>
            )}

            {current === 'start' && <ResidencyStep {...stepProps} />}
            {current === 'filer' && <FilerStep {...stepProps} />}
            {current === 'household' && <HouseholdStep {...stepProps} />}
            {current === 'income' && <IncomeStep {...stepProps} />}
            {current === 'ny-adjustments' && <AdjustmentsStep {...stepProps} />}
            {current === 'deductions' && <DeductionsStep {...stepProps} />}
            {current === 'credits' && <CreditsStep {...stepProps} />}
            {current === 'payments' && <PaymentsStep {...stepProps} />}
            {current === 'checkpoint' && <CheckpointStep {...stepProps} onEdit={go} onSaveJson={saveJson} />}
          </FormWrapper>

          <nav className="tf-step-nav" aria-label="Step navigation">
            {index > 0 ? (
              <button type="button" className="tf-btn tf-btn--ghost" onClick={back}>
                ← Back
              </button>
            ) : (
              <span />
            )}
            {nextStep ? (
              <div className="tf-step-nav-next">
                <span className="tf-step-nav-label">Next: {nextStep.navLabel}</span>
                <button type="button" className="tf-btn" onClick={next}>
                  Continue →
                </button>
              </div>
            ) : (
              <button type="button" className="tf-btn" disabled title="Review and printing come in the next stage.">
                Review and print (coming soon)
              </button>
            )}
          </nav>
        </main>

        <EstimateRail
          estimate={estimate}
          showCity={state.residency.nyc === 'full'}
          showYonkers={state.residency.yonkers === 'full'}
        />
      </div>

      <footer className="tf-footer">
        Everything you enter stays on your computer. Stateful Taxes is not affiliated with the IRS or the New York State
        Department of Taxation and Finance. Check every form before you mail it.
      </footer>
    </div>
  );
};

export default NYStateForm;
