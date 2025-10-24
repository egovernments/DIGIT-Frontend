import LZString from "lz-string";

const localStoreSupport = () => {
  try {
    return "sessionStorage" in window && window["sessionStorage"] !== null;
  } catch (e) {
    return false;
  }
};

const k = (key) => `Digit.${key}`;
const getStorage = (storageClass) => ({
  get: (key) => {
    if (localStoreSupport() && key) {
      let valueInStorage = storageClass.getItem(k(key));
      if (!valueInStorage || valueInStorage === "undefined") {
        return null;
      }
      const item = JSON.parse(valueInStorage);
      if (Date.now() > item.expiry) {
        storageClass.removeItem(k(key));
        return null;
      }
      return item.value;
    } else if (typeof window !== "undefined") {
      return window?.eGov?.Storage && window.eGov.Storage[k(key)].value;
    } else {
      return null;
    }
  },
  set: (key, value, ttl = 86400) => {
    const item = {
      value,
      ttl,
      expiry: Date.now() + ttl * 1000,
    };
    if (localStoreSupport()) {
      storageClass.setItem(k(key), JSON.stringify(item));
    } else if (typeof window !== "undefined") {
      window.eGov = window.eGov || {};
      window.eGov.Storage = window.eGov.Storage || {};
      window.eGov.Storage[k(key)] = item;
    }
  },
  del: (key) => {
    if (localStoreSupport()) {
      storageClass.removeItem(k(key));
    } else if (typeof window !== "undefined") {
      window.eGov = window.eGov || {};
      window.eGov.Storage = window.eGov.Storage || {};
      delete window.eGov.Storage[k(key)];
    }
  },
});

export const Storage = getStorage(window.sessionStorage);
export const PersistantStorage = {
  get: (key) => {
    try {
      const value = localStorage.getItem(key);
      if (!value) return null;
      // Decompress and parse
      const decompressed = LZString.decompress(value);
      return decompressed ? JSON.parse(decompressed) : null;
    } catch (e) {
      console.error("Error reading from localStorage:", e);
      return null;
    }
  },
  set: (key, value) => {
    try {
      let dataToStore = value;
      // Deduplicate if key is localization
      if (key === "localization") {
        const existing = PersistantStorage.get(key) || [];
        const combined = [...existing, ...value];
        // Remove duplicates based on 'code'
        dataToStore = Array.from(
          new Map(combined.map(item => [item.code, item])).values()
        );
      }
      // Compress before storing
      const compressed = LZString.compress(JSON.stringify(dataToStore));
      localStorage.setItem(key, compressed);
    } catch (e) {
      console.error("Error writing to localStorage:", e);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error("Error removing from localStorage:", e);
    }
  }
};
