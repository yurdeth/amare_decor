'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import ScrollToTopButton from '@/components/shared/ScrollToTopButton';
import Button from '@/components/ui/Button';
import { useQuotations } from '@/lib/context/QuotationContext';
import { Quotation } from '@/types/quotation';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, FileText, Wand2, Sparkles, Filter, Eye, Send, CheckCircle } from 'lucide-react';

export default function CotizacionesPage() {
  const { quotations, deleteQuotation } = useQuotations();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Debug: Mostrar cotizaciones cuando cambien
  React.useEffect(() => {
    console.log('Cotizaciones actuales:', quotations);
    console.log('Cantidad de cotizaciones:', quotations.length);
  }, [quotations]);

  const filteredQuotations = quotations.filter(q => {
    const matchesSearch = q.basicInfo.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.basicInfo.eventType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta cotización?')) {
      deleteQuotation(id);
    }
  };

  const getStatusColor = (status: Quotation['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'sent':
        return 'bg-blue-100 text-blue-700';
      case 'accepted':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: Quotation['status']) => {
    switch (status) {
      case 'draft':
        return 'Borrador';
      case 'sent':
        return 'Enviada';
      case 'accepted':
        return 'Aceptada';
      case 'rejected':
        return 'Rechazada';
      default:
        return status;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="responsive-container py-6 pb-24 md:pb-6">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary mb-2">
                    Cotizaciones
                  </h1>
                  <p className="text-sm sm:text-base text-primary/60">
                    Gestiona tus cotizaciones de decoración
                  </p>
                </div>
                <Link href="/cotizaciones/nueva">
                  <Button className="whitespace-nowrap">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Cotización
                  </Button>
                </Link>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-primary/60">Total Cotizaciones</p>
                      <p className="text-xl sm:text-2xl font-bold text-primary">{quotations.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-gray-500/20 rounded-lg">
                      <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-primary/60">Borradores</p>
                      <p className="text-xl sm:text-2xl font-bold text-primary">
                        {quotations.filter(q => q.status === 'draft').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Send className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-primary/60">Enviadas</p>
                      <p className="text-xl sm:text-2xl font-bold text-primary">
                        {quotations.filter(q => q.status === 'sent').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-primary/60">Aceptadas</p>
                      <p className="text-xl sm:text-2xl font-bold text-primary">
                        {quotations.filter(q => q.status === 'accepted').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and filters */}
              <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-primary/40" />
                    <input
                      type="text"
                      placeholder="Buscar por cliente o tipo de evento..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-3 rounded-lg border-2 border-accent/30 bg-white/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 text-sm sm:text-base"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="text-primary/40" size={20} />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 rounded-lg border-2 border-accent/30 bg-white/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="draft">Borradores</option>
                      <option value="sent">Enviadas</option>
                      <option value="accepted">Aceptadas</option>
                      <option value="rejected">Rechazadas</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Quotations list */}
              <div className="bg-secondary/20 backdrop-blur-sm rounded-xl overflow-hidden">
                {filteredQuotations.length === 0 ? (
                  <div className="text-center py-12">
                    <Wand2 className="mx-auto mb-4 text-primary/40" size={48} />
                    <p className="text-lg text-primary mb-2">No hay cotizaciones aún</p>
                    <p className="text-sm text-primary/60 mb-4">
                      {searchTerm || statusFilter !== 'all'
                        ? 'Intenta ajustar los filtros de búsqueda'
                        : 'Comienza creando tu primera cotización'}
                    </p>
                    {!searchTerm && statusFilter === 'all' && (
                      <Link href="/cotizaciones/nueva">
                        <Button className="inline-flex items-center gap-2">
                          <Sparkles size={18} />
                          Crear Primera Cotización
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-accent/30">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                            Cliente
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                            Evento
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                            Fecha
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-accent/20">
                        {filteredQuotations.map((quotation) => (
                          <tr key={quotation.id} className="hover:bg-accent/10 transition">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-primary">
                                {quotation.basicInfo.clientName}
                              </div>
                              {quotation.isTemplate && (
                                <span className="text-xs text-primary">Plantilla</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-primary">{quotation.basicInfo.eventType}</div>
                              <div className="text-sm text-primary/60">{quotation.basicInfo.guestCount} personas</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-primary/60">
                              {formatDate(quotation.basicInfo.eventDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quotation.status)}`}
                              >
                                {getStatusLabel(quotation.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                              {formatCurrency(quotation.costs.total)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/cotizaciones/${quotation.id}`}
                                  className="text-primary hover:text-primary/80 transition flex items-center gap-1"
                                  title="Ver detalles"
                                  onClick={() => console.log('Click en ver detalles - ID:', quotation.id)}
                                >
                                  <Eye size={18} />
                                  <span className="text-xs">Ver</span>
                                </Link>
                                <Link
                                  href={`/cotizaciones/${quotation.id}/editar`}
                                  className="text-primary hover:text-primary/80 transition flex items-center gap-1"
                                  title="Editar"
                                  onClick={() => console.log('Click en editar - ID:', quotation.id)}
                                >
                                  <Edit size={18} />
                                  <span className="text-xs">Editar</span>
                                </Link>
                                <button
                                  onClick={() => {
                                    console.log('Click en eliminar - ID:', quotation.id);
                                    handleDelete(quotation.id);
                                  }}
                                  className="text-red-500 hover:text-red-700 transition"
                                  title="Eliminar"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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