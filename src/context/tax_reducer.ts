export interface TaxState {
  version: 2;
  personalInfo: {
    spouseDateOfBirth: string;
    spouseDateOfDeath: string;
    dateOfBirth: string;
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
    country?: string;
    countyOfResidence: string;
    schoolDistrictName?: string;
    schoolDistrictCode: string;
    monthsLived: string;
    itemizedDeductionsFederal?: 'yes' | 'no';
    claimedAsDependent?: 'yes' | 'no';
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
    refundChoice: string;
    accountType: string;
    stateTaxWithheld: number;
    taxWithheld: number;
  };
  bankInfo: {
    accountType: string;
    routingNumber: string;
    accountNumber: string;
    confirmAccountNumber?: string;
  };
  dependents: Array<{
    id: string;
    firstName: string;
    middleInitial: string;
    lastName: string;
    ssn: string;
    dateOfBirth: string;
    relationship: string;
  }>;
  employers: Array<{
    id: string;
    employerName: string;
    ein: string;
    stateWithheld: number;
    localWithheld: number;
  }>;
}

export const initialTaxState: TaxState = {
  personalInfo: {
    firstName: '',
    middleInitial: '',
    lastName: '',
    ssn: '',
    mailingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    countyOfResidence: '',
    schoolDistrictCode: '',
    monthsLived: '12',
    spouseDateOfBirth: "",
    spouseDateOfDeath: "",
    dateOfBirth: ""
  },
  filingStatus: '1',
  income: {
    federalAdjustedGrossIncome: 0,
    nyAdditions: 0,
    nySubtractions: 0,
  },
  payments: {
    stateTaxWithheld: 0,
    taxWithheld: 0,
    refundChoice: "",
    accountType: ""
  },
  bankInfo: {
    accountType: 'Personal Checking',
    routingNumber: '',
    accountNumber: '',
  },
  dependents: [],
  employers: [],
};

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
  | { type: 'UPDATE_BANK_INFO'; payload: Partial<TaxState['bankInfo']> }
  | { type: 'UPDATE_DEPENDENTS'; payload: TaxState['dependents'] }
  | { type: 'UPDATE_EMPLOYERS'; payload: TaxState['employers'] }
  | { type: 'LOAD_FULL_DATA'; payload: TaxState }
  | { type: 'RESET_FORM' };

export function taxReducer(state: TaxState, action: TaxAction): TaxState {
  switch (action.type) {
    case 'UPDATE_PERSONAL_INFO':
      return { ...state, personalInfo: { ...state.personalInfo, ...action.payload } };
    case 'UPDATE_FILING_STATUS':
      return { ...state, filingStatus: action.payload };
    case 'UPDATE_INCOME':
      return { ...state, income: { ...state.income, ...action.payload } };
    case 'UPDATE_PAYMENTS':
      return { ...state, payments: { ...state.payments, ...action.payload } };
    case 'UPDATE_BANK_INFO':
      return { ...state, bankInfo: { ...state.bankInfo, ...action.payload } };
    case 'UPDATE_DEPENDENTS':
      return { ...state, dependents: action.payload };
    case 'UPDATE_EMPLOYERS':
      return { ...state, employers: action.payload };
    case 'LOAD_FULL_DATA':
      return normalizeTaxState(action.payload);
    case 'RESET_FORM':
      return createInitialTaxState();
    default:
      return state;
  }
}
