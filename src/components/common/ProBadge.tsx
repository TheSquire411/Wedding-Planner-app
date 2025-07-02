import React from 'react';
import { Crown, Sparkles } from 'lucide-react';

interface ProBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'badge' | 'banner' | 'icon';
  className?: string;
}

export default function ProBadge({ size = 'md', variant = 'badge', className = '' }: ProBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  if (variant === 'icon') {
    return (
      <Crown className={`${iconSizes[size]} text-gold-500 ${className}`} />
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-gold-400 to-primary-500 text-white rounded-lg ${sizeClasses[size]} font-semibold flex items-center space-x-1 ${className}`}>
        <Crown className={iconSizes[size]} />
        <span>PRO</span>
      </div>
    );
  }

  return (
    <span className={`bg-gradient-to-r from-gold-400 to-primary-500 text-white rounded-full ${sizeClasses[size]} font-semibold inline-flex items-center space-x-1 ${className}`}>
      <Crown className={iconSizes[size]} />
      <span>PRO</span>
    </span>
  );
}