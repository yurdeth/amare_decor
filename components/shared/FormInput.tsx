'use client';

import React from 'react';

interface FormInputProps {
  label: string;
  type?: 'text' | 'number' | 'email' | 'tel' | 'date' | 'textarea' | 'select';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  className?: string;
  name?: string;
  rows?: number;
  min?: string | number;
  max?: string | number;
  step?: string | number;
}

export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  options = [],
  className = '',
  name = '',
  rows = 4,
  min,
  max,
  step,
}: FormInputProps) {
  const baseInputClasses = 'w-full px-3 sm:px-4 py-3 rounded-xl border-2 border-accent/30 bg-white/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 placeholder:text-gray-400 text-base sm:text-sm';

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-primary mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`${baseInputClasses} resize-none`}
        />
      ) : type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`${baseInputClasses} cursor-pointer`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={step}
          className={baseInputClasses}
        />
      )}
    </div>
  );
}
