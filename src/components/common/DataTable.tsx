// src/components/common/DataTable.tsx
import React, { ReactNode } from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  emptySearchMessage?: string;
  searchTerm?: string;
  rowClassName?: string | ((item: T) => string);
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  error = null,
  emptyMessage = 'No items found',
  emptySearchMessage = 'No items found matching your search',
  searchTerm = '',
  rowClassName = 'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150',
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg text-red-700 dark:text-red-200">
        {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {searchTerm ? emptySearchMessage : emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((item) => {
            const getRowClass = typeof rowClassName === 'function' 
              ? rowClassName(item) 
              : rowClassName;
              
            return (
              <tr key={keyExtractor(item)} className={getRowClass}>
                {columns.map((column, index) => {
                  const cellContent = typeof column.accessor === 'function'
                    ? column.accessor(item)
                    : item[column.accessor as keyof T];
                  
                  return (
                    <td key={index} className="px-6 py-4 whitespace-nowrap">
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}