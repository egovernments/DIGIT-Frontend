import localforage from "localforage";

// Two-tier cache: in-memory Map (sync) + localStorage L1 (sync, capped) + IndexedDB L2 (async, archive).
// L1 preserves the synchronous-first-paint property: critical keys are read from localStorage before
// React renders. L2 holds the long-tail archive where the 5–10 MB localStorage budget would otherwise blow.

const L1_PREFIX = "Digit.L1.";
const L1_INDEX_KEY = "Digit.L1.__index__";
const LEGACY_CLEANUP_FLAG = "Digit.HybridStorage.cleanedLegacy";
const DEFAULT_TTL_SECS = 86400;
const DEFAULT_HOT_CAP_BYTES = 1.5 * 1024 * 1024;

// Prefixes/keys written by the upstream npm getStorage-based PersistantStorage
// (which prepends "Digit." to every key via its k() function). Once Localization
// switches to HybridStorage, those entries become orphaned — cleanupLegacy()
// removes them on first boot to free ~600 KB+ of localStorage.
const LEGACY_PREFIXES = ["Digit.Locale.", "Digit.MDMS."];
const LEGACY_KEYS = ["Digit.cachingService"];

let hotCapBytes = DEFAULT_HOT_CAP_BYTES;

const memMap = new Map();

const idbStore = localforage.createInstance({
  name: "digit-ui",
  storeName: "persistent_cache",
  description: "DIGIT UI persistent cache (locales, MDMS, settings)",
  driver: [localforage.INDEXEDDB], // explicit: no silent fallback to localStorage (would collide with L1)
});

const isExpired = (item) => item && item.expiry && Date.now() > item.expiry;

