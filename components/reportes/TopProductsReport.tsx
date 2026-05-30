'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Trophy, Package, TrendingUp, Calendar } from 'lucide-react';

interface TopProductsReportProps {
  startDate?: string;
  endDate?: string;
  limit?: number;
}

interface ProductUsage {
  product: string;
  count: number;
  percentage: number;
  lastUsed: string;
  categories: string[];
  totalValue: number;
}

export default function TopProductsReport({
  startDate,
  endDate,
  limit = 10,
}: TopProductsReportProps) {
  const { events, products } = useApp();

  // Calculate product usage
  const productUsage = useMemo(() => {
    const productCounts: { [key: string]: { count: number; lastUsed: string; categories: Set<string>; totalValue: number } } = {};

    // Filter events by date range
    const filteredEvents = events.filter(event => {
      if (!startDate && !endDate) return true;
      const eventDate = new Date(event.date);
      if (startDate && eventDate < new Date(startDate)) return false;
      if (endDate && eventDate > new Date(endDate)) return false;
      return true;
    });

    // Count product usage
    filteredEvents.forEach(event => {
      event.items.forEach(item => {
        if (!productCounts[item.productName]) {
          productCounts[item.productName] = {
            count: 0,
            lastUsed: event.date,
            categories: new Set(),
            totalValue: 0,
          };
        }
        productCounts[item.productName].count += item.quantity;
        productCounts[item.productName].lastUsed =
          new Date(event.date) > new Date(productCounts[item.productName].lastUsed)
            ? event.date
            : productCounts[item.productName].lastUsed;

        // Get product category and value
        const product = products.find(p => p.name === item.productName);
        if (product) {
          productCounts[item.productName].categories.add(product.category);
          productCounts[item.productName].totalValue += product.estimatedValue * item.quantity;
        }
      });
    });

    // Convert to array and calculate percentages
    const totalCount = Object.values(productCounts).reduce((sum, p) => sum + p.count, 0);

    return Object.entries(productCounts)
      .map(([product, data]) => ({
        product,
        count: data.count,
        lastUsed: data.lastUsed,
        categories: Array.from(data.categories),
        totalValue: data.totalValue,
        percentage: totalCount > 0 ? (data.count / totalCount) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }, [events, products, startDate, endDate]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalUsage = productUsage.reduce((sum, p) => sum + p.count, 0);
    const totalValue = productUsage.reduce((sum, p) => sum + p.totalValue, 0);
    const uniqueProducts = productUsage.length;

    return {
      totalUsage,
      totalValue,
      uniqueProducts,
      avgUsage: uniqueProducts > 0 ? totalUsage / uniqueProducts : 0,
    };
  }, [productUsage]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-primary/60">Productos Únicos</p>
              <p className="text-2xl font-bold text-primary">{stats.uniqueProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/40 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-primary/60">Uso Total</p>
              <p className="text-2xl font-bold text-primary">{stats.totalUsage}</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Trophy className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-primary/60">Valor Generado</p>
              <p className="text-lg font-bold text-primary">
                ${new Intl.NumberFormat('es-MX').format(stats.totalValue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products List */}
      <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-display font-semibold text-primary mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          Productos Más Utilizados
          <span className="text-sm font-normal text-primary/60">
            (Top {limit})
          </span>
        </h3>

        {productUsage.length === 0 ? (
          <div className="text-center py-8 text-primary/60">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay datos de uso de productos en el período seleccionado</p>
          </div>
        ) : (
          <div className="space-y-4">
            {productUsage.map((item, index) => (
              <div
                key={index}
                className="bg-white/30 rounded-xl p-4 hover:bg-white/50 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  {/* Rank */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                        index === 0
                          ? 'bg-yellow-400 text-yellow-900'
                          : index === 1
                          ? 'bg-gray-300 text-gray-700'
                          : index === 2
                          ? 'bg-orange-300 text-orange-800'
                          : 'bg-primary/20 text-primary'
                      }`}
                    >
                      {index + 1}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-primary mb-1">{item.product}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-primary/70 mb-3">
                      {item.categories.map((cat, catIndex) => (
                        <span
                          key={catIndex}
                          className="px-2 py-1 bg-accent/30 rounded-lg text-xs"
                        >
                          {cat}
                        </span>
                      ))}
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Último uso: {new Date(item.lastUsed).toLocaleDateString('es-MX')}
                      </span>
                    </div>

                    {/* Usage Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-primary/60">
                          Usado {item.count} {item.count === 1 ? 'vez' : 'veces'}
                        </span>
                        <span className="font-medium text-primary">
                          {item.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm text-primary/60">Valor Generado</p>
                    <p className="text-lg font-bold text-primary">
                      ${new Intl.NumberFormat('es-MX').format(item.totalValue)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
