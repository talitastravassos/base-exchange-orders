'use client';

import { useState } from 'react';
import { useOrders, useCreateOrder, useCancelOrder } from '../../src/features/orders/hooks/useOrders';
import { OrderTable } from '../../src/features/orders/components/OrderTable';
import { OrderForm, OrderFormData } from '../../src/features/orders/components/OrderForm';
import { OrderDetails } from '../../src/features/orders/components/OrderDetails';
import { ConfirmationModal } from '../../src/features/orders/components/ConfirmationModal';

export default function OrdersPage() {
  const { data: orders = [], isLoading, isError, error } = useOrders();
  const createOrderMutation = useCreateOrder();
  const cancelOrderMutation = useCancelOrder();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  const selectedOrder = orders.find(o => o.id === selectedOrderId); 

  const handleCreateOrder = (data: OrderFormData) => {
    createOrderMutation.mutate(data);
  };
  const handleCancelConfirm = () => {
    if (orderToCancel) {
      cancelOrderMutation.mutate(orderToCancel, {
        onSuccess: () => setOrderToCancel(null),
      });
    }
  };

  if (isLoading) return <div className="p-10 text-center font-bold text-xl">Loading Orders...</div>;
  if (isError) return <div className="p-10 text-center text-red-500 font-bold">Error: {(error as Error).message}</div>;

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-blue-600">Base Exchange - Orders</h1>
        <div className="text-sm font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full border">
          System Status: <span className="text-green-500 font-bold">Online</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <OrderForm onSubmit={handleCreateOrder} isLoading={createOrderMutation.isPending} />
        </div>
        
        <div className="lg:col-span-2">
          <OrderTable 
            orders={orders} 
            onSelectOrder={setSelectedOrderId} 
            onCancelOrder={setOrderToCancel} 
          />
        </div>
      </div>

      {selectedOrder && (
        <OrderDetails 
          order={selectedOrder} 
          onClose={() => setSelectedOrderId(null)} 
        />
      )}

      <ConfirmationModal
        isOpen={!!orderToCancel}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        onConfirm={handleCancelConfirm}
        onCancel={() => setOrderToCancel(null)}
        isLoading={cancelOrderMutation.isPending}
      />
    </main>
  );
}
