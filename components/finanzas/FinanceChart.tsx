'use client';

import React, { useMemo } from 'react';
import { formatCurrency } from '@/lib/utils/formatters';
import { Income, Expense } from '@/lib/context/AppContext';

interface FinanceChartProps {
  incomes: Income[];
  expenses: Expense[];
  startDate?: string;
  endDate?: string;
}

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  profit: number;
}

export default function FinanceChart({ incomes, expenses, startDate, endDate }: FinanceChartProps) {
  const monthlyData = useMemo(() => {
    const data: { [key: string]: MonthlyData } = {};

    // Filter incomes by date range
    const filteredIncomes = incomes.filter(inc => {
      if (!startDate && !endDate) return true;
      const incDate = new Date(inc.date);
      if (startDate && incDate < new Date(startDate)) return false;
      if (endDate && incDate > new Date(endDate)) return false;
      return true;
    });

    // Filter expenses by date range
    const filteredExpenses = expenses.filter(exp => {
      if (!startDate && !endDate) return true;
      const expDate = new Date(exp.date);
      if (startDate && expDate < new Date(startDate)) return false;
      if (endDate && expDate > new Date(endDate)) return false;
      return true;
    });

    // Process incomes by month
    filteredIncomes.forEach(inc => {
      const date = new Date(inc.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('es-MX', { month: 'short', year: '2-digit' });

      if (!data[monthKey]) {
        data[monthKey] = {
          month: monthLabel,
          income: 0,
          expense: 0,
          profit: 0,
        };
      }
      data[monthKey].income += inc.amount;
    });

    // Process expenses by month
    filteredExpenses.forEach(exp => {
      const date = new Date(exp.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('es-MX', { month: 'short', year: '2-digit' });

      if (!data[monthKey]) {
        data[monthKey] = {
          month: monthLabel,
          income: 0,
          expense: 0,
          profit: 0,
        };
      }
      data[monthKey].expense += exp.amount;
    });

    // Calculate profit for each month
    Object.keys(data).forEach(key => {
      data[key].profit = data[key].income - data[key].expense;
    });

    // Sort by date and get last 6 months
    return Object.values(data)
      .sort((a, b) => {
        const dateA = new Date(a.month).getTime();
        const dateB = new Date(b.month).getTime();
        return dateA - dateB;
      })
      .slice(-6);
  }, [incomes, expenses, startDate, endDate]);

  const maxValue = useMemo(() => {
    const maxIncome = Math.max(...monthlyData.map(d => d.income), 0);
    const maxExpense = Math.max(...monthlyData.map(d => d.expense), 0);
    return Math.max(maxIncome, maxExpense, 1);
  }, [monthlyData]);

  const getBarHeight = (value: number) => {
    if (maxValue === 0) return 0;
    return (value / maxValue) * 100;
  };

  if (monthlyData.length === 0) {
    return (
      <div className="bg-secondary/20 backdrop-blur-sm rounded-2xl p-8 text-center">
        <p className="text-primary/60">No hay datos suficientes para mostrar el gráfico</p>
      </div>
    );
  }

  return (
    <div className="bg-secondary/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-display font-semibold text-primary mb-6">
        Resumen Mensual
      </h3>

      {/* Chart */}
      <div className="flex items-end justify-around gap-4 h-64 mb-4">
        {monthlyData.map((data, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            {/* Bars container */}
            <div className="flex items-end gap-1 w-full h-full justify-center">
              {/* Income bar */}
              <div
                className="w-6 bg-green-500 rounded-t-lg transition-all duration-500 hover:bg-green-600 relative group"
                style={{ height: `${getBarHeight(data.income)}%` }}
                title={`Ingresos: ${formatCurrency(data.income)}`}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {formatCurrency(data.income)}
                </div>
              </div>

              {/* Expense bar */}
              <div
                className="w-6 bg-red-500 rounded-t-lg transition-all duration-500 hover:bg-red-600 relative group"
                style={{ height: `${getBarHeight(data.expense)}%` }}
                title={`Gastos: ${formatCurrency(data.expense)}`}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {formatCurrency(data.expense)}
                </div>
              </div>
            </div>

            {/* Month label */}
            <span className="text-xs text-primary/70 text-center capitalize">
              {data.month}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-primary/70">Ingresos</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm text-primary/70">Gastos</span>
        </div>
      </div>
    </div>
  );
}
