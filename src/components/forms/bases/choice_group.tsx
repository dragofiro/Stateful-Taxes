// Radio buttons drawn as cards. Used for questions with a few clear answers.
import React, { useId } from 'react';

export interface Choice<T extends string> {
  value: T;
  title: string;
  description?: string;
  /** Short code at the right, for example the form number. */
  code?: string;
}

interface ChoiceGroupProps<T extends string> {
  legend: string;
  value: T | '';
  choices: ReadonlyArray<Choice<T>>;
  onChange: (value: T) => void;
  error?: string | undefined;
  /** Lays the cards out in a row with this many columns. */
  columns?: number;
}

export function ChoiceGroup<T extends string>({ legend, value, choices, onChange, error, columns }: ChoiceGroupProps<T>) {
  const name = useId();
  return (
    <fieldset
      className={`tf-choices${columns ? ' tf-choices--row' : ''}`}
      style={columns ? ({ '--cols': columns } as React.CSSProperties) : undefined}
      data-invalid={error ? 'true' : undefined}
    >
      <legend>{legend}</legend>
      {choices.map((c) => (
        <label key={c.value} className="tf-choice">
          <input type="radio" name={name} value={c.value} checked={value === c.value} onChange={() => onChange(c.value)} />
          <span className="tf-choice-dot" aria-hidden="true" />
          <span className="tf-choice-text">
            <span className="tf-choice-title">{c.title}</span>
            {c.description && <span className="tf-choice-desc">{c.description}</span>}
          </span>
          {c.code && <span className="tf-choice-code">{c.code}</span>}
        </label>
      ))}
      {error && <p className="tf-error">{error}</p>}
    </fieldset>
  );
}
