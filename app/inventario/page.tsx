'use client';

import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { DataTable } from '@/components/shared/DataTable';
import ProductModal from '@/components/inventario/ProductModal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useApp } from '@/lib/context/AppContext';
import { formatCurrency, getStatusLabel } from '@/lib/utils/formatters';
import { Product } from '@/lib/context/AppContext';
import { Search, Filter, Package } from 'lucide-react';

export default function Inventario() {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    if (confirm(`¿Estás seguro de que deseas eliminar "${product.name}"?`)) {
      deleteProduct(product.id);
    }
  };

  const handleSaveProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      key: 'name',
      title: 'Producto',
      sortable: true,
      render: (value: string) => (
        <div className="font-medium">{value}</div>
      ),
    },
    {
      key: 'category',
      title: 'Categoría',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-primary/70">{value}</span>
      ),
    },
    {
      key: 'quantity',
      title: 'Cantidad',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <span className={`font-medium ${value < 5 ? 'text-red-500' : ''}`}>
            {value}
          </span>
          {value < 5 && (
            <span className="text-xs text-red-500">Bajo</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Estado',
      sortable: true,
      render: (value: string) => {
        const variant = value === 'available' ? 'available' :
                       value === 'in-use' ? 'in-use' : 'maintenance';
        return (
          <Badge variant={variant} size="sm">
            {getStatusLabel(value)}
          </Badge>
        );
      },
    },
    {
      key: 'estimatedValue',
      title: 'Valor Estimado',
      sortable: true,
      render: (value: number) => (
        <span className="font-medium">{formatCurrency(value)}</span>
      ),
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
                  Inventario
                </h1>
                <p className="text-primary/60">
                  Gestiona los productos y materiales de Amaré Decor
                </p>
              </div>
              <Button onClick={handleAddProduct} className="whitespace-nowrap">
                + Agregar Producto
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-primary/60">Total Productos</p>
                    <p className="text-2xl font-bold text-primary">{products.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm text-primary/60 mb-1">Valor Total</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(products.reduce((sum, p) => sum + (p.estimatedValue * p.quantity), 0))}
                </p>
              </div>

              <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm text-primary/60 mb-1">Stock Bajo</p>
                <p className="text-2xl font-bold text-red-500">
                  {products.filter(p => p.quantity < 5).length}
                </p>
              </div>

              <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm text-primary/60 mb-1">En Uso</p>
                <p className="text-2xl font-bold text-primary">
                  {products.filter(p => p.status === 'in-use').length}
                </p>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-4 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-accent/30 bg-white/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary/60" />
                  <span className="text-sm font-medium text-primary">Filtros:</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border-2 border-accent/30 bg-white/50 focus:border-primary outline-none text-sm"
                  >
                    <option value="all">Todas las categorías</option>
                    {categories.filter(c => c !== 'all').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border-2 border-accent/30 bg-white/50 focus:border-primary outline-none text-sm"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="available">Disponible</option>
                    <option value="in-use">En uso</option>
                    <option value="maintenance">Mantenimiento</option>
                  </select>
                </div>

                {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setCategoryFilter('all');
                      setStatusFilter('all');
                    }}
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>

              {/* Results count */}
              <p className="text-sm text-primary/60">
                Mostrando {filteredProducts.length} de {products.length} productos
              </p>
            </div>

            {/* Data Table */}
            <div className="bg-secondary/20 backdrop-blur-sm rounded-xl overflow-hidden">
              <DataTable
                data={filteredProducts}
                columns={columns}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                emptyMessage="No hay productos que coincidan con los filtros"
              />
            </div>
          </div>
        </main>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </div>
  );
}
