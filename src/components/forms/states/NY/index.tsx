import React from 'react';
import { useTaxContext } from '../../../../context/tax_context.tsx';
import { FormWrapper } from '../../bases/form_wrapper.tsx';
import { FormSection } from '../../bases/form_section.tsx';
import { InputField } from '../../bases/input_field.tsx';
import { CurrencyField } from '../../bases/currency_field.tsx';
import { SelectField } from '../../bases/select_field.tsx';
import { PrimaryInfoField } from '../../fields/primary_info.tsx';
import { HomeAddressField } from '../../fields/home_address.tsx';
import { compileAndDownloadPdf } from '../../../../services/pdf_compiler.tsx';
import { NY_PDF_SCHEMA } from './ny_schema.tsx';

export const NYStateForm: React.FC = () => {
  const { state, updatePersonalInfo, updateFilingStatus, updateIncome, updatePayments } = useTaxContext();

  const handleGeneratePdf = async () => {
    const flatFormData = {
      ...state.personalInfo,
      filingStatus: state.filingStatus,
      ...state.income,
      ...state.payments,
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

  return (
    <FormWrapper
      title="New York Resident Income Tax Return"
      formCode="IT-201"
      stateName="New York"
      onGeneratePdf={handleGeneratePdf}
    >
      <div className="space-y-6">
        
        {/* Section 1: Personal Info */}
        <FormSection
          title="Step 1: Taxpayer Information"
          description="Enter your legal identification and residency details as of December 31."
        >
          <PrimaryInfoField />
          <HomeAddressField />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="County of Residence"
              placeholder="e.g. Albany"
              value={state.personalInfo.countyOfResidence}
              onChange={(e) => updatePersonalInfo({ countyOfResidence: e.target.value })}
            />
            <InputField
              label="School District Name"
              placeholder="e.g. Albany City SD"
              value={state.personalInfo.schoolDistrictName || ''}
              onChange={(e) => updatePersonalInfo({ schoolDistrictName: e.target.value })}
            />
            <InputField
              label="School District Code"
              placeholder="e.g. 051"
              value={state.personalInfo.schoolDistrictCode}
              onChange={(e) => updatePersonalInfo({ schoolDistrictCode: e.target.value })}
            />
          </div>
        </FormSection>

        {/* Section 2: Filing Status & Questions */}
        <FormSection
          title="Step 2: Filing Status & Special Conditions"
          description="Select your filing status and answer required residency and compliance questions."
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <SelectField
              label="Itemized deductions on federal return?"
              value={state.personalInfo.itemizedDeductionsFederal || 'no'}
              onChange={(e) =>
                updatePersonalInfo({
                  itemizedDeductionsFederal: e.target.value as 'yes' | 'no',
                })
              }
              options={[
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },
              ]}
            />
            <SelectField
              label="Claimed as dependent on another return?"
              value={state.personalInfo.claimedAsDependent || 'no'}
              onChange={(e) =>
                updatePersonalInfo({
                  claimedAsDependent: e.target.value as 'yes' | 'no',
                })
              }
              options={[
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },
              ]}
            />
          </div>
        </FormSection>

        {/* Section 3: Income & Adjustments */}
        <FormSection
          title="Step 3: Federal Income & Adjustments"
          description="Report your income figures from your federal return and state modifications."
        >
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
        </FormSection>

        {/* Section 4: Payments, Refunds & Direct Deposit */}
        <FormSection
          title="Step 4: Payments, Tax Withheld & Refund Options"
          description="Enter total state tax withheld and specify refund or direct deposit preferences."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <SelectField
              label="Refund Choice"
              value={state.payments.refundChoice || 'direct_deposit'}
              onChange={(e) => updatePayments({ refundChoice: e.target.value })}
              options={[
                { label: 'Direct Deposit', value: 'direct_deposit' },
                { label: 'Paper Check', value: 'paper_check' },
              ]}
            />
            <SelectField
              label="Bank Account Type (Line 83a)"
              value={state.payments.accountType || 'personal_checking'}
              onChange={(e) => updatePayments({ accountType: e.target.value })}
              options={[
                { label: 'Personal Checking', value: 'personal_checking' },
                { label: 'Personal Savings', value: 'personal_savings' },
                { label: 'Business Checking', value: 'business_checking' },
                { label: 'Business Savings', value: 'business_savings' },
              ]}
            />
          </div>
        </FormSection>

      </div>
    </FormWrapper>
  );
};

export default NYStateForm;