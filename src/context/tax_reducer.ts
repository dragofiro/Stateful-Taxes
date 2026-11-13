// Manages the state tree for individual tax information and form data.
// Amounts are whole dollars, like the New York forms.

/** Filing status codes as printed on IT-201 and IT-203 (Item A). Empty until the filer picks one. */
export type FilingStatus = '' | '1' | '2' | '3' | '4' | '5';

/** Residency for the whole tax year. 'full' files IT-201. 'part' and 'non' file IT-203. */
export type ResidencyStatus = '' | 'full' | 'part' | 'non';

/** Residency in a city that levies its own income tax (New York City or Yonkers). */
export type LocalResidency = '' | 'full' | 'part' | 'none';

/** One line of a return. IT-201 uses only `federal`. IT-203 also uses `nySource` (the New York State amount column). */
export interface AmountPair {
  federal: number;
  nySource: number;
}

/** Federal income lines 1 to 16 that the filer types in. Wages (line 1) come from the W-2 list when it has entries. */
export const INCOME_LINE_KEYS = [
  'wages',
  'taxableInterest',
  'ordinaryDividends',
  'taxableRefunds',
  'alimonyReceived',
  'businessIncome',
  'capitalGain',
  'otherGains',
  'iraDistributions',
  'pensionsAnnuities',
  'rentalPartnership',
  'farmIncome',
  'unemployment',
  'socialSecurity',
  'otherIncome',
] as const;
export type IncomeLineKey = (typeof INCOME_LINE_KEYS)[number];

/** New York additions, lines 20 to 23. */
export const ADDITION_KEYS = ['otherStateBondInterest', 'publicEmployee414h', 'nys529Distributions', 'otherAdditions'] as const;
export type AdditionKey = (typeof ADDITION_KEYS)[number];

/** New York subtractions that the filer types in. Lines 25 and 27 copy lines 4 and 15, so they are not stored. */
export const SUBTRACTION_KEYS = [
  'governmentPensions',
  'usBondInterest',
  'pensionExclusion',
  'nys529Deduction',
  'otherSubtractions',
] as const;
export type SubtractionKey = (typeof SUBTRACTION_KEYS)[number];

export interface Dependent {
  id: string;
  firstName: string;
  middleInitial: string;
  lastName: string;
  ssn: string;
  dateOfBirth: string;
  relationship: string;
}

export type W2Locality = '' | 'NYC' | 'Yonkers' | 'Other';

/** One W-2. Box numbers are in the comments. */
export interface EmployerWithholding {
  id: string;
  employerName: string;
  ein: string;
  /** Box 1, federal wages. */
  wages: number;
  /** Box 16, New York State wages. */
  stateWages: number;
  /** Box 17, New York State tax withheld. */
  stateWithheld: number;
  /** Box 19, local tax withheld. */
  localWithheld: number;
  /** Box 20, the locality of the local tax. */
  locality: W2Locality;
}

export interface BankInfo {
  accountType: string;
  routingNumber: string;
  accountNumber: string;
  confirmAccountNumber: string;
}

export interface TaxState {
  version: 2;
  personalInfo: {
    firstName: string;
    middleInitial: string;
    lastName: string;
    ssn: string;
    dateOfBirth: string;
    dateOfDeath: string;
    spouseFirstName?: string;
    spouseMiddleInitial?: string;
    spouseLastName?: string;
    spouseSsn?: string;
    spouseDateOfBirth?: string;
    spouseDateOfDeath?: string;
    /** Mailing address. */
    mailingAddress: string;
    apartmentNumber?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    /** Permanent home address, used when it differs from the mailing address. */
    homeSameAsMailing: boolean;
    homeAddress: string;
    homeApartment: string;
    homeCity: string;
    homeState: string;
    homeZip: string;
    countyOfResidence: string;
    schoolDistrictName: string;
    schoolDistrictCode: string;
    /** Item F on IT-201: months lived in New York City. */
    nycMonthsLived: string;
  };
  residency: {
    status: ResidencyStatus;
    nyc: LocalResidency;
    yonkers: LocalResidency;
    /** Part-year residents: the dates they moved into or out of New York State. */
    movedInDate: string;
    movedOutDate: string;
    /** Nonresidents: their state of residence. */
    otherStateOfResidence: string;
    /** Someone else can claim the filer as a dependent (Item C). */
    claimedAsDependent: boolean;
  };
  filingStatus: FilingStatus;
  dependents: Dependent[];
  employers: EmployerWithholding[];
  income: {
    lines: Record<IncomeLineKey, AmountPair>;
    /** Line 18, total federal adjustments to income. */
    adjustments: AmountPair;
  };
  modifications: {
    additions: Record<AdditionKey, AmountPair>;
    subtractions: Record<SubtractionKey, AmountPair>;
  };
  deductions: {
    choice: 'standard' | 'itemized';
    /** New York itemized deduction from Form IT-196. */
    itemizedAmount: number;
  };
  credits: {
    /** Federal earned income credit, used to compute the New York EITC. */
    federalEic: number;
    /** Part-year residents: the EITC from Form IT-215. */
    nysEitcOverride: number;
    residentCredit: number;
    otherNonrefundable: number;
    empireStateChildCredit: number;
    childCareCredit: number;
    collegeTuitionCredit: number;
    realPropertyCredit: number;
    otherRefundable: number;
    nycOtherNonrefundable: number;
    nycEitc: number;
  };
  payments: {
    /** Withholding that is not on a W-2 in the list, for example from 1099 forms. */
    stateTaxWithheld: number;
    nycTaxWithheld: number;
    yonkersTaxWithheld: number;
    estimatedPayments: number;
    extensionPayment: number;
    salesUseTax: number;
  };
  bankInfo: BankInfo;
  workflow: {
    currentStep: string;
    visited: string[];
  };
}

