import React from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-gray-50 border rounded-lg px-3 py-2.5 text-sm text-gray-900',
            'placeholder-gray-400 transition-all duration-150',
            'focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent',
            error ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-200',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

// =============================================
// Textarea variant
// =============================================
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full bg-gray-50 border rounded-lg px-3 py-2.5 text-sm text-gray-900',
            'placeholder-gray-400 transition-all duration-150 resize-none',
            'focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent',
            error ? 'border-red-400' : 'border-gray-200',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
