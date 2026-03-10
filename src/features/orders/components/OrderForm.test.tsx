import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OrderForm } from './OrderForm';
import '@testing-library/jest-dom';

describe('OrderForm Validation', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  test('shows error messages for empty required fields', async () => {
    render(<OrderForm onSubmit={mockOnSubmit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /create order/i }));

    expect(await screen.findByText(/instrument is required/i)).toBeInTheDocument();
  });

  test('validates that price and quantity must be positive', async () => {
    render(<OrderForm onSubmit={mockOnSubmit} />);
    
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. AAPL/i), { target: { value: 'AAPL' } });
    fireEvent.change(screen.getByPlaceholderText(/0\.00/i), { target: { value: '-10' } });
    fireEvent.change(screen.getByPlaceholderText(/100/i), { target: { value: '0' } });
    
    fireEvent.click(screen.getByRole('button', { name: /create order/i }));

    expect(await screen.findByText(/price must be positive/i)).toBeInTheDocument();
    expect(await screen.findByText(/quantity must be a positive integer/i)).toBeInTheDocument();
  });

  test('calls onSubmit when all fields are valid', async () => {
    render(<OrderForm onSubmit={mockOnSubmit} />);
    
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. AAPL/i), { target: { value: 'TSLA' } });
    fireEvent.change(screen.getByPlaceholderText(/0\.00/i), { target: { value: '250' } });
    fireEvent.change(screen.getByPlaceholderText(/100/i), { target: { value: '10' } });
    
    fireEvent.click(screen.getByRole('button', { name: /create order/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        instrument: 'TSLA',
        side: 'Buy',
        price: 250,
        quantity: 10,
      });
    });
  });
});
