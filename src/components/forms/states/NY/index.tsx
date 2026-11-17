// New York filing workflow: the beginning stage (residency, filer, household) and the middle stage
// (income, New York adjustments, deductions, credits, payments), with a running estimate beside each step.
// The final stage (review, sign and print the PDF) comes later.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '@fontsource-variable/newsreader/opsz.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '../../bases/forms.css';
import { useTaxContext } from '../../../../context/tax_context.tsx';
import { FormWrapper } from '../../bases/form_wrapper.tsx';
import { FormSection } from '../../bases/form_section.tsx';
import { CurrencyField } from '../../bases/currency_field.tsx';
import { SelectField } from '../../bases/select_field.tsx';

import { PrimaryInfoField } from '../../fields/primary_info.tsx';
import { SpouseInfoField } from '../../fields/spouse_info.tsx';
import { HomeAddressField } from '../../fields/home_address.tsx';
import { MailingAddressField } from '../../fields/mailing_address.tsx';
import { DependantInfoField } from '../../fields/dependant_info.tsx';
import { EmployerWitholdingField } from '../../fields/employer_witholding.tsx';
import { BankAccountInfoField } from '../../fields/bank_account_info.tsx';

import { compileAndDownloadPdf } from '../../../../services/pdf_compiler.ts';
import { NY_PDF_SCHEMA } from './ny_schema.ts';

