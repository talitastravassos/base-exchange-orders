'use client';

import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { Order } from '../../../types/order';
import { FilterState, OrderFilters } from './OrderFilters';

interface OrderTableProps {
  orders: Order[];
  onSelectOrder: (id: string) => void;
  onCancelOrder: (id: string) => void;
}

export function OrderTable({
  orders,
  onSelectOrder,
  onCancelOrder,
}: OrderTableProps) {
  const [filters, setFilters] = useState<FilterState>({
    instrument: '',
    id: '',
    date: '',
    status: '',
    side: '',
  });

  const [sortKey, setSortKey] = useState<'price' | 'quantity' | 'createdAt'>(
    'createdAt',
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = useMemo(() => {
    return orders
      .filter(
        (o) =>
          o.instrument
            .toLowerCase()
            .includes(filters.instrument.toLowerCase()) &&
          o.id.toLowerCase().includes(filters.id.toLowerCase()) &&
          (filters.status === '' || o.status === filters.status) &&
          (filters.side === '' || o.side === filters.side) &&
          (filters.date === '' || o.createdAt.startsWith(filters.date)),
      )
      .sort((a, b) => {
        const factor = sortOrder === 'asc' ? 1 : -1;
        if (sortKey === 'createdAt') {
          return (
            (new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime()) *
            factor
          );
        }
        return (a[sortKey] - b[sortKey]) * factor;
      });
  }, [orders, filters, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-4">
      <OrderFilters
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
        }}
      />

      <div className="overflow-x-auto rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <table
          className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
          aria-label="Trading orders table"
        >
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Instrument
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Side
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => toggleSort('price')}
                aria-sort={
                  sortKey === 'price'
                    ? sortOrder === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
              >
                Price{' '}
                {sortKey === 'price' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => toggleSort('quantity')}
                aria-sort={
                  sortKey === 'quantity'
                    ? sortOrder === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
              >
                Qty{' '}
                {sortKey === 'quantity'
                  ? sortOrder === 'asc'
                    ? '▲'
                    : '▼'
                  : ''}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Rem. Qty
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => toggleSort('createdAt')}
                aria-sort={
                  sortKey === 'createdAt'
                    ? sortOrder === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
              >
                Date{' '}
                {sortKey === 'createdAt'
                  ? sortOrder === 'asc'
                    ? '▲'
                    : '▼'
                  : ''}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-12 text-center text-gray-500 italic"
                >
                  No orders found matching your filters
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer group"
                  onClick={() => onSelectOrder(order.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Order ${order.id}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ')
                      onSelectOrder(order.id);
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-400 group-hover:text-blue-500">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                    {order.instrument}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${order.side === 'Buy' ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {order.side}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    {order.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 font-medium">
                    {order.remainingQuantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-4 font-bold rounded-md ${
                        order.status === 'Open'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200'
                          : order.status === 'Partial'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200'
                            : order.status === 'Executed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {dayjs(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {(order.status === 'Open' ||
                      order.status === 'Partial') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCancelOrder(order.id);
                        }}
                        className="text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-md transition-all font-bold focus:ring-2 focus:ring-red-500 outline-none"
                        aria-label={`Cancel order ${order.id}`}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-700 dark:text-gray-400">
            Showing{' '}
            <span className="font-semibold">
              {(currentPage - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold">
              {Math.min(currentPage * pageSize, filteredOrders.length)}
            </span>{' '}
            of <span className="font-semibold">{filteredOrders.length}</span>{' '}
            results
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="page-size" className="text-sm text-gray-500">
              Page size:
            </label>
            <select
              id="page-size"
              className="h-10 px-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {totalPages > 1 && (
          <nav className="flex gap-2" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border dark:border-gray-600 ${currentPage === 1 ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              aria-label="Previous page"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded border dark:border-gray-600 transition-colors ${currentPage === p ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  aria-current={currentPage === p ? 'page' : undefined}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border dark:border-gray-600 ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              aria-label="Next page"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
