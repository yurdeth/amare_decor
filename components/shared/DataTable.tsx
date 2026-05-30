'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown, MoreVertical, Pencil, Trash2 } from 'lucide-react';

export interface Column<T> {
  key: string;
  title: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onEdit,
  onDelete,
  emptyMessage = 'No hay datos disponibles',
  className = '',
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  const renderSortIcon = (columnKey: string) => {
    if (sortColumn !== columnKey) return null;

    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    );
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-accent/30">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-left text-sm font-semibold text-primary ${
                  column.sortable ? 'cursor-pointer hover:bg-accent/20' : ''
                }`}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center">
                  {column.title}
                  {column.sortable && renderSortIcon(column.key)}
                </div>
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-4 py-3 text-right text-sm font-semibold text-primary">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                className="px-4 py-8 text-center text-primary/60"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, index) => (
              <tr
                key={index}
                className="border-b border-accent/20 hover:bg-white/30 transition-colors duration-150"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm text-primary">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="p-2 rounded-lg hover:bg-accent/30 transition-colors duration-150 group"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4 text-primary group-hover:text-primary/70" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="p-2 rounded-lg hover:bg-red-100 transition-colors duration-150 group"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
