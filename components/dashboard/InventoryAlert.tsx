'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Package, ChevronRight } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import Badge from '@/components/ui/Badge';

export default function InventoryAlert() {
  const { getLowStockProducts } = useApp();
  const lowStockProducts = getLowStockProducts(5);

  return (
    <div className="bg-secondary/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-display font-semibold text-primary flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          Alertas de Inventario
        </h3>
        <Link
          href="/inventario"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/70 transition-colors duration-200"
        >
          Ver inventario
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {lowStockProducts.length === 0 ? (
          <div className="text-center py-8 text-primary/60">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Todo en orden</p>
            <p className="text-xs mt-1">No hay alertas de inventario</p>
          </div>
        ) : (
          lowStockProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/30 border-l-4 border-yellow-500"
            >
              <div className="flex-1">
                <h4 className="font-medium text-primary">{product.name}</h4>
                <p className="text-sm text-primary/60">{product.category}</p>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="maintenance" size="sm">
                  {product.quantity} unidades
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>

      {lowStockProducts.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-yellow-100/30 border border-yellow-200/30">
          <p className="text-xs text-yellow-800">
            <span className="font-medium">Recomendación:</span> Reabastecer estos productos pronto
          </p>
        </div>
      )}
    </div>
  );
}
