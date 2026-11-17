// Running estimate of the return, shown beside every step.
import React, { useState } from 'react';
import type { NyEstimate } from './ny_calculator.ts';

const usd = (n: number) => `$${Math.abs(Math.round(n)).toLocaleString('en-US')}`;
const signed = (n: number) => (n < 0 ? `−${usd(n)}` : usd(n));

interface RowProps {
  label: string;
  value: string;
  strong?: boolean;
}

const Row: React.FC<RowProps> = ({ label, value, strong }) => (
  <div className={`tf-estimate-row${strong ? ' tf-estimate-row--strong' : ''}`}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

export const EstimateRail: React.FC<{ estimate: NyEstimate; showCity: boolean; showYonkers: boolean }> = ({
  estimate: e,
  showCity,
  showYonkers,
}) => {
  const [open, setOpen] = useState(false);
  const balanceKind = !e.ready ? 'none' : e.balance >= 0 ? 'refund' : 'owe';
  const headline = !e.ready ? 'Estimated refund' : e.balance >= 0 ? 'Estimated refund' : 'Estimated amount owed';

  return (
    <aside className="tf-estimate" aria-label="Your estimate" data-balance={balanceKind} data-open={open}>
      <div className="tf-estimate-head">
        <p className="tf-estimate-label">{headline}</p>
        <p className="tf-estimate-amount" aria-live="polite">
          {e.ready ? usd(e.balance) : '—'}
        </p>
        <p className="tf-estimate-sub">
          {e.ready ? `${e.form} · updates as you type` : 'Choose a filing status to see your estimate.'}
        </p>
        <button type="button" className="tf-btn tf-btn--quiet tf-estimate-toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? 'Hide details' : 'Show details'}
        </button>
      </div>
      <div className="tf-estimate-body">
        <p className="tf-estimate-group">Income</p>
        <Row label="Federal AGI" value={signed(e.federalAgi.federal)} />
        <Row label="NY additions" value={usd(e.additions.federal)} />
        <Row label="NY subtractions" value={usd(e.subtractions.federal)} />
        <Row label="New York AGI" value={signed(e.nyAgi.federal)} strong />
        {e.form === 'IT-203' && <Row label="NY source income" value={signed(e.nyAgi.nySource)} />}

        <p className="tf-estimate-group">Tax</p>
        <Row label={e.deductionKind === 'itemized' ? 'Itemized deduction' : 'Standard deduction'} value={`−${usd(e.deduction)}`} />
        {e.dependentExemptions > 0 && <Row label="Dependent exemptions" value={`−${usd(e.dependentExemptions)}`} />}
        <Row label="Taxable income" value={usd(e.taxableIncome)} strong />
        {e.form === 'IT-203' && <Row label="Income percentage" value={`${(e.incomePercentage * 100).toFixed(2)}%`} />}
        <Row label="New York State tax" value={usd(e.nysTax)} />
        {e.nysNonrefundableCredits > 0 && <Row label="NYS credits" value={`−${usd(Math.min(e.nysNonrefundableCredits, e.nysTax))}`} />}
        {showCity && <Row label="New York City tax" value={usd(e.nycTaxAfterCredits)} />}
        {showYonkers && <Row label="Yonkers surcharge" value={usd(e.yonkersTax)} />}
        {e.salesUseTax > 0 && <Row label="Sales or use tax" value={usd(e.salesUseTax)} />}
        <Row label="Total tax" value={usd(e.totalTax)} strong />

        <p className="tf-estimate-group">Paid</p>
        <Row label="Tax withheld" value={usd(e.withholding.state + e.withholding.nyc + e.withholding.yonkers)} />
        {e.estimatedPayments > 0 && <Row label="Estimated payments" value={usd(e.estimatedPayments)} />}
        <Row label="Refundable credits" value={usd(e.refundableCredits)} />
        <Row label="Total paid" value={usd(e.totalPayments)} strong />

        {e.notes.length > 0 && (
          <ul className="tf-estimate-notes">
            {e.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};
