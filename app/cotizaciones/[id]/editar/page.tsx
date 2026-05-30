'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import ScrollToTopButton from '@/components/shared/ScrollToTopButton';
import Button from '@/components/ui/Button';
import QuotationBasicInfoStep from '@/components/cotizaciones/BasicInfoStep';
import StyleSelectionStep from '@/components/cotizaciones/StyleSelectionStep';
import ElementsStep from '@/components/cotizaciones/ElementsStep';
import ReviewStep from '@/components/cotizaciones/ReviewStep';
import { QuotationBasicInfo, DecorationStyle, ReferenceImage, QuotationItem, QuotationCosts, QuotationConfig } from '@/types/quotation';
import { useQuotations } from '@/lib/context/QuotationContext';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditarCotizacionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { getQuotation, updateQuotation, config } = useQuotations();
  const [quotation, setQuotation] = React.useState<any>(null);
  const [quotationId, setQuotationId] = React.useState<string>('');
  const [loading, setLoading] = React.useState(true);

  // Resolver los params y cargar la cotización
  React.useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      const id = resolvedParams.id;
      setQuotationId(id);

      console.log('Editando cotización con ID:', id);
      const foundQuotation = getQuotation(id);
      setQuotation(foundQuotation);
      setLoading(false);
    };

    resolveParams();
  }, [params, getQuotation]);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto scroll-smooth">
            <div className="responsive-container py-6 pb-24 md:pb-6">
              <div className="max-w-7xl mx-auto">
                <div className="text-center py-12">
                  <p className="text-primary">Cargando cotización...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
        <ScrollToTopButton />
      </div>
    );
  }

  const [currentStep, setCurrentStep] = useState(1);
  const [basicInfo, setBasicInfo] = useState<QuotationBasicInfo>({
    clientName: '',
    eventType: '',
    eventDate: '',
    guestCount: 0,
    location: '',
    estimatedBudget: 0,
    notes: ''
  });
  const [selectedStyles, setSelectedStyles] = useState<DecorationStyle[]>([]);
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);
  const [clientImages, setClientImages] = useState<string[]>([]);
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [costs, setCosts] = useState<QuotationCosts>({
    materials: 0,
    labor: 0,
    transport: config.transportCost,
    rentals: 0,
    extras: 0,
    subtotal: 0,
    profitMargin: 0,
    profitPercentage: config.profitMargin,
    total: 0
  });
  const [localConfig, setLocalConfig] = useState<QuotationConfig>(config);

  useEffect(() => {
    if (quotation) {
      setBasicInfo(quotation.basicInfo);
      setSelectedStyles(quotation.selectedStyles);
      setReferenceImages(quotation.referenceImages);
      setClientImages(quotation.clientImages || []);
      setItems(quotation.items);
      setCosts(quotation.costs);
      setLocalConfig(quotation.config);
    }
  }, [quotation]);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto scroll-smooth">
            <div className="responsive-container py-6 pb-24 md:pb-6">
              <div className="max-w-7xl mx-auto">
                <div className="text-center py-12">
                  <p className="text-primary">Cargando cotización...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
        <ScrollToTopButton />
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto scroll-smooth">
            <div className="responsive-container py-6 pb-24 md:pb-6">
              <div className="max-w-7xl mx-auto">
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-primary mb-2">Cotización no encontrada</h2>
                  <Link href="/cotizaciones" className="text-primary hover:text-primary/80">
                    Volver a cotizaciones
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
        <ScrollToTopButton />
      </div>
    );
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSave = (status: 'draft' | 'sent') => {
    try {
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

      updateQuotation(quotationId, quotationData);

      // Mostrar mensaje de éxito
      if (typeof window !== 'undefined') {
        const message = status === 'draft'
          ? '✅ Cotización actualizada correctamente'
          : '✅ Cotización finalizada y actualizada correctamente';

        alert(message + '. Serás redirigido a la lista de cotizaciones.');
      }

      // Redirigir a la lista de cotizaciones
      setTimeout(() => {
        router.push('/cotizaciones');
      }, 500);
    } catch (error) {
      console.error('Error al actualizar la cotización:', error);
      alert('Error al actualizar la cotización. Por favor intenta de nuevo.');
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return basicInfo.clientName && basicInfo.eventType && basicInfo.eventDate && basicInfo.location;
      case 2:
        return true; // Permitir continuar aunque no haya imagen
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
              status: quotation.status,
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
                  <div className="flex items-center gap-3 mb-2">
                    <Link href={`/cotizaciones/${quotationId}`} className="text-primary hover:text-primary/80 transition flex items-center gap-2">
                      <ArrowLeft size={20} />
                      Volver a Cotización
                    </Link>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary mb-2">
                    Editar Cotización
                  </h1>
                  <p className="text-sm sm:text-base text-primary/60">
                    Paso {currentStep} de 4 {quotation && `- ${quotation.basicInfo.clientName}`}
                  </p>
                </div>
              </div>

              {/* Step content */}
              <div className="bg-secondary/20 backdrop-blur-sm rounded-xl">
                <div className="p-4 sm:p-6">
                  {renderStep()}
                </div>

                {/* Navigation buttons (no mostrar en el paso 4) */}
                {currentStep < 4 && (
                  <div className="bg-accent/20 border-t border-accent/20 px-4 sm:px-6 py-4 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      disabled={currentStep === 1}
                      className="disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      Volver
                    </Button>

                    <Button
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className="disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {currentStep === 3 ? 'Revisar' : 'Continuar'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
}