export const NYStateForm: React.FC = () => {
  const { state, updatePersonalInfo, updateFilingStatus, updateIncome, updatePayments } = useTaxContext();

  const handleGeneratePdf = async () => {
    // Map tax state property names to the exact keys defined in NY_PDF_SCHEMA
    const flatFormData = {
      fiscalYearStart: '',
      fiscalYearEnd: '',
      tpFirstName: state.personalInfo.firstName,
      tpMi: state.personalInfo.middleInitial,
      tpLastName: state.personalInfo.lastName,
      tpDob: state.personalInfo.dateOfBirth,
      tpSsn: state.personalInfo.ssn,
      tpDateDeath: state.personalInfo.spouseDateOfDeath,
      
      spouseFirstName: state.personalInfo.spouseFirstName,
      spouseMi: state.personalInfo.spouseMiddleInitial,
      spouseLastName: state.personalInfo.spouseLastName,
      spouseDob: state.personalInfo.spouseDateOfBirth,
      spouseSsn: state.personalInfo.spouseSsn,
      spouseDateDeath: state.personalInfo.spouseDateOfDeath,

      tpHomeAddress: state.personalInfo.mailingAddress,
      tpHomeApt: state.personalInfo.apartmentNumber,
      tpHomeCity: state.personalInfo.city,
      tpHomeZip: state.personalInfo.zipCode,

      tpMailAddress: state.personalInfo.mailingAddress,
      tpMailApt: state.personalInfo.apartmentNumber,
      tpMailCity: state.personalInfo.city,
      tpMailState: state.personalInfo.state,
      tpMailZip: state.personalInfo.zipCode,
      tpMailCountry: state.personalInfo.country,
      
      nysCountyResidence: state.personalInfo.countyOfResidence,
      sdName: state.personalInfo.schoolDistrictName,
      sdCode: state.personalInfo.schoolDistrictCode,
      
      filingStatus: state.filingStatus,
      itemized: state.personalInfo.itemizedDeductionsFederal === 'yes',
      dependent: state.personalInfo.claimedAsDependent === 'yes',
      foreignAccount: false,
      
      line19: state.income.federalAdjustedGrossIncome,
      line20: state.income.nyAdditions,
      line22: state.income.nySubtractions,
      
      line70: state.payments.stateTaxWithheld,
      line71: state.payments.taxWithheld,
      
      line83bRouting: state.bankInfo.routingNumber,
      line83cAccountNum: state.bankInfo.accountNumber,
    };

    try {
      await compileAndDownloadPdf({
        stateCode: 'NY',
        stateFolder: 'new_york',
        pdfFilename: 'it201.pdf',
        formData: flatFormData,
        schema: NY_PDF_SCHEMA,
      });
    } catch (error) {
      alert('Failed to generate New York IT-201 PDF template locally.');
    }
  };

  const stepProps = { errors, estimate };
  const nextStep = NY_STEPS[index + 1];

  return (
    <FormWrapper
      title="New York Resident Income Tax Return"
      formCode="IT-201"
      stateName="New York"
      onGeneratePdf={handleGeneratePdf}
    >
      <div className="space-y-6">
        
        {/* Step 1: Filing Status */}
        <FormSection
          title="Step 1: Filing Status & Residency"
          description="Select your filing status and general tax parameters."
        >
          <SelectField
            label="Filing Status"
            value={state.filingStatus}
            onChange={(e) => updateFilingStatus(e.target.value)}
            options={[
              { label: '1 - Single', value: '1' },
              { label: '2 - Married filing joint return', value: '2' },
              { label: '3 - Married filing separate return', value: '3' },
              { label: '4 - Head of household (with qualifying person)', value: '4' },
              { label: '5 - Qualifying widow(er) with dependent child', value: '5' },
            ]}
          />
        </FormSection>

        {/* Step 2: Personal Identification */}
        <FormSection
          title="Step 2: Primary Taxpayer Information"
          description="Enter your personal identification details."
        >
          <PrimaryInfoField />
          
          {/* Conditional Spouse Block for Joint Returns */}
          {(state.filingStatus === '2' || state.filingStatus === '3') && (
            <SpouseInfoField />
          )}
        </FormSection>

        {/* Step 3: Address Information */}
        <FormSection
          title="Step 3: Addresses"
          description="Provide your permanent home address and mailing address."
        >
          <HomeAddressField />
          <MailingAddressField />
        </FormSection>

        {/* Step 4: Dependents */}
        <FormSection
          title="Step 4: Dependents"
          description="List any qualifying dependents to claim exemptions."
        >
          <DependantInfoField />
        </FormSection>

        {/* Step 5: W-2 & Income */}
        <FormSection
          title="Step 5: Income & Employer Withholding"
          description="Enter figures from your Federal return and W-2 statements."
        >
          <EmployerWitholdingField />

          <div className="pt-4 space-y-4 border-t border-slate-800">
            <CurrencyField
              label="Federal Adjusted Gross Income (AGI)"
              value={state.income.federalAdjustedGrossIncome}
              onChange={(e) =>
                updateIncome({ federalAdjustedGrossIncome: parseFloat(e.target.value) || 0 })
              }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CurrencyField
                label="New York Additions"
                value={state.income.nyAdditions}
                onChange={(e) => updateIncome({ nyAdditions: parseFloat(e.target.value) || 0 })}
              />
              <CurrencyField
                label="New York Subtractions"
                value={state.income.nySubtractions}
                onChange={(e) => updateIncome({ nySubtractions: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
        </FormSection>

        {/* Step 6: Direct Deposit & Banking */}
        <FormSection
          title="Step 6: Direct Deposit & Payments"
          description="Provide bank account details for refund direct deposit or balance payment."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <CurrencyField
              label="New York State Tax Withheld"
              value={state.payments.stateTaxWithheld}
              onChange={(e) =>
                updatePayments({ stateTaxWithheld: parseFloat(e.target.value) || 0 })
              }
            />
            <CurrencyField
              label="New York City Tax Withheld"
              value={state.payments.taxWithheld}
              onChange={(e) =>
                updatePayments({ taxWithheld: parseFloat(e.target.value) || 0 })
              }
            />
          </div>
          <BankAccountInfoField />
        </FormSection>

            {current === 'start' && <ResidencyStep {...stepProps} />}
            {current === 'filer' && <FilerStep {...stepProps} />}
            {current === 'household' && <HouseholdStep {...stepProps} />}
            {current === 'income' && <IncomeStep {...stepProps} />}
            {current === 'ny-adjustments' && <AdjustmentsStep {...stepProps} />}
            {current === 'deductions' && <DeductionsStep {...stepProps} />}
            {current === 'credits' && <CreditsStep {...stepProps} />}
            {current === 'payments' && <PaymentsStep {...stepProps} />}
            {current === 'checkpoint' && <CheckpointStep {...stepProps} onEdit={go} onSaveJson={saveJson} />}
          </FormWrapper>

          <nav className="tf-step-nav" aria-label="Step navigation">
            {index > 0 ? (
              <button type="button" className="tf-btn tf-btn--ghost" onClick={back}>
                ← Back
              </button>
            ) : (
              <span />
            )}
            {nextStep ? (
              <div className="tf-step-nav-next">
                <span className="tf-step-nav-label">Next: {nextStep.navLabel}</span>
                <button type="button" className="tf-btn" onClick={next}>
                  Continue →
                </button>
              </div>
            ) : (
              <button type="button" className="tf-btn" disabled title="Review and printing come in the next stage.">
                Review and print (coming soon)
              </button>
            )}
          </nav>
        </main>

        <EstimateRail
          estimate={estimate}
          showCity={state.residency.nyc === 'full'}
          showYonkers={state.residency.yonkers === 'full'}
        />
      </div>

      <footer className="tf-footer">
        Everything you enter stays on your computer. Stateful Taxes is not affiliated with the IRS or the New York State
        Department of Taxation and Finance. Check every form before you mail it.
      </footer>
    </div>
  );
};

export default NYStateForm;
