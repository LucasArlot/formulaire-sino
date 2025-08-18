import { createContext } from 'react';
import type { QuoteFormContextValue } from '@/features/lead/context/QuoteFormTypes';

export const QuoteFormContext = createContext<QuoteFormContextValue | undefined>(undefined);

// Note: provider lives in '../QuoteFormContext' to avoid circular imports
