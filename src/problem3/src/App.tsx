import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import WalletPage from '@/components/WalletPage';

const App: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Wallet Balances
        </Typography>
        <WalletPage />
      </Box>
    </Container>
  );
};

export default App; 