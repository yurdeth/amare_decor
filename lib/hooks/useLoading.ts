'use client';

import React, { useState, useCallback } from 'react';
import { ToastType } from '@/components/ui/Toast';

interface LoadingState {
  isLoading: boolean;
  message?: string;
}

interface ToastMessage {
  type: ToastType;
  message: string;
  id: number;
}

export function useLoading() {
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const withLoading = useCallback(
    async <T,>(operation: () => Promise<T>, loadingMessage?: string): Promise<T> => {
      setLoading({ isLoading: true, message: loadingMessage });
      try {
        const result = await operation();
        return result;
      } catch (error) {
        throw error;
      } finally {
        setLoading({ isLoading: false });
      }
    },
    []
  );

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { type, message, id }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message: string) => showToast('success', message), [showToast]);
  const showError = useCallback((message: string) => showToast('error', message), [showToast]);
  const showWarning = useCallback((message: string) => showToast('warning', message), [showToast]);
  const showInfo = useCallback((message: string) => showToast('info', message), [showToast]);

  return {
    loading,
    withLoading,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    toasts,
    removeToast
  };
}