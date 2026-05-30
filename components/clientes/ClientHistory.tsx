'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { formatDate, formatCurrency } from '@/lib/utils/formatters';
import { Calendar, DollarSign, Package, FileText, TrendingUp } from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface ClientHistoryProps {
  clientId: string;
}

export default function ClientHistory({ clientId }: ClientHistoryProps) {
  const { events, calculateEventProfit } = useApp();

  // Get events for this client
  const clientEvents = useMemo(() => {
    return events
      .filter(event => event.clientId === clientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [events, clientId]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalEvents = clientEvents.length;
    const completedEvents = clientEvents.filter(e => e.status === 'completed').length;
    const totalSpent = clientEvents.reduce((sum, e) => sum + e.budget, 0);
    const avgBudget = totalEvents > 0 ? totalSpent / totalEvents : 0;

    // Calculate total profit (simplified - would need actual income data)
    const totalProfit = clientEvents.reduce((sum, e) => {
      return sum + calculateEventProfit(e.id);
    }, 0);

    return {
      totalEvents,
      completedEvents,
      totalSpent,
      avgBudget,
      totalProfit,
    };
  }, [clientEvents, calculateEventProfit]);

  const getStatusVariant = (status: string): 'available' | 'in-use' | 'maintenance' => {
    switch (status) {
      case 'confirmed':
        return 'available';
      case 'pending':
        return 'maintenance';
      case 'completed':
        return 'in-use';
      default:
        return 'maintenance';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      completed: 'Completado',
      cancelled: 'Cancelado',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-primary/10 rounded-lg p-4 text-center">
          <Package className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-primary">{stats.totalEvents}</p>
          <p className="text-xs text-primary/70">Eventos Totales</p>
        </div>

        <div className="bg-green-100 rounded-lg p-4 text-center">
          <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-600">{stats.completedEvents}</p>
          <p className="text-xs text-green-700">Completados</p>
        </div>

        <div className="bg-secondary/40 rounded-lg p-4 text-center">
          <DollarSign className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-lg font-bold text-primary">
            {formatCurrency(stats.totalSpent)}
          </p>
          <p className="text-xs text-primary/70">Total Invertido</p>
        </div>

        <div className="bg-accent/40 rounded-lg p-4 text-center">
          <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-lg font-bold text-primary">
            {formatCurrency(stats.avgBudget)}
          </p>
          <p className="text-xs text-primary/70">Promedio</p>
        </div>
      </div>

      {/* Events List */}
      <div>
        <h3 className="text-lg font-display font-semibold text-primary mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Historial de Eventos
        </h3>

        {clientEvents.length === 0 ? (
          <div className="text-center py-8 text-primary/60">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Este cliente no tiene eventos registrados</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clientEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white/40 backdrop-blur-sm rounded-xl p-4 hover:bg-white/60 transition-all duration-200 border-l-4 border-primary"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-primary mb-1">
                      {event.type}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-primary/70">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                  </div>
                  <Badge variant={getStatusVariant(event.status)} size="sm">
                    {getStatusLabel(event.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-primary/60 mb-1">Presupuesto</p>
                    <p className="font-semibold text-primary">
                      {formatCurrency(event.budget)}
                    </p>
                  </div>
                  <div>
                    <p className="text-primary/60 mb-1">Productos Asignados</p>
                    <p className="font-semibold text-primary">
                      {event.items.length} productos
                    </p>
                  </div>
                </div>

                {event.notes && (
                  <div className="mt-3 pt-3 border-t border-accent/20">
                    <p className="text-xs text-primary/60 line-clamp-2">
                      {event.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
