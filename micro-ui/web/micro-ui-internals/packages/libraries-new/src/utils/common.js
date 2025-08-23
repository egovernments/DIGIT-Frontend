/**
 * Common utility functions
 */

/**
 * Get default language
 */
export const getDefaultLanguage = () => {
  return 'en_IN';
};

/**
 * Get multi-root tenant setting
 */
export const getMultiRootTenant = () => {
  return window?.globalConfigs?.getConfig?.('ENABLE_MULTI_ROOT_TENANT') === 'true';
};

/**
 * String replacement utility
 */
export const stringReplaceAll = (str = '', searcher = '', replaceWith = '') => {
  if (searcher === '') return str;
  return str.split(searcher).join(replaceWith);
};

/**
 * Storage utilities
 */
export const Storage = {
  get: (key) => {
    try {
      if (typeof window !== 'undefined') {
        const value = sessionStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      }
    } catch (error) {
      console.error('Error reading from storage:', error);
    }
    return null;
  },

  set: (key, value) => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error writing to storage:', error);
    }
  },

  remove: (key) => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  },

  clear: () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};

/**
 * Persistent storage utilities  
 */
export const PersistentStorage = {
  get: (key) => {
    try {
      if (typeof window !== 'undefined') {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      }
    } catch (error) {
      console.error('Error reading from persistent storage:', error);
    }
    return null;
  },

  set: (key, value, expiryInSeconds = 0) => {
    try {
      if (typeof window !== 'undefined') {
        const data = {
          value,
          ...(expiryInSeconds > 0 && {
            expiry: Date.now() + (expiryInSeconds * 1000)
          })
        };
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error writing to persistent storage:', error);
    }
  },

  remove: (key) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing from persistent storage:', error);
    }
  },

  clear: () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing persistent storage:', error);
    }
  },

  isExpired: (key) => {
    const item = PersistentStorage.get(key);
    if (item && item.expiry) {
      return Date.now() > item.expiry;
    }
    return false;
  }
};

/**
 * Session storage utilities
 */
export const SessionStorage = {
  get: (key) => Storage.get(key),
  set: (key, value) => Storage.set(key, value),
  remove: (key) => Storage.remove(key),
  clear: () => Storage.clear()
};

/**
 * Format functions
 */
export const formatDate = (date, locale = 'en-IN') => {
  if (!date) return '';
  
  try {
    return new Date(date).toLocaleDateString(locale);
  } catch (error) {
    console.error('Error formatting date:', error);
    return date;
  }
};

export const formatCurrency = (amount, currency = 'INR', locale = 'en-IN') => {
  if (amount === null || amount === undefined) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return amount;
  }
};

/**
 * Validation utilities
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

/**
 * Debounce utility
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Deep clone utility
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

/**
 * Get global config value
 */
export const getGlobalConfig = (key, fallback = null) => {
  return window?.globalConfigs?.getConfig?.(key) || fallback;
};