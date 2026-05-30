'use client';

import React, { useState } from 'react';
import { Wand2, Sparkles, Star } from 'lucide-react';
import { QuotationTemplate } from '@/types/quotation';
import { useQuotations } from '@/lib/context/QuotationContext';

interface TemplateSelectionProps {
  onSelectTemplate: (template: QuotationTemplate) => void;
  onCreateNew: () => void;
  onClose: () => void;
}

export default function TemplateSelection({ onSelectTemplate, onCreateNew, onClose }: TemplateSelectionProps) {
  const { templates } = useQuotations();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'bodas', 'cumpleanos', 'corporativo', 'infantil'];

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.templateName.toLowerCase().includes(selectedCategory));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pl-20 md:pl-64">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <Wand2 className="text-[#8E977D]" size={28} />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Comienza con una Plantilla</h2>
              <p className="text-sm text-gray-600">Acelera tu cotización con plantillas predefinidas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {/* Category filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                  selectedCategory === category
                    ? 'bg-[#8E977D] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'Todas' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Templates grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition group cursor-pointer"
                onClick={() => onSelectTemplate(template)}
              >
                {/* Template preview */}
                <div className="aspect-video bg-gradient-to-br from-[#F0EDE5] to-[#E8E4DC] relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl">🎈</span>
                  </div>
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Star size={12} />
                    Plantilla
                  </div>
                </div>

                {/* Template info */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{template.templateName}</h3>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Precio estimado</p>
                      <p className="text-lg font-bold text-[#8E977D]">
                        ${template.estimatedPrice.toLocaleString('es-MX')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Elementos</p>
                      <p className="text-sm font-medium text-gray-700">{template.items.length}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {template.selectedStyles.slice(0, 3).map(style => (
                      <span
                        key={style}
                        className="bg-pink-100 text-[#6B7A5C] text-xs px-2 py-1 rounded-full"
                      >
                        {style}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#8E977D] bg-opacity-90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-center text-white">
                    <Sparkles className="mx-auto mb-2" size={32} />
                    <p className="font-semibold">Usar Plantilla</p>
                    <p className="text-sm opacity-90">Personalizar después</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Create new option */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">¿No encuentras lo que buscas?</h3>
                <p className="text-gray-600">Crea una cotización desde cero totalmente personalizada</p>
              </div>
              <button
                onClick={onCreateNew}
                className="bg-gradient-to-r from-[#8E977D] to-[#6B7A5C] hover:from-[#6B7A5C] hover:to-[#5A6A4F] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition"
              >
                <Wand2 size={20} />
                Crear Nueva Cotización
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}