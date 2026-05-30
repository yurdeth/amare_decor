'use client';

import React, { useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import FormInput from '@/components/shared/FormInput';
import Button from '@/components/ui/Button';
import { Expense } from '@/lib/context/AppContext';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Omit<Expense, 'id'>) => void;
  expense?: Expense;
}

const categories = [
  { value: 'Materiales', label: 'Materiales' },
  { value: 'Mano de obra', label: 'Mano de obra' },
  { value: 'Transporte', label: 'Transporte' },
  { value: 'Alquiler', label: 'Alquiler' },
  { value: 'Otros', label: 'Otros' },
];

export default function ExpenseModal({ isOpen, onClose, onSave, expense }: ExpenseModalProps) {
  const [formData, setFormData] = React.useState({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: 'Otros' as Expense['category'],
    description: '',
  });

  const [errors, setErrors] = React.useState<{
    amount?: string;
    date?: string;
    description?: string;
  }>({});

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount,
        date: expense.date.split('T')[0],
        category: expense.category,
        description: expense.description,
      });
    } else {
      setFormData({
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        category: 'Otros',
        description: '',
      });
    }
    setErrors({});
  }, [expense, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value,
    }));

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
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
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
    <Modal isOpen={isOpen} onClose={onClose} title={expense ? 'Editar Gasto' : 'Registrar Gasto'}>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Descripción del Gasto"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Ej: Compra de flores y telas"
          required
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}

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
            {expense ? 'Guardar Cambios' : 'Registrar Gasto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
