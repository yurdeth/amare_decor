'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Quotation, QuotationTemplate, QuotationConfig, QuotationCosts, QuotationItem, Material } from '@/types/quotation';

interface QuotationContextType {
  quotations: Quotation[];
  templates: QuotationTemplate[];
  config: QuotationConfig;
  addQuotation: (quotation: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateQuotation: (id: string, quotation: Partial<Quotation>) => void;
  deleteQuotation: (id: string) => void;
  getQuotation: (id: string) => Quotation | undefined;
  saveAsTemplate: (quotationId: string, templateName: string, description: string) => void;
  loadFromTemplate: (templateId: string, clientInfo: any) => Quotation;
  updateConfig: (config: Partial<QuotationConfig>) => void;
  calculateCosts: (items: QuotationItem[], config: QuotationConfig) => QuotationCosts;
  generateQuotationFromTemplate: (template: QuotationTemplate, basicInfo: any) => Quotation;
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

const defaultConfig: QuotationConfig = {
  profitMargin: 30,
  transportCost: 500,
  laborPercentage: 20,
  rentalPercentage: 15,
  extrasPercentage: 10,
};

const defaultTemplates: QuotationTemplate[] = [
  {
    id: 'wedding-basic',
    templateName: 'Boda Básica',
    description: 'Decoración elegante y clásica para bodas',
    previewImage: '/images/templates/wedding-basic.jpg',
    estimatedPrice: 15000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'draft',
    selectedStyles: ['elegante', 'organico'],
    referenceImages: [],
    items: [
      {
        id: 'wedding-arch',
        type: 'arcos-globos',
        name: 'Arco Principal de Globos',
        quantity: 1,
        unitCost: 2500,
        laborCost: 800,
        totalCost: 3300,
        category: 'Arcos'
      },
      {
        id: 'wedding-centerpieces',
        type: 'mesas',
        name: 'Centros de Mesa',
        quantity: 10,
        unitCost: 450,
        laborCost: 150,
        totalCost: 600,
        category: 'Mesas'
      }
    ],
    costs: {
      materials: 7000,
      labor: 2300,
      transport: 500,
      rentals: 1050,
      extras: 700,
      subtotal: 11550,
      profitMargin: 3450,
      profitPercentage: 30,
      total: 15000
    },
    config: defaultConfig,
    isTemplate: true
  },
  {
    id: 'birthday-kids',
    templateName: 'Cumpleaños Infantil',
    description: 'Decoración colorida y divertida para niños',
    previewImage: '/images/templates/kids-birthday.jpg',
    estimatedPrice: 8000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'draft',
    selectedStyles: ['infantil', 'pastel'],
    referenceImages: [],
    items: [
      {
        id: 'kids-arch',
        type: 'arcos-globos',
        name: 'Arco de Globos Infantil',
        quantity: 1,
        unitCost: 1800,
        laborCost: 600,
        totalCost: 2400,
        category: 'Arcos'
      },
      {
        id: 'kids-backdrop',
        type: 'backdrops',
        name: 'Backdrop Personalizado',
        quantity: 1,
        unitCost: 1200,
        laborCost: 400,
        totalCost: 1600,
        category: 'Backdrops'
      }
    ],
    costs: {
      materials: 3000,
      labor: 1000,
      transport: 500,
      rentals: 450,
      extras: 300,
      subtotal: 5250,
      profitMargin: 2750,
      profitPercentage: 30,
      total: 8000
    },
    config: defaultConfig,
    isTemplate: true
  }
];

export function QuotationProvider({ children }: { children: ReactNode }) {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [templates, setTemplates] = useState<QuotationTemplate[]>(defaultTemplates);
  const [config, setConfig] = useState<QuotationConfig>(defaultConfig);

  // Cargar datos desde localStorage al iniciar (solo una vez)
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const savedQuotations = localStorage.getItem('quotations');
        const savedTemplates = localStorage.getItem('quotationTemplates');
        const savedConfig = localStorage.getItem('quotationConfig');

        if (savedQuotations) {
          setQuotations(JSON.parse(savedQuotations));
        }
        if (savedTemplates) {
          setTemplates(JSON.parse(savedTemplates));
        }
        if (savedConfig) {
          setConfig(JSON.parse(savedConfig));
        }
      } catch (error) {
        console.error('Error loading quotation data from localStorage:', error);
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.error('LocalStorage quota exceeded. Unable to load quotation data.');
        }
      }
    };

    loadFromStorage();
  }, []);

  // Guardar todos los datos en localStorage cuando cambien (consolidado con debounce)
  useEffect(() => {
    const saveAllToStorage = () => {
      try {
        localStorage.setItem('quotations', JSON.stringify(quotations));
        localStorage.setItem('quotationTemplates', JSON.stringify(templates));
        localStorage.setItem('quotationConfig', JSON.stringify(config));
      } catch (error) {
        console.error('Error saving quotation data to localStorage:', error);
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.error('LocalStorage quota exceeded. Unable to save quotation data.');
        }
      }
    };

    // Debounce save operations to avoid excessive writes
    const timeoutId = setTimeout(saveAllToStorage, 100);
    return () => clearTimeout(timeoutId);
  }, [quotations, templates, config]);

  const calculateCosts = (items: QuotationItem[], currentConfig: QuotationConfig): QuotationCosts => {
    const materials = items.reduce((sum, item) => sum + (item.unitCost * item.quantity), 0);
    const labor = items.reduce((sum, item) => sum + (item.laborCost * item.quantity), 0);

    const rentals = materials * (currentConfig.rentalPercentage / 100);
    const transport = currentConfig.transportCost;
    const extras = (materials + labor) * (currentConfig.extrasPercentage / 100);

    const subtotal = materials + labor + transport + rentals + extras;
    const profitMargin = subtotal * (currentConfig.profitMargin / 100);
    const total = subtotal + profitMargin;

    return {
      materials,
      labor,
      transport,
      rentals,
      extras,
      subtotal,
      profitMargin,
      profitPercentage: currentConfig.profitMargin,
      total
    };
  };

  const addQuotation = (quotation: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Generar un ID único y más legible
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const newId = `q-${timestamp}-${random}`;

    const newQuotation: Quotation = {
      ...quotation,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setQuotations(prev => [...prev, newQuotation]);

    // Verificar que se guardó correctamente
    console.log('Cotización guardada con ID:', newId);
    console.log('Cotización completa:', newQuotation);

    return newId;
  };

  const updateQuotation = (id: string, updates: Partial<Quotation>) => {
    console.log('Actualizando cotización con ID:', id);
    console.log('Updates:', updates);

    setQuotations(prev => {
      const updated = prev.map(q =>
        q.id === id
          ? { ...q, ...updates, updatedAt: new Date().toISOString() }
          : q
      );
      console.log('Cotizaciones después de actualizar:', updated);
      return updated;
    });
  };

  const deleteQuotation = (id: string) => {
    setQuotations(prev => prev.filter(q => q.id !== id));
  };

  const getQuotation = (id: string) => {
    return quotations.find(q => q.id === id);
  };

  const saveAsTemplate = (quotationId: string, templateName: string, description: string) => {
    const quotation = quotations.find(q => q.id === quotationId);
    if (!quotation) return;

    const newTemplate: QuotationTemplate = {
      ...quotation,
      id: `template-${Date.now()}`,
      templateName,
      description,
      previewImage: quotation.referenceImages[0]?.url || '/images/templates/default.jpg',
      estimatedPrice: quotation.costs.total,
      isTemplate: true
    };

    setTemplates(prev => [...prev, newTemplate]);
  };

  const loadFromTemplate = (templateId: string, basicInfo: any) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) throw new Error('Template not found');

    return generateQuotationFromTemplate(template, basicInfo);
  };

  const generateQuotationFromTemplate = (template: QuotationTemplate, basicInfo: any): Quotation => {
    const newQuotation: Quotation = {
      id: `quotation-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      basicInfo,
      selectedStyles: template.selectedStyles,
      referenceImages: template.referenceImages,
      items: template.items,
      costs: template.costs,
      config: template.config,
      clientImages: []
    };
    return newQuotation;
  };

  const updateConfig = (updates: Partial<QuotationConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <QuotationContext.Provider
      value={{
        quotations,
        templates,
        config,
        addQuotation,
        updateQuotation,
        deleteQuotation,
        getQuotation,
        saveAsTemplate,
        loadFromTemplate,
        updateConfig,
        calculateCosts,
        generateQuotationFromTemplate,
      }}
    >
      {children}
    </QuotationContext.Provider>
  );
}

export function useQuotations() {
  const context = useContext(QuotationContext);
  if (context === undefined) {
    throw new Error('useQuotations must be used within a QuotationProvider');
  }
  return context;
}