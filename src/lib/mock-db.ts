import { Order } from '../types/order';

class MockDatabase {
  private static instance: MockDatabase;
  private orders: Order[] = [
    {
      id: '1',
      instrument: 'AAPL',
      side: 'Buy',
      price: 150,
      quantity: 100,
      remainingQuantity: 100,
      status: 'Open',
      createdAt: '2026-03-10T10:00:00.000Z',
      history: [{ status: 'Open', timestamp: '2026-03-10T10:00:00.000Z' }],
    },
    {
      id: '2',
      instrument: 'GOOGL',
      side: 'Sell',
      price: 2800,
      quantity: 50,
      remainingQuantity: 50,
      status: 'Open',
      createdAt: '2026-03-10T10:05:00.000Z',
      history: [{ status: 'Open', timestamp: '2026-03-10T10:05:00.000Z' }],
    },
  ];

  private constructor() {}

  public static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  public getOrders(): Order[] {
    return this.orders;
  }

  public getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id);
  }

  public addOrder(order: Order): void {
    this.orders.push(order);
  }

  public updateOrder(id: string, updates: Partial<Order>): Order | undefined {
    const index = this.orders.findIndex((o) => o.id === id);
    if (index === -1) return undefined;

    this.orders[index] = { ...this.orders[index], ...updates };
    return this.orders[index];
  }
}

export const db = MockDatabase.getInstance();
