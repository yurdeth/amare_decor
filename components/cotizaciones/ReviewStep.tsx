'use client';

import React, { useRef } from 'react';
import { Download, Image, FileText, Mail, Phone, MapPin } from 'lucide-react';
import { Quotation, QuotationConfig } from '@/types/quotation';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface ReviewStepProps {
  quotation: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'>;
  config: QuotationConfig;
  onSave: (status: 'draft' | 'sent') => void;
  onBack: () => void;
}

export default function ReviewStep({ quotation, config, onSave, onBack }: ReviewStepProps) {
  const imageRef = useRef<HTMLDivElement>(null);

  const generateClientImage = async () => {
    if (!imageRef.current) return;

    try {
      // Mostrar mensaje de carga
      const loadingMsg = document.createElement('div');
      loadingMsg.textContent = 'Generando imagen...';
      loadingMsg.className = 'fixed top-4 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg z-50';
      document.body.appendChild(loadingMsg);

      const canvas = await html2canvas(imageRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false
      });

      // Convertir a blob y descargar
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `cotizacion-${quotation.basicInfo.clientName.replace(/\s+/g, '-').toLowerCase()}.png`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          // Remover mensaje de carga
          document.body.removeChild(loadingMsg);
        } else {
          document.body.removeChild(loadingMsg);
          alert('Error al generar la imagen. Intente de nuevo.');
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error al generar la imagen: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  const generateInternalPDF = () => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;

      // Header
      doc.setFontSize(24);
      doc.setTextColor(142, 151, 125); // Verde Amaré Decor
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
      quotation.items.forEach((item, index) => {
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
      yPosition += splitNotes.length * 6 + 10;

      // Configuración utilizada
      doc.setFont('helvetica', 'bold');
      doc.text('Configuración de Costos:', 20, yPosition);
      yPosition += 7;

      doc.setFont('helvetica', 'normal');
      doc.text(`Margen de ganancia: ${config.profitMargin}%`, 25, yPosition);
      yPosition += 6;
      doc.text(`Costo de transporte: $${config.transportCost}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Porcentaje de alquileres: ${config.rentalPercentage}%`, 25, yPosition);
      yPosition += 6;
      doc.text(`Porcentaje de extras: ${config.extrasPercentage}%`, 25, yPosition);

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

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-gray-800 mb-2">Revisión Final</h2>
        <p className="text-gray-600">Revisa y genera los documentos de tu cotización</p>
      </div>

      {/* Vista previa de la imagen para cliente */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Vista Previa - Imagen para Cliente</h3>

        {/* Contenedor que será convertido a imagen */}
        <div
          ref={imageRef}
          className="bg-gradient-to-br from-[#F0EDE5] via-white to-[#E8E4DC] rounded-lg p-8 border-4 border-[#8E977D]/30 max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-4xl font-serif font-bold text-[#8E977D] mb-2">Amaré Decor</h2>
            <p className="text-gray-600">Decoración con Globos y Eventos</p>
          </div>

          {/* Información del evento */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <h3 className="text-2xl font-serif text-gray-800 mb-4 text-center">
              {quotation.basicInfo.eventType}
            </h3>
            <p className="text-lg text-gray-700 text-center mb-4">
              Para: <span className="font-semibold">{quotation.basicInfo.clientName}</span>
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
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
              <h4 className="font-semibold text-gray-800 mb-3 text-center">Imagen de Referencia</h4>
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
            <h4 className="font-semibold text-gray-800 mb-3">Incluye:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              {quotation.items.map((item: any, index: number) => (
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
          <div className="bg-gradient-to-r from-[#8E977D] to-[#6B7A5C] rounded-lg p-6 text-white text-center">
            <p className="text-sm opacity-90 mb-1">Precio Estimado</p>
            <p className="text-4xl font-bold">${quotation.costs.total.toLocaleString('es-MX')} USD</p>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
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

        {/* Botón para generar imagen */}
        <div className="mt-6 text-center">
          <button
            onClick={generateClientImage}
            className="bg-gradient-to-r from-[#8E977D] to-[#6B7A5C] hover:from-[#6B7A5C] hover:to-[#5A6A4F] text-white px-8 py-3 rounded-lg flex items-center gap-2 mx-auto transition"
          >
            <Image size={20} />
            Generar Imagen para Cliente
          </button>
        </div>
      </div>

      {/* Botón para generar PDF interno */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Documento Interno</h3>
        <p className="text-gray-600 mb-6">
          Genera un PDF detallado con todos los costos, desgloses y notas para uso interno del equipo.
        </p>
        <div className="text-center">
          <button
            onClick={generateInternalPDF}
            className="bg-gray-700 hover:bg-gray-800 text-white px-8 py-3 rounded-lg flex items-center gap-2 mx-auto transition"
          >
            <FileText size={20} />
            Generar PDF Interno
          </button>
        </div>
      </div>

      {/* Resumen de la cotización */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Resumen de la Cotización</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Cliente:</span>
            <span className="font-medium">{quotation.basicInfo.clientName}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Evento:</span>
            <span className="font-medium">{quotation.basicInfo.eventType}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Fecha:</span>
            <span className="font-medium">{new Date(quotation.basicInfo.eventDate).toLocaleDateString('es-MX')}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Elementos:</span>
            <span className="font-medium">{quotation.items.length} items</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">${quotation.costs.subtotal.toLocaleString('es-MX')}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Ganancia:</span>
            <span className="font-medium text-green-600">${quotation.costs.profitMargin.toLocaleString('es-MX')}</span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-lg font-bold text-gray-800">Total:</span>
            <span className="text-2xl font-bold text-[#8E977D]">${quotation.costs.total.toLocaleString('es-MX')}</span>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between gap-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg transition"
        >
          Volver
        </button>
        <button
          onClick={() => onSave('draft')}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition"
        >
          Guardar Borrador
        </button>
        <button
          onClick={() => onSave('sent')}
          className="flex-1 bg-[#8E977D] hover:bg-[#6B7A5C] text-white px-6 py-3 rounded-lg transition"
        >
          Finalizar Cotización
        </button>
      </div>

      {/* Progress indicator */}
      <div className="mt-8 flex items-center justify-center space-x-2">
        <div className="h-2 w-8 bg-[#8E977D] rounded-full"></div>
        <div className="h-2 w-8 bg-[#8E977D] rounded-full"></div>
        <div className="h-2 w-8 bg-[#8E977D] rounded-full"></div>
        <div className="h-2 w-8 bg-[#8E977D] rounded-full"></div>
      </div>
    </div>
  );
}