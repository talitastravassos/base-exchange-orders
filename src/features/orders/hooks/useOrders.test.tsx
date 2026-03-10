import { renderHook, waitFor } from '@testing-library/react';
import { useOrders, useOrder, useCreateOrder, useCancelOrder } from './useOrders';
import { orderService } from '../services/orderService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

jest.mock('../services/orderService');

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('Orders Hooks', () => {
  test('useOrders should fetch orders', async () => {
    const mockOrders = [{ id: '1', instrument: 'AAPL' }];
    (orderService.fetchOrders as jest.Mock).mockResolvedValue(mockOrders);

    const { result } = renderHook(() => useOrders(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockOrders);
  });

  test('useOrder should fetch a single order', async () => {
    const mockOrder = { id: '1', instrument: 'AAPL' };
    (orderService.fetchOrderById as jest.Mock).mockResolvedValue(mockOrder);

    const { result } = renderHook(() => useOrder('1'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockOrder);
  });

  test('useCreateOrder should call createOrder and invalidate cache', async () => {
    const newOrder = { instrument: 'AAPL', side: 'Buy' as const, price: 150, quantity: 100 };
    const mockResponse = { ...newOrder, id: '2' };
    (orderService.createOrder as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCreateOrder(), { wrapper });

    result.current.mutate(newOrder);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(orderService.createOrder).toHaveBeenCalledWith(newOrder);
  });

  test('useCancelOrder should call cancelOrder and invalidate cache', async () => {
    const mockResponse = { id: '1', status: 'Cancelled' };
    (orderService.cancelOrder as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCancelOrder(), { wrapper });

    result.current.mutate('1');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(orderService.cancelOrder).toHaveBeenCalledWith('1');
  });
});
