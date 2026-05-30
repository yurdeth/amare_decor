'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import { formatDateShort, formatCurrency } from '@/lib/utils/formatters';
import { useApp } from '@/lib/context/AppContext';
import Badge from '@/components/ui/Badge';

export default function RecentEvents() {
  const { getUpcomingEvents } = useApp();
  const upcomingEvents = getUpcomingEvents(5);

  const getEventTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      Boda: 'Boda',
      Cumpleaños: 'Cumpleaños',
      Corporativo: 'Corporativo',
      Aniversario: 'Aniversario',
      Otros: 'Otros',
    };
    return types[type] || type;
  };

  const getEventStatusVariant = (status: string): 'available' | 'in-use' | 'maintenance' => {
    switch (status) {
      case 'confirmed':
        return 'available';
      case 'pending':
        return 'maintenance';
      default:
        return 'available';
    }
  };

  return (
    <div className="bg-secondary/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-display font-semibold text-primary">
          Próximos Eventos
        </h3>
        <Link
          href="/eventos"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/70 transition-colors duration-200"
        >
          Ver todos
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-8 text-primary/60">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No hay próximos eventos</p>
          </div>
        ) : (
          upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-4 p-4 rounded-xl bg-white/30 hover:bg-white/50 transition-all duration-200"
            >
              {/* Date Badge */}
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/20 flex flex-col items-center justify-center">
                <span className="text-xs font-medium text-primary/70">
                  {new Date(event.date).toLocaleDateString('es-MX', { month: 'short' })}
                </span>
                <span className="text-lg font-bold text-primary">
                  {new Date(event.date).getDate()}
                </span>
              </div>

              {/* Event Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-primary truncate">{event.clientName}</h4>
                <p className="text-sm text-primary/70">{getEventTypeLabel(event.type)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant={getEventStatusVariant(event.status)} size="sm">
                    {event.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                  </Badge>
                  <span className="text-sm text-primary/60">
                    {formatCurrency(event.budget)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
