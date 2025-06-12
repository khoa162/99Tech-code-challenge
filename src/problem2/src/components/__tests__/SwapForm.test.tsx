import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SwapForm } from '../SwapForm';
import { useTokens } from '../../hooks/useTokens';

// Mock the useTokens hook
jest.mock('../../hooks/useTokens');

const mockTokens = [
  {
    currency: 'SWTH',
    date: '2024-01-01',
    price: 1.5,
    iconUrl: 'https://example.com/swth.svg'
  },
  {
    currency: 'ETH',
    date: '2024-01-01',
    price: 2000,
    iconUrl: 'https://example.com/eth.svg'
  }
];

describe('SwapForm', () => {
  beforeEach(() => {
    (useTokens as jest.Mock).mockReturnValue({
      tokens: mockTokens,
      loading: false,
      error: null
    });
  });

  it('renders the form correctly', () => {
    render(<SwapForm />);
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter amount')).toBeInTheDocument();
    expect(screen.getByText('Swap')).toBeInTheDocument();
  });

  it('calculates output amount correctly', async () => {
    render(<SwapForm />);
    
    // Select tokens
    const fromSelect = screen.getByText('From').closest('div')?.querySelector('button');
    const toSelect = screen.getByText('To').closest('div')?.querySelector('button');
    
    fireEvent.click(fromSelect!);
    fireEvent.click(screen.getByText('SWTH'));
    
    fireEvent.click(toSelect!);
    fireEvent.click(screen.getByText('ETH'));
    
    // Enter amount
    const input = screen.getByPlaceholderText('Enter amount');
    fireEvent.change(input, { target: { value: '100' } });
    
    // Check output amount
    await waitFor(() => {
      expect(screen.getByText('0.075')).toBeInTheDocument();
    });
  });

  it('shows error when same token is selected', async () => {
    render(<SwapForm />);
    
    // Select same token for both
    const fromSelect = screen.getByText('From').closest('div')?.querySelector('button');
    const toSelect = screen.getByText('To').closest('div')?.querySelector('button');
    
    fireEvent.click(fromSelect!);
    fireEvent.click(screen.getByText('SWTH'));
    
    fireEvent.click(toSelect!);
    fireEvent.click(screen.getByText('SWTH'));
    
    // Enter amount
    const input = screen.getByPlaceholderText('Enter amount');
    fireEvent.change(input, { target: { value: '100' } });
    
    // Submit form
    fireEvent.click(screen.getByText('Swap'));
    
    await waitFor(() => {
      expect(screen.getByText('Cannot swap the same token')).toBeInTheDocument();
    });
  });

  it('shows loading state when submitting', async () => {
    render(<SwapForm />);
    
    // Fill form
    const fromSelect = screen.getByText('From').closest('div')?.querySelector('button');
    const toSelect = screen.getByText('To').closest('div')?.querySelector('button');
    
    fireEvent.click(fromSelect!);
    fireEvent.click(screen.getByText('SWTH'));
    
    fireEvent.click(toSelect!);
    fireEvent.click(screen.getByText('ETH'));
    
    const input = screen.getByPlaceholderText('Enter amount');
    fireEvent.change(input, { target: { value: '100' } });
    
    // Submit form
    fireEvent.click(screen.getByText('Swap'));
    
    await waitFor(() => {
      expect(screen.getByText('Swapping...')).toBeInTheDocument();
    });
  });
}); 