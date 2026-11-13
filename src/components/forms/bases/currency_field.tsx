// Dollar amount input. The value is a whole number of dollars, like the New York forms.
// While the field has focus it keeps the text as typed. On blur it shows the amount with commas.
import React, { useId, useState } from 'react';

interface CurrencyFieldProps {
  label: string;
  value: number;
  onValueChange?: (value: number) => void;
  hint?: string | undefined;
  error?: string | undefined;
  /** Allows losses, for example business or capital losses. */
  allowNegative?: boolean;
  /** Shows a computed value that the filer cannot edit. */
  readOnly?: boolean;
  /** Hides the visible label. The label is still read by screen readers. */
  hideLabel?: boolean;
}

export function formatDollars(value: number): string {
  if (!value) return '';
  return Math.round(value).toLocaleString('en-US');
}

export function parseDollars(text: string, allowNegative = false): number {
  const negative = allowNegative && /^\s*(-|\()/.test(text);
  const digits = text.replace(/[^0-9.]/g, '');
  const n = Math.round(parseFloat(digits) || 0);
  return negative ? -n : n;
}

export const CurrencyField: React.FC<CurrencyFieldProps> = ({
  label,
  value,
  onValueChange,
  hint,
  error,
  allowNegative = false,
  readOnly = false,
  hideLabel = false,
}) => {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? (readOnly ? Math.round(value).toLocaleString('en-US') : formatDollars(value));

  return (
    <div className="tf-field" data-invalid={error ? 'true' : undefined}>
      <label className={hideLabel ? 'tf-sr' : 'tf-label'} htmlFor={id}>
        {label}
      </label>
      <div className="tf-money">
        <input
          id={id}
          className="tf-input"
          type="text"
          inputMode={allowNegative ? 'text' : 'numeric'}
          autoComplete="off"
          placeholder="0"
          readOnly={readOnly}
          value={shown}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          onFocus={() => !readOnly && setDraft(value ? String(value) : '')}
          onBlur={() => setDraft(null)}
          onChange={(e) => {
            const text = e.target.value;
            if (!/^[\s$,0-9.()-]*$/.test(text)) return;
            setDraft(text);
            onValueChange?.(parseDollars(text, allowNegative));
          }}
        />
      </div>
      {hint && !hideLabel && (
        <p className="tf-hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="tf-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};
