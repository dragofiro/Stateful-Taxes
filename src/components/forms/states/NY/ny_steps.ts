// Step list and per-step checks for the New York filing workflow.
import type { TaxState } from '../../../../context/tax_reducer.ts';
import {
  NYS_PENSION_EXCLUSION_LIMIT,
  NYS_529_LIMIT_JOINT,
  NYS_529_LIMIT_SINGLE,
} from './ny_rates_2025.ts';

export type StepId =
  | 'start'
  | 'filer'
  | 'household'
  | 'income'
  | 'ny-adjustments'
  | 'deductions'
  | 'credits'
  | 'payments'
  | 'checkpoint';

export type StageId = 'beginning' | 'middle' | 'checkpoint';

export interface StepDefinition {
  id: StepId;
  stage: StageId;
  title: string;
  /** Short name for the step list. */
  navLabel: string;
}

export const STAGES: ReadonlyArray<{ id: StageId; label: string }> = [
  { id: 'beginning', label: 'Getting started' },
  { id: 'middle', label: 'Income and credits' },
  { id: 'checkpoint', label: 'Checkpoint' },
];

export const NY_STEPS: readonly StepDefinition[] = [
  { id: 'start', stage: 'beginning', title: 'Where did you live in 2025?', navLabel: 'Residency' },
  { id: 'filer', stage: 'beginning', title: 'About you', navLabel: 'You and filing status' },
  { id: 'household', stage: 'beginning', title: 'Your household', navLabel: 'Dependents' },
  { id: 'income', stage: 'middle', title: 'Income from your federal return', navLabel: 'Income' },
  { id: 'ny-adjustments', stage: 'middle', title: 'New York additions and subtractions', navLabel: 'NY adjustments' },
  { id: 'deductions', stage: 'middle', title: 'Deductions and exemptions', navLabel: 'Deductions' },
  { id: 'credits', stage: 'middle', title: 'Credits', navLabel: 'Credits' },
  { id: 'payments', stage: 'middle', title: 'Tax already paid', navLabel: 'Payments' },
  { id: 'checkpoint', stage: 'checkpoint', title: 'Where your return stands', navLabel: 'Summary' },
];

/** Steps of the final stage. They show in the step list as not yet available. */
export const LATER_STEPS: readonly string[] = ['Review and sign', 'Print your return'];

export function isStepId(value: string): value is StepId {
  return NY_STEPS.some((s) => s.id === value);
}

export type FieldErrors = Record<string, string>;

const SSN = /^\d{3}-?\d{2}-?\d{4}$/;
const ZIP = /^\d{5}(-?\d{4})?$/;

function required(errors: FieldErrors, key: string, value: string | undefined, message: string) {
  if (!value || !value.trim()) errors[key] = message;
}

function ssn(errors: FieldErrors, key: string, value: string | undefined, who: string) {
  if (!value || !value.trim()) errors[key] = `Enter ${who} Social Security number.`;
  else if (!SSN.test(value.trim())) errors[key] = 'Use the format 123-45-6789.';
}

/** Returns the problems that stop the filer from going to the next step. An empty object means the step is complete. */
export function validateStep(step: StepId, state: TaxState): FieldErrors {
  const errors: FieldErrors = {};
  const r = state.residency;
  const p = state.personalInfo;

  switch (step) {
    case 'start':
      if (!r.status) errors['residency.status'] = 'Choose how you lived in New York in 2025.';
      if (r.status === 'part' && !r.movedInDate && !r.movedOutDate) {
        errors['residency.movedInDate'] = 'Enter the date you moved into or out of New York State.';
      }
      if (r.status === 'non') required(errors, 'residency.otherStateOfResidence', r.otherStateOfResidence, 'Enter your state of residence.');
      if (r.status && r.status !== 'non' && !r.nyc) errors['residency.nyc'] = 'Tell us if you lived in New York City.';
      if (r.status && r.status !== 'non' && !r.yonkers) errors['residency.yonkers'] = 'Tell us if you lived in Yonkers.';
      break;

    case 'filer':
      if (!state.filingStatus) errors['filingStatus'] = 'Choose a filing status.';
      required(errors, 'personalInfo.firstName', p.firstName, 'Enter your first name.');
      required(errors, 'personalInfo.lastName', p.lastName, 'Enter your last name.');
      ssn(errors, 'personalInfo.ssn', p.ssn, 'your');
      required(errors, 'personalInfo.dateOfBirth', p.dateOfBirth, 'Enter your date of birth.');
      if (state.filingStatus === '2' || state.filingStatus === '3') {
        required(errors, 'personalInfo.spouseFirstName', p.spouseFirstName, "Enter your spouse's first name.");
        required(errors, 'personalInfo.spouseLastName', p.spouseLastName, "Enter your spouse's last name.");
        ssn(errors, 'personalInfo.spouseSsn', p.spouseSsn, "your spouse's");
      }
      required(errors, 'personalInfo.mailingAddress', p.mailingAddress, 'Enter your mailing address.');
      required(errors, 'personalInfo.city', p.city, 'Enter the city.');
      required(errors, 'personalInfo.state', p.state, 'Enter the state.');
      if (!p.zipCode.trim()) errors['personalInfo.zipCode'] = 'Enter the ZIP code.';
      else if (!ZIP.test(p.zipCode.trim())) errors['personalInfo.zipCode'] = 'Use a 5-digit ZIP code.';
      if (!p.homeSameAsMailing) {
        required(errors, 'personalInfo.homeAddress', p.homeAddress, 'Enter your permanent home address.');
        required(errors, 'personalInfo.homeCity', p.homeCity, 'Enter the city.');
      }
      if (r.status === 'full' || r.status === 'part') {
        required(errors, 'personalInfo.countyOfResidence', p.countyOfResidence, 'Enter your New York county.');
        required(errors, 'personalInfo.schoolDistrictName', p.schoolDistrictName, 'Enter your school district.');
        if (!/^\d{3}$/.test(p.schoolDistrictCode.trim())) {
          errors['personalInfo.schoolDistrictCode'] = 'Enter the 3-digit code from the instructions.';
        }
      }
      if (r.nyc === 'part') {
        const months = Number(p.nycMonthsLived);
        if (!p.nycMonthsLived || !Number.isInteger(months) || months < 1 || months > 11) {
          errors['personalInfo.nycMonthsLived'] = 'Enter a number of months from 1 to 11.';
        }
      }
      break;

    case 'ny-adjustments': {
      const joint = state.filingStatus === '2';
      const pensionLimit = NYS_PENSION_EXCLUSION_LIMIT * (joint ? 2 : 1);
      if (state.modifications.subtractions.pensionExclusion.federal > pensionLimit) {
        errors['subtractions.pensionExclusion'] = `The exclusion is at most $${pensionLimit.toLocaleString()} ($20,000 for each person aged 59½ or older).`;
      }
      const limit529 = joint ? NYS_529_LIMIT_JOINT : NYS_529_LIMIT_SINGLE;
      if (state.modifications.subtractions.nys529Deduction.federal > limit529) {
        errors['subtractions.nys529Deduction'] = `The deduction is at most $${limit529.toLocaleString()} for your filing status.`;
      }
      break;
    }

    case 'deductions':
      if (state.deductions.choice === 'itemized' && state.deductions.itemizedAmount <= 0) {
        errors['deductions.itemizedAmount'] = 'Enter your New York itemized deduction from Form IT-196.';
      }
      break;

    default:
      break;
  }
  return errors;
}
