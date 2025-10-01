import { useState, useEffect, useCallback } from 'react';

interface UseApiOptions {
  immediate?: boolean; // Whether to fetch immediately on mount
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useApi<T>(
  url: string | null,
  options: UseApiOptions = { immediate: true }
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    if (!url) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: T = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (options.immediate && url) {
      execute();
    }
  }, [execute, options.immediate, url]);

  const refetch = useCallback(() => execute(), [execute]);

  return {
    data,
    loading,
    error,
    execute,
    refetch
  };
}

// Helper hook for multiple API calls
export function useMultipleApi<T extends Record<string, any>>(
  urls: Record<keyof T, string | null>,
  options: UseApiOptions = { immediate: true }
): Record<keyof T, UseApiReturn<any>> {
  const results = {} as Record<keyof T, UseApiReturn<any>>;
  
  Object.keys(urls).forEach((key) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    results[key as keyof T] = useApi(urls[key as keyof T], options);
  });
  
  return results;
}