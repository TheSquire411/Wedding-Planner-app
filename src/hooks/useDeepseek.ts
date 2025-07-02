import { useState, useCallback } from 'react';
import { deepseekService } from '../services/deepseekService';

interface UseDeepseekOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  autoRetry?: boolean;
}

export function useDeepseek(options: UseDeepseekOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const execute = useCallback(async (
    method: keyof typeof deepseekService,
    ...args: any[]
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Type assertion to handle the method call
      const result = await (deepseekService[method] as any)(...args);

      if (result.success) {
        setData(result.data);
        options.onSuccess?.(result.data);
        return result.data;
      } else {
        const errorMessage = result.error || 'Unknown error occurred';
        setError(errorMessage);
        options.onError?.(errorMessage);
        return null;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to execute Deepseek request';
      setError(errorMessage);
      options.onError?.(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const testConnection = useCallback(() => {
    return execute('testConnection');
  }, [execute]);

  const generateStory = useCallback((coupleInfo: any) => {
    return execute('generateWeddingStory', coupleInfo);
  }, [execute]);

  const generateVisionBoard = useCallback((preferences: any) => {
    return execute('generateVisionBoardContent', preferences);
  }, [execute]);

  const analyzeImage = useCallback((imageDescription: string) => {
    return execute('analyzeWeddingImage', imageDescription);
  }, [execute]);

  const generateChatResponse = useCallback((message: string, context: any) => {
    return execute('generateChatResponse', message, context);
  }, [execute]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    testConnection,
    generateStory,
    generateVisionBoard,
    analyzeImage,
    generateChatResponse,
    reset,
    isReady: deepseekService.isReady()
  };
}