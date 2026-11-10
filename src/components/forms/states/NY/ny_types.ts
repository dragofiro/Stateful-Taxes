export type FilingStatusNY = '1' | '2' | '3' | '4' | '5'; 
// 1 = Single, 2 = Married filing joint, 3 = Married filing separate, 4 = Head of household, 5 = Qualifying widow(er)

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
  // Page 1: Personal Information & Residency
  fiscalYearBeginning?: string;
  fiscalYearEnding?: string;
  firstName: string;
  middleInitial: string;
  lastName: string;
  dateOfBirth?: string;
  ssn: string;
  
  spouseFirstName?: string;
  spouseMiddleInitial?: string;
  spouseLastName?: string;
  spouseDateOfBirth?: string;
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
  permanentAddress?: string;
  permanentApartment?: string;
  permanentCity?: string;
  permanentState?: string;
  permanentZip?: string;
  dateOfDeath?: string;
  spouseDateOfDeath?: string;

  filingStatus: FilingStatusNY;
  itemizedDeductionsFederal: 'yes' | 'no';
  claimedAsDependent: 'yes' | 'no';
  foreignFinancialAccount: 'yes' | 'no';
  yonkersLivingQuarters: 'yes' | 'no';
  yonkersMonthsYou: number;
  yonkersMonthsSpouse: number;
  yonkersWorkNotLive: 'yes' | 'no';
  nycLivingQuarters: 'yes' | 'no';
  nycDaysSpent: number;
  nycMonthsLived: number;
  nycMonthsSpouse: number;
  specialConditionCodes?: string;

  dependents: DependentNY[];
  moreThan7Dependents?: boolean;

  // Page 2: Income & Adjustments
  wages: number;
  taxableInterest: number;
  ordinaryDividends: number;
  taxableRefundsState: number;
  alimonyReceived: number;
  businessIncome: number;
  capitalGain: number;
  otherGains: number;
  iraBeneficiary: boolean;
  taxableIraDistributions: number;
  pensionBeneficiary: boolean;
  taxablePensions: number;
  rentalRoyalties: number;
  rentalRealEstateIncluded: number;
  farmIncome: number;
  unemploymentComp: number;
  taxableSocialSecurity: number;
  otherIncomeIdentify?: string;
  otherIncomeAmount: number;
  totalFederalAdjustmentsIdentify?: string;
  totalFederalAdjustmentsAmount: number;
  federalAdjustedGrossIncome: number;
  
  bondInterestStateLocal: number;
  publicEmployeeRetirement414h: number;
  collegeSavings529Distributions: number;
  nyAdditions: number;
  
  taxRefundsSubtractions: number;
  pensionsNysGovt: number;
  socialSecuritySubtractions: number;
  usGovtBondInterest: number;
  pensionAnnuityExclusion: number;
  collegeSavings529Deduction: number;
  nySubtractions: number;
  nyAdjustedGrossIncome: number;

  deductionType: 'standard' | 'itemized';
  deductionAmount: number;
  incomeAfterDeduction: number;
  dependentExemptionAmount: number;
  taxableIncome: number;

  // Page 3: Taxes, Credits & Surcharges
  nysTaxOnIncome: number;
  nysHouseholdCredit: number;
  residentCredit: number;
  otherNysNonrefundableCredits: number;
  netOtherNysTaxes: number;
  totalNysTaxes: number;
  nycTaxableIncome: number;
  nycResidentTax: number;
  nycHouseholdCredit: number;
  partYearNycResidentTax: number;
  otherNycTaxes: number;
  nycNonrefundableCredits: number;
  mctmtNetEarningsZone1: number;
  mctmtNetEarningsZone2: number;
  mctmtZone1: number;
  mctmtZone2: number;
  totalMctmt: number;
  yonkersResidentSurcharge: number;
  yonkersNonresidentEarningsTax: number;
  partYearYonkersSurcharge: number;
  totalCityYonkersMctmtTaxes: number;
  salesOrUseTax: number;
  voluntaryContributions: number;
  totalTaxesAndContributions: number;

  // Page 4: Refund, Payments & Signatures
  empireStateChildCredit: number;
  childDependentCareCredit: number;
  nysEic: number;
  nysNoncustodialEic: number;
  realPropertyTaxCredit: number;
  collegeTuitionCredit: number;
  nycSchoolTaxCreditFixed: number;
  nycSchoolTaxCreditRateReduction: number;
  nycEic: number;
  nycIncomeTaxEliminationCredit: number;
  otherRefundableCredits: number;
  stateTaxWithheld: number;
  nycTaxWithheld: number;
  yonkersTaxWithheld: number;
  estimatedTaxPayments: number;
  totalPayments: number;
  amountOverpaid: number;
  refundAvailable: number;
  deposit529Amount: number;
  totalRefundAfterDeposit: number;
  refundChoice: RefundChoiceNY;
  appliedTo2026EstimatedTax: number;
  amountYouOwe: number;
  electronicFundsWithdrawal: boolean;
  estimatedTaxPenalty: number;
  otherPenaltiesInterest: number;
  outsideUsAccount: boolean;
  accountType?: AccountTypeNY;
  routingNumber?: string;
  accountNumber?: string;
  withdrawalDate?: string;
  withdrawalAmount?: number;

  thirdPartyDesignee: 'yes' | 'no';
  designeeName?: string;
  designeePhone?: string;
  designeePin?: string;
  designeeEmail?: string;

  yourSignature?: string;
  yourSignatureDate?: string;
  yourOccupation?: string;
  daytimePhone?: string;
  taxpayerEmail?: string;

  spouseSignature?: string;
  spouseSignatureDate?: string;
  spouseOccupation?: string;
  spouseEmail?: string;

  preparerSignature?: string;
  preparerPrintedName?: string;
  preparerSignatureDate?: string;
  firmName?: string;
  preparerPtinsSn?: string;
  preparerNytprin?: string;
  nytprinExclCode?: string;
  preparerAddress?: string;
  employerIdNumber?: string;
}