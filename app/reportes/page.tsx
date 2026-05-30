'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import MonthlyReport from '@/components/reportes/MonthlyReport';
import TopProductsReport from '@/components/reportes/TopProductsReport';
import ExpenseBreakdown from '@/components/reportes/ExpenseBreakdown';
import Button from '@/components/ui/Button';
import { Calendar, Filter, FileText, TrendingUp, Package, PieChart, BarChart3, Download } from 'lucide-react';

type ReportTab = 'overview' | 'products' | 'expenses';

export default function Reportes() {
  const [activeTab, setActiveTab] = useState<ReportTab>('overview');
  const [dateFilter, setDateFilter] = useState<'all' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'custom'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Get date range based on filter
  const getDateRange = () => {
    const now = new Date();

    switch (dateFilter) {
      case 'thisMonth':
        return {
          startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
          endDate: now.toISOString(),
        };
      case 'lastMonth':
        return {
          startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString(),
          endDate: new Date(now.getFullYear(), now.getMonth(), 0).toISOString(),
        };
      case 'thisYear':
        return {
          startDate: new Date(now.getFullYear(), 0, 1).toISOString(),
          endDate: now.toISOString(),
        };
      case 'custom':
        return {
          startDate: startDate ? new Date(startDate).toISOString() : undefined,
          endDate: endDate ? new Date(endDate).toISOString() : undefined,
        };
      default:
        return {
          startDate: undefined,
          endDate: undefined,
        };
    }
  };

  const { startDate: effectiveStartDate, endDate: effectiveEndDate } = getDateRange();

  const handleExportReport = () => {
    alert('Función de exportación en desarrollo.\n\nEsta función permitirá exportar los reportes a PDF o Excel en futuras versiones.');
  };

  const tabs = [
    {
      id: 'overview' as ReportTab,
      label: 'Resumen Mensual',
      icon: BarChart3,
      description: 'Vista general de ingresos, gastos y ganancias',
    },
    {
      id: 'products' as ReportTab,
      label: 'Top Productos',
      icon: Package,
      description: 'Productos más utilizados y su rendimiento',
    },
    {
      id: 'expenses' as ReportTab,
      label: 'Desglose Gastos',
      icon: PieChart,
      description: 'Análisis de gastos por categoría',
    },
  ];

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
                  Reportes
                </h1>
                <p className="text-primary/60">
                  Análisis detallado del rendimiento de Amaré Decor
                </p>
              </div>
              <Button onClick={handleExportReport} className="whitespace-nowrap">
                <Download className="w-4 h-4 mr-2" />
                Exportar Reporte
              </Button>
            </div>

            {/* Date Filters */}
            <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary/60" />
                <span className="text-sm font-medium text-primary">Período del Reporte:</span>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex gap-2">
                  {[
                    { value: 'all', label: 'Todos los tiempos' },
                    { value: 'thisMonth', label: 'Este mes' },
                    { value: 'lastMonth', label: 'Mes anterior' },
                    { value: 'thisYear', label: 'Este año' },
                    { value: 'custom', label: 'Personalizado' },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setDateFilter(filter.value as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        dateFilter === filter.value
                          ? 'bg-primary text-white'
                          : 'bg-white/50 text-primary hover:bg-white/70'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {dateFilter === 'custom' && (
                  <div className="flex gap-2 items-center">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-3 py-2 rounded-lg border-2 border-accent/30 bg-white/50 focus:border-primary outline-none text-sm"
                    />
                    <span className="text-primary/60">hasta</span>
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

            {/* Tabs */}
            <div className="border-b border-accent/30">
              <div className="flex gap-2 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all duration-200 whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-primary/60 hover:text-primary hover:border-accent/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="fade-in">
              {activeTab === 'overview' && (
                <div>
                  <div className="mb-4">
                    <h2 className="text-xl font-display font-semibold text-primary mb-2">
                      Resumen Mensual de Rendimiento
                    </h2>
                    <p className="text-sm text-primary/60">
                      Análisis detallado de ingresos, gastos y ganancias mes a mes
                    </p>
                  </div>
                  <MonthlyReport
                    startDate={effectiveStartDate}
                    endDate={effectiveEndDate}
                  />
                </div>
              )}

              {activeTab === 'products' && (
                <div>
                  <div className="mb-4">
                    <h2 className="text-xl font-display font-semibold text-primary mb-2">
                      Productos Más Utilizados
                    </h2>
                    <p className="text-sm text-primary/60">
                      Análisis de los productos con mayor uso en eventos
                    </p>
                  </div>
                  <TopProductsReport
                    startDate={effectiveStartDate}
                    endDate={effectiveEndDate}
                    limit={15}
                  />
                </div>
              )}

              {activeTab === 'expenses' && (
                <div>
                  <div className="mb-4">
                    <h2 className="text-xl font-display font-semibold text-primary mb-2">
                      Desglose de Gastos por Categoría
                    </h2>
                    <p className="text-sm text-primary/60">
                      Análisis detallado de la distribución de gastos
                    </p>
                  </div>
                  <ExpenseBreakdown
                    startDate={effectiveStartDate}
                    endDate={effectiveEndDate}
                  />
                </div>
              )}
            </div>

            {/* Report Tips */}
            <div className="bg-primary/10 rounded-xl p-4 border-2 border-primary/20">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-primary mb-1">Tips para Análisis</h4>
                  <ul className="text-sm text-primary/70 space-y-1">
                    <li>• Compara meses para identificar tendencias estacionales</li>
                    <li>• Revisa los productos más utilizados para optimizar inventario</li>
                    <li>• Analiza las categorías de gastos para identificar oportunidades de ahorro</li>
                    <li>• Usa filtros de fecha para analizar períodos específicos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
