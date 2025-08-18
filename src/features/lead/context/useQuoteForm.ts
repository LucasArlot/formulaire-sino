import { useContext } from 'react';
import { QuoteFormContext } from '@/features/lead/context/QuoteFormContext';
import type { QuoteFormContextValue } from '@/features/lead/context/QuoteFormTypes';

export function useQuoteForm(): QuoteFormContextValue {
  const ctx = useContext(QuoteFormContext);
  if (!ctx) throw new Error('useQuoteForm must be used inside <QuoteFormProvider>');
  return ctx;
}
