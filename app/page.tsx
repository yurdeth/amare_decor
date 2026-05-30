'use client';

import React, { useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import MetricCard from '@/components/dashboard/MetricCard';
import RecentEvents from '@/components/dashboard/RecentEvents';
import InventoryAlert from '@/components/dashboard/InventoryAlert';
import TopProducts from '@/components/dashboard/TopProducts';
import MotivationalMessage from '@/components/dashboard/MotivationalMessage';
import ScrollToTopButton from '@/components/shared/ScrollToTopButton';
import { DataBackup } from '@/components/DataBackup';
import { useApp } from '@/lib/context/AppContext';

export default function Dashboard() {
  const { getDashboardMetrics } = useApp();

  // Memoize metrics to avoid recalculation on every render
  const metrics = useMemo(() => getDashboardMetrics(), [getDashboardMetrics]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Page Content with improved scroll */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="responsive-container py-6 pb-24 md:pb-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Motivational Message */}
              <div className="bg-secondary/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg">
                <MotivationalMessage />
              </div>

              {/* Data Backup Section */}
              <div className="bg-secondary/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg">
                <h3 className="text-lg font-display font-semibold text-primary mb-3 flex items-center gap-2">
                  <span>💾</span>
                  <span>Backup de Datos</span>
                </h3>
                <p className="text-sm text-primary/70 mb-4">
                  Exporta tus datos para hacer un backup o impórtalos para restaurar una copia de seguridad.
                </p>
                <DataBackup />
              </div>

              {/* Metrics Grid - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <MetricCard
                  title="Ingresos Totales"
                  value={metrics.totalIncome}
                  icon="income"
                  trend={{ value: 12, isPositive: true }}
                />
                <MetricCard
                  title="Gastos Totales"
                  value={metrics.totalExpenses}
                  icon="expense"
                  trend={{ value: 8, isPositive: false }}
                />
                <MetricCard
                  title="Ganancia Neta"
                  value={metrics.netProfit}
                  icon="profit"
                  trend={{ value: 15, isPositive: true }}
                />
                <MetricCard
                  title="Eventos Activos"
                  value={metrics.activeEvents}
                  icon="events"
                  trend={{ value: 5, isPositive: true }}
                />
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Recent Events */}
                <RecentEvents />

                {/* Inventory Alerts */}
                <InventoryAlert />
              </div>

              {/* Top Products - Full Width */}
              <div>
                <TopProducts />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
}
