'use client';

import React from 'react';
import { Calendar, MapPin, Users, DollarSign, FileText } from 'lucide-react';
import { QuotationBasicInfo } from '@/types/quotation';

interface BasicInfoStepProps {
  basicInfo: QuotationBasicInfo;
  onChange: (info: QuotationBasicInfo) => void;
}

const eventTypes = [
  'Boda',
  'Cumpleaños',
  'Baby Shower',
  'Bautizo',
  'Communión',
  'Graduación',
  'Corporativo',
  'Aniversario',
  'Navidad',
  'Otro'
];

export default function BasicInfoStep({ basicInfo, onChange }: BasicInfoStepProps) {
  const handleChange = (field: keyof QuotationBasicInfo, value: any) => {
    onChange({ ...basicInfo, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-gray-800 mb-2">Información del Evento</h2>
        <p className="text-gray-600">Comencemos con los datos básicos de tu celebración</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre del cliente */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Cliente
          </label>
          <input
            type="text"
            value={basicInfo.clientName}
            onChange={(e) => handleChange('clientName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E977D] focus:border-transparent transition"
            placeholder="Ej: María González López"
          />
        </div>

        {/* Tipo de evento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Evento
          </label>
          <select
            value={basicInfo.eventType}
            onChange={(e) => handleChange('eventType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E977D] focus:border-transparent transition"
          >
            <option value="">Selecciona el tipo de evento</option>
            {eventTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Fecha del evento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha del Evento
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="date"
              value={basicInfo.eventDate}
              onChange={(e) => handleChange('eventDate', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E977D] focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Cantidad de personas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cantidad de Personas
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="number"
              value={basicInfo.guestCount}
              onChange={(e) => handleChange('guestCount', parseInt(e.target.value) || 0)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E977D] focus:border-transparent transition"
              placeholder="Ej: 100"
            />
          </div>
        </div>

        {/* Presupuesto aproximado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Presupuesto Aproximado
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="number"
              value={basicInfo.estimatedBudget}
              onChange={(e) => handleChange('estimatedBudget', parseInt(e.target.value) || 0)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E977D] focus:border-transparent transition"
              placeholder="Ej: 15000"
            />
          </div>
        </div>

        {/* Lugar del evento */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lugar del Evento
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={basicInfo.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E977D] focus:border-transparent transition"
              placeholder="Ej: Salon Hores, Centro de Convenciones"
            />
          </div>
        </div>

        {/* Notas adicionales */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas Adicionales
          </label>
          <textarea
            value={basicInfo.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E977D] focus:border-transparent transition"
            placeholder="Detalles adicionales del evento, preferencias especiales, etc."
          />
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-8 flex items-center justify-center space-x-2">
        <div className="h-2 w-8 bg-[#8E977D] rounded-full"></div>
        <div className="h-2 w-8 bg-gray-200 rounded-full"></div>
        <div className="h-2 w-8 bg-gray-200 rounded-full"></div>
        <div className="h-2 w-8 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
}