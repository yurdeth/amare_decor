'use client';

import React, { useState } from 'react';
import { X, Save, FileText } from 'lucide-react';
import QuotationBasicInfoStep from './BasicInfoStep';
import StyleSelectionStep from './StyleSelectionStep';
import ElementsStep from './ElementsStep';
import ReviewStep from './ReviewStep';
import { QuotationBasicInfo, DecorationStyle, ReferenceImage, QuotationItem, QuotationCosts, QuotationConfig } from '@/types/quotation';
import { useQuotations } from '@/lib/context/QuotationContext';

interface QuotationWizardProps {
  onClose: () => void;
  editingQuotation?: any;
}

export default function QuotationWizard({ onClose, editingQuotation }: QuotationWizardProps) {
  const { addQuotation, updateQuotation, config, calculateCosts } = useQuotations();

  const [currentStep, setCurrentStep] = useState(1);
  const [basicInfo, setBasicInfo] = useState<QuotationBasicInfo>(
    editingQuotation?.basicInfo || {
      clientName: '',
      eventType: '',
      eventDate: '',
      guestCount: 0,
      location: '',
      estimatedBudget: 0,
      notes: ''
    }
  );

  const [selectedStyles, setSelectedStyles] = useState<DecorationStyle[]>(
    editingQuotation?.selectedStyles || []
  );

  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>(
    editingQuotation?.referenceImages || []
  );

  const [clientImages, setClientImages] = useState<string[]>(
    editingQuotation?.clientImages || []
  );

  const [items, setItems] = useState<QuotationItem[]>(
    editingQuotation?.items || []
  );

  const [costs, setCosts] = useState<QuotationCosts>(
    editingQuotation?.costs || {
      materials: 0,
      labor: 0,
      transport: config.transportCost,
      rentals: 0,
      extras: 0,
      subtotal: 0,
      profitMargin: 0,
      profitPercentage: config.profitMargin,
      total: 0
    }
  );

  const [localConfig, setLocalConfig] = useState<QuotationConfig>(config);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = (status: 'draft' | 'sent') => {
    const quotationData = {
      status,
      basicInfo,
      selectedStyles,
      referenceImages,
      items,
      costs,
      config: localConfig,
      clientImages
    };

    if (editingQuotation) {
      updateQuotation(editingQuotation.id, quotationData);
    } else {
      addQuotation(quotationData);
    }

    onClose();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return basicInfo.clientName && basicInfo.eventType && basicInfo.eventDate && basicInfo.location;
      case 2:
        return true; // Ya no requiere validación de estilos
      case 3:
        return items.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <QuotationBasicInfoStep
            basicInfo={basicInfo}
            onChange={setBasicInfo}
          />
        );
      case 2:
        return (
          <StyleSelectionStep
            selectedStyles={selectedStyles}
            referenceImages={referenceImages}
            clientImages={clientImages}
            onStylesChange={setSelectedStyles}
            onReferenceImagesChange={setReferenceImages}
            onClientImagesChange={setClientImages}
          />
        );
      case 3:
        return (
          <ElementsStep
            items={items}
            costs={costs}
            config={localConfig}
            onItemsChange={setItems}
            onCostsChange={setCosts}
            onConfigChange={setLocalConfig}
          />
        );
      case 4:
        return (
          <ReviewStep
            quotation={{
              status: 'draft',
              basicInfo,
              selectedStyles,
              referenceImages,
              items,
              costs,
              config: localConfig,
              clientImages
            }}
            config={localConfig}
            onSave={handleSave}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto pl-20 md:pl-64">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Nueva Cotización</h2>
            <p className="text-sm text-gray-600">Paso {currentStep} de 4</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Step content */}
        <div className="px-6 py-8">
          {renderStep()}
        </div>

        {/* Navigation buttons (no mostrar en el paso 4) */}
        {currentStep < 4 && (
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700 px-6 py-2 rounded-lg transition"
            >
              Volver
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-[#8E977D] hover:bg-[#6B7A5C] disabled:bg-[#A8B79C] disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition"
            >
              {currentStep === 3 ? 'Revisar' : 'Continuar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}