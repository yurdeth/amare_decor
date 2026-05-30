'use client';

import React from 'react';
import { Trophy } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';

export default function TopProducts() {
  const { getTopProducts } = useApp();
  const topProducts = getTopProducts(5);
  const maxCount = topProducts.length > 0 ? topProducts[0].count : 1;

  const calculatePercentage = (count: number) => {
    return Math.round((count / maxCount) * 100);
  };

  return (
    <div className="bg-secondary/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-display font-semibold text-primary">
          Productos Más Utilizados
        </h3>
      </div>

      <div className="space-y-4">
        {topProducts.length === 0 ? (
          <div className="text-center py-8 text-primary/60">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No hay datos aún</p>
            <p className="text-xs mt-1">Los productos aparecerán aquí después de los eventos</p>
          </div>
        ) : (
          topProducts.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-bold">
                    {index + 1}
                  </span>
                  <h4 className="font-medium text-primary">{item.product}</h4>
                </div>
                <span className="text-sm text-primary/70 font-medium">
                  {item.count} {item.count === 1 ? 'vez' : 'veces'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${calculatePercentage(item.count)}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
