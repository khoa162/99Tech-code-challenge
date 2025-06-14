import React from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../elements/Button';

export const TransactionHistory = () => {
  const { transactions } = useTransactions();

  if (transactions.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        No transactions yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Transaction History</h2>
      <AnimatePresence>
        {transactions.map((tx) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img
                  src={tx.fromToken.iconUrl}
                  alt={tx.fromToken.currency}
                  className="w-6 h-6"
                />
                <span className="font-medium dark:text-white">{tx.fromAmount}</span>
                <span className="text-gray-500 dark:text-gray-400">{tx.fromToken.currency}</span>
              </div>
              <div className="text-gray-400">→</div>
              <div className="flex items-center space-x-2">
                <img
                  src={tx.toToken.iconUrl}
                  alt={tx.toToken.currency}
                  className="w-6 h-6"
                />
                <span className="font-medium dark:text-white">{tx.toAmount}</span>
                <span className="text-gray-500 dark:text-gray-400">{tx.toToken.currency}</span>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {new Date(tx.timestamp).toLocaleString()}
            </div>
            <div className={`mt-1 text-sm ${
              tx.status === 'completed' ? 'text-green-500' : 'text-red-500'
            }`}>
              {tx.status === 'completed' ? 'Completed' : 'Failed'}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}; 