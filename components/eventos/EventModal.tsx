'use client';

import React, { useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import FormInput from '@/components/shared/FormInput';
import Button from '@/components/ui/Button';
import ProductSelector from '@/components/eventos/ProductSelector';
import { Event, EventItem } from '@/lib/context/AppContext';
import { useApp } from '@/lib/context/AppContext';
import { formatCurrency } from '@/lib/utils/formatters';
import { eventSchema, getValidationErrors } from '@/lib/validation/schemas';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  event?: Event;
}

const eventTypes = [
  { value: 'Boda', label: 'Boda' },
  { value: 'Cumpleaños', label: 'Cumpleaños' },
  { value: 'Corporativo', label: 'Corporativo' },
  { value: 'Aniversario', label: 'Aniversario' },
  { value: 'Otros', label: 'Otros' },
];

const eventStatuses = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'completed', label: 'Completado' },
  { value: 'cancelled', label: 'Cancelado' },
];

export default function EventModal({ isOpen, onClose, onSave, event }: EventModalProps) {
  const { clients } = useApp();
  const [formData, setFormData] = React.useState({
    clientId: '',
    clientName: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Otros' as Event['type'],
    budget: 0,
    status: 'pending' as Event['status'],
    notes: '',
  });
  const [selectedItems, setSelectedItems] = React.useState<EventItem[]>([]);

  const [errors, setErrors] = React.useState<{
    clientId?: string;
    date?: string;
    budget?: string;
  }>({});

  useEffect(() => {
    if (event) {
      setFormData({
        clientId: event.clientId,
        clientName: event.clientName,
        date: event.date.split('T')[0],
        type: event.type,
        budget: event.budget,
        status: event.status,
        notes: event.notes || '',
      });
      setSelectedItems(event.items);
    } else {
      setFormData({
        clientId: '',
        clientName: '',
        date: new Date().toISOString().split('T')[0],
        type: 'Otros',
        budget: 0,
        status: 'pending',
        notes: '',
      });
      setSelectedItems([]);
    }
    setErrors({});
  }, [event, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Update client name when client is selected
    if (name === 'clientId') {
      const selectedClient = clients.find(c => c.id === value);
      setFormData(prev => ({
        ...prev,
        clientId: value,
        clientName: selectedClient ? selectedClient.name : '',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'budget' ? Number(value) : value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const eventData = {
      ...formData,
      date: new Date(formData.date).toISOString(),
      items: selectedItems,
    };
    const validationErrors = getValidationErrors(eventSchema, eventData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        date: new Date(formData.date).toISOString(),
        items: selectedItems,
      });
      onClose();
    }
  };

  // Calculate total cost of selected items
  const totalItemsCost = selectedItems.reduce((total, item) => {
    // Note: This would need to fetch product prices, for now using placeholder
    return total;
  }, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? 'Editar Evento' : 'Crear Nuevo Evento'}
      size="large"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Cliente"
            type="select"
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            options={[
              { value: '', label: 'Seleccionar cliente...' },
              ...clients.map(client => ({
                value: client.id,
                label: client.name,
              })),
            ]}
            required
          />
          {errors.clientId && <p className="text-red-500 text-xs mt-1">{errors.clientId}</p>}

          <FormInput
            label="Tipo de Evento"
            type="select"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={eventTypes}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Fecha del Evento"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}

          <FormInput
            label="Presupuesto Estimado (USD)"
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
          {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Estado"
            type="select"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={eventStatuses}
            required
          />

          <div className="flex items-end">
            <div className="w-full bg-primary/10 rounded-lg p-3 border-2 border-primary/20">
              <p className="text-xs text-primary/70 mb-1">Presupuesto del Evento</p>
              <p className="text-lg font-bold text-primary">
                {formatCurrency(formData.budget)}
              </p>
            </div>
          </div>
        </div>

        {/* Product Selector */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-primary mb-3">
            Asignar Productos del Inventario
          </h4>
          <ProductSelector
            selectedItems={selectedItems}
            onItemsChange={setSelectedItems}
          />
        </div>

        {/* Notes */}
        <FormInput
          label="Notas Adicionales (Opcional)"
          type="textarea"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Detalles importantes sobre el evento..."
        />

        <div className="flex gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
          >
            {event ? 'Guardar Cambios' : 'Crear Evento'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
