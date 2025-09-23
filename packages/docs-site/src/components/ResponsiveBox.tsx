import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ResponsiveBoxProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'info' | 'warning' | 'success' | 'error' | 'neutral';
  icon?: LucideIcon;
  title?: string;
}

export default function ResponsiveBox({ 
  children, 
  className = '', 
  variant = 'neutral',
  icon: Icon,
  title 
}: ResponsiveBoxProps) {
  const variantClasses = {
    info: 'bg-blue/5 border-blue/20',
    warning: 'bg-yellow/5 border-yellow/20',
    success: 'bg-midnight/5 border-midnight/20', 
    error: 'bg-orange/5 border-orange/20',
    neutral: 'bg-gray-50 border-gray-200'
  };

  const iconColors = {
    info: 'text-blue',
    warning: 'text-yellow',
    success: 'text-midnight',
    error: 'text-orange',
    neutral: 'text-midnight'
  };

  return (
    <div className={`border rounded-lg p-2 sm:p-4 md:p-6 ${variantClasses[variant]} ${className}`}>
      {(Icon || title) && (
        <div className="flex items-start space-x-2 sm:space-x-3 mb-2 sm:mb-3">
          {Icon && (
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 ${iconColors[variant]}`} />
          )}
          {title && (
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-midnight">{title}</h3>
          )}
        </div>
      )}
      <div className={Icon || title ? 'text-sm sm:text-base' : 'flex items-start space-x-2 sm:space-x-3 text-sm sm:text-base'}>
        {children}
      </div>
    </div>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
  className?: string;
}

export function ResponsiveGrid({ children, cols = 2, className = '' }: ResponsiveGridProps) {
  const gridClasses = {
    1: 'grid gap-4 sm:gap-6',
    2: 'grid gap-4 sm:gap-6 sm:grid-cols-2',
    3: 'grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3'
  };

  return (
    <div className={`${gridClasses[cols]} ${className}`}>
      {children}
    </div>
  );
}

interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export function ResponsiveCard({ children, className = '', padding = 'md' }: ResponsiveCardProps) {
  const paddingClasses = {
    sm: 'p-2 sm:p-3 md:p-4',
    md: 'p-2 sm:p-4 md:p-6', 
    lg: 'p-3 sm:p-6 md:p-8'
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg text-sm sm:text-base ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}
