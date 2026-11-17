export type FilingStatusNY = '1' | '2' | '3' | '4' | '5'; 

export type AccountTypeNY = 'personal_checking' | 'personal_savings' | 'business_checking' | 'business_savings';
export type RefundChoiceNY = 'direct_deposit' | 'paper_check';

export interface DependentNY {
  firstName: string;
  middleInitial: string;
  lastName: string;
  relationship: string;
  ssn: string;
  dateOfBirth: string;
}

export interface NYTaxFormValues {
  fiscalYearStart?: string;
  fiscalYearEnd?: string;
  tpFirstName: string;
  tpMi: string;
  tpLastName: string;
  tpDob?: string;
  tpSsn: string;
  tpDateDeath?: string;
  
  spouseFirstName?: string;
  spouseMi?: string;
  spouseLastName?: string;
  spouseDob?: string;
  spouseSsn?: string;
  spouseDateDeath?: string;

  tpHomeAddress: string;
  tpHomeApt?: string;
  tpHomeCity: string;
  tpHomeZip: string;

  tpMailAddress: string;
  tpMailApt?: string;
  tpMailCity: string;
  tpMailState: string;
  tpMailZip: string;
  tpMailCountry?: string;
  
  nysCountyResidence: string;
  sdName?: string;
  sdCode: string;

  filingStatus: FilingStatusNY;
  itemized: boolean;
  dependent: boolean;
  foreignAccount: boolean;

  line19: number;
  line20: number;
  line22: number;
  
  line70: number;
  line71: number;

  line83bRouting?: string;
  line83cAccountNum?: string;
}