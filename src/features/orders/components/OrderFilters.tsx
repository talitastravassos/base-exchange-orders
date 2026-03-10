'use client';

import { OrderSide, OrderStatus } from '../../../types/order';

export interface FilterState {
  instrument: string;
  id: string;
  date: string;
  status: OrderStatus | '';
  side: OrderSide | '';
}

interface OrderFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  filters: FilterState;
}

export function OrderFilters({ filters, onFilterChange }: OrderFiltersProps) {
  const handleChange = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div
      className="flex flex-wrap items-end gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700"
      role="search"
      aria-label="Order filters"
    >
      <div className="flex flex-col gap-1">
        <label
          htmlFor="filter-id"
          className="text-xs font-semibold text-gray-500 uppercase"
        >
          Order ID
        </label>
        <input
          id="filter-id"
          type="text"
          placeholder="e.g. 7x2j9"
          className="h-10 px-2 border rounded text-black dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 w-32 outline-none"
          value={filters.id}
          onChange={(e) => handleChange('id', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="filter-instrument"
          className="text-xs font-semibold text-gray-500 uppercase"
        >
          Instrument
        </label>
        <input
          id="filter-instrument"
          type="text"
          placeholder="Filter Instrument"
          className="h-10 px-2 border rounded text-black dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
          value={filters.instrument}
          onChange={(e) => handleChange('instrument', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="filter-date"
          className="text-xs font-semibold text-gray-500 uppercase"
        >
          Date
        </label>
        <input
          id="filter-date"
          type="date"
          className="h-10 px-2 border rounded text-black dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
          value={filters.date}
          onChange={(e) => handleChange('date', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="filter-status"
          className="text-xs font-semibold text-gray-500 uppercase"
        >
          Status
        </label>
        <select
          id="filter-status"
          className="h-10 px-2 border rounded text-black dark:text-white dark:bg-gray-700 outline-none cursor-pointer"
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Partial">Partial</option>
          <option value="Executed">Executed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="filter-side"
          className="text-xs font-semibold text-gray-500 uppercase"
        >
          Side
        </label>
        <select
          id="filter-side"
          className="h-10 px-2 border rounded text-black dark:text-white dark:bg-gray-700 outline-none cursor-pointer"
          value={filters.side}
          onChange={(e) => handleChange('side', e.target.value)}
        >
          <option value="">All Sides</option>
          <option value="Buy">Buy</option>
          <option value="Sell">Sell</option>
        </select>
      </div>
    </div>
  );
}
