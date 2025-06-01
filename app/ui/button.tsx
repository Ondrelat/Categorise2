// components/ui/button.tsx
'use client';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

export const Button = ({ variant = 'default', className = '', ...props }: ButtonProps) => {
  const baseClass = 'px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200';
  const variantClass =
    variant === 'default'
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'border border-blue-600 text-blue-600 hover:bg-blue-50';

  return (
    <button
      className={`${baseClass} ${variantClass} ${className}`}
      {...props}
    />
  );
};