'use client';

import dayjs from 'dayjs';
import { Order } from '../../../types/order';

interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
}

export function OrderDetails({ order, onClose }: OrderDetailsProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold dark:text-white">Order Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Order ID</p>
              <p className="text-lg font-mono dark:text-gray-200">{order.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Status</p>
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-bold rounded-full ${
                order.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                order.status === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'Executed' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {order.status}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Instrument</p>
              <p className="text-lg font-bold dark:text-gray-200">{order.instrument}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Side</p>
              <p className={`text-lg font-bold ${order.side === 'Buy' ? 'text-green-600' : 'text-red-600'}`}>
                {order.side}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Price</p>
              <p className="text-lg font-semibold dark:text-gray-200">{order.price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Total Quantity</p>
              <p className="text-lg font-semibold dark:text-gray-200">{order.quantity}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Remaining Quantity</p>
              <p className="text-lg font-semibold text-blue-600">{order.remainingQuantity}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Created At</p>
              <p className="text-lg dark:text-gray-200">{dayjs(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Status History</h3>
            <div className="space-y-4">
              {order.history.map((h, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700">
                  <div className={`w-3 h-3 rounded-full ${
                    h.status === 'Open' ? 'bg-blue-400' :
                    h.status === 'Partial' ? 'bg-yellow-400' :
                    h.status === 'Executed' ? 'bg-green-400' :
                    'bg-red-400'
                  }`} />
                  <div className="flex-1">
                    <p className="font-bold dark:text-gray-200">{h.status}</p>
                    <p className="text-sm text-gray-500">{dayjs(h.timestamp).format('YYYY-MM-DD HH:mm:ss')}</p>
                  </div>
                </div>
              )).reverse()}
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t dark:border-gray-700 text-right">
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-lg font-bold">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
