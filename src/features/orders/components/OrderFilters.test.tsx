import { render, screen, fireEvent } from '@testing-library/react';
import { OrderFilters, FilterState } from './OrderFilters';
import '@testing-library/jest-dom';

describe('OrderFilters Component', () => {
  const mockFilters: FilterState = {
    instrument: '',
    id: '',
    date: '',
    status: '',
    side: '',
  };
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  test('calls onFilterChange when ID input changes', () => {
    render(<OrderFilters filters={mockFilters} onFilterChange={mockOnFilterChange} />);
    const input = screen.getByLabelText(/Order ID/i);
    fireEvent.change(input, { target: { value: '7x2' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ ...mockFilters, id: '7x2' });
  });

  test('calls onFilterChange when instrument input changes', () => {
    render(<OrderFilters filters={mockFilters} onFilterChange={mockOnFilterChange} />);
    const input = screen.getByLabelText(/Instrument/i);
    fireEvent.change(input, { target: { value: 'AAPL' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ ...mockFilters, instrument: 'AAPL' });
  });

  test('calls onFilterChange when date input changes', () => {
    render(<OrderFilters filters={mockFilters} onFilterChange={mockOnFilterChange} />);
    const input = screen.getByLabelText(/Date/i);
    fireEvent.change(input, { target: { value: '2026-03-10' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ ...mockFilters, date: '2026-03-10' });
  });

  test('calls onFilterChange when status select changes', () => {
    render(<OrderFilters filters={mockFilters} onFilterChange={mockOnFilterChange} />);
    const select = screen.getByLabelText(/Status/i);
    fireEvent.change(select, { target: { value: 'Executed' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ ...mockFilters, status: 'Executed' });
  });

  test('calls onFilterChange when side select changes', () => {
    render(<OrderFilters filters={mockFilters} onFilterChange={mockOnFilterChange} />);
    const select = screen.getByLabelText(/Side/i);
    fireEvent.change(select, { target: { value: 'Sell' } });
    expect(mockOnFilterChange).toHaveBeenCalledWith({ ...mockFilters, side: 'Sell' });
  });
});
