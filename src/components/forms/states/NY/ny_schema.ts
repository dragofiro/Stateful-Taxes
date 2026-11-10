import { type NYTaxFormValues } from './ny_types.ts';

export const NY_PDF_SCHEMA: Record<keyof NYTaxFormValues | string, string> = {
  fiscalYearBeginning: 'TopmostSubform[0].Page1[0].FiscalYear_Begin[0]',
  fiscalYearEnding: 'TopmostSubform[0].Page1[0].FiscalYear_End[0]',
  firstName: 'TopmostSubform[0].Page1[0].Filer_FirstName[0]',
  middleInitial: 'TopmostSubform[0].Page1[0].Filer_MI[0]',
  lastName: 'TopmostSubform[0].Page1[0].Filer_LastName[0]',
  dateOfBirth: 'TopmostSubform[0].Page1[0].Filer_DOB[0]',
  ssn: 'TopmostSubform[0].Page1[0].Filer_SSN[0]',
  
  spouseFirstName: 'TopmostSubform[0].Page1[0].Spouse_FirstName[0]',
  spouseMiddleInitial: 'TopmostSubform[0].Page1[0].Spouse_MI[0]',
  spouseLastName: 'TopmostSubform[0].Page1[0].Spouse_LastName[0]',
  spouseDateOfBirth: 'TopmostSubform[0].Page1[0].Spouse_DOB[0]',
  spouseSsn: 'TopmostSubform[0].Page1[0].Spouse_SSN[0]',

  mailingAddress: 'TopmostSubform[0].Page1[0].Address_Street[0]',
  apartmentNumber: 'TopmostSubform[0].Page1[0].Address_Apt[0]',
  city: 'TopmostSubform[0].Page1[0].Address_City[0]',
  state: 'TopmostSubform[0].Page1[0].Address_State[0]',
  zipCode: 'TopmostSubform[0].Page1[0].Address_Zip[0]',
  country: 'TopmostSubform[0].Page1[0].Address_Country[0]',
  
  countyOfResidence: 'TopmostSubform[0].Page1[0].County_Resident[0]',
  schoolDistrictName: 'TopmostSubform[0].Page1[0].School_District_Name[0]',
  schoolDistrictCode: 'TopmostSubform[0].Page1[0].School_District_Code[0]',
  
  filingStatus: 'TopmostSubform[0].Page1[0].Filing_Status_Boxes[0]',
  itemizedDeductionsFederal: 'TopmostSubform[0].Page1[0].Itemized_Federal[0]',
  claimedAsDependent: 'TopmostSubform[0].Page1[0].Claimed_Dependent[0]',
  foreignFinancialAccount: 'TopmostSubform[0].Page1[0].Foreign_Account[0]',
  
  nycMonthsLived: 'TopmostSubform[0].Page1[0].NYC_Months[0]',
  specialConditionCodes: 'TopmostSubform[0].Page1[0].Special_Condition_Codes[0]',

  federalAdjustedGrossIncome: 'TopmostSubform[0].Page1[0].Line19_FederalAGI[0]',
  nyAdditions: 'TopmostSubform[0].Page1[0].Line20_Additions[0]',
  nySubtractions: 'TopmostSubform[0].Page1[0].Line22_Subtractions[0]',
  
  stateTaxWithheld: 'TopmostSubform[0].Page2[0].Line70_StateWithheld[0]',
  nycTaxWithheld: 'TopmostSubform[0].Page2[0].Line71_NYCWithheld[0]',
  
  refundChoice: 'TopmostSubform[0].Page4[0].Refund_Choice[0]',
  accountType: 'TopmostSubform[0].Page4[0].Account_Type[0]',
  routingNumber: 'TopmostSubform[0].Page4[0].Routing_Number[0]',
  accountNumber: 'TopmostSubform[0].Page4[0].Account_Number[0]',
};