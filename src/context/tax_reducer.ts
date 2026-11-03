export interface TaxState {
  personalInfo: {
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
    countyOfResidence: string;
    schoolDistrictCode: string;
    nycMonthsLived: string;
  };
  filingStatus: string;
  income: {
    federalAdjustedGrossIncome: number;
    nyAdditions: number;
    nySubtractions: number;
  };
  payments: {
    stateTaxWithheld: number;
    nycTaxWithheld: number;
  };
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
    countyOfResidence: '',
    schoolDistrictCode: '',
    nycMonthsLived: '12',
  },
  filingStatus: '1', // Default to Single
  income: {
    federalAdjustedGrossIncome: 0,
    nyAdditions: 0,
    nySubtractions: 0,
  },
  payments: {
    stateTaxWithheld: 0,
    nycTaxWithheld: 0,
  },
};

export type TaxAction =
  | { type: 'UPDATE_PERSONAL_INFO'; payload: Partial<TaxState['personalInfo']> }
  | { type: 'UPDATE_FILING_STATUS'; payload: string }
  | { type: 'UPDATE_INCOME'; payload: Partial<TaxState['income']> }
  | { type: 'UPDATE_PAYMENTS'; payload: Partial<TaxState['payments']> }
  | { type: 'LOAD_FULL_DATA'; payload: TaxState }
  | { type: 'RESET_FORM' };

export function taxReducer(state: TaxState, action: TaxAction): TaxState {
  switch (action.type) {
    case 'UPDATE_PERSONAL_INFO':
      return {
        ...state,
        personalInfo: { ...state.personalInfo, ...action.payload },
      };
    case 'UPDATE_FILING_STATUS':
      return {
        ...state,
        filingStatus: action.payload,
      };
    case 'UPDATE_INCOME':
      return {
        ...state,
        income: { ...state.income, ...action.payload },
      };
    case 'UPDATE_PAYMENTS':
      return {
        ...state,
        payments: { ...state.payments, ...action.payload },
      };
    case 'LOAD_FULL_DATA':
      return action.payload;
    case 'RESET_FORM':
      return initialTaxState;
    default:
      return state;
  }
}