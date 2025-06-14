import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Token, TokenWithIcon } from '../types/token';

// Update icon URL to use GitHub repo
const TOKEN_ICON_BASE_URL = 'https://github.com/Switcheo/token-icons/raw/main/tokens';
const CACHE_KEY = 'token_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fallback icon for tokens without icon
const FALLBACK_ICON = 'https://github.com/Switcheo/token-icons/raw/main/tokens/SWTH.svg';

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

    // For BUSD, keep only the one with price closest to 1
    if (tokenGroups['BUSD']) {
      const busdTokens = tokenGroups['BUSD'];
      const closestTo1 = busdTokens.reduce((closest, current) => {
        const currentDiff = Math.abs(current.price - 1);
        const closestDiff = Math.abs(closest.price - 1);
        return currentDiff < closestDiff ? current : closest;
      });
      tokenGroups['BUSD'] = [closestTo1];
    }

    // Flatten groups back to array and add icons
    const uniqueTokens = Object.values(tokenGroups).flat();
    return uniqueTokens.map(token => {
      // Try to get token icon, fallback to SWTH icon if not found
      const iconUrl = `${TOKEN_ICON_BASE_URL}/${token.currency}.svg`;
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