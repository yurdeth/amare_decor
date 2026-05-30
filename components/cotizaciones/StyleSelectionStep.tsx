'use client';

import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ReferenceImage, DecorationStyle } from '@/types/quotation';

interface StyleSelectionStepProps {
  selectedStyles: DecorationStyle[];
  referenceImages: ReferenceImage[];
  clientImages: string[];
  onStylesChange: (styles: DecorationStyle[]) => void;
  onReferenceImagesChange: (images: ReferenceImage[]) => void;
  onClientImagesChange: (images: string[]) => void;
}

export default function StyleSelectionStep({
  selectedStyles,
  referenceImages,
  clientImages,
  onStylesChange,
  onReferenceImagesChange,
  onClientImagesChange
}: StyleSelectionStepProps) {

  const [previewImages, setPreviewImages] = useState<string[]>(clientImages);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Solo permitir una imagen
    if (files.length > 1) {
      alert('Por favor sube solo una imagen de referencia');
      return;
    }

    const file = files[0];

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor sube solo archivos de imagen');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // Reemplazar la imagen anterior si existe
        onClientImagesChange([reader.result]);
        setPreviewImages([reader.result]);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeClientImage = () => {
    onClientImagesChange([]);
    setPreviewImages([]);
  };

  // Asignar automáticamente un estilo genérico
  React.useEffect(() => {
    if (selectedStyles.length === 0) {
      onStylesChange(['personalizado'] as DecorationStyle[]);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-gray-800 mb-2">Imagen de Referencia</h2>
        <p className="text-gray-600">Sube una imagen del diseño que tienes en mente</p>
      </div>

      {/* Zona de subida de imagen */}
      <div className="max-w-2xl mx-auto">
        {previewImages.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[#8E977D] transition">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <ImageIcon className="mb-4 text-[#8E977D]" size={64} />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Sube tu imagen de referencia
                </h3>
                <p className="text-gray-600 mb-4">
                  Arrastra una imagen aquí o haz clic para seleccionar
                </p>
                <div className="text-sm text-gray-500">
                  <p>Formatos aceptados: JPG, PNG, WEBP</p>
                  <p>Tamaño máximo: 10MB</p>
                </div>
              </div>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Vista previa de la imagen */}
            <div className="relative group">
              <img
                src={previewImages[0]}
                alt="Referencia del diseño"
                className="w-full rounded-lg shadow-lg"
              />
              <button
                onClick={removeClientImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition shadow-lg"
                title="Eliminar imagen"
              >
                <X size={20} />
              </button>
            </div>

            {/* Botón para cambiar imagen */}
            <div className="flex justify-center gap-4">
              <input
                type="file"
                id="change-image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label htmlFor="change-image-upload" className="cursor-pointer">
                <div className="bg-[#8E977D] hover:bg-[#6B7A5C] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition">
                  <Upload size={20} />
                  Cambiar imagen
                </div>
              </label>

              <button
                onClick={removeClientImage}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition"
              >
                <X size={20} />
                Eliminar imagen
              </button>
            </div>

            {/* Información de la imagen */}
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-700">
                ✅ Imagen de referencia cargada correctamente
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Esta imagen se usará como referencia para crear tu cotización
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Nota informativa */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
        <div className="flex items-start gap-3">
          <div className="text-yellow-600 text-2xl">💡</div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">Consejo</h4>
            <p className="text-sm text-gray-700">
              Sube una imagen clara del diseño que deseas. Esto nos ayudará a crear una cotización más precisa
              para tu evento. Puedes ser una foto de internet, un diseño que te gustó, o una referencia de otro evento.
            </p>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-8 flex items-center justify-center space-x-2">
        <div className="h-2 w-8 bg-[#8E977D] rounded-full"></div>
        <div className="h-2 w-8 bg-[#8E977D] rounded-full"></div>
        <div className="h-2 w-8 bg-gray-200 rounded-full"></div>
        <div className="h-2 w-8 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
}