const zeroPair = (): AmountPair => ({ federal: 0, nySource: 0 });

function pairs<K extends string>(keys: readonly K[]): Record<K, AmountPair> {
  return Object.fromEntries(keys.map((k) => [k, zeroPair()])) as Record<K, AmountPair>;
}

export function createInitialTaxState(): TaxState {
  return {
    version: 2,
    personalInfo: {
      firstName: '',
      middleInitial: '',
      lastName: '',
      ssn: '',
      dateOfBirth: '',
      dateOfDeath: '',
      mailingAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      homeSameAsMailing: true,
      homeAddress: '',
      homeApartment: '',
      homeCity: '',
      homeState: '',
      homeZip: '',
      countyOfResidence: '',
      schoolDistrictName: '',
      schoolDistrictCode: '',
      nycMonthsLived: '',
    },
    residency: {
      status: '',
      nyc: '',
      yonkers: '',
      movedInDate: '',
      movedOutDate: '',
      otherStateOfResidence: '',
      claimedAsDependent: false,
    },
    filingStatus: '',
    dependents: [],
    employers: [],
    income: { lines: pairs(INCOME_LINE_KEYS), adjustments: zeroPair() },
    modifications: { additions: pairs(ADDITION_KEYS), subtractions: pairs(SUBTRACTION_KEYS) },
    deductions: { choice: 'standard', itemizedAmount: 0 },
    credits: {
      federalEic: 0,
      nysEitcOverride: 0,
      residentCredit: 0,
      otherNonrefundable: 0,
      empireStateChildCredit: 0,
      childCareCredit: 0,
      collegeTuitionCredit: 0,
      realPropertyCredit: 0,
      otherRefundable: 0,
      nycOtherNonrefundable: 0,
      nycEitc: 0,
    },
    payments: {
      stateTaxWithheld: 0,
      nycTaxWithheld: 0,
      yonkersTaxWithheld: 0,
      estimatedPayments: 0,
      extensionPayment: 0,
      salesUseTax: 0,
    },
    bankInfo: {
      accountType: 'Personal Checking',
      routingNumber: '',
      accountNumber: '',
      confirmAccountNumber: '',
    },
    workflow: { currentStep: 'start', visited: ['start'] },
  };
}

export const initialTaxState: TaxState = createInitialTaxState();

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Copies values from `source` onto `base`, but only where the type matches the value in `base`. */
function mergeShape<T>(base: T, source: unknown): T {
  if (isPlainObject(base)) {
    if (!isPlainObject(source)) return base;
    const out: Record<string, unknown> = { ...base };
    for (const key of Object.keys(source)) {
      out[key] = key in base ? mergeShape((base as Record<string, unknown>)[key], source[key]) : source[key];
    }
    return out as T;
  }
  if (Array.isArray(base)) return (Array.isArray(source) ? source : base) as T;
  if (base === undefined) return source as T;
  return (typeof source === typeof base ? source : base) as T;
}

/**
 * Turns any saved draft (from local storage or a downloaded JSON file) into a complete TaxState.
 * Drafts from the first version of the app had a flat income and payments shape. Those values move to the new lines.
 */
