import { type NYTaxFormValues } from './ny_types.ts';

export const NY_PDF_SCHEMA: Record<keyof NYTaxFormValues | string, string> = {
  fiscalYearStart: 'Fiscal_year_start',
  fiscalYearEnd: 'Fiscal_year_end',
  tpFirstName: 'TP_first_name',
  tpMi: 'TP_MI',
  tpLastName: 'TP_last_name',
  tpDob: 'TP_DOB',
  tpSsn: 'TP_SSN',
  tpDateDeath: 'TP_date_death',
  
  spouseFirstName: 'Spouse_first_name',
  spouseMi: 'Spouse_MI',
  spouseLastName: 'Spouse_last_name',
  spouseDob: 'Spouse_DOB',
  spouseSsn: 'Spouse_SSN',
  spouseDateDeath: 'Spouse_date_death',

  tpHomeAddress: 'TP_home_address',
  tpHomeApt: 'TP_home_apt',
  tpHomeCity: 'TP_home_city',
  tpHomeZip: 'TP_home_zip',

  tpMailAddress: 'TP_mail_address',
  tpMailApt: 'TP_mail_apt',
  tpMailCity: 'TP_mail_city',
  tpMailState: 'TP_mail_state',
  tpMailZip: 'TP_mail_zip',
  tpMailCountry: 'TP_mail_country',
  
  nysCountyResidence: 'NYS_county_residence',
  sdName: 'SD_name',
  sdCode: 'SD_code',
  
  filingStatus: 'Filing_status',
  itemized: 'Itemized',
  dependent: 'Dependent',
  foreignAccount: 'Foreign_account',
  
  line19: 'Line19',
  line20: 'Line20',
  line22: 'Line22',
  
  line70: 'Line70',
  line71: 'Line71',
  
  line83bRouting: 'Line83b_routing',
  line83cAccountNum: 'Line83c_account_num',
};