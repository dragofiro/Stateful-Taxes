export interface TaxState {
  personalInfo: {
    spouseDateOfBirth: string;
    spouseDateOfDeath: string;
    dateOfBirth: string;
    firstName: string;
    middleInitial: string;
    lastName: string;
    ssn: string;
    spouseFirstName?: string;
    spouseMiddleInitial?: string;
    spouseLastName?: string;
    spouseSsn?: string;
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
  filingStatus: string;
  income: {
    federalAdjustedGrossIncome: number;
    nyAdditions: number;
    nySubtractions: number;
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
  | { type: 'UPDATE_FILING_STATUS'; payload: string }
  | { type: 'UPDATE_INCOME'; payload: Partial<TaxState['income']> }
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
      return action.payload;
    case 'RESET_FORM':
      return initialTaxState;
    default:
      return state;
  }
}