export function normalizeTaxState(raw: unknown): TaxState {
  const next = mergeShape(createInitialTaxState(), raw);
  next.version = 2;
  if (isPlainObject(raw) && raw.version !== 2) {
    const oldIncome = isPlainObject(raw.income) ? raw.income : {};
    const fagi = Number(oldIncome.federalAdjustedGrossIncome) || 0;
    if (fagi) next.income.lines.otherIncome.federal = fagi;
    const add = Number(oldIncome.nyAdditions) || 0;
    if (add) next.modifications.additions.otherAdditions.federal = add;
    const sub = Number(oldIncome.nySubtractions) || 0;
    if (sub) next.modifications.subtractions.otherSubtractions.federal = sub;
  }
  return next;
}

export type TaxAction =
  | { type: 'UPDATE_PERSONAL_INFO'; payload: Partial<TaxState['personalInfo']> }
  | { type: 'UPDATE_FILING_STATUS'; payload: FilingStatus }
  | { type: 'UPDATE_RESIDENCY'; payload: Partial<TaxState['residency']> }
  | { type: 'UPDATE_DEPENDENTS'; payload: Dependent[] }
  | { type: 'UPDATE_EMPLOYERS'; payload: EmployerWithholding[] }
  | { type: 'UPDATE_INCOME_LINE'; key: IncomeLineKey; payload: Partial<AmountPair> }
  | { type: 'UPDATE_ADJUSTMENTS'; payload: Partial<AmountPair> }
  | { type: 'UPDATE_ADDITION'; key: AdditionKey; payload: Partial<AmountPair> }
  | { type: 'UPDATE_SUBTRACTION'; key: SubtractionKey; payload: Partial<AmountPair> }
  | { type: 'UPDATE_DEDUCTIONS'; payload: Partial<TaxState['deductions']> }
  | { type: 'UPDATE_CREDITS'; payload: Partial<TaxState['credits']> }
  | { type: 'UPDATE_PAYMENTS'; payload: Partial<TaxState['payments']> }
  | { type: 'UPDATE_BANK_INFO'; payload: Partial<BankInfo> }
  | { type: 'GO_TO_STEP'; payload: string }
  | { type: 'LOAD_FULL_DATA'; payload: unknown }
  | { type: 'RESET_FORM' };

export function taxReducer(state: TaxState, action: TaxAction): TaxState {
  switch (action.type) {
    case 'UPDATE_PERSONAL_INFO':
      return { ...state, personalInfo: { ...state.personalInfo, ...action.payload } };
    case 'UPDATE_FILING_STATUS':
      return { ...state, filingStatus: action.payload };
    case 'UPDATE_RESIDENCY':
      return { ...state, residency: { ...state.residency, ...action.payload } };
    case 'UPDATE_DEPENDENTS':
      return { ...state, dependents: action.payload };
    case 'UPDATE_EMPLOYERS':
      return { ...state, employers: action.payload };
    case 'UPDATE_INCOME_LINE':
      return {
        ...state,
        income: {
          ...state.income,
          lines: { ...state.income.lines, [action.key]: { ...state.income.lines[action.key], ...action.payload } },
        },
      };
    case 'UPDATE_ADJUSTMENTS':
      return { ...state, income: { ...state.income, adjustments: { ...state.income.adjustments, ...action.payload } } };
    case 'UPDATE_ADDITION': {
      const additions = state.modifications.additions;
      return {
        ...state,
        modifications: {
          ...state.modifications,
          additions: { ...additions, [action.key]: { ...additions[action.key], ...action.payload } },
        },
      };
    }
    case 'UPDATE_SUBTRACTION': {
      const subtractions = state.modifications.subtractions;
      return {
        ...state,
        modifications: {
          ...state.modifications,
          subtractions: { ...subtractions, [action.key]: { ...subtractions[action.key], ...action.payload } },
        },
      };
    }
    case 'UPDATE_DEDUCTIONS':
      return { ...state, deductions: { ...state.deductions, ...action.payload } };
    case 'UPDATE_CREDITS':
      return { ...state, credits: { ...state.credits, ...action.payload } };
    case 'UPDATE_PAYMENTS':
      return { ...state, payments: { ...state.payments, ...action.payload } };
    case 'UPDATE_BANK_INFO':
      return { ...state, bankInfo: { ...state.bankInfo, ...action.payload } };
    case 'GO_TO_STEP': {
      const visited = state.workflow.visited.includes(action.payload)
        ? state.workflow.visited
        : [...state.workflow.visited, action.payload];
      return { ...state, workflow: { currentStep: action.payload, visited } };
    }
    case 'LOAD_FULL_DATA':
      return normalizeTaxState(action.payload);
    case 'RESET_FORM':
      return createInitialTaxState();
    default:
      return state;
  }
}
