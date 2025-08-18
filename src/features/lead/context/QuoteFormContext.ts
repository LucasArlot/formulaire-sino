import { createContext } from 'react';
import type { QuoteFormContextValue } from '@/features/lead/context/QuoteFormTypes';

export const QuoteFormContext = createContext<QuoteFormContextValue | undefined>(undefined);

// Re-export the provider from the main implementation file so consumers can import
// both the context and the provider from the same module path, ensuring a single instance.
export { QuoteFormProvider } from '../QuoteFormContext';
