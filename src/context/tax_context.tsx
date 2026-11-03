import React, { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import { taxReducer, initialTaxState, type TaxState, type TaxAction } from './tax_reducer.ts';

interface TaxContextType {
  state: TaxState;
  dispatch: React.Dispatch<TaxAction>;
  updatePersonalInfo: (payload: Partial<TaxState['personalInfo']>) => void;
  updateFilingStatus: (status: string) => void;
  updateIncome: (payload: Partial<TaxState['income']>) => void;
  updatePayments: (payload: Partial<TaxState['payments']>) => void;
  loadFullData: (data: TaxState) => void;
  resetForm: () => void;
}

const TaxContext = createContext<TaxContextType | undefined>(undefined);

export const TaxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taxReducer, initialTaxState);

  const updatePersonalInfo = (payload: Partial<TaxState['personalInfo']>) => {
    dispatch({ type: 'UPDATE_PERSONAL_INFO', payload });
  };

  const updateFilingStatus = (payload: string) => {
    dispatch({ type: 'UPDATE_FILING_STATUS', payload });
  };

  const updateIncome = (payload: Partial<TaxState['income']>) => {
    dispatch({ type: 'UPDATE_INCOME', payload });
  };

  const updatePayments = (payload: Partial<TaxState['payments']>) => {
    dispatch({ type: 'UPDATE_PAYMENTS', payload });
  };

  const loadFullData = (payload: TaxState) => {
    dispatch({ type: 'LOAD_FULL_DATA', payload });
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  useEffect(() => {
  const savedDraft = localStorage.getItem('stateful_taxes_draft');
    if (savedDraft) {
        try {
        dispatch({ type: 'LOAD_FULL_DATA', payload: JSON.parse(savedDraft) });
        } catch (e) {
        console.error('Failed to load local tax draft', e);
        }
    }
    }, []);

  useEffect(() => {
    // Auto-save to browser's secure local storage on every change
    localStorage.setItem('stateful_taxes_draft', JSON.stringify(state));
    }, [state]);

  return (
    <TaxContext.Provider
      value={{
        state,
        dispatch,
        updatePersonalInfo,
        updateFilingStatus,
        updateIncome,
        updatePayments,
        loadFullData,
        resetForm,
      }}
    >
      {children}
    </TaxContext.Provider>
  );
};

export const useTaxContext = (): TaxContextType => {
  const context = useContext(TaxContext);
  if (!context) {
    throw new Error('useTaxContext must be used within a TaxProvider');
  }
  return context;
};