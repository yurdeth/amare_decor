'use client';

import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    borderColor: 'border-green-600'
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-500',
    textColor: 'text-white',
    borderColor: 'border-red-600'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-500',
    textColor: 'text-white',
    borderColor: 'border-yellow-600'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    borderColor: 'border-blue-600'
  }
};

export default function Toast({ type, message, onClose, duration = 3000 }: ToastProps) {
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 animate-slide-in ${config.bgColor} ${config.textColor} px-4 py-3 rounded-lg shadow-lg border-2 ${config.borderColor} flex items-center gap-3 min-w-[300px] max-w-md`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-80 transition-opacity"
        aria-label="Cerrar notificación"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
