import { useState, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';

/**
 * Custom hook for managing localStorage with React state synchronization
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = getStorageItem<T>(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        // Save state
        setStoredValue(valueToStore);
        
        // Save to local storage
        setStorageItem(key, valueToStore);
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      removeStorageItem(key);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch {
          // If parsing fails, use the raw value
          setStoredValue(e.newValue as T);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for managing localStorage with expiration
 */
export function useExpiringLocalStorage<T>(
  key: string,
  initialValue: T,
  ttlMs: number
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = getStorageItem(key);
      
      if (item) {
        const parsed = typeof item === 'string' ? JSON.parse(item) : item;
        const now = new Date().getTime();
        
        if (parsed.expiry && now > parsed.expiry) {
          removeStorageItem(key);
          return initialValue;
        }
        
        return parsed.value || initialValue;
      }
      
      return initialValue;
    } catch (error) {
      console.warn(`Error reading expiring localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        const now = new Date().getTime();
        const item = {
          value: valueToStore,
          expiry: now + ttlMs,
        };
        
        setStoredValue(valueToStore);
        setStorageItem(key, item);
      } catch (error) {
        console.warn(`Error setting expiring localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, ttlMs]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      removeStorageItem(key);
    } catch (error) {
      console.warn(`Error removing expiring localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}