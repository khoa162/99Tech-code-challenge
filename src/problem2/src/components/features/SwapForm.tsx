import React, { useState, useEffect, useCallback, memo } from 'react';
import { useTokens } from '../../hooks/useTokens';
import { useTransactions } from '../../context/TransactionContext';
import { TokenSelect } from './TokenSelect';
import { TokenWithIcon } from '../../types/token';
import { Button } from '../elements/Button';
import { Tooltip } from '../elements/Tooltip';
import { motion, AnimatePresence } from 'framer-motion';

// TODO: Move to constants file later
const TRANSACTION_FEE = 0.003; // 0.3% fee, standard fee used by major DEXs like Uniswap V2, SushiSwap

interface SwapFormProps {
  onTransactionComplete?: () => void;
}

// Memoized components
const TokenSelectMemo = memo(TokenSelect);
const TooltipMemo = memo(Tooltip);

export const SwapForm: React.FC<SwapFormProps> = ({ onTransactionComplete }) => {
  const { tokens, loading, error, refetch } = useTokens();
  const { addTransaction } = useTransactions();
  const [fromToken, setFromToken] = useState<TokenWithIcon | null>(null);
  const [toToken, setToToken] = useState<TokenWithIcon | null>(null);
  const [amount, setAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [feeAmount, setFeeAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // swap error message

  // Calculate output amount whenever inputs change
  useEffect(() => {
    if (!fromToken || !toToken || !amount) {
      setOutputAmount('');
      setExchangeRate(0);
      setFeeAmount(0);
      return;
    }

    const inputAmount = parseFloat(amount);
    if (isNaN(inputAmount)) return;

    // Calculate exchange rate using exact prices
    const rate = fromToken.price / toToken.price;
    setExchangeRate(rate);
    console.log("rate >>>>:", rate);
    // Calculate total output first
    const totalOutput = inputAmount * rate;
    console.log("totalOutput >>>>:", totalOutput);
    // Then calculate fee on the output amount
    const calculatedFee = totalOutput * TRANSACTION_FEE;
    setFeeAmount(calculatedFee);
    console.log("feeAmount >>>>:", calculatedFee);
    const calculatedOutput = totalOutput - calculatedFee;
    console.log("calculatedOutput >>>>:", calculatedOutput);
    
    // Only format the final display value
    setOutputAmount(calculatedOutput.toFixed(6));
  }, [fromToken, toToken, amount]);

  const validateForm = useCallback((): boolean => {
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
  }, [fromToken, toToken, amount]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !fromToken || !toToken) return;

    setIsSubmitting(true);
    setFormError(null);
    setShowError(false);
    setShowSuccess(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addTransaction({
        fromToken,
        toToken,
        fromAmount: amount,
        toAmount: outputAmount,
        status: 'completed'
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // Reset form
      setAmount('');
      setOutputAmount('');
      onTransactionComplete?.();
    } catch (error) {
      // Only show error for real failures
      console.error('Swap failed:', error);
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
  }, [fromToken, toToken, amount, outputAmount, validateForm, addTransaction, onTransactionComplete]);

  const handleSwapTokens = useCallback(() => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  }, [fromToken, toToken]);

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
        <button 
          onClick={refetch}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
    >
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-4 right-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-4 py-2 rounded-lg shadow-lg"
          >
            Swap completed successfully!
          </motion.div>
        )}
        {showError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-4 right-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 px-4 py-2 rounded-lg shadow-lg"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-4"
        >
          <TokenSelectMemo
            tokens={tokens}
            selectedToken={fromToken}
            onChange={setFromToken}
            label="From"
            disabled={isSubmitting}
          />

          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
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
            </motion.button>
          </div>

          <TokenSelectMemo
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
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </motion.div>

        {outputAmount && fromToken && toToken && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <p className="text-sm text-gray-600 dark:text-gray-300">You will receive</p>
            <p className="text-2xl font-semibold dark:text-white">{outputAmount}</p>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              <TooltipMemo text="The current exchange rate between the selected tokens">
                <p>Exchange Rate: 1 {fromToken.currency} = {exchangeRate.toFixed(2)} {toToken.currency}</p>
              </TooltipMemo>
              <TooltipMemo text="A 0.3% fee is charged on each swap transaction">
                <p>Fee: {feeAmount.toFixed(6)} {toToken.currency}</p>
              </TooltipMemo>
            </div>
          </motion.div>
        )}

        {formError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-red-500 text-sm"
          >
            {formError}
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
        </motion.button>
      </form>
    </motion.div>
  );
}; 