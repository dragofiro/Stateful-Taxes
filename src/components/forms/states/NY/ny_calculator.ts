// Estimates a New York return (IT-201 or IT-203) from the current draft.
// Every line is rounded to whole dollars, as on the paper form.
import {
  INCOME_LINE_KEYS,
  ADDITION_KEYS,
  SUBTRACTION_KEYS,
  type AmountPair,
  type FilingStatus,
  type TaxState,
} from '../../../../context/tax_reducer.ts';
import {
  NYS_BRACKETS,
  NYC_BRACKETS,
  NYS_STANDARD_DEDUCTION,
  NYS_DEPENDENT_FILER_DEDUCTION,
  NYS_DEPENDENT_EXEMPTION,
  NYS_SUPPLEMENTAL_TAX_THRESHOLD,
  NYS_FLAT_RATE_FULL_AGI,
  NYS_RECAPTURE,
  NYS_RECAPTURE_PHASE_IN,
  NYS_HOUSEHOLD_CREDIT,
  NYC_HOUSEHOLD_CREDIT,
  NYC_SCHOOL_CREDIT_PRORATED,
  NYC_SCHOOL_RATE_REDUCTION,
  NYC_SCHOOL_RATE_REDUCTION_LIMIT,
  NYS_FLAT_TOP_THRESHOLD,
  NYS_TOP_RATE,
  NYS_EITC_RATE,
  YONKERS_SURCHARGE_RATE,
  NYC_SCHOOL_CREDIT,
  NYC_SCHOOL_CREDIT_INCOME_LIMIT,
  type Brackets,
  type HouseholdCreditTable,
  type RateReductionSchedule,
} from './ny_rates_2025.ts';

export type NyReturnForm = 'IT-201' | 'IT-203';

export interface NyEstimate {
  form: NyReturnForm;
  /** True when the filer picked a filing status. Without one, no tax is computed. */
  ready: boolean;
  wagesFromW2: AmountPair;
  federalIncome: AmountPair;
  federalAdjustments: AmountPair;
  federalAgi: AmountPair;
  additions: AmountPair;
  subtractions: AmountPair;
  nyAgi: AmountPair;
  standardDeduction: number;
  itemizedDeduction: number;
  deduction: number;
  deductionKind: 'standard' | 'itemized';
  dependentExemptions: number;
  taxableIncome: number;
  /** Line 39 (IT-203 line 38): tax on all taxable income, before credits and IT-203 allocation. */
  baseTax: number;
  /** IT-203 income percentage (New York amount / federal amount of NY AGI). 1 for IT-201. */
  incomePercentage: number;
  /** IT-201: tax before credits. IT-203: allocated tax (line 46). */
  nysTax: number;
  nysHouseholdCredit: number;
  nysNonrefundableCredits: number;
  nysTaxAfterCredits: number;
  nycTax: number;
  nycHouseholdCredit: number;
  nycNonrefundableCredits: number;
  nycTaxAfterCredits: number;
  yonkersTax: number;
  salesUseTax: number;
  totalTax: number;
  nysEitc: number;
  nycSchoolCredit: number;
  nycSchoolRateReduction: number;
  refundableCredits: number;
  withholding: { state: number; nyc: number; yonkers: number };
  estimatedPayments: number;
  totalPayments: number;
  /** Positive: refund. Negative: amount owed. */
  balance: number;
  /** Things this estimate leaves out or approximates, in plain words for the filer. */
  notes: string[];
}

const round = (n: number) => Math.round(n);
const nonNegative = (n: number) => Math.max(0, n);
const sumPairs = (items: AmountPair[]): AmountPair =>
  items.reduce((acc, p) => ({ federal: acc.federal + p.federal, nySource: acc.nySource + p.nySource }), {
    federal: 0,
    nySource: 0,
  });

/** Tax from a bracket table, using the rate schedule. */
export function bracketTax(income: number, brackets: Brackets): number {
  let tax = 0;
  let lower = 0;
  for (const [upper, rate] of brackets) {
    if (income <= lower) break;
    tax += (Math.min(income, upper) - lower) * rate;
    lower = upper;
  }
  return round(tax);
}

/** Rounds to four decimal places, as the tax computation worksheets do. */
const round4 = (n: number) => Math.round(n * 10_000) / 10_000;

/**
 * Line 39: New York State tax. Up to $107,650 of NY AGI it is the rate schedule. Above that, the
 * tax computation worksheets take back the benefit of the lower brackets. Above $25 million, it is a flat rate.
 */
