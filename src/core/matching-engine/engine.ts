import { Order } from '../../types/order';

interface MatchingResult {
  updatedOrders: Order[];
  newOrder: Order;
}

/**
 * Matching Engine logic
 *
 * Rules:
 * - Buy price >= Sell price
 * - Buy side matches Sell side
 * - Partial or exact matches
 * - Updates status and remainingQuantity
 * - Appends to history
 */
export function matchOrder(
  newOrder: Order,
  existingOrders: Order[],
): MatchingResult {
  const updatedOrders: Order[] = [];
  const currentNewOrder = { ...newOrder };

  // Filter compatible counterparties
  // 1. Must be opposite side
  // 2. Must be active (Open or Partial)
  // 3. Price compatibility: Buy price >= Sell price
  const candidates = existingOrders
    .filter(
      (o) =>
        o.side !== currentNewOrder.side &&
        (o.status === 'Open' || o.status === 'Partial') &&
        (currentNewOrder.side === 'Buy'
          ? currentNewOrder.price >= o.price
          : o.price >= currentNewOrder.price),
    )
    // Sort by price (best price first) and then by time (FIFO)
    .sort((a, b) => {
      if (currentNewOrder.side === 'Buy') {
        // Buy matches with lowest Sell price
        if (a.price !== b.price) return a.price - b.price;
      } else {
        // Sell matches with highest Buy price
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

    // Update candidate
    const updatedCandidate = { ...candidate };
    updatedCandidate.remainingQuantity -= matchQuantity;
    updatedCandidate.status =
      updatedCandidate.remainingQuantity === 0 ? 'Executed' : 'Partial';
    updatedCandidate.history.push({
      status: updatedCandidate.status,
      timestamp: new Date().toISOString(),
    });

    // Update current order
    currentNewOrder.remainingQuantity -= matchQuantity;
    currentNewOrder.status =
      currentNewOrder.remainingQuantity === 0 ? 'Executed' : 'Partial';

    // Push history for currentNewOrder later (to avoid duplicates if matched multiple times)
    // Actually, we should only push history once per matching session?
    // No, history should reflect status changes.
    // If it goes from Open -> Partial -> Executed, it needs both.

    updatedOrders.push(updatedCandidate);
  }

  // After all matches, add the final status to currentNewOrder history if it changed
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
