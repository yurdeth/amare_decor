'use client';

import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import ScrollToTopButton from '@/components/shared/ScrollToTopButton';
import Button from '@/components/ui/Button';
import { useQuotations } from '@/lib/context/QuotationContext';
import { QuotationItem } from '@/types/quotation';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import Link from 'next/link';
import { ArrowLeft, Edit, Download, Image, FileText, Mail, Phone, MapPin, Calendar, Users, DollarSign, ImageIcon } from 'lucide-react';

export default function CotizacionDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { getQuotation, quotations } = useQuotations();
  const [quotationId, setQuotationId] = React.useState<string>('');
  const [quotation, setQuotation] = React.useState<any>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Resolver los params y buscar la cotización
  React.useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      const id = resolvedParams.id;
      setQuotationId(id);

      console.log('ID de cotización solicitada:', id);
      console.log('Cotizaciones disponibles:', quotations);
      console.log('Buscando cotización con ID:', id);

      const foundQuotation = getQuotation(id);
      setQuotation(foundQuotation);
      console.log('Cotización encontrada:', foundQuotation);
    };

    resolveParams();
  }, [params, quotations, getQuotation]);

  // Mostrar loading mientras se resuelven los params
  if (!quotationId || !quotation) {
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
    console.log('No se encontró la cotización. Mostrando página de error.');
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

  const generateClientImage = async () => {
    if (!imageRef.current) return;

    try {
      const canvas = await html2canvas(imageRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `cotizacion-${quotation.basicInfo.clientName.replace(/\s+/g, '-').toLowerCase()}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error al generar la imagen. Por favor intenta de nuevo.');
    }
  };

  const generateInternalPDF = () => {
    if (!quotation) {
      alert('No se puede generar el PDF: cotización no encontrada');
      return;
    }

    try {
      const doc = new jsPDF();
      let yPosition = 20;

      // Header
      doc.setFontSize(24);
      doc.setTextColor(142, 151, 125); // Verde Amaré
      doc.text('Amaré Decor', 20, yPosition);
      yPosition += 15;

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Cotización Interna', 20, yPosition);
      yPosition += 10;

      // Información del cliente
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Información del Cliente:', 20, yPosition);
      yPosition += 7;

      doc.setFont('helvetica', 'normal');
      doc.text(`Nombre: ${quotation.basicInfo.clientName}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Tipo de Evento: ${quotation.basicInfo.eventType}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Fecha: ${new Date(quotation.basicInfo.eventDate).toLocaleDateString('es-MX')}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Cantidad de Personas: ${quotation.basicInfo.guestCount}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Lugar: ${quotation.basicInfo.location}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Presupuesto Estimado: $${quotation.basicInfo.estimatedBudget.toLocaleString('es-MX')}`, 25, yPosition);
      yPosition += 10;

      // Estilo seleccionado
      doc.setFont('helvetica', 'bold');
      doc.text('Estilo de Decoración:', 20, yPosition);
      yPosition += 7;
      doc.setFont('helvetica', 'normal');
      doc.text('Diseño Personalizado (según imagen de referencia)', 25, yPosition);
      yPosition += 10;

      // Imagen de referencia si existe
      if (quotation.clientImages && quotation.clientImages.length > 0) {
        doc.addPage();
        yPosition = 20;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Imagen de Referencia del Diseño:', 20, yPosition);
        yPosition += 10;

        // Agregar la imagen al PDF
        try {
          const imgWidth = 170; // Ancho máximo de la imagen en mm
          const imgHeight = 120; // Altura máxima de la imagen en mm

          doc.addImage(quotation.clientImages[0], 'JPEG', 20, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10;
        } catch (error) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.text('No se pudo cargar la imagen de referencia', 20, yPosition);
          yPosition += 10;
        }
      }

      yPosition += 10;

      // Elementos
      doc.setFont('helvetica', 'bold');
      doc.text('Elementos de Decoración:', 20, yPosition);
      yPosition += 7;

      doc.setFont('helvetica', 'normal');
      quotation.items.forEach((item: any, index: number) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(
          `${index + 1}. ${item.name} x${item.quantity} - $${item.totalCost.toLocaleString('es-MX')}`,
          25,
          yPosition
        );
        yPosition += 6;
      });
      yPosition += 10;

      // Desglose de costos
      doc.setFont('helvetica', 'bold');
      doc.text('Desglose de Costos:', 20, yPosition);
      yPosition += 7;

      doc.setFont('helvetica', 'normal');
      doc.text(`Materiales: $${quotation.costs.materials.toLocaleString('es-MX')}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Mano de obra: $${quotation.costs.labor.toLocaleString('es-MX')}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Transporte: $${quotation.costs.transport.toLocaleString('es-MX')}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Alquileres: $${quotation.costs.rentals.toLocaleString('es-MX')}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Extras: $${quotation.costs.extras.toLocaleString('es-MX')}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Subtotal: $${quotation.costs.subtotal.toLocaleString('es-MX')}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Margen de ganancia: $${quotation.costs.profitMargin.toLocaleString('es-MX')} (${quotation.costs.profitPercentage}%)`, 25, yPosition);
      yPosition += 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(`TOTAL: $${quotation.costs.total.toLocaleString('es-MX')}`, 25, yPosition);
      yPosition += 15;

      // Notas internas
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Notas Internas:', 20, yPosition);
      yPosition += 7;

      doc.setFont('helvetica', 'normal');
      const notes = quotation.basicInfo.notes || 'Sin notas adicionales';
      const splitNotes = doc.splitTextToSize(notes, 170);
      doc.text(splitNotes, 25, yPosition);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Generado: ${new Date().toLocaleString('es-MX')}`,
        20,
        285
      );

      // Guardar PDF
      doc.save(`cotizacion-interna-${quotation.basicInfo.clientName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Por favor intenta de nuevo.');
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Borrador';
      case 'sent': return 'Enviada';
      case 'accepted': return 'Aceptada';
      case 'rejected': return 'Rechazada';
      default: return status;
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
                    <Link href="/cotizaciones" className="text-primary hover:text-primary/80 transition flex items-center gap-2">
                      <ArrowLeft size={20} />
                      Volver a Cotizaciones
                    </Link>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary mb-2">
                    Cotización
                  </h1>
                  <p className="text-sm sm:text-base text-primary/60">
                    {quotation.basicInfo.clientName} - {quotation.basicInfo.eventType}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link href={`/cotizaciones/${quotation.id}/editar`}>
                    <Button>
                      <Edit size={18} className="mr-2" />
                      Editar
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Información del evento */}
                <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-4 sm:p-6">
                  <h2 className="text-xl font-bold text-primary mb-4">Información del Evento</h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Users className="text-primary" size={20} />
                      <div>
                        <p className="text-sm text-primary/60">Cliente</p>
                        <p className="font-medium text-primary">{quotation.basicInfo.clientName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="text-primary" size={20} />
                      <div>
                        <p className="text-sm text-primary/60">Fecha del evento</p>
                        <p className="font-medium text-primary">{formatDate(quotation.basicInfo.eventDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="text-primary" size={20} />
                      <div>
                        <p className="text-sm text-primary/60">Lugar</p>
                        <p className="font-medium text-primary">{quotation.basicInfo.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <DollarSign className="text-primary" size={20} />
                      <div>
                        <p className="text-sm text-primary/60">Presupuesto estimado</p>
                        <p className="font-medium text-primary">{formatCurrency(quotation.basicInfo.estimatedBudget)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Costos */}
                <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-4 sm:p-6">
                  <h2 className="text-xl font-bold text-primary mb-4">Resumen de Costos</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-primary/60">Materiales</span>
                      <span className="font-medium text-primary">{formatCurrency(quotation.costs.materials)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary/60">Mano de obra</span>
                      <span className="font-medium text-primary">{formatCurrency(quotation.costs.labor)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary/60">Transporte</span>
                      <span className="font-medium text-primary">{formatCurrency(quotation.costs.transport)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary/60">Alquileres</span>
                      <span className="font-medium text-primary">{formatCurrency(quotation.costs.rentals)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary/60">Extras</span>
                      <span className="font-medium text-primary">{formatCurrency(quotation.costs.extras)}</span>
                    </div>
                    <div className="border-t border-accent/20 pt-3 flex justify-between">
                      <span className="font-medium text-primary">Subtotal</span>
                      <span className="font-bold text-primary">{formatCurrency(quotation.costs.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary/60">Margen de ganancia</span>
                      <span className="font-medium text-green-600">{formatCurrency(quotation.costs.profitMargin)}</span>
                    </div>
                    <div className="border-t border-accent/20 pt-3 flex justify-between">
                      <span className="text-lg font-bold text-primary">Total</span>
                      <span className="text-2xl font-bold text-primary">{formatCurrency(quotation.costs.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Elementos */}
                <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-4 sm:p-6">
                  <h2 className="text-xl font-bold text-primary mb-4">Elementos de Decoración</h2>
                  {quotation.items.length === 0 ? (
                    <p className="text-primary/60">No hay elementos agregados</p>
                  ) : (
                    <div className="space-y-3">
                      {quotation.items.map((item: QuotationItem, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-accent/20 rounded-lg">
                          <div>
                            <p className="font-medium text-primary">{item.name}</p>
                            <p className="text-sm text-primary/60">{item.category} x{item.quantity}</p>
                          </div>
                          <p className="font-bold text-primary">{formatCurrency(item.totalCost)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Imagen de referencia */}
                <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-4 sm:p-6">
                  <h2 className="text-xl font-bold text-primary mb-4">Imagen de Referencia</h2>
                  {quotation.clientImages && quotation.clientImages.length > 0 ? (
                    <div className="space-y-3">
                      {quotation.clientImages.map((image: string, index: number) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Referencia ${index + 1}`}
                            className="w-full rounded-lg shadow-sm"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-white/50 rounded-lg">
                      <ImageIcon className="mx-auto mb-2 text-primary/40" size={48} />
                      <p className="text-sm text-primary/60">No se subió imagen de referencia</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Vista previa de imagen para cliente */}
              <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <h2 className="text-xl font-bold text-primary">Imagen para Cliente</h2>
                  <Button onClick={generateClientImage} className="whitespace-nowrap">
                    <Image size={18} className="mr-2" />
                    Generar Imagen
                  </Button>
                </div>

                {/* Contenedor para generar imagen */}
                <div className="flex justify-center">
                  <div
                    ref={imageRef}
                    className="bg-gradient-to-br from-[#F0EDE5] via-white to-[#E8E4DC] rounded-lg p-8 border-4 border-primary/30 max-w-2xl w-full"
                  >
                    {/* Header */}
                    <div className="text-center mb-6">
                      <h2 className="text-4xl font-serif font-bold text-primary mb-2">Amaré Decor</h2>
                      <p className="text-gray-600">Decoración con Globos y Eventos</p>
                    </div>

                    {/* Información del evento */}
                    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                      <h3 className="text-2xl font-serif text-primary mb-4 text-center">
                        {quotation.basicInfo.eventType}
                      </h3>
                      <p className="text-lg text-primary text-center mb-4">
                        Para: <span className="font-semibold">{quotation.basicInfo.clientName}</span>
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm text-primary/70">
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span>{new Date(quotation.basicInfo.eventDate).toLocaleDateString('es-MX')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>👥</span>
                          <span>{quotation.basicInfo.guestCount} personas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          <span>{quotation.basicInfo.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>🎨</span>
                          <span>Diseño Personalizado</span>
                        </div>
                      </div>
                    </div>

                    {/* Imagen de referencia */}
                    {quotation.clientImages && quotation.clientImages.length > 0 && (
                      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
                        <h4 className="font-semibold text-primary mb-3 text-center">Imagen de Referencia</h4>
                        <div className="flex justify-center">
                          <img
                            src={quotation.clientImages[0]}
                            alt="Referencia del diseño"
                            className="max-w-full max-h-48 rounded-lg object-contain"
                          />
                        </div>
                      </div>
                    )}

                    {/* Descripción de la decoración */}
                    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                      <h4 className="font-semibold text-primary mb-3">Incluye:</h4>
                      <ul className="space-y-2 text-sm text-primary">
                        {quotation.items.map((item: QuotationItem, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span>🎈</span>
                            <span>
                              {item.name} x{item.quantity}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Precio */}
                    <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white text-center">
                      <p className="text-sm opacity-90 mb-1">Precio Estimado</p>
                      <p className="text-4xl font-bold">{formatCurrency(quotation.costs.total)} USD</p>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center text-sm text-primary/70">
                      <p className="flex items-center justify-center gap-2 mb-1">
                        <Phone size={14} />
                        <span>+52 55 1234 5678</span>
                      </p>
                      <p className="flex items-center justify-center gap-2">
                        <Mail size={14} />
                        <span>amare.2520mp@gmail.com</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón para generar PDF interno */}
              <div className="bg-secondary/20 backdrop-blur-sm rounded-xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-primary mb-1">PDF Interno</h2>
                    <p className="text-sm text-primary/60">Genera un documento detallado para uso interno</p>
                  </div>
                  <Button onClick={generateInternalPDF} variant="outline" className="whitespace-nowrap">
                    <FileText size={18} className="mr-2" />
                    Generar PDF
                  </Button>
                </div>
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