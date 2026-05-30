import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'available' | 'in-use' | 'maintenance' | 'primary' | 'secondary';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300';

  const variantClasses = {
    available: 'bg-available/80 text-white',
    'in-use': 'bg-in-use/80 text-white',
    maintenance: 'bg-maintenance/80 text-white',
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary/80 text-white',
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
}
