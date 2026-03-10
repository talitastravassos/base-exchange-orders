import { Order } from '../../../types/order';

const API_URL = '/api/orders';

export const orderService = {
  async fetchOrders(): Promise<Order[]> {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  async fetchOrderById(id: string): Promise<Order> {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  },

  async createOrder(newOrderData: Pick<Order, 'instrument' | 'side' | 'price' | 'quantity'>): Promise<Order> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrderData),
    });

    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  },

  async cancelOrder(id: string): Promise<Order> {
    const order = await this.fetchOrderById(id);
    
    if (order.status !== 'Open' && order.status !== 'Partial') {
      throw new Error('Only Open or Partial orders can be cancelled');
    }

    const updatedOrder: Partial<Order> = {
      status: 'Cancelled',
      history: [
        ...order.history,
        { status: 'Cancelled', timestamp: new Date().toISOString() }
      ],
    };

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedOrder),
    });

    if (!response.ok) throw new Error('Failed to cancel order');
    return response.json();
  },
};
