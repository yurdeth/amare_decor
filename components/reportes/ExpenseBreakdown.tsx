'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { formatCurrency } from '@/lib/utils/formatters';
import { PieChart, TrendingDown } from 'lucide-react';

interface ExpenseBreakdownProps {
  startDate?: string;
  endDate?: string;
}

interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  count: number;
  color: string;
}

export default function ExpenseBreakdown({ startDate, endDate }: ExpenseBreakdownProps) {
  const { expenses } = useApp();

  // Category colors
  const categoryColors: { [key: string]: string } = {
    'Materiales': 'bg-blue-500',
    'Mano de obra': 'bg-purple-500',
    'Transporte': 'bg-yellow-500',
    'Alquiler': 'bg-orange-500',
    'Otros': 'bg-gray-500',
  };

  // Calculate breakdown by category
  const breakdown = useMemo(() => {
    const filteredExpenses = expenses.filter(expense => {
      if (!startDate && !endDate) return true;
      const expDate = new Date(expense.date);
      if (startDate && expDate < new Date(startDate)) return false;
      if (endDate && expDate > new Date(endDate)) return false;
      return true;
    });

    const categoryTotals: { [key: string]: { amount: number; count: number } } = {};

    filteredExpenses.forEach(expense => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = { amount: 0, count: 0 };
      }
      categoryTotals[expense.category].amount += expense.amount;
      categoryTotals[expense.category].count += 1;
    });

    const totalAmount = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.amount, 0);

    return Object.entries(categoryTotals)
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        count: data.count,
        percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
        color: categoryColors[category] || 'bg-gray-500',
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, startDate, endDate]);

  // Calculate total
  const totalExpenses = useMemo(() => {
    return breakdown.reduce((sum, cat) => sum + cat.amount, 0);
  }, [breakdown]);

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-red-100 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-800">Gastos Totales</p>
              <p className="text-3xl font-bold text-red-700">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-red-800">Categorías</p>
            <p className="text-2xl font-bold text-red-700">{breakdown.length}</p>
          </div>
        </div>
      </div>

      {/* Breakdown List */}
      <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-display font-semibold text-primary mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Desglose por Categoría
        </h3>

        {breakdown.length === 0 ? (
          <div className="text-center py-8 text-primary/60">
            <PieChart className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay gastos registrados en el período seleccionado</p>
          </div>
        ) : (
          <div className="space-y-4">
            {breakdown.map((item) => (
              <div key={item.category} className="space-y-2">
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${item.color}`} />
                    <h4 className="font-semibold text-primary">{item.category}</h4>
                    <span className="text-xs text-primary/60">
                      ({item.count} {item.count === 1 ? 'gasto' : 'gastos'})
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{formatCurrency(item.amount)}</p>
                    <p className="text-sm text-primary/60">{item.percentage.toFixed(1)}%</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Visual Pie Chart (CSS-based) */}
      {breakdown.length > 0 && (
        <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-display font-semibold text-primary mb-4">
            Distribución Visual
          </h3>
          <div className="flex items-center justify-center">
            <div
              className="relative w-48 h-48 rounded-full"
              style={{
                background: `conic-gradient(
                  ${breakdown.map((item, index) => {
                    const start = breakdown.slice(0, index).reduce((sum, cat) => sum + cat.percentage, 0);
                    const end = start + item.percentage;
                    const color = item.color.replace('bg-', '');
                    return `${color} ${start}% ${end}%`;
                  }).join(', ')}
                )`,
              }}
            >
              <div className="absolute inset-4 bg-background rounded-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{breakdown.length}</p>
                  <p className="text-xs text-primary/60">categorías</p>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
            {breakdown.map((item) => (
              <div key={item.category} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${item.color}`} />
                <span className="text-sm text-primary/70">{item.category}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