export function nysTaxOnIncome(nyAgi: number, taxable: number, status: Exclude<FilingStatus, ''>): number {
  if (nyAgi > NYS_FLAT_TOP_THRESHOLD) return round(taxable * NYS_TOP_RATE);
  const scheduleTax = bracketTax(taxable, NYS_BRACKETS[status]);
  if (nyAgi <= NYS_SUPPLEMENTAL_TAX_THRESHOLD) return scheduleTax;

  const schedule = NYS_RECAPTURE[status];
  const tier = [...schedule.tiers].reverse().find((t) => taxable > t.over);
  if (!tier) {
    // Worksheets 1, 7 and 12.
    const flatTax = round(taxable * schedule.flatRate);
    if (nyAgi >= NYS_FLAT_RATE_FULL_AGI) return flatTax;
    const share = round4((nyAgi - NYS_SUPPLEMENTAL_TAX_THRESHOLD) / NYS_RECAPTURE_PHASE_IN);
    return scheduleTax + round((flatTax - scheduleTax) * share);
  }
  // The other worksheets: recapture base plus a share of the incremental benefit.
  const share = round4(Math.min(nyAgi - tier.over, NYS_RECAPTURE_PHASE_IN) / NYS_RECAPTURE_PHASE_IN);
  return scheduleTax + tier.base + round(tier.increment * share);
}

/** Household credit from a table, by federal AGI and the number of people in the household. */
export function householdCredit(table: HouseholdCreditTable, federalAgi: number, people: number): number {
  const row = table.find((r) => federalAgi <= r.upTo);
  if (!row) return 0;
  const columns = row.amounts.length;
  const last = row.amounts[columns - 1] ?? 0;
  if (people <= columns) return row.amounts[Math.max(1, people) - 1] ?? 0;
  return last + (people - columns) * row.extra;
}

/** Line 69a: NYC school tax credit (rate reduction amount). */
export function schoolRateReduction(cityTaxable: number, s: RateReductionSchedule): number {
  if (cityTaxable <= 0) return 0;
  if (cityTaxable <= s.breakpoint) return round(cityTaxable * s.lowRate);
  return round(s.base + (cityTaxable - s.breakpoint) * s.highRate);
}

export function returnFormFor(state: TaxState): NyReturnForm {
  return state.residency.status === 'part' || state.residency.status === 'non' ? 'IT-203' : 'IT-201';
}

/** Wages from the W-2 list: box 1 for the federal column and box 16 for the New York column. */
export function wagesFromW2(state: TaxState): AmountPair {
  return sumPairs(state.employers.map((w) => ({ federal: w.wages, nySource: w.stateWages })));
}

/** The income lines as used in the estimate. Wages come from the W-2 list when it has entries. */
export function effectiveIncomeLines(state: TaxState): Record<(typeof INCOME_LINE_KEYS)[number], AmountPair> {
  const lines = { ...state.income.lines };
  if (state.employers.length > 0) lines.wages = wagesFromW2(state);
  return lines;
}

export function standardDeductionFor(status: FilingStatus, claimedAsDependent: boolean): number {
  if (!status) return 0;
  if (status === '1' && claimedAsDependent) return NYS_DEPENDENT_FILER_DEDUCTION;
  return NYS_STANDARD_DEDUCTION[status];
}

