import { Order } from '../../types/order';

interface MatchingResult {
  updatedOrders: Order[];
  newOrder: Order;
}

export function matchOrder(
  newOrder: Order,
  existingOrders: Order[],
): MatchingResult {
  const updatedOrders: Order[] = [];
  const currentNewOrder = { ...newOrder };

  const candidates = existingOrders
    .filter(
      (o) =>
        o.side !== currentNewOrder.side &&
        (o.status === 'Open' || o.status === 'Partial') &&
        (currentNewOrder.side === 'Buy'
          ? currentNewOrder.price >= o.price
          : o.price >= currentNewOrder.price),
    )
    .sort((a, b) => {
      if (currentNewOrder.side === 'Buy') {
        if (a.price !== b.price) return a.price - b.price;
      } else {
        if (a.price !== b.price) return b.price - a.price;
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  for (const candidate of candidates) {
    if (currentNewOrder.remainingQuantity <= 0) break;

    const matchQuantity = Math.min(
      currentNewOrder.remainingQuantity,
      candidate.remainingQuantity,
    );

    const updatedCandidate = { ...candidate };
    updatedCandidate.remainingQuantity -= matchQuantity;
    updatedCandidate.status =
      updatedCandidate.remainingQuantity === 0 ? 'Executed' : 'Partial';
    updatedCandidate.history.push({
      status: updatedCandidate.status,
      timestamp: new Date().toISOString(),
    });

    currentNewOrder.remainingQuantity -= matchQuantity;
    currentNewOrder.status =
      currentNewOrder.remainingQuantity === 0 ? 'Executed' : 'Partial';

    updatedOrders.push(updatedCandidate);
  }

  if (currentNewOrder.status !== newOrder.status) {
    currentNewOrder.history.push({
      status: currentNewOrder.status,
      timestamp: new Date().toISOString(),
    });
  }

  return {
    updatedOrders,
    newOrder: currentNewOrder,
  };
}
