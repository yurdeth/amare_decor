'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

const messages = [
  'Organiza cada detalle con amor',
  'Cada número cuenta tu crecimiento',
  'Controla tu negocio con propósito',
  'Tu tranquilidad también es parte del proceso',
  'La elegancia está en los detalles',
  'Transforma momentos en recuerdos inolvidables',
  'Crea magia en cada celebración',
  'Tu pasión se refleja en cada evento',
  'El éxito está en la excelencia de los detalles',
  'Convierte sueños en realidad',
];

export default function MotivationalMessage() {
  const [message, setMessage] = useState(messages[0]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Select random message
    const randomIndex = Math.floor(Math.random() * messages.length);
    setMessage(messages[randomIndex]);

    // Trigger animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div
      className={`text-center py-8 px-6 transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-center justify-center gap-3 mb-3">
        <Heart className="w-6 h-6 text-primary fill-primary animate-pulse" />
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>

      <p className="text-2xl md:text-3xl font-display font-medium italic text-primary leading-relaxed">
        {message}
      </p>

      <div className="flex items-center justify-center gap-3 mt-3">
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <Heart className="w-6 h-6 text-primary fill-primary animate-pulse" />
      </div>
    </div>
  );
}
