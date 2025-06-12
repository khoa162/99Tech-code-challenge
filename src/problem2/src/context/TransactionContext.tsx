import React, { createContext, useContext, useState } from 'react';
import { TokenWithIcon } from '../types/token';

export interface Transaction {
  id: string;
  fromToken: TokenWithIcon;
  toToken: TokenWithIcon;
  fromAmount: string;
  toAmount: string;
  status: 'completed' | 'failed';
  timestamp: number;
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  error: string | null;
  clearError: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    try {
      const newTransaction: Transaction = {
        ...transaction,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      };
      setTransactions(prev => [newTransaction, ...prev]);
      setError(null);
    } catch (err) {
      setError('Failed to add transaction. Please try again.');
    }
  };

  const clearError = () => setError(null);

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, error, clearError }}>
      {children}
    </TransactionContext.Provider>
  );
}; 