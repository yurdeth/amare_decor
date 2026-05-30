'use client';

import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import ClientModal from '@/components/clientes/ClientModal';
import ClientHistory from '@/components/clientes/ClientHistory';
import ScrollToTopButton from '@/components/shared/ScrollToTopButton';
import Button from '@/components/ui/Button';
import { useApp } from '@/lib/context/AppContext';
import { formatPhoneNumber, truncateText } from '@/lib/utils/formatters';
import { Client } from '@/lib/context/AppContext';
import { Users, Mail, Phone, MapPin, Calendar, TrendingUp, Plus, Search, X } from 'lucide-react';

export default function Clientes() {
  const { clients, addClient, updateClient, deleteClient, events, getEventsByClient } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter clients
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const searchLower = searchTerm.toLowerCase();
      return (
        client.name.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.phone.includes(searchTerm) ||
        client.address?.toLowerCase().includes(searchLower) ||
        client.notes?.toLowerCase().includes(searchLower)
      );
    });
  }, [clients, searchTerm]);

  // Get client statistics
  const clientStats = useMemo(() => {
    const totalClients = clients.length;
    const activeClients = clients.filter(client => {
      const clientEvents = getEventsByClient(client.id);
      const lastEvent = clientEvents[clientEvents.length - 1];
      if (!lastEvent) return false;
      const lastEventDate = new Date(lastEvent.date);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return lastEventDate >= sixMonthsAgo;
    }).length;

    const totalEvents = events.reduce((sum, event) => {
      return sum + (events.filter(e => e.clientId === event.clientId).length > 0 ? 1 : 0);
    }, 0);

    return {
      totalClients,
      activeClients,
      totalEvents,
    };
  }, [clients, events, getEventsByClient]);

  const handleAddClient = () => {
    setEditingClient(undefined);
    setIsModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteClient = (client: Client) => {
    const clientEvents = getEventsByClient(client.id);
    if (clientEvents.length > 0) {
      alert(`No se puede eliminar al cliente "${client.name}" porque tiene ${clientEvents.length} eventos asociados.`);
      return;
    }

    if (confirm(`¿Estás seguro de que deseas eliminar a "${client.name}"?`)) {
      deleteClient(client.id);
    }
  };

  const handleSaveClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    if (editingClient) {
      updateClient(editingClient.id, clientData);
    } else {
      addClient(clientData);
    }
    setIsModalOpen(false);
  };

  const handleViewHistory = (clientId: string) => {
    setSelectedClientId(clientId);
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
                    Clientes
                  </h1>
                  <p className="text-sm sm:text-base text-primary/60">
                    Gestiona la información y relaciones con los clientes
                  </p>
                </div>
                <Button onClick={handleAddClient} className="whitespace-nowrap">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Cliente
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-primary/60">Total Clientes</p>
                      <p className="text-xl sm:text-2xl font-bold text-primary">{clientStats.totalClients}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-primary/60">Activos (6 meses)</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">{clientStats.activeClients}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-accent/40 rounded-lg">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-primary/60">Total Eventos</p>
                      <p className="text-xl sm:text-2xl font-bold text-primary">{clientStats.totalEvents}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-primary/40" />
                  <input
                    type="text"
                    placeholder="Buscar clientes por nombre, email, teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-3 rounded-lg border-2 border-accent/30 bg-white/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 text-sm sm:text-base"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-accent/30 rounded-full transition-colors duration-200"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4 text-primary/60" />
                    </button>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-primary/60 mt-2">
                  Mostrando {filteredClients.length} de {clients.length} clientes
                </p>
              </div>

              {/* Content */}
              {selectedClientId ? (
                /* Client History View */
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedClientId(null)}
                      className="self-start sm:self-auto"
                    >
                      ← Volver a Clientes
                    </Button>
                    <h2 className="text-xl sm:text-2xl font-display font-semibold text-primary">
                      {clients.find(c => c.id === selectedClientId)?.name}
                    </h2>
                  </div>
                  <ClientHistory clientId={selectedClientId} />
                </div>
              ) : (
                /* Clients Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {filteredClients.length === 0 ? (
                    <div className="col-span-full text-center py-8 sm:py-12 text-primary/60">
                      <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm sm:text-base">No hay clientes que coincidan con la búsqueda</p>
                    </div>
                  ) : (
                    filteredClients.map((client) => {
                      const clientEvents = getEventsByClient(client.id);
                      return (
                        <div
                          key={client.id}
                          className="bg-secondary/20 backdrop-blur-sm rounded-xl p-4 sm:p-5 hover-elevate fade-in"
                        >
                          {/* Header */}
                          <div className="flex items-start justify-between mb-3 sm:mb-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-primary text-base sm:text-lg mb-1 truncate">
                                {client.name}
                              </h3>
                              {clientEvents.length > 0 && (
                                <span className="text-xs text-primary/60">
                                  {clientEvents.length} {clientEvents.length === 1 ? 'evento' : 'eventos'}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-primary/70">
                              <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">{client.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-primary/70">
                              <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span>{formatPhoneNumber(client.phone)}</span>
                            </div>
                            {client.address && (
                              <div className="flex items-center gap-2 text-xs sm:text-sm text-primary/70">
                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="truncate">{client.address}</span>
                              </div>
                            )}
                          </div>

                          {/* Notes preview */}
                          {client.notes && (
                            <div className="mb-3 sm:mb-4 p-2 bg-accent/20 rounded-lg">
                              <p className="text-xs text-primary/60 line-clamp-2">
                                {truncateText(client.notes, 80)}
                              </p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditClient(client)}
                              className="flex-1"
                            >
                              Editar
                            </Button>
                            {clientEvents.length > 0 ? (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleViewHistory(client.id)}
                                className="flex-1"
                              >
                                Ver Historial
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteClient(client)}
                                className="flex-1 text-red-500 hover:text-red-600"
                              >
                                Eliminar
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Client Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveClient}
        client={editingClient}
      />

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
}
