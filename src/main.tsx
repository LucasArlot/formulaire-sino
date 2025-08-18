import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QuoteFormProvider } from '@/features/lead/QuoteFormContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QuoteFormProvider>
      <App />
    </QuoteFormProvider>
  </StrictMode>
);
