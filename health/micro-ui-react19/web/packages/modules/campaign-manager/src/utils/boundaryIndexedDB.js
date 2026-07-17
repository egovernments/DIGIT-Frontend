const DB_NAME = "HCM_CAMPAIGN_BOUNDARY_DB";
const DB_VERSION = 1;
const STORE_NAME = "boundaryData";

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not available"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

/**
 * Get boundary data from IndexedDB by key.
 * @param {string} key
 * @returns {Promise<any>} The stored data, or null if not found.
 */
async function getBoundaryData(key) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result !== undefined ? request.result : null);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (e) {
    console.warn("IndexedDB getBoundaryData failed, falling back to null:", e);
    return null;
  }
}

/**
 * Set boundary data in IndexedDB.
 * @param {string} key
 * @param {any} data
 * @returns {Promise<void>}
 */
async function setBoundaryData(key, data) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(data, key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (e) {
    console.warn("IndexedDB setBoundaryData failed:", e);
  }
}

/**
 * Clear boundary data from IndexedDB by key.
 * @param {string} key
 * @returns {Promise<void>}
 */
async function clearBoundaryData(key) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (e) {
    console.warn("IndexedDB clearBoundaryData failed:", e);
  }
}

/**
 * Clear all boundary data from IndexedDB.
 * @returns {Promise<void>}
 */
async function clearAllBoundaryData() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (e) {
    console.warn("IndexedDB clearAllBoundaryData failed:", e);
  }
}

export { getBoundaryData, setBoundaryData, clearBoundaryData, clearAllBoundaryData };
