// Provides the context for managing tax state and form data throughout the application.
// The draft is saved to this browser's local storage on every change and read back on load.
import React, { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import {
  taxReducer,
  createInitialTaxState,
  normalizeTaxState,
  type AdditionKey,
  type AmountPair,
  type FilingStatus,
  type IncomeLineKey,
  type SubtractionKey,
  type TaxState,
  type TaxAction,
} from './tax_reducer.ts';

const STORAGE_KEY = 'stateful_taxes_draft';

interface TaxContextType {
  state: TaxState;
  dispatch: React.Dispatch<TaxAction>;
  updatePersonalInfo: (payload: Partial<TaxState['personalInfo']>) => void;
  updateFilingStatus: (status: FilingStatus) => void;
  updateResidency: (payload: Partial<TaxState['residency']>) => void;
  updateIncomeLine: (key: IncomeLineKey, payload: Partial<AmountPair>) => void;
  updateAdjustments: (payload: Partial<AmountPair>) => void;
  updateAddition: (key: AdditionKey, payload: Partial<AmountPair>) => void;
  updateSubtraction: (key: SubtractionKey, payload: Partial<AmountPair>) => void;
  updateDeductions: (payload: Partial<TaxState['deductions']>) => void;
  updateCredits: (payload: Partial<TaxState['credits']>) => void;
  updatePayments: (payload: Partial<TaxState['payments']>) => void;
  goToStep: (step: string) => void;
  loadFullData: (data: unknown) => void;
  resetForm: () => void;
}

const TaxContext = createContext<TaxContextType | undefined>(undefined);

/** Reads the saved draft before the first render, so a reload never shows an empty form first. */
function loadSavedDraft(): TaxState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return normalizeTaxState(JSON.parse(saved));
  } catch (e) {
    console.error('Failed to load local tax draft', e);
  }
  return createInitialTaxState();
}

export const TaxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taxReducer, undefined, loadSavedDraft);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save local tax draft', e);
    }
  }, [state]);

  const helpers = useMemo(
    () => ({
      updatePersonalInfo: (payload: Partial<TaxState['personalInfo']>) => dispatch({ type: 'UPDATE_PERSONAL_INFO', payload }),
      updateFilingStatus: (payload: FilingStatus) => dispatch({ type: 'UPDATE_FILING_STATUS', payload }),
      updateResidency: (payload: Partial<TaxState['residency']>) => dispatch({ type: 'UPDATE_RESIDENCY', payload }),
      updateIncomeLine: (key: IncomeLineKey, payload: Partial<AmountPair>) =>
        dispatch({ type: 'UPDATE_INCOME_LINE', key, payload }),
      updateAdjustments: (payload: Partial<AmountPair>) => dispatch({ type: 'UPDATE_ADJUSTMENTS', payload }),
      updateAddition: (key: AdditionKey, payload: Partial<AmountPair>) => dispatch({ type: 'UPDATE_ADDITION', key, payload }),
      updateSubtraction: (key: SubtractionKey, payload: Partial<AmountPair>) =>
        dispatch({ type: 'UPDATE_SUBTRACTION', key, payload }),
      updateDeductions: (payload: Partial<TaxState['deductions']>) => dispatch({ type: 'UPDATE_DEDUCTIONS', payload }),
      updateCredits: (payload: Partial<TaxState['credits']>) => dispatch({ type: 'UPDATE_CREDITS', payload }),
      updatePayments: (payload: Partial<TaxState['payments']>) => dispatch({ type: 'UPDATE_PAYMENTS', payload }),
      goToStep: (payload: string) => dispatch({ type: 'GO_TO_STEP', payload }),
      loadFullData: (payload: unknown) => dispatch({ type: 'LOAD_FULL_DATA', payload }),
      resetForm: () => dispatch({ type: 'RESET_FORM' }),
    }),
    [],
  );

  const value = useMemo(() => ({ state, dispatch, ...helpers }), [state, helpers]);

  return <TaxContext.Provider value={value}>{children}</TaxContext.Provider>;
};

export const useTaxContext = (): TaxContextType => {
  const context = useContext(TaxContext);
  if (!context) {
    throw new Error('useTaxContext must be used within a TaxProvider');
  }
  return context;
};
