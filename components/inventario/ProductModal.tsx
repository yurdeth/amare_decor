'use client';

import React, { useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import FormInput from '@/components/shared/FormInput';
import Button from '@/components/ui/Button';
import { Product } from '@/lib/context/AppContext';
import { productSchema, getValidationErrors } from '@/lib/validation/schemas';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  product?: Product;
}

const categories = [
  { value: 'Mesas', label: 'Mesas' },
  { value: 'Sillas', label: 'Sillas' },
  { value: 'Decoración', label: 'Decoración' },
  { value: 'Iluminación', label: 'Iluminación' },
  { value: 'Textiles', label: 'Textiles' },
  { value: 'Otros', label: 'Otros' },
];

const statuses = [
  { value: 'available', label: 'Disponible' },
  { value: 'in-use', label: 'En uso' },
  { value: 'maintenance', label: 'Mantenimiento' },
];

export default function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    category: 'Otros' as Product['category'],
    quantity: 0,
    status: 'available' as Product['status'],
    estimatedValue: 0,
    description: '',
  });

  const [errors, setErrors] = React.useState<{
    name?: string;
    quantity?: string;
    estimatedValue?: string;
  }>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        quantity: product.quantity,
        status: product.status,
        estimatedValue: product.estimatedValue,
        description: product.description || '',
      });
    } else {
      setFormData({
        name: '',
        category: 'Otros',
        quantity: 0,
        status: 'available',
        estimatedValue: 0,
        description: '',
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'estimatedValue' ? Number(value) : value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const validationErrors = getValidationErrors(productSchema, formData);
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
    <Modal isOpen={isOpen} onClose={onClose} title={product ? 'Editar Producto' : 'Agregar Producto'}>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Nombre del Producto"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ej: Mesa de centro dorada"
          required
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Categoría"
            type="select"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categories}
            required
          />

          <FormInput
            label="Estado"
            type="select"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statuses}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Cantidad"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="0"
            min="0"
            required
          />
          {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}

          <FormInput
            label="Costo (USD)"
            type="number"
            name="estimatedValue"
            value={formData.estimatedValue}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
          {errors.estimatedValue && <p className="text-red-500 text-xs mt-1">{errors.estimatedValue}</p>}
        </div>

        <FormInput
          label="Descripción (Opcional)"
          type="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detalles adicionales sobre el producto..."
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
            {product ? 'Guardar Cambios' : 'Agregar Producto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
