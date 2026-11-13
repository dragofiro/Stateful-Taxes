// Rows of numbered form lines with one or two amount columns.
// IT-201 has one column (federal amount). IT-203 adds the New York State amount column.
import React, { type ReactNode } from 'react';
import { CurrencyField } from './currency_field.tsx';

interface AmountPairValue {
  federal: number;
  nySource: number;
}

interface AmountLinesProps {
  /** 1 for IT-201, 2 for IT-203. */
  columns: 1 | 2;
  children: ReactNode;
}

export const AmountLines: React.FC<AmountLinesProps> = ({ columns, children }) => (
  <div className="tf-lines" data-columns={columns}>
    <div className="tf-line tf-line-head" aria-hidden="true">
      <span>Line</span>
      <span>Item</span>
      <span>Federal amount</span>
      {columns === 2 && <span>New York amount</span>}
    </div>
    {children}
  </div>
);

interface AmountLineProps {
  line: string;
  label: string;
  hint?: string | undefined;
  columns: 1 | 2;
  value: AmountPairValue;
  onChange?: (value: Partial<AmountPairValue>) => void;
  allowNegative?: boolean;
  readOnly?: boolean;
  error?: string | undefined;
  total?: boolean;
}

export const AmountLine: React.FC<AmountLineProps> = ({
  line,
  label,
  hint,
  columns,
  value,
  onChange,
  allowNegative,
  readOnly,
  error,
  total,
}) => (
  <div className={`tf-line${total ? ' tf-line--total' : ''}`}>
    <span className="tf-line-no">{line}</span>
    <div className="tf-line-label">
      {label}
      {hint && <p className="tf-hint">{hint}</p>}
    </div>
    {total ? (
      <>
        <span className="tf-line-value">{formatSigned(value.federal)}</span>
        {columns === 2 && <span className="tf-line-value">{formatSigned(value.nySource)}</span>}
      </>
    ) : (
      <>
        <CurrencyField
          label={`${label}, federal amount`}
          hideLabel
          value={value.federal}
          allowNegative={allowNegative ?? false}
          readOnly={readOnly ?? false}
          onValueChange={(federal) => onChange?.({ federal })}
        />
        {columns === 2 && (
          <CurrencyField
            label={`${label}, New York amount`}
            hideLabel
            value={value.nySource}
            allowNegative={allowNegative ?? false}
            readOnly={readOnly ?? false}
            onValueChange={(nySource) => onChange?.({ nySource })}
          />
        )}
      </>
    )}
    {error && <p className="tf-error">{error}</p>}
  </div>
);

export function formatSigned(n: number): string {
  const s = `$${Math.abs(Math.round(n)).toLocaleString('en-US')}`;
  return n < 0 ? `−${s}` : s;
}
