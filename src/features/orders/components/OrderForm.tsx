'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';


const orderSchema = z.object({
  instrument: z.string().min(1, 'Instrument is required'),
  side: z.enum(['Buy', 'Sell'] as const),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
});

export type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  onSubmit: (data: OrderFormData) => void;
  isLoading?: boolean;
}

export function OrderForm({ onSubmit, isLoading }: OrderFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      side: 'Buy',
    },
  });

  const handleFormSubmit = (data: OrderFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Create New Order</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium dark:text-gray-300">Instrument</label>
          <input
            {...register('instrument')}
            placeholder="e.g. AAPL"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.instrument && <p className="text-red-500 text-xs">{errors.instrument.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium dark:text-gray-300">Side</label>
          <select
            {...register('side')}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="Buy">Buy</option>
            <option value="Sell">Sell</option>
          </select>
          {errors.side && <p className="text-red-500 text-xs">{errors.side.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium dark:text-gray-300">Price</label>
          <input
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            placeholder="0.00"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium dark:text-gray-300">Quantity</label>
          <input
            type="number"
            {...register('quantity', { valueAsNumber: true })}
            placeholder="100"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.quantity && <p className="text-red-500 text-xs">{errors.quantity.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded font-bold text-white transition-colors ${
          isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Processing...' : 'Create Order'}
      </button>
    </form>
  );
}
