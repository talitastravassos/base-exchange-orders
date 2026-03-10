import { orderService } from './orderService';

// Mock global fetch
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

    // Mock fetches in order
    // 1. Fetch orders to match
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockExistingOrders,
    });

    // 2. Patch the counterpart (the matching)
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockExistingOrders[0], status: 'Executed', remainingQuantity: 0 }),
    });

    // 3. Post the new order
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
});
