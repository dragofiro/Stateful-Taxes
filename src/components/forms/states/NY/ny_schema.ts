import { NYTaxFormValues } from './ny_types';

export const NY_PDF_SCHEMA: Record<keyof NYTaxFormValues, string> = {
  firstName: 'TopmostSubform[0].Page1[0].Filer_FirstName[0]',
  middleInitial: 'TopmostSubform[0].Page1[0].Filer_MI[0]',
  lastName: 'TopmostSubform[0].Page1[0].Filer_LastName[0]',
  ssn: 'TopmostSubform[0].Page1[0].Filer_SSN[0]',
  
  spouseFirstName: 'TopmostSubform[0].Page1[0].Spouse_FirstName[0]',
  spouseMiddleInitial: 'TopmostSubform[0].Page1[0].Spouse_MI[0]',
  spouseLastName: 'TopmostSubform[0].Page1[0].Spouse_LastName[0]',
  spouseSsn: 'TopmostSubform[0].Page1[0].Spouse_SSN[0]',

  mailingAddress: 'TopmostSubform[0].Page1[0].Address_Street[0]',
  apartmentNumber: 'TopmostSubform[0].Page1[0].Address_Apt[0]',
  city: 'TopmostSubform[0].Page1[0].Address_City[0]',
  state: 'TopmostSubform[0].Page1[0].Address_State[0]',
  zipCode: 'TopmostSubform[0].Page1[0].Address_Zip[0]',
  
  countyOfResidence: 'TopmostSubform[0].Page1[0].County_Resident[0]',
  schoolDistrictCode: 'TopmostSubform[0].Page1[0].School_District_Code[0]',
  nycMonthsLived: 'TopmostSubform[0].Page1[0].NYC_Months[0]',

  filingStatus: 'TopmostSubform[0].Page1[0].Filing_Status_Boxes[0]',
  federalAdjustedGrossIncome: 'TopmostSubform[0].Page1[0].Line19_FederalAGI[0]',
  nyAdditions: 'TopmostSubform[0].Page1[0].Line20_Additions[0]',
  nySubtractions: 'TopmostSubform[0].Page1[0].Line22_Subtractions[0]',
  
  stateTaxWithheld: 'TopmostSubform[0].Page2[0].Line70_StateWithheld[0]',
  nycTaxWithheld: 'TopmostSubform[0].Page2[0].Line71_NYCWithheld[0]',
};