// Export all custom hooks
export * from './useLocalStorage';
export * from './useDebounce';
export * from './useApi';
export * from './useForm';

// Re-export commonly used hooks for convenience
export {
  useLocalStorage,
  useExpiringLocalStorage,
} from './useLocalStorage';

export {
  useDebounce,
  useDebouncedCallback,
  useDebouncedSearch,
} from './useDebounce';

export {
  useApi,
  usePaginatedApi,
  useInfiniteScroll,
  useOptimisticUpdate,
} from './useApi';

export {
  useForm,
  useFormArray,
  useFieldValidation,
} from './useForm';