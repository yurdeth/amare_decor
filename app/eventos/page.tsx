'use client';

import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import EventModal from '@/components/eventos/EventModal';
import { DataTable } from '@/components/shared/DataTable';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useApp } from '@/lib/context/AppContext';
import { formatCurrency, formatDateShort, getStatusLabel } from '@/lib/utils/formatters';
import { Event } from '@/lib/context/AppContext';
import { Calendar, MapPin, Users, Filter, Plus, Search } from 'lucide-react';

export default function Eventos() {
  const { events, addEvent, updateEvent, deleteEvent, clients } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  // Filter and sort events in single operation (optimized)
  const filteredAndSortedEvents = useMemo(() => {
    return events
      .filter(event => {
        const matchesSearch =
          event.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.notes?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || event.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || event.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB; // Ascending order (upcoming first)
      });
  }, [events, searchTerm, typeFilter, statusFilter]);

  // Get unique event types
  const eventTypes = useMemo(() => {
    const types = ['all', ...new Set(events.map(e => e.type))];
    return types;
  }, [events]);

  const handleAddEvent = () => {
    setEditingEvent(undefined);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (event: Event) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el evento "${event.clientName}" - ${event.type}?`)) {
      deleteEvent(event.id);
    }
  };

  const handleSaveEvent = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }
    setIsModalOpen(false);
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'completed':
        return 'text-blue-600';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-600';
    }
  };

  const columns = [
    {
      key: 'clientName',
      title: 'Cliente',
      sortable: true,
      render: (value: string) => (
        <div className="font-medium">{value}</div>
      ),
    },
    {
      key: 'type',
      title: 'Tipo',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-primary/70">{value}</span>
      ),
    },
    {
      key: 'date',
      title: 'Fecha',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm">{formatDateShort(value)}</span>
      ),
    },
    {
      key: 'budget',
      title: 'Presupuesto',
      sortable: true,
      render: (value: number) => (
        <span className="font-medium">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'status',
      title: 'Estado',
      sortable: true,
      render: (value: string) => (
        <Badge variant={getStatusVariant(value)} size="sm">
          {getStatusLabel(value)}
        </Badge>
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
                  Eventos
                </h1>
                <p className="text-primary/60">
                  Gestiona los eventos y celebraciones de Amaré Decor
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'outline'}
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline'}
                  onClick={() => setViewMode('list')}
                >
                  Lista
                </Button>
                <Button onClick={handleAddEvent} className="whitespace-nowrap">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Evento
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-primary/60">Total Eventos</p>
                    <p className="text-2xl font-bold text-primary">{events.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm text-primary/60 mb-1">Confirmados</p>
                <p className="text-2xl font-bold text-green-600">
                  {events.filter(e => e.status === 'confirmed').length}
                </p>
              </div>

              <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm text-primary/60 mb-1">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {events.filter(e => e.status === 'pending').length}
                </p>
              </div>

              <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm text-primary/60 mb-1">Valor Total</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(events.reduce((sum, e) => sum + e.budget, 0))}
                </p>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary/60" />
                <span className="text-sm font-medium text-primary">Filtros:</span>
              </div>

              <div className="flex flex-wrap gap-4">
                {/* Search */}
                <div className="relative flex-1 min-w-[250px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                  <input
                    type="text"
                    placeholder="Buscar eventos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-accent/30 bg-white/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg border-2 border-accent/30 bg-white/50 focus:border-primary outline-none text-sm"
                  >
                    <option value="all">Todos los tipos</option>
                    {eventTypes.filter(t => t !== 'all').map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg border-2 border-accent/30 bg-white/50 focus:border-primary outline-none text-sm"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="pending">Pendientes</option>
                    <option value="confirmed">Confirmados</option>
                    <option value="completed">Completados</option>
                    <option value="cancelled">Cancelados</option>
                  </select>
                </div>

                {/* Clear filters */}
                {(searchTerm || typeFilter !== 'all' || statusFilter !== 'all') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setTypeFilter('all');
                      setStatusFilter('all');
                    }}
                  >
                    Limpiar
                  </Button>
                )}
              </div>

              {/* Results count */}
              <p className="text-sm text-primary/60">
                Mostrando {filteredAndSortedEvents.length} de {events.length} eventos
              </p>
            </div>

            {/* Content */}
            {viewMode === 'list' ? (
              /* List View */
              <div className="bg-secondary/20 backdrop-blur-sm rounded-xl overflow-hidden">
                <DataTable
                  data={filteredAndSortedEvents}
                  columns={columns}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                  emptyMessage="No hay eventos que coincidan con los filtros"
                />
              </div>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedEvents.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-primary/60">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No hay eventos que coincidan con los filtros</p>
                  </div>
                ) : (
                  filteredAndSortedEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-secondary/20 backdrop-blur-sm rounded-xl p-5 hover-elevate cursor-pointer fade-in"
                      onClick={() => handleEditEvent(event)}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-primary text-lg mb-1">
                            {event.clientName}
                          </h3>
                          <p className="text-sm text-primary/70">{event.type}</p>
                        </div>
                        <Badge variant={getStatusVariant(event.status)} size="sm">
                          {getStatusLabel(event.status)}
                        </Badge>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm text-primary/70 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateShort(event.date)}</span>
                      </div>

                      {/* Budget and Items */}
                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-primary/60">Presupuesto:</span>
                        <span className="font-semibold text-primary">
                          {formatCurrency(event.budget)}
                        </span>
                      </div>

                      {event.items.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-primary/60">
                          <Users className="w-4 h-4" />
                          <span>{event.items.length} productos asignados</span>
                        </div>
                      )}

                      {event.notes && (
                        <div className="mt-3 pt-3 border-t border-accent/20">
                          <p className="text-xs text-primary/60 line-clamp-2">
                            {event.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        event={editingEvent}
      />
    </div>
  );
}
