import React, { useMemo } from 'react';
import { BoxProps, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';
import { useWalletBalances, usePrices } from '@/hooks';
import { WalletBalance, FormattedWalletBalance } from '@/types/wallet';

// FIXME: Move this to a proper config file later
const PRIORITIES: Record<string, number> = {
  Osmosis: 100,    // Our main chain
  Ethereum: 50,    // Legacy
  Arbitrum: 30,    // L2
  Zilliqa: 20,     // Old stuff
  Neo: 20,         // Old stuff
};

interface WalletRowProps {
  className?: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
  currency: string;
  price: number;
}

// Quick component for displaying wallet rows
const WalletRow = ({ className, amount, usdValue, formattedAmount, currency, price }: WalletRowProps) => {
  // Hack: Fix negative values
  const displayAmount = amount < 0 ? 0 : amount;
  
  return (
    <TableRow>
      <TableCell>{currency}</TableCell>
      <TableCell align="right">{formattedAmount}</TableCell>
      <TableCell align="right">${price.toFixed(2)}</TableCell>
      <TableCell align="right">${usdValue.toFixed(2)}</TableCell>
    </TableRow>
  );
};

// Main wallet page component
const WalletPage = (props: BoxProps) => {
  const { children, ...rest } = props;
  const { balances, isLoading: isLoadingBalances, error: balancesError } = useWalletBalances();
  const { prices, isLoading: isLoadingPrices, error: pricesError } = usePrices();

  // Get priority for sorting
  const getPriority = (chain: string) => {
    return PRIORITIES[chain] || -99;
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter(balance => {
        const priority = getPriority(balance.blockchain);
        if (priority > -99) {
          if (balance.amount > 0) {
            return true;
          }
        }
        return false;
      })
      .sort((a, b) => {
        const priorityA = getPriority(a.blockchain);
        const priorityB = getPriority(b.blockchain);
        if (priorityA > priorityB) {
          return -1;
        } else if (priorityB > priorityA) {
          return 1;
        }
        return 0;
      });
  }, [balances]);

  const formattedBalances = useMemo(() => {
    return sortedBalances.map(balance => ({
      ...balance,
      formatted: balance.amount.toFixed()
    }));
  }, [sortedBalances]);

  const rows = useMemo(() => {
    return formattedBalances.map(balance => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          key={`${balance.currency}-${balance.blockchain}`}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
          currency={balance.currency}
          price={prices[balance.currency]}
        />
      );
    });
  }, [formattedBalances, prices]);

  if (isLoadingBalances || isLoadingPrices) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (balancesError || pricesError) {
    return (
      <Box p={2}>
        <Alert severity="error">
          {balancesError || pricesError || 'An error occurred while loading data'}
        </Alert>
      </Box>
    );
  }

  if (rows.length === 0) {
    return (
      <Box p={2}>
        <Alert severity="info">No tokens found in your wallet</Alert>
      </Box>
    );
  }

  return (
    <Box {...rest}>
      {/* <Typography variant="h4" gutterBottom>
        Wallet Balance
      </Typography> */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Token</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell align="right">Price (USD)</TableCell>
              <TableCell align="right">Value (USD)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WalletPage; 