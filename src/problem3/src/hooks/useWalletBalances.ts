import { useState, useEffect } from 'react';
import { WalletBalance } from '../types/wallet';

interface WalletBalancesResult {
  balances: WalletBalance[];
  isLoading: boolean;
  error: string | null;
}

// Simulate network delay
const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export const useWalletBalances = (): WalletBalancesResult => {
  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Simulate API call
        const response = await new Promise<WalletBalance[]>((resolve) => {
          setTimeout(() => {
            resolve([
              { currency: 'OSMO', amount: 123.45, blockchain: 'Osmosis' },
              { currency: 'ETH', amount: 1.234, blockchain: 'Ethereum' },
              { currency: 'ARB', amount: 42.69, blockchain: 'Arbitrum' },
              { currency: 'ZIL', amount: 1337.42, blockchain: 'Zilliqa' },
              { currency: 'NEO', amount: 0, blockchain: 'Neo' },
              { currency: 'BTC', amount: 0.001, blockchain: 'Bitcoin' },
            ]);
          }, 1000);
        });
        setBalances(response);
      } catch (err) {
        setError('Failed to fetch wallet balances');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
  }, []);

  return { balances, isLoading, error };
}; 