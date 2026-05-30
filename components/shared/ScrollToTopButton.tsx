'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Desktop Button */}
      <button
        onClick={scrollToTop}
        className={`hidden md:flex fixed bottom-8 right-8 z-50 items-center justify-center w-12 h-12 rounded-full bg-[#8E977D] text-white shadow-lg hover:bg-primary transition-all duration-300 ${
          isVisible ? 'slide-up opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Volver arriba"
      >
        <ArrowUp className="w-6 h-6" />
      </button>

      {/* Mobile Button */}
      <button
        onClick={scrollToTop}
        className={`md:hidden fixed bottom-24 right-4 z-50 items-center justify-center w-10 h-10 rounded-full bg-[#8E977D] text-white shadow-lg hover:bg-primary transition-all duration-300 ${
          isVisible ? 'slide-up opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Volver arriba"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </>
  );
}