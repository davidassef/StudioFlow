/**
 * Local storage utilities with error handling and type safety
 */

/**
 * Safely get item from localStorage
 */
export const getStorageItem = <T = string>(key: string, defaultValue?: T): T | null => {
  try {
    if (typeof window === 'undefined') return defaultValue || null;
    
    const item = localStorage.getItem(key);
    
    if (item === null) return defaultValue || null;
    
    // Try to parse as JSON, fallback to string
    try {
      return JSON.parse(item);
    } catch {
      return item as T;
    }
  } catch (error) {
    console.warn(`Error getting item from localStorage: ${key}`, error);
    return defaultValue || null;
  }
};

/**
 * Safely set item in localStorage
 */
export const setStorageItem = <T>(key: string, value: T): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.warn(`Error setting item in localStorage: ${key}`, error);
    return false;
  }
};

/**
 * Safely remove item from localStorage
 */
export const removeStorageItem = (key: string): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Error removing item from localStorage: ${key}`, error);
    return false;
  }
};

/**
 * Clear all localStorage items
 */
export const clearStorage = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    localStorage.clear();
    return true;
  } catch (error) {
    console.warn('Error clearing localStorage', error);
    return false;
  }
};

/**
 * Check if localStorage is available
 */
export const isStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get storage size in bytes
 */
export const getStorageSize = (): number => {
  try {
    if (typeof window === 'undefined') return 0;
    
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  } catch {
    return 0;
  }
};

/**
 * Storage wrapper with expiration
 */
export class ExpiringStorage {
  private static setWithExpiry<T>(key: string, value: T, ttl: number): boolean {
    const now = new Date();
    const item = {
      value,
      expiry: now.getTime() + ttl,
    };
    
    return setStorageItem(key, item);
  }
  
  private static getWithExpiry<T>(key: string): T | null {
    const itemStr = getStorageItem(key);
    
    if (!itemStr) return null;
    
    try {
      const item = typeof itemStr === 'string' ? JSON.parse(itemStr) : itemStr;
      const now = new Date();
      
      if (now.getTime() > item.expiry) {
        removeStorageItem(key);
        return null;
      }
      
      return item.value;
    } catch {
      removeStorageItem(key);
      return null;
    }
  }
  
  /**
   * Set item with expiration time in milliseconds
   */
  static set<T>(key: string, value: T, ttlMs: number): boolean {
    return this.setWithExpiry(key, value, ttlMs);
  }
  
  /**
   * Set item with expiration time in minutes
   */
  static setMinutes<T>(key: string, value: T, minutes: number): boolean {
    return this.setWithExpiry(key, value, minutes * 60 * 1000);
  }
  
  /**
   * Set item with expiration time in hours
   */
  static setHours<T>(key: string, value: T, hours: number): boolean {
    return this.setWithExpiry(key, value, hours * 60 * 60 * 1000);
  }
  
  /**
   * Set item with expiration time in days
   */
  static setDays<T>(key: string, value: T, days: number): boolean {
    return this.setWithExpiry(key, value, days * 24 * 60 * 60 * 1000);
  }
  
  /**
   * Get item (automatically removes if expired)
   */
  static get<T>(key: string): T | null {
    return this.getWithExpiry<T>(key);
  }
  
  /**
   * Remove item
   */
  static remove(key: string): boolean {
    return removeStorageItem(key);
  }
}

/**
 * Session storage utilities (similar to localStorage but for session)
 */
export const sessionStorage = {
  get: <T = string>(key: string, defaultValue?: T): T | null => {
    try {
      if (typeof window === 'undefined') return defaultValue || null;
      
      const item = window.sessionStorage.getItem(key);
      
      if (item === null) return defaultValue || null;
      
      try {
        return JSON.parse(item);
      } catch {
        return item as T;
      }
    } catch (error) {
      console.warn(`Error getting item from sessionStorage: ${key}`, error);
      return defaultValue || null;
    }
  },
  
  set: <T>(key: string, value: T): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      window.sessionStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.warn(`Error setting item in sessionStorage: ${key}`, error);
      return false;
    }
  },
  
  remove: (key: string): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      
      window.sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing item from sessionStorage: ${key}`, error);
      return false;
    }
  },
  
  clear: (): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      
      window.sessionStorage.clear();
      return true;
    } catch (error) {
      console.warn('Error clearing sessionStorage', error);
      return false;
    }
  },
};

/**
 * Cookie utilities
 */
export const cookies = {
  get: (name: string): string | null => {
    try {
      if (typeof document === 'undefined') return null;
      
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      
      if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';').shift();
        return cookieValue ? decodeURIComponent(cookieValue) : null;
      }
      
      return null;
    } catch {
      return null;
    }
  },
  
  set: (name: string, value: string, days?: number, path: string = '/'): boolean => {
    try {
      if (typeof document === 'undefined') return false;
      
      let expires = '';
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `; expires=${date.toUTCString()}`;
      }
      
      document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=${path}`;
      return true;
    } catch {
      return false;
    }
  },
  
  remove: (name: string, path: string = '/'): boolean => {
    try {
      if (typeof document === 'undefined') return false;
      
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
      return true;
    } catch {
      return false;
    }
  },
};

/**
 * Storage keys constants
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'studioflow_auth_token',
  REFRESH_TOKEN: 'studioflow_refresh_token',
  USER_DATA: 'studioflow_user_data',
  THEME: 'studioflow_theme',
  LANGUAGE: 'studioflow_language',
  FAVORITES: 'studioflow_favorites',
  SEARCH_HISTORY: 'studioflow_search_history',
  FILTERS: 'studioflow_filters',
  ONBOARDING_COMPLETED: 'studioflow_onboarding_completed',
} as const;

/**
 * Clear all app-related storage
 */
export const clearAppStorage = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeStorageItem(key);
    sessionStorage.remove(key);
    cookies.remove(key);
  });
};