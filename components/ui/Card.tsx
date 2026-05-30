import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ title, children, className = '', hover = false, onClick }: CardProps) {
  const baseClasses = 'bg-secondary/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#8E977D]/20 transition-all duration-300';
  const hoverClasses = hover ? 'hover-elevate hover:border-[#8E977D]/40 cursor-pointer' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {title && (
        <h3 className="text-xl font-display font-semibold text-primary mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
