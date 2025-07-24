import { useState, useEffect, useCallback } from 'react';
import { retry } from '../utils/helpers';

interface UseApiOptions {
  immediate?: boolean;
  retries?: number;
  retryDelay?: number;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Generic hook for API calls with loading, error, and retry functionality
 */
export function useApi<T>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions = {}
): UseApiState<T> & {
  execute: () => Promise<void>;
  reset: () => void;
} {
  const { immediate = false, retries = 0, retryDelay = 1000 } = options;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const executeWithRetry = retries > 0 
        ? () => retry(apiFunction, retries + 1, retryDelay)
        : apiFunction;
        
      const result = await executeWithRetry();
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error as Error 
      }));
    }
  }, [apiFunction, retries, retryDelay]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook for paginated API calls
 */
export function usePaginatedApi<T>(
  apiFunction: (page: number, limit: number) => Promise<{
    results: T[];
    count: number;
    next: string | null;
    previous: string | null;
  }>,
  limit: number = 10
) {
  const [state, setState] = useState({
    data: [] as T[],
    loading: false,
    error: null as Error | null,
    page: 1,
    hasMore: true,
    totalCount: 0,
  });

  const loadPage = useCallback(async (page: number, append: boolean = false) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiFunction(page, limit);
      
      setState(prev => ({
        ...prev,
        data: append ? [...prev.data, ...result.results] : result.results,
        loading: false,
        page,
        hasMore: !!result.next,
        totalCount: result.count,
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error as Error 
      }));
    }
  }, [apiFunction, limit]);

  const loadMore = useCallback(() => {
    if (!state.loading && state.hasMore) {
      loadPage(state.page + 1, true);
    }
  }, [loadPage, state.loading, state.hasMore, state.page]);

  const refresh = useCallback(() => {
    loadPage(1, false);
  }, [loadPage]);

  const reset = useCallback(() => {
    setState({
      data: [],
      loading: false,
      error: null,
      page: 1,
      hasMore: true,
      totalCount: 0,
    });
  }, []);

  useEffect(() => {
    loadPage(1, false);
  }, [loadPage]);

  return {
    ...state,
    loadMore,
    refresh,
    reset,
  };
}

/**
 * Hook for infinite scroll functionality
 */
export function useInfiniteScroll<T>(
  apiFunction: (page: number, limit: number) => Promise<{
    results: T[];
    count: number;
    next: string | null;
    previous: string | null;
  }>,
  options: {
    limit?: number;
    threshold?: number;
    enabled?: boolean;
  } = {}
) {
  const { limit = 10, threshold = 100, enabled = true } = options;
  
  const paginatedApi = usePaginatedApi(apiFunction, limit);
  
  useEffect(() => {
    if (!enabled) return;
    
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      
      if (scrollHeight - scrollTop <= clientHeight + threshold) {
        paginatedApi.loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [paginatedApi.loadMore, threshold, enabled]);

  return paginatedApi;
}

/**
 * Hook for optimistic updates
 */
export function useOptimisticUpdate<T>(
  initialData: T[],
  updateFunction: (id: string | number, data: Partial<T>) => Promise<T>,
  deleteFunction?: (id: string | number) => Promise<void>
) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const optimisticUpdate = useCallback(async (
    id: string | number,
    updates: Partial<T>,
    optimisticData: Partial<T>
  ) => {
    // Apply optimistic update
    setData(prev => prev.map(item => 
      (item as any).id === id ? { ...item, ...optimisticData } : item
    ));
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedItem = await updateFunction(id, updates);
      
      // Apply real update
      setData(prev => prev.map(item => 
        (item as any).id === id ? updatedItem : item
      ));
    } catch (error) {
      // Revert optimistic update
      setData(prev => prev.map(item => 
        (item as any).id === id ? { ...item, ...updates } : item
      ));
      
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [updateFunction]);

  const optimisticDelete = useCallback(async (id: string | number) => {
    if (!deleteFunction) return;
    
    // Store original item for potential revert
    const originalItem = data.find(item => (item as any).id === id);
    
    // Apply optimistic delete
    setData(prev => prev.filter(item => (item as any).id !== id));
    
    setLoading(true);
    setError(null);
    
    try {
      await deleteFunction(id);
    } catch (error) {
      // Revert optimistic delete
      if (originalItem) {
        setData(prev => [...prev, originalItem]);
      }
      
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [deleteFunction, data]);

  const optimisticAdd = useCallback(async (
    createFunction: () => Promise<T>,
    optimisticData: T
  ) => {
    // Apply optimistic add
    setData(prev => [optimisticData, ...prev]);
    
    setLoading(true);
    setError(null);
    
    try {
      const newItem = await createFunction();
      
      // Replace optimistic item with real item
      setData(prev => prev.map(item => 
        item === optimisticData ? newItem : item
      ));
    } catch (error) {
      // Revert optimistic add
      setData(prev => prev.filter(item => item !== optimisticData));
      
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    optimisticUpdate,
    optimisticDelete,
    optimisticAdd,
    setData,
  };
}