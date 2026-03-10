import { NextResponse } from 'next/server';
import { db } from '../../../src/lib/mock-db';
import { matchOrder } from '../../../src/core/matching-engine/engine';
import { Order } from '../../../src/types/order';

export async function GET() {
  return NextResponse.json(db.getOrders());
}

export async function POST(request: Request) {
  const data = await request.json();
  
  const newOrder: Order = {
    id: Math.random().toString(36).substring(2, 9),
    ...data,
    remainingQuantity: data.quantity,
    status: 'Open',
    createdAt: new Date().toISOString(),
    history: [{ status: 'Open', timestamp: new Date().toISOString() }],
  };

  const existingOrders = db.getOrders();
  const { updatedOrders, newOrder: processedNewOrder } = matchOrder(newOrder, existingOrders);

  for (const updated of updatedOrders) {
    db.updateOrder(updated.id, updated);
  }

  db.addOrder(processedNewOrder);

  return NextResponse.json(processedNewOrder, { status: 201 });
}
