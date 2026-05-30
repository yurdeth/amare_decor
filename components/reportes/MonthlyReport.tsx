'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { formatCurrency } from '@/lib/utils/formatters';
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3 } from 'lucide-react';

interface MonthlyReportProps {
  startDate?: string;
  endDate?: string;
}

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  profit: number;
  eventCount: number;
}

export default function MonthlyReport({ startDate, endDate }: MonthlyReportProps) {
  const { incomes, expenses, events } = useApp();

  // Filter and group by month
  const monthlyData = useMemo(() => {
    const data: { [key: string]: MonthlyData } = {};

    // Filter incomes
    const filteredIncomes = incomes.filter(inc => {
      if (!startDate && !endDate) return true;
      const incDate = new Date(inc.date);
      if (startDate && incDate < new Date(startDate)) return false;
      if (endDate && incDate > new Date(endDate)) return false;
      return true;
    });

    // Filter expenses
    const filteredExpenses = expenses.filter(exp => {
      if (!startDate && !endDate) return true;
      const expDate = new Date(exp.date);
      if (startDate && expDate < new Date(startDate)) return false;
      if (endDate && expDate > new Date(endDate)) return false;
      return true;
    });

    // Filter events
    const filteredEvents = events.filter(event => {
      if (!startDate && !endDate) return true;
      const eventDate = new Date(event.date);
      if (startDate && eventDate < new Date(startDate)) return false;
      if (endDate && eventDate > new Date(endDate)) return false;
      return true;
    });

    // Process by month
    filteredIncomes.forEach(inc => {
      const date = new Date(inc.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });

      if (!data[monthKey]) {
        data[monthKey] = {
          month: monthLabel,
          income: 0,
          expense: 0,
          profit: 0,
          eventCount: 0,
        };
      }
      data[monthKey].income += inc.amount;
    });

    filteredExpenses.forEach(exp => {
      const date = new Date(exp.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!data[monthKey]) {
        const monthLabel = date.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
        data[monthKey] = {
          month: monthLabel,
          income: 0,
          expense: 0,
          profit: 0,
          eventCount: 0,
        };
      }
      data[monthKey].expense += exp.amount;
    });

    filteredEvents.forEach(event => {
      const date = new Date(event.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!data[monthKey]) {
        const monthLabel = date.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
        data[monthKey] = {
          month: monthLabel,
          income: 0,
          expense: 0,
          profit: 0,
          eventCount: 0,
        };
      }
      data[monthKey].eventCount += 1;
    });

    // Calculate profit for each month
    Object.keys(data).forEach(key => {
      data[key].profit = data[key].income - data[key].expense;
    });

    // Sort by date and get all months
    return Object.values(data).sort((a, b) => {
      const dateA = new Date(a.month).getTime();
      const dateB = new Date(b.month).getTime();
      return dateA - dateB;
    });
  }, [incomes, expenses, events, startDate, endDate]);

  // Calculate totals
  const totals = useMemo(() => {
    return monthlyData.reduce(
      (acc, month) => ({
        totalIncome: acc.totalIncome + month.income,
        totalExpense: acc.totalExpense + month.expense,
        totalProfit: acc.totalProfit + month.profit,
        totalEvents: acc.totalEvents + month.eventCount,
      }),
      { totalIncome: 0, totalExpense: 0, totalProfit: 0, totalEvents: 0 }
    );
  }, [monthlyData]);

  // Calculate averages
  const averages = useMemo(() => {
    const monthsCount = monthlyData.length || 1;
    return {
      avgIncome: totals.totalIncome / monthsCount,
      avgExpense: totals.totalExpense / monthsCount,
      avgProfit: totals.totalProfit / monthsCount,
    };
  }, [totals, monthlyData.length]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-green-100 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Ingresos Totales</span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {formatCurrency(totals.totalIncome)}
          </p>
          <p className="text-xs text-green-600 mt-1">
            Promedio: {formatCurrency(averages.avgIncome)}/mes
          </p>
        </div>

        <div className="bg-red-100 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-800">Gastos Totales</span>
          </div>
          <p className="text-2xl font-bold text-red-700">
            {formatCurrency(totals.totalExpense)}
          </p>
          <p className="text-xs text-red-600 mt-1">
            Promedio: {formatCurrency(averages.avgExpense)}/mes
          </p>
        </div>

        <div className="bg-primary/20 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Ganancia Neta</span>
          </div>
          <p className={`text-2xl font-bold ${totals.totalProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {formatCurrency(Math.abs(totals.totalProfit))}
            {totals.totalProfit < 0 && ' (-)'}
          </p>
          <p className="text-xs text-primary/70 mt-1">
            Promedio: {formatCurrency(Math.abs(averages.avgProfit))}/mes
          </p>
        </div>

        <div className="bg-accent/40 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Eventos Totales</span>
          </div>
          <p className="text-2xl font-bold text-primary">
            {totals.totalEvents}
          </p>
          <p className="text-xs text-primary/70 mt-1">
            {monthlyData.length} {monthlyData.length === 1 ? 'mes' : 'meses'}
          </p>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-display font-semibold text-primary mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Desglose Mensual
        </h3>

        {monthlyData.length === 0 ? (
          <div className="text-center py-8 text-primary/60">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay datos disponibles para el período seleccionado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-accent/30">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Mes</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-primary">Ingresos</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-primary">Gastos</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-primary">Ganancia</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-primary">Eventos</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-primary">Margen</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((data, index) => {
                  const margin = data.income > 0 ? (data.profit / data.income) * 100 : 0;
                  return (
                    <tr
                      key={index}
                      className="border-b border-accent/20 hover:bg-white/30 transition-colors duration-150"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-primary capitalize">
                        {data.month}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">
                        {formatCurrency(data.income)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-red-500 font-medium">
                        {formatCurrency(data.expense)}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right font-medium ${
                        data.profit >= 0 ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {formatCurrency(Math.abs(data.profit))}
                        {data.profit < 0 && ' (-)'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-primary">
                        {data.eventCount}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          margin >= 20
                            ? 'bg-green-100 text-green-700'
                            : margin >= 10
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {margin.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="border-t-2 border-accent/30 bg-primary/5">
                <tr>
                  <td className="px-4 py-3 text-sm font-bold text-primary">TOTALES</td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-green-600">
                    {formatCurrency(totals.totalIncome)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-red-500">
                    {formatCurrency(totals.totalExpense)}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-bold ${
                    totals.totalProfit >= 0 ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {formatCurrency(Math.abs(totals.totalProfit))}
                    {totals.totalProfit < 0 && ' (-)'}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-primary">
                    {totals.totalEvents}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                      totals.totalIncome > 0 && (totals.totalProfit / totals.totalIncome) * 100 >= 20
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {totals.totalIncome > 0
                        ? ((totals.totalProfit / totals.totalIncome) * 100).toFixed(1)
                        : '0'}%
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
