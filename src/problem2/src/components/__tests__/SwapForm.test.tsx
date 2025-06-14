import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SwapForm } from '../features/SwapForm';
import { TransactionProvider } from '../../context/TransactionContext';
import { vi } from 'vitest';
import { within } from '@testing-library/react';

// Mock data
const mockTokens = [
  { currency: 'SWTH', price: 1, iconUrl: '/swth.png' },
  { currency: 'ETH', price: 2000, iconUrl: '/eth.png' },
];

// Mock useTokens hook
vi.mock('../../hooks/useTokens', () => ({
  useTokens: () => ({
    tokens: mockTokens,
    loading: false,
    error: null,
  }),
}));

// Helper function to render component with provider
const renderSwapForm = () => {
  return render(
    <TransactionProvider>
      <SwapForm />
    </TransactionProvider>
  );
};

// Helper function to select token
const selectToken = async (label: string, token: string) => {
  const button = screen.getByText(label).closest('div')?.querySelector('button');
  fireEvent.click(button!);
  
  await waitFor(() => {
    const listbox = screen.getByRole('listbox');
    const option = within(listbox).getByText(token);
    fireEvent.click(option);
  });
};

describe('SwapForm', () => {
  // Test basic rendering
  it('should render basic form elements', () => {
    renderSwapForm();
    
    // Check if basic elements are rendered
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter amount')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /swap/i })).toBeInTheDocument();
  });

  // Test token selection and amount calculation
  it('should calculate output amount when selecting tokens and entering amount', async () => {
    renderSwapForm();

    // Select tokens
    await selectToken('From', 'SWTH');
    await selectToken('To', 'ETH');

    // Enter amount
    const amountInput = screen.getByPlaceholderText('Enter amount');
    fireEvent.change(amountInput, { target: { value: '1' } });

    // Verify output amount
    await waitFor(() => {
      const outputText = screen.getByText('You will receive');
      expect(outputText.nextSibling).toHaveTextContent('0.000499');
    });
  });

  // Test error handling
  it('should show error when selecting same token for both fields', async () => {
    renderSwapForm();

    // Select SWTH for both fields
    await selectToken('From', 'SWTH');
    await selectToken('To', 'SWTH');

    // Enter amount and submit
    const amountInput = screen.getByPlaceholderText('Enter amount');
    fireEvent.change(amountInput, { target: { value: '1' } });

    const submitButton = screen.getByRole('button', { name: /swap/i });
    fireEvent.click(submitButton);

    // Verify error message
    expect(screen.getByText('Cannot swap the same token')).toBeInTheDocument();
  });
}); 