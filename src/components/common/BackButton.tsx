import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  to?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Standardized back button component for consistent navigation
 */
export default function BackButton({ to = '/dashboard', className = '', children }: BackButtonProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(to);
  };

  return (
    <button
      onClick={handleBack}
      className={`p-2 text-gray-600 hover:text-gray-800 transition-colors ${className}`}
      aria-label="Go back"
    >
      {children || <ArrowLeft className="h-6 w-6" />}
    </button>
  );
}