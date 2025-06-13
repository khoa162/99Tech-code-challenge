import { useState, useEffect } from 'react';

// Cache for 5 mins
const CACHE_TIME = 5 * 60 * 1000;
let cache: { data: Record<string, number>; time: number } | null = null;

export const usePrices = () => {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Use cache if available
        if (cache && Date.now() - cache.time < CACHE_TIME) {
          setPrices(cache.data);
          return;
        }

        // Mock prices
        const data: Record<string, number> = {
          OSMO: 1.5,
          ETH: 2000,
          ARB: 1.2,
          ZIL: 0.02,
          NEO: 10,
          BTC: 40000,
        };

        // Update cache
        cache = {
          data,
          time: Date.now()
        };

        setPrices(data);
      } catch (err) {
        setError('Failed to fetch prices');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
    
    // Refresh every minute
    const timer = setInterval(fetchPrices, 60000);
    return () => clearInterval(timer);
  }, []);

  return { prices, isLoading, error };
}; 