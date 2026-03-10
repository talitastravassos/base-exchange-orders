'use client';

import React, { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { Order, OrderSide, OrderStatus } from '../../../types/order';

interface OrderTableProps {
  orders: Order[];
  onSelectOrder: (id: string) => void;
  onCancelOrder: (id: string) => void;
}

export function OrderTable({ orders, onSelectOrder, onCancelOrder }: OrderTableProps) {
  const [filterInstrument, setFilterInstrument] = useState('');
  const [filterId, setFilterId] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | ''>('');
  const [filterSide, setFilterSide] = useState<OrderSide | ''>('');
  const [sortKey, setSortKey] = useState<'price' | 'quantity' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = useMemo(() => {
    return orders
      .filter(o => 
        o.instrument.toLowerCase().includes(filterInstrument.toLowerCase()) &&
        o.id.toLowerCase().includes(filterId.toLowerCase()) &&
        (filterStatus === '' || o.status === filterStatus) &&
        (filterSide === '' || o.side === filterSide) &&
        (filterDate === '' || o.createdAt.startsWith(filterDate))
      )
      .sort((a, b) => {
        const factor = sortOrder === 'asc' ? 1 : -1;
        if (sortKey === 'createdAt') {
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * factor;
        }
        return (a[sortKey] - b[sortKey]) * factor;
      });
  }, [orders, filterInstrument, filterId, filterStatus, filterSide, filterDate, sortKey, sortOrder]);

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
      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
        <input 
          type="text" 
          placeholder="Filter ID" 
          className="p-2 border rounded text-black dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 w-32"
          value={filterId}
          onChange={(e) => { setFilterId(e.target.value); setCurrentPage(1); }}
        />
        <input 
          type="text" 
          placeholder="Filter Instrument" 
          className="p-2 border rounded text-black dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
          value={filterInstrument}
          onChange={(e) => { setFilterInstrument(e.target.value); setCurrentPage(1); }}
        />
        <input 
          type="date" 
          className="p-2 border rounded text-black dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
          value={filterDate}
          onChange={(e) => { setFilterDate(e.target.value); setCurrentPage(1); }}
        />
        <select 
          className="p-2 border rounded text-black dark:text-white dark:bg-gray-700"
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value as OrderStatus | ''); setCurrentPage(1); }}
        >
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Partial">Partial</option>
          <option value="Executed">Executed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select 
          className="p-2 border rounded text-black dark:text-white dark:bg-gray-700"
          value={filterSide}
          onChange={(e) => { setFilterSide(e.target.value as OrderSide | ''); setCurrentPage(1); }}
        >
          <option value="">All Sides</option>
          <option value="Buy">Buy</option>
          <option value="Sell">Sell</option>
        </select>
        
        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm dark:text-gray-300">Page Size:</label>
          <select 
            className="p-1 border rounded text-sm dark:bg-gray-700"
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Instrument</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Side</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('price')}>
                Price {sortKey === 'price' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('quantity')}>
                Qty {sortKey === 'quantity' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rem. Qty</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('createdAt')}>
                Date {sortKey === 'createdAt' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-gray-500 italic">No orders found matching your filters</td>
              </tr>
            ) : (
              paginatedOrders.map(order => (
                <tr key={order.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer group" onClick={() => onSelectOrder(order.id)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-400 group-hover:text-blue-500">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">{order.instrument}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${order.side === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>
                    {order.side}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">{order.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{order.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 font-medium">{order.remainingQuantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-4 font-bold rounded-md ${
                      order.status === 'Open' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200' :
                      order.status === 'Partial' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200' :
                      order.status === 'Executed' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {dayjs(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {(order.status === 'Open' || order.status === 'Partial') && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onCancelOrder(order.id); }}
                        className="text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-md transition-all font-bold"
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm">
          <div className="text-sm text-gray-700 dark:text-gray-400">
            Showing <span className="font-semibold">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-semibold">{Math.min(currentPage * pageSize, filteredOrders.length)}</span> of <span className="font-semibold">{filteredOrders.length}</span> results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border dark:border-gray-600 ${currentPage === 1 ? 'bg-gray-100 text-gray-400 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded border dark:border-gray-600 ${currentPage === p ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border dark:border-gray-600 ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
