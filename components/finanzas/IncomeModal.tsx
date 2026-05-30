'use client';

import React, { useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import FormInput from '@/components/shared/FormInput';
import Button from '@/components/ui/Button';
import { Income } from '@/lib/context/AppContext';
import { useApp } from '@/lib/context/AppContext';

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (income: Omit<Income, 'id'>) => void;
  income?: Income;
}

const categories = [
  { value: 'Bodas', label: 'Bodas' },
  { value: 'Cumpleaños', label: 'Cumpleaños' },
  { value: 'Corporativos', label: 'Corporativos' },
  { value: 'Aniversarios', label: 'Aniversarios' },
  { value: 'Adelanto', label: 'Adelanto' },
  { value: 'Otros', label: 'Otros' },
];

export default function IncomeModal({ isOpen, onClose, onSave, income }: IncomeModalProps) {
  const { events } = useApp();
  const [formData, setFormData] = React.useState({
    eventId: '',
    eventName: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: 'Otros',
  });

  const [errors, setErrors] = React.useState<{
    amount?: string;
    date?: string;
  }>({});

  useEffect(() => {
    if (income) {
      setFormData({
        eventId: income.eventId,
        eventName: income.eventName,
        amount: income.amount,
        date: income.date.split('T')[0],
        category: income.category,
      });
    } else {
      setFormData({
        eventId: '',
        eventName: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        category: 'Otros',
      });
    }
    setErrors({});
  }, [income, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Update event name when event is selected
    if (name === 'eventId') {
      const selectedEvent = events.find(ev => ev.id === value);
      setFormData(prev => ({
        ...prev,
        eventId: value,
        eventName: selectedEvent ? `${selectedEvent.type} - ${selectedEvent.clientName}` : '',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'amount' ? Number(value) : value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (formData.amount <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }
    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        date: new Date(formData.date).toISOString(),
      });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={income ? 'Editar Ingreso' : 'Registrar Ingreso'}>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Evento (Opcional)"
          type="select"
          name="eventId"
          value={formData.eventId}
          onChange={handleChange}
          options={[
            { value: '', label: 'Sin evento asociado' },
            ...events.map(ev => ({
              value: ev.id,
              label: `${ev.type} - ${ev.clientName} (${new Date(ev.date).toLocaleDateString('es-MX')})`,
            })),
          ]}
        />

        <FormInput
          label="Descripción / Nombre del Ingreso"
          type="text"
          name="eventName"
          value={formData.eventName}
          onChange={handleChange}
          placeholder="Ej: Pago de boda - María González"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Monto (USD)"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
          {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}

          <FormInput
            label="Fecha"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
        </div>

        <FormInput
          label="Categoría"
          type="select"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categories}
          required
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
            {income ? 'Guardar Cambios' : 'Registrar Ingreso'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
