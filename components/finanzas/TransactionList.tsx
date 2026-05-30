'use client';

import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Calendar, Tag } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { Income, Expense } from '@/lib/context/AppContext';
import Badge from '@/components/ui/Badge';

interface TransactionListProps {
  incomes: Income[];
  expenses: Expense[];
  type?: 'all' | 'income' | 'expense';
  onEdit?: (transaction: Income | Expense, type: 'income' | 'expense') => void;
  onDelete?: (transaction: Income | Expense, type: 'income' | 'expense') => void;
}

export default function TransactionList({
  incomes,
  expenses,
  type = 'all',
  onEdit,
  onDelete,
}: TransactionListProps) {
  const [sortOrder, setSortOrder] = React.useState<'desc' | 'asc'>('desc');

  // Combine and sort transactions
  const transactions = useMemo(() => {
    let combined: Array<{ item: Income | Expense; itemType: 'income' | 'expense'; date: string }> = [];

    if (type === 'all' || type === 'income') {
      combined = [
        ...combined,
        ...incomes.map(inc => ({ item: inc, itemType: 'income' as const, date: inc.date })),
      ];
    }

    if (type === 'all' || type === 'expense') {
      combined = [
        ...combined,
        ...expenses.map(exp => ({ item: exp, itemType: 'expense' as const, date: exp.date })),
      ];
    }

    return combined.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [incomes, expenses, type, sortOrder]);

  const getCategoryColor = (category: string, isIncome: boolean) => {
    if (isIncome) {
      return 'bg-green-100 text-green-700';
    }
    const colors: { [key: string]: string } = {
      'Materiales': 'bg-blue-100 text-blue-700',
      'Mano de obra': 'bg-purple-100 text-purple-700',
      'Transporte': 'bg-yellow-100 text-yellow-700',
      'Alquiler': 'bg-orange-100 text-orange-700',
      'Otros': 'bg-gray-100 text-gray-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-3">
      {/* Sort button */}
      <div className="flex justify-end">
        <button
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          className="text-sm text-primary hover:text-primary/70 transition-colors duration-200 flex items-center gap-1"
        >
          <Calendar className="w-4 h-4" />
          {sortOrder === 'desc' ? 'Más recientes primero' : 'Más antiguos primero'}
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12 text-primary/60">
          <p className="text-sm">No hay transacciones registradas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map(({ item, itemType, date }) => {
            const isIncome = itemType === 'income';
            const income = isIncome ? (item as Income) : null;
            const expense = !isIncome ? (item as Expense) : null;

            return (
              <div
                key={`${itemType}-${item.id}`}
                className="bg-white/40 backdrop-blur-sm rounded-xl p-4 hover:bg-white/60 transition-all duration-200 border-l-4"
                style={{
                  borderLeftColor: isIncome ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left side */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {isIncome ? (
                        <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                      <h4 className="font-semibold text-primary truncate">
                        {isIncome ? (income?.eventName || 'Sin nombre') : (expense?.description || 'Sin descripción')}
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm text-primary/70">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(date)}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" />
                        <Badge
                          variant="secondary"
                          size="sm"
                          className={getCategoryColor(isIncome ? (income?.category || 'Otros') : (expense?.category || 'Otros'), isIncome)}
                        >
                          {isIncome ? (income?.category || 'Otros') : (expense?.category || 'Otros')}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-2">
                    <p
                      className={`text-xl font-bold ${
                        isIncome ? 'text-green-600' : 'text-red-500'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(isIncome ? (income?.amount || 0) : (expense?.amount || 0))}
                    </p>

                    {onDelete && (
                      <button
                        onClick={() => onDelete(item, itemType)}
                        className="text-xs text-red-500 hover:text-red-600 transition-colors duration-200"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
