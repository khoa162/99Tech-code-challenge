import React, { useState, useEffect } from 'react';
import { useTokens } from '../../hooks/useTokens';
import { useTransactions } from '../../context/TransactionContext';
import { TokenSelect } from './TokenSelect';
import { TokenWithIcon } from '../../types/token';
import { Button } from '../elements/Button';
import { Input } from '../elements/Input';
import { Tooltip } from '../elements/Tooltip';
import { Confetti } from '../elements/Confetti';

const TRANSACTION_FEE = 0.003;

interface SwapFormProps {
  onTransactionComplete?: () => void;
}

export const SwapForm: React.FC<SwapFormProps> = ({ onTransactionComplete }) => {
  const { tokens, loading, error } = useTokens();
  const { addTransaction } = useTransactions();
  const [fromToken, setFromToken] = useState<TokenWithIcon | null>(null);
  const [toToken, setToToken] = useState<TokenWithIcon | null>(null);
  const [amount, setAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!fromToken || !toToken || !amount) {
      setOutputAmount('');
      return;
    }

    const inputAmount = parseFloat(amount);
    if (isNaN(inputAmount)) return;

    const rate = fromToken.price / toToken.price;
    const feeAmount = inputAmount * TRANSACTION_FEE;
    const calculatedOutput = ((inputAmount - feeAmount) * rate).toFixed(6);
    setOutputAmount(calculatedOutput);
  }, [fromToken, toToken, amount]);

  const validateForm = (): boolean => {
    if (!fromToken || !toToken) {
      setFormError('Please select both tokens');
      return false;
    }
    if (fromToken.currency === toToken.currency) {
      setFormError('Cannot swap the same token');
      return false;
    }
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setFormError('Please enter a valid amount');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !fromToken || !toToken) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addTransaction({
        fromToken,
        toToken,
        fromAmount: amount,
        toAmount: outputAmount,
        status: 'completed'
      });

      setAmount('');
      setOutputAmount('');
      onTransactionComplete?.();
    } catch (error) {
      addTransaction({
        fromToken,
        toToken,
        fromAmount: amount,
        toAmount: outputAmount,
        status: 'failed'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <TokenSelect
            tokens={tokens}
            selectedToken={fromToken}
            onChange={setFromToken}
            label="From"
            disabled={isSubmitting}
          />

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSwapTokens}
              disabled={isSubmitting || !fromToken || !toToken}
              className={`p-2 rounded-full ${
                isSubmitting || !fromToken || !toToken
                  ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800'
              }`}
            >
              <svg
                className={`w-6 h-6 ${
                  isSubmitting || !fromToken || !toToken
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-indigo-600 dark:text-indigo-300'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>
          </div>

          <TokenSelect
            tokens={tokens}
            selectedToken={toToken}
            onChange={setToToken}
            label="To"
            disabled={isSubmitting}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {outputAmount && fromToken && toToken && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">You will receive</p>
            <p className="text-2xl font-semibold dark:text-white">{outputAmount}</p>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              <p>Exchange Rate: 1 {fromToken.currency} = {(fromToken.price / toToken.price).toFixed(6)} {toToken.currency}</p>
              <p>Fee: {(parseFloat(amount) * TRANSACTION_FEE).toFixed(6)} {fromToken.currency}</p>
            </div>
          </div>
        )}

        {formError && (
          <div className="text-red-500 text-sm">{formError}</div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
            isSubmitting
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Swapping...
            </div>
          ) : (
            'Swap'
          )}
        </button>
      </form>
    </div>
  );
}; 