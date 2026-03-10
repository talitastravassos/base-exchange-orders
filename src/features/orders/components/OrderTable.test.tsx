import { render, screen, fireEvent } from '@testing-library/react';
import { OrderTable } from './OrderTable';
import { Order } from '../../../types/order';
import '@testing-library/jest-dom';

const mockOrders: Order[] = [
  {
    id: '1',
    instrument: 'AAPL',
    side: 'Buy',
    price: 150,
    quantity: 100,
    remainingQuantity: 100,
    status: 'Open',
    createdAt: '2026-03-10T12:00:00.000Z',
    history: []
  },
  {
    id: '2',
    instrument: 'MSFT',
    side: 'Sell',
    price: 300,
    quantity: 50,
    remainingQuantity: 50,
    status: 'Partial',
    createdAt: '2026-03-10T11:00:00.000Z',
    history: []
  }
];

describe('OrderTable Component', () => {
  const mockOnSelect = jest.fn();
  const mockOnCancel = jest.fn();

  test('renders all orders correctly', () => {
    render(<OrderTable orders={mockOrders} onSelectOrder={mockOnSelect} onCancelOrder={mockOnCancel} />);
    
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('MSFT')).toBeInTheDocument();
    expect(screen.getByText('150.00')).toBeInTheDocument();
    expect(screen.getByText('300.00')).toBeInTheDocument();
  });

  test('calls onSelectOrder when a row is clicked', () => {
    render(<OrderTable orders={mockOrders} onSelectOrder={mockOnSelect} onCancelOrder={mockOnCancel} />);
    
    // Rows have role='button'
    const rows = screen.getAllByRole('button', { name: /Order/i });
    fireEvent.click(rows[0]);
    expect(mockOnSelect).toHaveBeenCalledWith('1');
  });

  test('calls onCancelOrder when cancel button is clicked', () => {
    render(<OrderTable orders={mockOrders} onSelectOrder={mockOnSelect} onCancelOrder={mockOnCancel} />);
    
    const cancelButtons = screen.getAllByRole('button', { name: /Cancel order/i });
    fireEvent.click(cancelButtons[0]);
    
    expect(mockOnCancel).toHaveBeenCalledWith('1');
  });

  test('shows empty state message when no orders are provided after filtering', () => {
    render(<OrderTable orders={[]} onSelectOrder={mockOnSelect} onCancelOrder={mockOnCancel} />);
    expect(screen.getByText(/no orders found/i)).toBeInTheDocument();
  });
});
