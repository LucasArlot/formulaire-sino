import { createContext, type Context } from 'react';
import type { QuoteFormContextValue } from '@/features/lead/context/QuoteFormTypes';

declare global {
  interface Window {
    __QUOTE_FORM_CONTEXT__?: Context<QuoteFormContextValue | undefined>;
  }
}

// Ensure a single context instance even if module is evaluated more than once
export const QuoteFormContext: Context<QuoteFormContextValue | undefined> =
  typeof window !== 'undefined' && window.__QUOTE_FORM_CONTEXT__
    ? window.__QUOTE_FORM_CONTEXT__
    : createContext<QuoteFormContextValue | undefined>(undefined);

if (typeof window !== 'undefined') {
  window.__QUOTE_FORM_CONTEXT__ = QuoteFormContext;
}

// Note: provider lives in '../QuoteFormContext' to avoid circular imports
