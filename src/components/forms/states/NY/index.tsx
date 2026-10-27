import React from 'react';
import { useTaxContext } from '../../../../context/TaxContext'; // Assuming context setup
import { FormWrapper } from '../../bases/form_wrapper';
import { InputField } from '../../bases/input_field';
import { SelectField } from '../../bases/select_field';
import { FullNameField } from '../../fields/full_name';
import { HomeAddressField } from '../../fields/home_address';

export const NYStateForm: React.FC = () => {
  // Connected to centralized local store (TaxContext)
  // const { stateData, updateStateData } = useTaxContext();

  return (
    <FormWrapper title="New York Resident Income Tax Return" formCode="IT-201">
      <div className="space-y-6">
        
        {/* Section 1: Personal Info */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">
            Step 1: Taxpayer Information
          </h3>
          <FullNameField />
          <HomeAddressField />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField 
              label="County of Residence (as of Dec 31)" 
              placeholder="e.g. Albany" 
            />
            <InputField 
              label="School District Code" 
              placeholder="e.g. 051" 
            />
          </div>
        </div>

        {/* Section 2: Filing Status */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">
            Step 2: Filing Status
          </h3>
          <SelectField 
            label="Select Filing Status"
            options={[
              { label: '1 - Single', value: '1' },
              { label: '2 - Married filing joint return', value: '2' },
              { label: '3 - Married filing separate return', value: '3' },
              { label: '4 - Head of household (with qualifying person)', value: '4' },
              { label: '5 - Qualifying widow(er) with dependent child', value: '5' },
            ]}
          />
        </div>

        {/* Section 3: Income & Adjustments */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">
            Step 3: Federal Income & Adjustments
          </h3>
          <InputField 
            label="Federal Adjusted Gross Income (AGI)" 
            type="number"
            placeholder="0" 
          />
        </div>

      </div>
    </FormWrapper>
  );
};

export default NYStateForm;