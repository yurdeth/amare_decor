'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
};

export default function LoadingSpinner({
  size = 'md',
  text,
  fullScreen = false
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={fullScreen ? 'fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50' : 'flex flex-col items-center justify-center'}>
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-primary border-t-transparent`} />
      {text && (
        <p className="mt-3 text-sm text-primary/70 text-center">{text}</p>
      )}
    </div>
  );

  return spinner;
}
