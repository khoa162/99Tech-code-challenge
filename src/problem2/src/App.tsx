import React, { useState } from 'react';
import { SwapForm } from './components/features/SwapForm';
import { TransactionHistory } from './components/features/TransactionHistory';
import { TransactionProvider } from './context/TransactionContext';
import { DarkModeToggle } from './components/elements/DarkModeToggle';
import { ErrorBoundary } from './components/elements/ErrorBoundary';
import { MainLayout } from './components/layouts/MainLayout';

const App: React.FC = () => {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleTransactionComplete = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <ErrorBoundary>
      <TransactionProvider>
        <MainLayout>
          <DarkModeToggle />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SwapForm onTransactionComplete={handleTransactionComplete} />
            <TransactionHistory />
          </div>
        </MainLayout>
      </TransactionProvider>
    </ErrorBoundary>
  );
};

export default App; 