import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Token, TokenWithIcon } from '../types/token';

// Update icon URL to use GitHub repo
const TOKEN_ICON_BASE_URL = 'https://github.com/Switcheo/token-icons/raw/main/tokens';
const CACHE_KEY = 'token_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fallback icon for tokens without icon
const FALLBACK_ICON = 'https://github.com/Switcheo/token-icons/raw/main/tokens/SWTH.svg';

// List of stablecoins that should be closest to 1
const STABLECOINS = ['BUSD', 'USDC', 'USD', 'USC'];

// Map token names to their correct icon filenames
const TOKEN_ICON_MAP: Record<string, string> = {
  'stOSMO': 'stOSMO',
  'rATOM': 'rATOM',
  'stEVMOS': 'stEVMOS',
  'stLUNA': 'stLUNA',
  // Add more mappings if needed
};

interface TokenCache {
  tokens: TokenWithIcon[];
  timestamp: number;
}

export const useTokens = () => {
  const [tokens, setTokens] = useState<TokenWithIcon[]>(() => {
    // Try to load from cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { tokens, timestamp } = JSON.parse(cached) as TokenCache;
      if (Date.now() - timestamp < CACHE_DURATION) {
        return tokens;
      }
    }
    return [];
  });
  const [loading, setLoading] = useState(!tokens.length);
  const [error, setError] = useState<string | null>(null);

  const processTokens = useCallback((data: Token[]) => {
    // Group tokens by currency
    const tokenGroups = data.reduce((acc, token) => {
      if (!acc[token.currency]) {
        acc[token.currency] = [];
      }
      acc[token.currency].push(token);
      return acc;
    }, {} as Record<string, Token[]>);

    // For stablecoins, keep only the one with price closest to 1
    STABLECOINS.forEach(currency => {
      if (tokenGroups[currency]) {
        const tokens = tokenGroups[currency];
        const closestTo1 = tokens.reduce((closest, current) => {
          const currentDiff = Math.abs(current.price - 1);
          const closestDiff = Math.abs(closest.price - 1);
          return currentDiff < closestDiff ? current : closest;
        });
        tokenGroups[currency] = [closestTo1];
      }
    });

    // For other tokens, keep the most recent one if there are duplicates
    Object.keys(tokenGroups).forEach(currency => {
      if (!STABLECOINS.includes(currency) && tokenGroups[currency].length > 1) {
        const tokens = tokenGroups[currency];
        const mostRecent = tokens.reduce((latest, current) => {
          return new Date(current.date) > new Date(latest.date) ? current : latest;
        });
        tokenGroups[currency] = [mostRecent];
      }
    });

    // Flatten groups back to array and add icons
    const uniqueTokens = Object.values(tokenGroups).flat();
    return uniqueTokens.map(token => {
      // Get the correct icon filename from the mapping
      const iconName = TOKEN_ICON_MAP[token.currency] || token.currency;
      const iconUrl = `${TOKEN_ICON_BASE_URL}/${iconName}.svg`;
      return {
        ...token,
        iconUrl: iconUrl || FALLBACK_ICON
      };
    });
  }, []);

  const fetchTokens = useCallback(async () => {
    try {
      const response = await axios.get<Token[]>('https://interview.switcheo.com/prices.json');
      const processedTokens = processTokens(response.data);
      
      // Cache the processed tokens
      const cache: TokenCache = {
        tokens: processedTokens,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      
      setTokens(processedTokens);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tokens. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [processTokens]);

  useEffect(() => {
    if (!tokens.length) {
      fetchTokens();
    }
  }, [tokens.length, fetchTokens]);

  return { tokens, loading, error, refetch: fetchTokens };
}; 