const readL1Index = () => {
  try {
    const raw = localStorage.getItem(L1_INDEX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeL1Index = (index) => {
  try {
    localStorage.setItem(L1_INDEX_KEY, JSON.stringify(index));
  } catch {
    // index is best-effort; if it can't be persisted we'll re-derive on next boot
  }
};

const touchL1 = (key) => {
  const idx = readL1Index().filter((k) => k !== key);
  idx.unshift(key);
  writeL1Index(idx);
};

const removeL1 = (key) => {
  try {
    localStorage.removeItem(L1_PREFIX + key);
  } catch {}
  const idx = readL1Index().filter((k) => k !== key);
  writeL1Index(idx);
};

const computeL1Bytes = () => {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(L1_PREFIX)) {
      total += (k.length + (localStorage.getItem(k)?.length || 0)) * 2; // UTF-16
    }
  }
  return total;
};

const evictL1Until = (targetBytes) => {
  const idx = readL1Index();
  // index is MRU-first, so pop() drops the least-recently-used
  while (idx.length && computeL1Bytes() > targetBytes) {
    const victim = idx.pop();
    try {
      localStorage.removeItem(L1_PREFIX + victim);
    } catch {}
  }
  writeL1Index(idx);
};

const readL1Sync = (key) => {
  let raw;
  try {
    raw = localStorage.getItem(L1_PREFIX + key);
  } catch {
    return null;
  }
  if (!raw) return null;
  let item;
  try {
    item = JSON.parse(raw);
  } catch {
    return null;
  }
  if (isExpired(item)) {
    removeL1(key);
    return null;
  }
  touchL1(key);
  return item;
};

const writeL1Sync = (key, item) => {
  const serialized = JSON.stringify(item);
  try {
    localStorage.setItem(L1_PREFIX + key, serialized);
    touchL1(key);
    return true;
  } catch (e) {
    if (e && e.name === "QuotaExceededError") {
      evictL1Until(hotCapBytes * 0.75);
      try {
        localStorage.setItem(L1_PREFIX + key, serialized);
        touchL1(key);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
};

const enforceL1Cap = () => {
  if (computeL1Bytes() > hotCapBytes) evictL1Until(hotCapBytes);
};

export const HybridStorage = {
  // Sync read: Map → L1 → null. Use from i18next or any hook that needs O(1) at render time.
  getSync(key) {
    const fromMap = memMap.get(key);
    if (fromMap !== undefined) {
      if (isExpired(fromMap)) {
        memMap.delete(key);
        removeL1(key);
        return null;
      }
      return fromMap.value;
    }
    const fromL1 = readL1Sync(key);
    if (fromL1) {
      memMap.set(key, fromL1);
      return fromL1.value;
    }
    return null;
  },

  // Async read: Map → L1 → L2 → null. Use during boot hydration and for cold-tier keys.
  async getAsync(key) {
    const fromSync = HybridStorage.getSync(key);
    if (fromSync !== null) return fromSync;
    try {
      const item = await idbStore.getItem(key);
      if (!item || isExpired(item)) {
        if (item) idbStore.removeItem(key).catch(() => {});
        return null;
      }
      memMap.set(key, item);
      return item.value;
    } catch {
      return null;
    }
  },

  // Hot write: Map + L1 (sync, for first-paint next time) + L2 archive (fire-and-forget).
  setSync(key, value, ttl = DEFAULT_TTL_SECS) {
    const item = { value, expiry: Date.now() + ttl * 1000 };
    memMap.set(key, item);
    const okL1 = writeL1Sync(key, item);
    if (okL1) enforceL1Cap();
    idbStore.setItem(key, item).catch(() => {});
    return okL1;
  },

  // Cold write: Map + L2 only. Use for data that doesn't need synchronous-first-paint reads.
  async setAsync(key, value, ttl = DEFAULT_TTL_SECS) {
    const item = { value, expiry: Date.now() + ttl * 1000 };
    memMap.set(key, item);
    try {
      await idbStore.setItem(key, item);
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    memMap.delete(key);
    removeL1(key);
    idbStore.removeItem(key).catch(() => {});
  },

  // Bulk hydrate: pull every L2 key matching `predicate` into the in-memory Map.
  // Called once after boot; misses fall through to fetch.
  async hydrate(predicate) {
    try {
      await idbStore.iterate((item, key) => {
        if (predicate && !predicate(key)) return;
        if (!item || isExpired(item)) return;
        memMap.set(key, item);
      });
    } catch {}
  },

  // Diagnostics: total bytes per tier + key counts. Used by Phase 0/3/7 verifications.
  size() {
    let l1Keys = 0;
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i)?.startsWith(L1_PREFIX)) l1Keys++;
    }
    return {
      mapKeys: memMap.size,
      l1Keys,
      l1Bytes: computeL1Bytes(),
      hotCapBytes,
    };
  },

  configure(opts) {
    if (opts && typeof opts.hotCapBytes === "number" && opts.hotCapBytes > 0) {
      hotCapBytes = opts.hotCapBytes;
    }
  },

  // One-shot cleanup of legacy PersistantStorage entries (Digit.Locale.*,
  // Digit.MDMS.*, Digit.cachingService) that were written by upstream
  // getStorage-based PersistantStorage. Once Localization swaps to HybridStorage
  // those entries become unread dead weight — remove them on first boot to free
  // ~600 KB+ of localStorage. Idempotent: gated by a flag so subsequent boots no-op.
  cleanupLegacy() {
    if (localStorage.getItem(LEGACY_CLEANUP_FLAG)) return { skipped: true };
    let removed = 0;
    let freedBytes = 0;
    try {
      const toRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k) continue;
        const isLegacyPrefixed = LEGACY_PREFIXES.some((p) => k.startsWith(p));
        const isLegacyKey = LEGACY_KEYS.includes(k);
        if (isLegacyPrefixed || isLegacyKey) {
          const v = localStorage.getItem(k);
          freedBytes += (k.length + (v ? v.length : 0)) * 2;
          toRemove.push(k);
        }
      }
      for (const k of toRemove) {
        try {
          localStorage.removeItem(k);
          removed++;
        } catch {}
      }
      localStorage.setItem(LEGACY_CLEANUP_FLAG, String(Date.now()));
      return { removed, freedBytes };
    } catch (e) {
      return { error: String(e && e.message ? e.message : e) };
    }
  },
};

export default HybridStorage;
