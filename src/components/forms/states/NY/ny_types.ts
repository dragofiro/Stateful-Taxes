export type FilingStatusNY = '1' | '2' | '3' | '4' | '5'; 
// 1 = Single, 2 = Married filing joint, 3 = Married filing separate, 4 = Head of household, 5 = Qualifying widow(er)

export interface NYTaxFormValues {
  // Personal Information (Step 1)
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
  
  // Residency & Local Info
  countyOfResidence: string;
  schoolDistrictCode: string;
  nycMonthsLived: string; // Item F

  // Filing Status & Income (Step 2 & 3)
  filingStatus: FilingStatusNY;
  federalAdjustedGrossIncome: number;
  nyAdditions: number;
  nySubtractions: number;
  
  // Payments & Withholding
  stateTaxWithheld: number;
  nycTaxWithheld: number;
}