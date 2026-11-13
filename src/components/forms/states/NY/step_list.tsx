// Step list beside the form. On narrow screens a progress bar replaces it.
import React from 'react';
import { NY_STEPS, STAGES, LATER_STEPS, type StepId } from './ny_steps.ts';

export type StepState = 'todo' | 'done' | 'issue';

interface StepListProps {
  current: StepId;
  states: Record<StepId, StepState>;
  onSelect: (step: StepId) => void;
}

export const StepList: React.FC<StepListProps> = ({ current, states, onSelect }) => {
  let number = 0;
  const index = NY_STEPS.findIndex((s) => s.id === current);
  return (
    <>
      <nav className="tf-steps" aria-label="Filing steps">
        {STAGES.map((stage) => (
          <div key={stage.id}>
            <p className="tf-steps-stage">{stage.label}</p>
            <ol className="tf-steps-list">
              {NY_STEPS.filter((s) => s.stage === stage.id).map((s) => {
                number += 1;
                const state = states[s.id];
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      className="tf-step-link"
                      data-state={state}
                      aria-current={s.id === current ? 'step' : undefined}
                      onClick={() => onSelect(s.id)}
                    >
                      <span className="tf-step-mark" aria-hidden="true">
                        {state === 'done' && s.id !== current ? '✓' : state === 'issue' && s.id !== current ? '!' : number}
                      </span>
                      {s.navLabel}
                      {state === 'issue' && <span className="tf-sr"> (needs information)</span>}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
        <p className="tf-steps-stage">Finish</p>
        <ol className="tf-steps-list">
          {LATER_STEPS.map((label) => (
            <li key={label}>
              <button type="button" className="tf-step-link" disabled>
                <span className="tf-step-mark" aria-hidden="true" />
                {label}
                <span className="tf-step-later">Soon</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
      <div className="tf-progress" aria-hidden="true">
        <div className="tf-progress-bar">
          <div className="tf-progress-fill" style={{ width: `${((index + 1) / NY_STEPS.length) * 100}%` }} />
        </div>
      </div>
    </>
  );
};
