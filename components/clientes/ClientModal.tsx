'use client';

import React, { useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import FormInput from '@/components/shared/FormInput';
import Button from '@/components/ui/Button';
import { Client } from '@/lib/context/AppContext';
import { formatPhoneNumber } from '@/lib/utils/formatters';
import { clientSchema, getValidationErrors } from '@/lib/validation/schemas';
import { Mail, Phone, MapPin, FileText } from 'lucide-react';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  client?: Client;
}

export default function ClientModal({ isOpen, onClose, onSave, client }: ClientModalProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  const [errors, setErrors] = React.useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address || '',
        notes: client.notes || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
      });
    }
    setErrors({});
  }, [client, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const validationErrors = getValidationErrors(clientSchema, formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={client ? 'Editar Cliente' : 'Nuevo Cliente'}
      size="medium"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-4">
          <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
            <div className="p-2 bg-primary/20 rounded-full">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-primary/70">Información de Contacto</p>
              <p className="text-sm font-medium text-primary">Datos principales</p>
            </div>
          </div>
        </div>

        <FormInput
          label="Nombre Completo"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ej: María González"
          required
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="cliente@email.com"
            required
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}

          <FormInput
            label="Teléfono"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+52 55 1234 5678"
            required
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div className="space-y-4 mb-4 mt-6">
          <div className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg border-2 border-accent/50">
            <div className="p-2 bg-accent/40 rounded-full">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-primary/70">Ubicación y Notas</p>
              <p className="text-sm font-medium text-primary">Información adicional</p>
            </div>
          </div>
        </div>

        <FormInput
          label="Dirección (Opcional)"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Ej: Av. Reforma 222, Col. Cuauhtémoc, CDMX"
        />

        <FormInput
          label="Notas Adicionales (Opcional)"
          type="textarea"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Preferencias, alergias, detalles importantes..."
          rows={4}
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
            {client ? 'Guardar Cambios' : 'Agregar Cliente'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
