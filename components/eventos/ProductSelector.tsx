'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Product } from '@/lib/context/AppContext';
import { Plus, Minus, Search, Package } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils/formatters';

interface EventItem {
  productId: string;
  productName: string;
  quantity: number;
}

interface ProductSelectorProps {
  selectedItems: EventItem[];
  onItemsChange: (items: EventItem[]) => void;
}

export default function ProductSelector({ selectedItems, onItemsChange }: ProductSelectorProps) {
  const { products } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filter available products
  const availableProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const isAvailable = product.status === 'available' || product.status === 'in-use';
      return matchesSearch && matchesCategory && isAvailable;
    });
  }, [products, searchTerm, categoryFilter]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  // Calculate quantity of a product in selected items
  const getSelectedQuantity = (productId: string) => {
    const item = selectedItems.find(i => i.productId === productId);
    return item ? item.quantity : 0;
  };

  // Handle quantity change
  const handleQuantityChange = (product: Product, change: number) => {
    const currentQuantity = getSelectedQuantity(product.id);
    const newQuantity = currentQuantity + change;

    if (newQuantity <= 0) {
      // Remove item if quantity is 0
      onItemsChange(selectedItems.filter(i => i.productId !== product.id));
    } else if (newQuantity <= product.quantity) {
      // Update quantity
      const newItems = selectedItems.filter(i => i.productId !== product.id);
      newItems.push({
        productId: product.id,
        productName: product.name,
        quantity: newQuantity,
      });
      onItemsChange(newItems);
    }
  };

  // Calculate total value of selected items
  const totalValue = useMemo(() => {
    return selectedItems.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        return total + (product.estimatedValue * item.quantity);
      }
      return total;
    }, 0);
  }, [selectedItems, products]);

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-accent/30 bg-white/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 text-sm"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border-2 border-accent/30 bg-white/50 focus:border-primary outline-none text-sm"
        >
          <option value="all">Todas las categorías</option>
          {categories.filter(c => c !== 'all').map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Available Products */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {availableProducts.length === 0 ? (
          <div className="text-center py-8 text-primary/60">
            <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No hay productos disponibles</p>
          </div>
        ) : (
          availableProducts.map((product) => {
            const selectedQty = getSelectedQuantity(product.id);
            return (
              <div
                key={product.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedQty > 0
                    ? 'border-primary bg-primary/10'
                    : 'border-accent/30 bg-white/30'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-primary text-sm truncate">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" size="sm">
                      {product.category}
                    </Badge>
                    <span className="text-xs text-primary/60">
                      Disponibles: {product.quantity}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(product, -1)}
                    disabled={selectedQty === 0}
                    className={`p-1 rounded transition-colors duration-200 ${
                      selectedQty === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-accent/30 text-primary hover:bg-accent/50'
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="w-8 text-center font-medium text-primary">
                    {selectedQty}
                  </span>

                  <button
                    onClick={() => handleQuantityChange(product, 1)}
                    disabled={selectedQty >= product.quantity}
                    className={`p-1 rounded transition-colors duration-200 ${
                      selectedQty >= product.quantity
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-primary/20 text-primary hover:bg-primary/30'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary */}
      {selectedItems.length > 0 && (
        <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary">
              Productos seleccionados:
            </span>
            <span className="text-sm font-bold text-primary">
              {selectedItems.length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary">
              Valor total:
            </span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(totalValue)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
