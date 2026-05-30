'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'medium' | 'large';
}

export default function Modal({ isOpen, onClose, title, children, size = 'medium' }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={`relative bg-background rounded-2xl sm:rounded-3xl shadow-2xl w-full max-h-[90vh] overflow-y-auto fade-in ${
        size === 'large' ? 'max-w-4xl' : 'max-w-2xl'
      }`}>
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-accent/30 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-2xl sm:rounded-t-3xl">
          <h2 className="text-xl sm:text-2xl font-display font-semibold text-primary truncate pr-2">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent/20 rounded-full transition-colors duration-200 flex-shrink-0"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