export function estimateNyReturn(state: TaxState): NyEstimate {
  const form = returnFormFor(state);
  const isIt203 = form === 'IT-203';
  const status = state.filingStatus;
  const notes: string[] = [];

  // Federal income (lines 1 to 19). IT-201 has only the federal column.
  const lines = effectiveIncomeLines(state);
  const column = (p: AmountPair): AmountPair => (isIt203 ? p : { federal: p.federal, nySource: p.federal });
  const federalIncome = sumPairs(INCOME_LINE_KEYS.map((k) => column(lines[k])));
  const federalAdjustments = column(state.income.adjustments);
  const federalAgi = {
    federal: federalIncome.federal - federalAdjustments.federal,
    nySource: federalIncome.nySource - federalAdjustments.nySource,
  };

  // New York additions and subtractions (lines 20 to 32). Lines 25 and 27 copy lines 4 and 15.
  const additions = sumPairs(ADDITION_KEYS.map((k) => column(state.modifications.additions[k])));
  const subtractions = sumPairs([
    column(lines.taxableRefunds),
    column(lines.socialSecurity),
    ...SUBTRACTION_KEYS.map((k) => column(state.modifications.subtractions[k])),
  ]);
  const nyAgi = {
    federal: federalAgi.federal + additions.federal - subtractions.federal,
    nySource: federalAgi.nySource + additions.nySource - subtractions.nySource,
  };

  // Deductions and exemptions (lines 34 to 38). The tax uses the federal column on both forms.
  const standardDeduction = standardDeductionFor(status, state.residency.claimedAsDependent);
  const itemizedDeduction = nonNegative(round(state.deductions.itemizedAmount));
  const deductionKind = state.deductions.choice;
  const deduction = deductionKind === 'itemized' ? itemizedDeduction : standardDeduction;
  const dependentExemptions = state.dependents.length * NYS_DEPENDENT_EXEMPTION;
  const taxableIncome = nonNegative(nyAgi.federal - deduction - dependentExemptions);

  const ready = status !== '';
  const c = state.credits;
  const r = state.residency;
  const federalAgiForCredits = federalAgi.federal;

  // Line 39 (IT-203 line 38): tax on all taxable income, with the worksheets above $107,650 of NY AGI.
  const baseTax = ready ? nysTaxOnIncome(nyAgi.federal, taxableIncome, status) : 0;

  // Line 40 (IT-203 line 39): household credit. Not allowed if someone can claim the filer as a dependent.
  // People: the filer, a spouse on a joint or separate return, and each dependent.
  const people = state.dependents.length + 1 + (status === '2' || status === '3' ? 1 : 0);
  const householdAllowed = ready && !r.claimedAsDependent;
  const nysHouseholdCredit = householdAllowed
    ? householdCredit(NYS_HOUSEHOLD_CREDIT[status as Exclude<typeof status, ''>], federalAgiForCredits, people)
    : 0;
  if (status === '3' && householdAllowed && federalAgiForCredits <= 32_000) {
    notes.push(
      "Married filing separately: the household credit tables use both spouses' income and dependents. This estimate uses only yours.",
    );
  }

  // NYS EITC. Full-year residents: 30% of the federal credit, less the household credit.
  let nysEitc = 0;
  if (r.status === 'full') {
    nysEitc = nonNegative(round(c.federalEic * NYS_EITC_RATE) - nysHouseholdCredit);
  } else if (r.status === 'part') {
    nysEitc = round(c.nysEitcOverride);
  }

  let incomePercentage = 1;
  let nysTax: number;
  let nysNonrefundableCredits: number;
  let refundableNysCredits: number;
  if (isIt203) {
    // IT-203 lines 39 to 46: the household credit, the child and dependent care credit and the EITC
    // come off the base tax first. The rest is allocated by the share of income from New York sources.
    const afterHousehold = nonNegative(baseTax - nysHouseholdCredit);
    const afterCare = nonNegative(afterHousehold - round(c.childCareCredit));
    const base = nonNegative(afterCare - nysEitc);
    incomePercentage =
      nyAgi.federal > 0 ? Math.min(1, Math.max(0, Math.round((nyAgi.nySource / nyAgi.federal) * 10_000) / 10_000)) : 0;
    nysTax = round(base * incomePercentage);
    nysNonrefundableCredits = round(c.residentCredit + c.otherNonrefundable);
    refundableNysCredits = round(c.empireStateChildCredit + c.collegeTuitionCredit + c.otherRefundable);
  } else {
    nysTax = baseTax;
    nysNonrefundableCredits = nysHouseholdCredit + round(c.residentCredit + c.otherNonrefundable);
    refundableNysCredits = round(
      c.empireStateChildCredit +
        c.childCareCredit +
        nysEitc +
        c.realPropertyCredit +
        c.collegeTuitionCredit +
        c.otherRefundable,
    );
  }
  const nysTaxAfterCredits = nonNegative(nysTax - nysNonrefundableCredits);

  // New York City resident tax, lines 47 to 49. Only full-year residents are computed here.
  const nycTaxableIncome = taxableIncome;
  let nycTax = 0;
  let nycHouseholdCredit = 0;
  if (r.nyc === 'full' && ready) {
    nycTax = bracketTax(nycTaxableIncome, NYC_BRACKETS[status]);
    if (householdAllowed) nycHouseholdCredit = householdCredit(NYC_HOUSEHOLD_CREDIT[status], federalAgiForCredits, people);
  } else if (r.nyc === 'part') {
    notes.push('Part-year New York City residents compute city tax on Form IT-360.1. This estimate does not include it yet.');
  }
  const nycNonrefundableCredits = nycHouseholdCredit + round(c.nycOtherNonrefundable);
  const nycTaxAfterCredits = nonNegative(nycTax - nycNonrefundableCredits);

  // NYC school tax credits, lines 69 and 69a. Not allowed if someone can claim the filer as a dependent.
  // The fixed credit tests federal AGI less IRA distributions (line 9).
  let nycSchoolCredit = 0;
  let nycSchoolRateReduction = 0;
  if (ready && !r.claimedAsDependent && (r.nyc === 'full' || r.nyc === 'part')) {
    const schoolIncome = federalAgiForCredits - nonNegative(lines.iraDistributions.federal);
    if (schoolIncome <= NYC_SCHOOL_CREDIT_INCOME_LIMIT) {
      if (r.nyc === 'full') {
        nycSchoolCredit = NYC_SCHOOL_CREDIT[status];
      } else {
        const months = Number(state.personalInfo.nycMonthsLived);
        const chart = status === '2' || status === '5' ? NYC_SCHOOL_CREDIT_PRORATED.joint : NYC_SCHOOL_CREDIT_PRORATED.single;
        nycSchoolCredit = Number.isInteger(months) && months >= 1 ? (chart[Math.min(months, 12) - 1] ?? 0) : 0;
      }
    }
    if (r.nyc === 'full' && nycTaxableIncome <= NYC_SCHOOL_RATE_REDUCTION_LIMIT) {
      nycSchoolRateReduction = schoolRateReduction(nycTaxableIncome, NYC_SCHOOL_RATE_REDUCTION[status]);
    } else if (r.nyc === 'part') {
      notes.push('Part-year New York City residents take the school tax rate reduction from Form IT-360.1. It is not included.');
    }
  }

  // Yonkers resident surcharge.
  let yonkersTax = 0;
  if (r.yonkers === 'full') {
    yonkersTax = round(nysTaxAfterCredits * YONKERS_SURCHARGE_RATE);
  } else if (r.yonkers === 'part') {
    notes.push('Part-year Yonkers residents compute the surcharge on Form IT-360.1. This estimate does not include it yet.');
  }

  const salesUseTax = round(state.payments.salesUseTax);
  const totalTax = nysTaxAfterCredits + nycTaxAfterCredits + yonkersTax + salesUseTax;

  const refundableCredits = refundableNysCredits + nycSchoolCredit + nycSchoolRateReduction + round(c.nycEitc);

  // Payments.
  const w2State = state.employers.reduce((s, w) => s + w.stateWithheld, 0);
  const w2Nyc = state.employers.reduce((s, w) => s + (w.locality === 'NYC' ? w.localWithheld : 0), 0);
  const w2Yonkers = state.employers.reduce((s, w) => s + (w.locality === 'Yonkers' ? w.localWithheld : 0), 0);
  const p = state.payments;
  const withholding = {
    state: round(w2State + p.stateTaxWithheld),
    nyc: round(w2Nyc + p.nycTaxWithheld),
    yonkers: round(w2Yonkers + p.yonkersTaxWithheld),
  };
  const estimatedPayments = round(p.estimatedPayments + p.extensionPayment);
  const totalPayments = refundableCredits + withholding.state + withholding.nyc + withholding.yonkers + estimatedPayments;

  if (ready && nyAgi.federal <= NYS_SUPPLEMENTAL_TAX_THRESHOLD && taxableIncome < 65_000) {
    notes.push('Tax uses the rate schedule. The tax table on the form can differ by a few dollars.');
  }

  return {
    form,
    ready,
    wagesFromW2: wagesFromW2(state),
    federalIncome,
    federalAdjustments,
    federalAgi,
    additions,
    subtractions,
    nyAgi,
    standardDeduction,
    itemizedDeduction,
    deduction,
    deductionKind,
    dependentExemptions,
    taxableIncome,
    baseTax,
    incomePercentage,
    nysTax,
    nysHouseholdCredit,
    nysNonrefundableCredits,
    nysTaxAfterCredits,
    nycTax,
    nycHouseholdCredit,
    nycNonrefundableCredits,
    nycTaxAfterCredits,
    yonkersTax,
    salesUseTax,
    totalTax,
    nysEitc,
    nycSchoolCredit,
    nycSchoolRateReduction,
    refundableCredits,
    withholding,
    estimatedPayments,
    totalPayments,
    balance: totalPayments - totalTax,
    notes,
  };
}
