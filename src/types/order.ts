export type OrderStatus = 'Open' | 'Partial' | 'Executed' | 'Cancelled';

export type OrderSide = 'Buy' | 'Sell';

export interface OrderHistory {
  status: OrderStatus;
  timestamp: string;
}

export interface Order {
  id: string;
  instrument: string;
  side: OrderSide;
  price: number;
  quantity: number;
  remainingQuantity: number;
  status: OrderStatus;
  createdAt: string;
  history: OrderHistory[];
}
