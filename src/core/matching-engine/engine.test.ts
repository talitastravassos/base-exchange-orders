import { matchOrder } from './engine';
import { Order } from '../../types/order';

const createOrder = (overrides: Partial<Order>): Order => ({
  id: Math.random().toString(),
  instrument: 'AAPL',
  side: 'Buy',
  price: 150,
  quantity: 100,
  remainingQuantity: 100,
  status: 'Open',
  createdAt: new Date().toISOString(),
  history: [{ status: 'Open', timestamp: new Date().toISOString() }],
  ...overrides,
});

describe('Matching Engine', () => {
  test('Exact Match: Buy 100 vs Sell 100', () => {
    const buyOrder = createOrder({ side: 'Buy', price: 150, quantity: 100, remainingQuantity: 100 });
    const sellOrder = createOrder({ side: 'Sell', price: 150, quantity: 100, remainingQuantity: 100 });

    const result = matchOrder(buyOrder, [sellOrder]);

    expect(result.newOrder.status).toBe('Executed');
    expect(result.newOrder.remainingQuantity).toBe(0);
    expect(result.updatedOrders[0].status).toBe('Executed');
    expect(result.updatedOrders[0].remainingQuantity).toBe(0);
  });

  test('Partial Match: Buy 100 vs Sell 60', () => {
    const buyOrder = createOrder({ side: 'Buy', price: 150, quantity: 100, remainingQuantity: 100 });
    const sellOrder = createOrder({ side: 'Sell', price: 150, quantity: 60, remainingQuantity: 60 });

    const result = matchOrder(buyOrder, [sellOrder]);

    expect(result.newOrder.status).toBe('Partial');
    expect(result.newOrder.remainingQuantity).toBe(40);
    expect(result.updatedOrders[0].status).toBe('Executed');
    expect(result.updatedOrders[0].remainingQuantity).toBe(0);
  });

  test('Multiple Matches: Buy 100 vs Sell 40, 30, 50', () => {
    const buyOrder = createOrder({ side: 'Buy', price: 150, quantity: 100, remainingQuantity: 100 });
    const sellOrders = [
      createOrder({ id: 's1', side: 'Sell', price: 140, quantity: 40, remainingQuantity: 40 }),
      createOrder({ id: 's2', side: 'Sell', price: 145, quantity: 30, remainingQuantity: 30 }),
      createOrder({ id: 's3', side: 'Sell', price: 150, quantity: 50, remainingQuantity: 50 }),
    ];

    const result = matchOrder(buyOrder, sellOrders);

    expect(result.newOrder.status).toBe('Executed');
    expect(result.newOrder.remainingQuantity).toBe(0);
    expect(result.updatedOrders).toHaveLength(3);
    expect(result.updatedOrders[0].id).toBe('s1');
    expect(result.updatedOrders[0].status).toBe('Executed');
    expect(result.updatedOrders[1].id).toBe('s2');
    expect(result.updatedOrders[1].status).toBe('Executed');
    expect(result.updatedOrders[2].id).toBe('s3');
    expect(result.updatedOrders[2].status).toBe('Partial');
    expect(result.updatedOrders[2].remainingQuantity).toBe(20);
  });

  test('Price compatibility: Buy price >= Sell price', () => {
    const buyOrder = createOrder({ side: 'Buy', price: 140, quantity: 100, remainingQuantity: 100 });
    const sellOrder = createOrder({ side: 'Sell', price: 150, quantity: 100, remainingQuantity: 100 });

    const result = matchOrder(buyOrder, [sellOrder]);

    expect(result.newOrder.status).toBe('Open');
    expect(result.newOrder.remainingQuantity).toBe(100);
    expect(result.updatedOrders).toHaveLength(0);
  });

  test('Sell side match: Sell 100 vs Buy 100', () => {
    const sellOrder = createOrder({ side: 'Sell', price: 150, quantity: 100, remainingQuantity: 100 });
    const buyOrder = createOrder({ side: 'Buy', price: 150, quantity: 100, remainingQuantity: 100 });

    const result = matchOrder(sellOrder, [buyOrder]);

    expect(result.newOrder.status).toBe('Executed');
    expect(result.newOrder.remainingQuantity).toBe(0);
    expect(result.updatedOrders[0].status).toBe('Executed');
  });

  test('No match: Buy side vs Buy side', () => {
    const buyOrder1 = createOrder({ side: 'Buy', price: 150, quantity: 100 });
    const buyOrder2 = createOrder({ side: 'Buy', price: 150, quantity: 100 });

    const result = matchOrder(buyOrder1, [buyOrder2]);

    expect(result.newOrder.status).toBe('Open');
    expect(result.updatedOrders).toHaveLength(0);
  });
});
