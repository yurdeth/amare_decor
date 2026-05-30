'use client';

import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import IncomeModal from '@/components/finanzas/IncomeModal';
import ExpenseModal from '@/components/finanzas/ExpenseModal';
import TransactionList from '@/components/finanzas/TransactionList';
import FinanceChart from '@/components/finanzas/FinanceChart';
import Button from '@/components/ui/Button';
import { useApp } from '@/lib/context/AppContext';
import { formatCurrency } from '@/lib/utils/formatters';
import { Income, Expense } from '@/lib/context/AppContext';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Filter, X } from 'lucide-react';

export default function Finanzas() {
  const { incomes, expenses, addIncome, addExpense, getTotalIncome, getTotalExpenses, getNetProfit } = useApp();
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'all' | 'income' | 'expense'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'thisMonth' | 'lastMonth' | 'custom'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter transactions by date
  const filteredIncomes = useMemo(() => {
    let filtered = incomes;

    if (dateFilter === 'thisMonth') {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filtered = filtered.filter(inc => new Date(inc.date) >= startOfMonth);
    } else if (dateFilter === 'lastMonth') {
      const now = new Date();
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      filtered = filtered.filter(inc => {
        const date = new Date(inc.date);
        return date >= startOfLastMonth && date <= endOfLastMonth;
      });
    } else if (dateFilter === 'custom' && startDate && endDate) {
      filtered = filtered.filter(inc => {
        const date = new Date(inc.date);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });
    }

    return filtered;
  }, [incomes, dateFilter, startDate, endDate]);

  const filteredExpenses = useMemo(() => {
    let filtered = expenses;

    if (dateFilter === 'thisMonth') {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filtered = filtered.filter(exp => new Date(exp.date) >= startOfMonth);
    } else if (dateFilter === 'lastMonth') {
      const now = new Date();
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      filtered = filtered.filter(exp => {
        const date = new Date(exp.date);
        return date >= startOfLastMonth && date <= endOfLastMonth;
      });
    } else if (dateFilter === 'custom' && startDate && endDate) {
      filtered = filtered.filter(exp => {
        const date = new Date(exp.date);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });
    }

    return filtered;
  }, [expenses, dateFilter, startDate, endDate]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalIncome = filteredIncomes.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const netProfit = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      netProfit,
    };
  }, [filteredIncomes, filteredExpenses]);

  const handleAddIncome = (income: Omit<Income, 'id'>) => {
    addIncome(income);
    setIsIncomeModalOpen(false);
  };

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    addExpense(expense);
    setIsExpenseModalOpen(false);
  };

  const handleDeleteTransaction = (transaction: Income | Expense, type: 'income' | 'expense') => {
    const desc = type === 'income'
      ? (transaction as Income).eventName
      : (transaction as Expense).description;

    if (confirm(`¿Estás seguro de que deseas eliminar este registro?\n\n${desc}`)) {
      // Delete logic would go here if we had delete functions in context
      alert('Función de eliminar no implementada en esta versión');
    }
  };

  const clearDateFilter = () => {
    setDateFilter('all');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-primary mb-2">
                  Finanzas
                </h1>
                <p className="text-primary/60">
                  Controla los ingresos y gastos de Amaré Decor
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsIncomeModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  Registrar Ingreso
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsExpenseModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <TrendingDown className="w-4 h-4" />
                  Registrar Gasto
                </Button>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-sm text-primary/60 mb-1">Total Ingresos</p>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(metrics.totalIncome)}
                </p>
              </div>

              <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-red-500/20 rounded-lg">
                    <TrendingDown className="w-6 h-6 text-red-500" />
                  </div>
                </div>
                <p className="text-sm text-primary/60 mb-1">Total Gastos</p>
                <p className="text-3xl font-bold text-red-500">
                  {formatCurrency(metrics.totalExpenses)}
                </p>
              </div>

              <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-primary/60 mb-1">Ganancia Neta</p>
                <p
                  className={`text-3xl font-bold ${
                    metrics.netProfit >= 0 ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {formatCurrency(Math.abs(metrics.netProfit))}
                  {metrics.netProfit < 0 && ' (-)'}
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-primary/60" />
                <span className="text-sm font-medium text-primary">Filtros:</span>
              </div>

              <div className="flex flex-wrap gap-4">
                {/* Transaction Type Filter */}
                <div>
                  <label className="block text-sm text-primary/60 mb-2">Tipo de Transacción</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTransactionType('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        transactionType === 'all'
                          ? 'bg-primary text-white'
                          : 'bg-white/50 text-primary hover:bg-white/70'
                      }`}
                    >
                      Todas
                    </button>
                    <button
                      onClick={() => setTransactionType('income')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        transactionType === 'income'
                          ? 'bg-green-500 text-white'
                          : 'bg-white/50 text-primary hover:bg-white/70'
                      }`}
                    >
                      Ingresos
                    </button>
                    <button
                      onClick={() => setTransactionType('expense')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        transactionType === 'expense'
                          ? 'bg-red-500 text-white'
                          : 'bg-white/50 text-primary hover:bg-white/70'
                      }`}
                    >
                      Gastos
                    </button>
                  </div>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-sm text-primary/60 mb-2">Período</label>
                  <div className="flex gap-2">
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value as any)}
                      className="px-4 py-2 rounded-lg border-2 border-accent/30 bg-white/50 focus:border-primary outline-none text-sm"
                    >
                      <option value="all">Todos los tiempos</option>
                      <option value="thisMonth">Este mes</option>
                      <option value="lastMonth">Mes anterior</option>
                      <option value="custom">Personalizado</option>
                    </select>

                    {dateFilter === 'custom' && (
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="px-3 py-2 rounded-lg border-2 border-accent/30 bg-white/50 focus:border-primary outline-none text-sm"
                        />
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="px-3 py-2 rounded-lg border-2 border-accent/30 bg-white/50 focus:border-primary outline-none text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Clear Filters */}
                {(transactionType !== 'all' || dateFilter !== 'all') && (
                  <Button variant="outline" size="sm" onClick={clearDateFilter}>
                    <X className="w-4 h-4 mr-1" />
                    Limpiar filtros
                  </Button>
                )}
              </div>
            </div>

            {/* Chart and Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart */}
              <div>
                <FinanceChart
                  incomes={filteredIncomes}
                  expenses={filteredExpenses}
                  startDate={dateFilter === 'custom' ? startDate : undefined}
                  endDate={dateFilter === 'custom' ? endDate : undefined}
                />
              </div>

              {/* Transactions List */}
              <div className="bg-secondary/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-display font-semibold text-primary mb-4">
                  Transacciones
                </h3>
                <div className="max-h-96 overflow-y-auto">
                  <TransactionList
                    incomes={filteredIncomes}
                    expenses={filteredExpenses}
                    type={transactionType}
                    onDelete={handleDeleteTransaction}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <IncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        onSave={handleAddIncome}
      />
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={handleAddExpense}
      />
    </div>
  );
}
