// React import not needed in TSX with modern tooling
import { QuoteForm } from '@/features/lead';
import { QuoteFormProvider } from '@/features/lead/QuoteFormContext';
import '@/styles/main.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-[#D6DF20]/10 flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-[#D6DF20]/10 rounded-full blur-3xl -top-48 -left-48 animate-blob mix-blend-multiply"></div>
        <div className="absolute w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl -bottom-48 -right-48 animate-blob animation-delay-2000 mix-blend-multiply"></div>
        <div className="absolute w-[500px] h-[500px] bg-[#001C38]/5 rounded-full blur-3xl top-1/2 left-1/2 animate-blob animation-delay-4000 mix-blend-multiply"></div>
      </div>

      {/* Light effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsIDAsIDAsIDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50 pointer-events-none"></div>
      
      <QuoteFormProvider>
        <QuoteForm />
      </QuoteFormProvider>
    </div>
  );
}

export default App;