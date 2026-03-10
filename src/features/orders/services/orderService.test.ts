import { orderService } from './orderService';

global.fetch = jest.fn() as jest.Mock;

describe('OrderService Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createOrder should fetch orders, match them, and update DB', async () => {
    const mockExistingOrders = [
      {
        id: 's1',
        instrument: 'AAPL',
        side: 'Sell',
        price: 150,
        quantity: 100,
        remainingQuantity: 100,
        status: 'Open',
        createdAt: new Date().toISOString(),
        history: [{ status: 'Open', timestamp: new Date().toISOString() }],
      },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockExistingOrders,
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockExistingOrders[0], status: 'Executed', remainingQuantity: 0 }),
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'new1', status: 'Executed', remainingQuantity: 0 }),
    });

    const result = await orderService.createOrder({
      instrument: 'AAPL',
      side: 'Buy',
      price: 150,
      quantity: 100,
    });

    expect(fetch).toHaveBeenCalledTimes(3);
    expect(result.status).toBe('Executed');
    expect(result.remainingQuantity).toBe(0);
  });

  test('fetchOrders should return all orders', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: '1' }],
    });

    const result = await orderService.fetchOrders();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  test('fetchOrderById should return a single order', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1' }),
    });

    const result = await orderService.fetchOrderById('1');
    expect(result.id).toBe('1');
  });

  test('fetchOrderById should throw an error when fetch fails', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(orderService.fetchOrderById('1')).rejects.toThrow('Failed to fetch order');
  });

  test('cancelOrder should update order status to Cancelled', async () => {
    const mockOrder = {
      id: '1',
      status: 'Open',
      history: [{ status: 'Open', timestamp: new Date().toISOString() }],
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockOrder,
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockOrder, status: 'Cancelled' }),
    });

    const result = await orderService.cancelOrder('1');
    expect(result.status).toBe('Cancelled');
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
