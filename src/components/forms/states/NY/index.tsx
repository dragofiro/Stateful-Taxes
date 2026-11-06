import React from 'react';
import { useTaxContext } from '../../../../context/tax_context.tsx';
import { FormWrapper } from '../../bases/form_wrapper.tsx';
import { FormSection } from '../../bases/form_section.tsx';
import { InputField } from '../../bases/input_field.tsx';
import { CurrencyField } from '../../bases/currency_field.tsx';
import { SelectField } from '../../bases/select_field.tsx';
import { FullNameField } from '../../fields/primary_info.tsx';
import { HomeAddressField } from '../../fields/home_address.tsx';
import { compileAndDownloadPdf } from '../../../../services/pdf_compiler.tsx';
import { NY_PDF_SCHEMA } from './ny_schema.tsx';

export const NYStateForm: React.FC = () => {
  const { state, updatePersonalInfo, updateFilingStatus, updateIncome, updatePayments } = useTaxContext();

  // Handle PDF generation using pdf-lib and the NY schema
  const handleGeneratePdf = async () => {
    // Flatten context state into a flat record expected by the schema
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
          <FullNameField />
          <HomeAddressField />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="County of Residence"
              placeholder="e.g. Albany"
              value={state.personalInfo.countyOfResidence}
              onChange={(e) => updatePersonalInfo({ countyOfResidence: e.target.value })}
            />
            <InputField
              label="School District Code"
              placeholder="e.g. 051"
              value={state.personalInfo.schoolDistrictCode}
              onChange={(e) => updatePersonalInfo({ schoolDistrictCode: e.target.value })}
            />
          </div>
        </FormSection>

        {/* Section 2: Filing Status */}
        <FormSection
          title="Step 2: Filing Status"
          description="Select the filing status that matches your federal or state filing requirements."
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

        {/* Section 4: Payments & Withholdings */}
        <FormSection
          title="Step 4: Payments and Tax Withheld"
          description="Enter total state and local taxes withheld from your W-2s or 1099s."
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
              value={state.payments.nycTaxWithheld}
              onChange={(e) =>
                updatePayments({ nycTaxWithheld: parseFloat(e.target.value) || 0 })
              }
            />
          </div>
        </FormSection>

      </div>
    </FormWrapper>
  );
};

export default NYStateForm;