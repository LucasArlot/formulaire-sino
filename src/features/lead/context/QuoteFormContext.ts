import { createContext } from 'react';
import type { QuoteFormContextValue } from '@/features/lead/context/QuoteFormTypes';

export const QuoteFormContext = createContext<QuoteFormContextValue | undefined>(undefined);
