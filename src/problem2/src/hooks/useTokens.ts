import { useState, useEffect } from 'react';
import axios from 'axios';
import { Token, TokenWithIcon } from '../types/token';

const TOKEN_ICON_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

export const useTokens = () => {
  const [tokens, setTokens] = useState<TokenWithIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get<Token[]>('https://interview.switcheo.com/prices.json');
        const tokensWithIcons = response.data.map(token => ({
          ...token,
          iconUrl: `${TOKEN_ICON_BASE_URL}/${token.currency}.svg`
        }));
        setTokens(tokensWithIcons);
        setError(null);
      } catch (err) {
        setError('Failed to fetch tokens. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  return { tokens, loading, error };
}; 