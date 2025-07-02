import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Custom hook for standardized navigation throughout the app
 */
export function useNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = useCallback((fallbackPath = '/dashboard') => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to specific path if no history
      navigate(fallbackPath);
    }
  }, [navigate]);

  const goTo = useCallback((path: string, options?: { replace?: boolean; state?: any }) => {
    navigate(path, options);
  }, [navigate]);

  const goToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const getCurrentPath = useCallback(() => {
    return location.pathname;
  }, [location.pathname]);

  const isCurrentPath = useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);

  return {
    goBack,
    goTo,
    goToDashboard,
    getCurrentPath,
    isCurrentPath,
    navigate,
    location
  };
}