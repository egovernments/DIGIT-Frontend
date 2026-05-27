# Storage Migration: PersistantStorage → HybridStorage

**Version:** 1.9.7
**Date:** 2026-05-26
**Status:** ✅ Deployed and verified in production

---

## TL;DR

The locale, MDMS, and API cache layer was migrated from a single-tier
localStorage-only cache (`PersistantStorage`) to a three-tier hybrid cache
(`HybridStorage`):

- **localStorage usage dropped 71%** (1,752 KB → ~500 KB measured in the
  deployment test)
- **QuotaExceededError cliff is structurally eliminated** — localStorage
  from our cache cannot exceed 1.5 MB regardless of write volume
- **Synchronous first-paint preserved** — i18next still reads translations
  before React renders, via an in-memory Map populated from L1 on boot
- **App behavior unchanged** — translations, MDMS dropdowns, language
  switch, multi-root tenant flow all work identically

---

## Why the migration was needed

Browsers cap localStorage at ~5–10 MB per origin. The old design used
localStorage as a single-tier cache with **no bounds and no eviction**.
Locale data, MDMS data, and cache settings all competed for the same
5–10 MB budget and accumulated forever.

When the cap was hit, `localStorage.setItem` threw `QuotaExceededError`.
The old `set()` had a bare `catch (e) { console.error(...) }`, so failures
were silent:

- Translations refetched on every navigation (no save)
- MDMS data refetched on every screen
- App slowed down and felt broken for heavy users

The structural problem: a 1-tier cache that grows until it hits the wall.

---

## The new architecture

Three-tier cache with bounded localStorage and unbounded IndexedDB overflow.

| Tier | Backed by | Capacity | Access | Role |
|------|-----------|----------|--------|------|
| L0 — Map | RAM | session only | sync | Hot path; repeated reads at zero cost |
| L1 — localStorage | localStorage | **1.5 MB hard cap (LRU-bounded)** | sync | First-paint hot slice |
| L2 — IndexedDB | localforage / native IDB | **~50% of free disk (GB scale)** | async | Full archive |

Every `setSync` write fans out to all three tiers. Every `getSync` read
tries Map → L1 → null (no IDB). The async `getAsync` adds the IDB fallback
when needed.

### Flow when new data arrives

```
┌────────────────────────────────────────────────────┐
│ New cache entry comes in via HybridStorage.setSync │
└────────────────────────────────────────────────────┘
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
    ┌──────────────┐         ┌──────────────┐
    │ localStorage │         │ IndexedDB    │
    │ (L1, capped) │         │ (L2, huge)   │
    │ 1.5 MB max   │         │ GBs of room  │
    └──────┬───────┘         └──────┬───────┘
           │                        │
           ▼                        ▼
  Would this push          ALWAYS writes here.
  L1 over 1.5 MB?          The full data lives
           │               in IDB no matter what.
     ┌─────┴─────┐
     ▼           ▼
   YES         NO
    │           │
    ▼           ▼
  Evict       Write goes
  oldest      in normally
  entries
  first

If one entry is bigger than 1.5 MB on its own:
  → skip L1
  → still goes to IDB
```

### Where data ends up by size

| Situation | localStorage (L1) | IndexedDB (L2) |
|-----------|-------------------|----------------|
| Small entry, L1 has room | ✅ written | ✅ written |
| Many small entries push L1 past 1.5 MB | ✅ newest stays, oldest evicted | ✅ all retained |
| Single entry bigger than 1.5 MB | ❌ skipped (cap exceeded) | ✅ written |
| L1 hits browser hard cap | ✅ retries after LRU evict to 75% | ✅ written |

---

## Protections built into HybridStorage

1. **Proactive LRU cap.** After every `setSync`, `enforceL1Cap()` evicts
   least-recently-used entries from L1 until total bytes ≤ 1.5 MB.
2. **Reactive QuotaExceededError handler.** If a write still throws
   `QuotaExceededError`, the catch block evicts L1 to 75% of cap, then
   retries once. Data lives in Map (this session) + L2 (persistent)
   regardless of the retry outcome.
3. **No silent failures.** Even if L1 write fails entirely, the in-memory
   Map serves the current session and IndexedDB persists the data for
   future sessions.
4. **One-shot legacy cleanup.** On first boot post-deploy,
   `cleanupLegacy()` removes the orphaned `Digit.Locale.*`, `Digit.MDMS.*`,
   and `Digit.cachingService` keys written by the previous architecture.
   Idempotent: gated by a flag (`Digit.HybridStorage.cleanedLegacy`).

---

## Public API

All exposed on `window.Digit`:

### `window.Digit.HybridStorage`
The low-level cache primitive. Used internally by Localization, MDMS,
and ApiCacheService.

```js
HybridStorage.getSync(key)                  // Map → L1 → null
HybridStorage.getAsync(key)                 // Map → L1 → L2 → null
HybridStorage.setSync(key, value, ttl)      // Map + L1 + fire-and-forget L2
HybridStorage.setAsync(key, value, ttl)     // Map + L2 only
HybridStorage.remove(key)                   // purge all three tiers
HybridStorage.hydrate(predicate)            // bulk pull L2 → Map on boot
HybridStorage.size()                        // diagnostics
HybridStorage.cleanupLegacy()               // remove legacy entries (idempotent)
HybridStorage.configure({ hotCapBytes })    // tune L1 cap at runtime
```

### `window.Digit.LocaleStore`
Thin facade over HybridStorage scoped to locale data.

```js
LocaleStore.get(key)
LocaleStore.set(key, value, ttl)
LocaleStore.remove(key)
LocaleStore.hydrate()  // warms Map with all Locale.* L2 entries
```

---

## Verification (production deployment)

| Check | Expected | Actual |
|-------|----------|--------|
| HybridStorage API exposed | yes | ✅ yes |
| LocaleStore API exposed | yes | ✅ yes |
| Cleanup migrator ran | yes | ✅ yes (timestamp recorded) |
| Legacy `Digit.Locale.*` keys present | 0 | ✅ 0 |
| Legacy `Digit.MDMS.*` keys present | 0 | ✅ 0 |
| Legacy `Digit.cachingService` present | no | ✅ no |
| New writes go to `Digit.L1.*` format | yes | ✅ yes |
| MDMS uses HybridStorage internally | yes | ✅ yes |
| App behavior (translations, dropdowns) | unchanged | ✅ unchanged |

### Storage breakdown after deploy

**L1 Locale modules** (9 entries, ~400 KB — working set for sync first-paint):
- `rainmaker-pgr` — 283.72 KB
- `rainmaker-schema` — 50.45 KB
- `rainmaker-workbench` — 32.89 KB
- `digit-sandbox` — 30.43 KB
- 5 smaller modules

**L1 MDMS** (11 entries, ~94 KB):
- `sandbox.ProductDetails` — 54.61 KB
- `CMS-BOUNDARY.HierarchySchema` — 12.87 KB
- `PGR.serviceDefs` — 12.52 KB
- 8 smaller entries

**IndexedDB `digit-ui` database** mirrors L1 + holds the full archive.

---

## Stress test results

Five tests run against the live deployment to validate cache limits.

### Test 1 — L1 cap enforcement under sustained writes
- 25 sequential writes × ~100 KB each (2.5 MB attempted)
- **Result:** L1 settled at ~1,467 KB. All 25 writes succeeded.
- **Verdict:** ✅ Cap enforced via LRU eviction.

### Test 2 — Single 2 MB entry (larger than cap)
- Wrote one 1,000,000-char string (~2 MB)
- **Result:** Entry skipped L1 (`inL1: false`), recovered via `getAsync`
  with byte-for-byte match.
- **Verdict:** ✅ Oversize entries overflow to IDB cleanly. No data loss.

### Test 3 — LRU eviction order
- Wrote 10 entries (A–J), then one more to force eviction.
- **Result:** Oldest 4 evicted (A, B, C, D); 6 most recent survived (E–J).
- **Verdict:** ✅ LRU order strictly observed.

### Test 4 — Data integrity post-eviction (zero data loss)
- Wrote target → polluted L1 with 15 × 150 KB to force eviction → read via `getAsync`.
- **Result:** Target evicted from L1, perfectly recovered from IDB.
- **Verdict:** ✅ IndexedDB is a complete safety net.

### Test 5 — 1000-write rapid-fire stress
- 1000 sequential writes, no delays.
- **Result:** 654 ms total (0.65 ms/write avg); L1 final 377 keys @ 1,531 KB; **no QuotaExceededError**.
- **Verdict:** ✅ Sub-millisecond writes; cap held under heavy load.

### Aggregate

| Capability | Status |
|------------|--------|
| L1 cap holds at ~1.5 MB under any write pattern | ✅ Pass |
| Oversize entries overflow to IndexedDB | ✅ Pass |
| LRU eviction order correct | ✅ Pass |
| Zero data loss after eviction (IDB safety net) | ✅ Pass |
| Performance under heavy load (1000 writes / 654 ms) | ✅ Pass |
| QuotaExceededError suppression | ✅ Pass — never triggered |

---

## Capacity headroom: before vs after

For a typical user (~1.6 MB locale + ~150 KB MDMS):

| Metric | OLD (PersistantStorage) | NEW (HybridStorage) |
|--------|------------------------|---------------------|
| localStorage used by cache | 1.75 MB | ~500 KB |
| localStorage headroom before browser cliff | ~3.3 MB | ~4.5 MB |
| Behavior when locale set doubles to 3.2 MB | LS hits 3.35 MB, cliff approaches | L1 stays 1.5 MB, overflow to IDB |
| Behavior when total cache hits 10 MB | LS breaks (QuotaExceededError) | L1 stays 1.5 MB, IDB has GBs to spare |

---

## Diagnostic scripts

Paste any of these in DevTools console of the deployed app.

### Snapshot of current storage state
```js
(() => {
  const ls = localStorage;
  const groups = {
    'OLD: Digit.Locale.*': [], 'OLD: Digit.MDMS.*': [], 'OLD: Digit.cachingService': [],
    'NEW: Digit.L1.Locale.*': [], 'NEW: Digit.L1.MDMS.*': [], 'NEW: Digit.L1.* other': [],
    'NEW: cleanup flag': [], 'Other Digit.*': [], 'Misc': [],
  };
  for (const k of Object.keys(ls).sort()) {
    const sz = ((k.length + (ls.getItem(k)?.length || 0)) * 2 / 1024).toFixed(2);
    const e = `${k}  (${sz} KB)`;
    if (k.startsWith('Digit.L1.Locale.')) groups['NEW: Digit.L1.Locale.*'].push(e);
    else if (k.startsWith('Digit.L1.MDMS.')) groups['NEW: Digit.L1.MDMS.*'].push(e);
    else if (k.startsWith('Digit.L1.')) groups['NEW: Digit.L1.* other'].push(e);
    else if (k === 'Digit.HybridStorage.cleanedLegacy') groups['NEW: cleanup flag'].push(e);
    else if (k.startsWith('Digit.Locale.')) groups['OLD: Digit.Locale.*'].push(e);
    else if (k.startsWith('Digit.MDMS.')) groups['OLD: Digit.MDMS.*'].push(e);
    else if (k === 'Digit.cachingService') groups['OLD: Digit.cachingService'].push(e);
    else if (k.startsWith('Digit.')) groups['Other Digit.*'].push(e);
    else groups.Misc.push(e);
  }
  for (const [n, es] of Object.entries(groups)) {
    if (!es.length) continue;
    console.log(`\n${n}  —  ${es.length} keys`);
    es.forEach(x => console.log('  ' + x));
  }
})();
```

### Verify migration is active
```js
({
  hasHybridStorage:    !!window.Digit?.HybridStorage,
  hasLocaleStore:      !!window.Digit?.LocaleStore,
  cleanupRan:          !!localStorage.getItem('Digit.HybridStorage.cleanedLegacy'),
  cleanupRanAt:        localStorage.getItem('Digit.HybridStorage.cleanedLegacy')
                        ? new Date(+localStorage.getItem('Digit.HybridStorage.cleanedLegacy')).toISOString()
                        : null,
  mdmsCallsGetSync:    window.Digit?.MDMSService?.getDataByCriteria?.toString().includes('getSync'),
})
```

### Inspect L1 status
```js
(() => {
  const ls = localStorage;
  const cap = 1.5 * 1024 * 1024;
  let bytes = 0, keys = 0;
  for (let i = 0; i < ls.length; i++) {
    const k = ls.key(i);
    if (k?.startsWith('Digit.L1.')) { keys++; bytes += (k.length + (ls.getItem(k)?.length || 0)) * 2; }
  }
  return {
    capKB: cap / 1024,
    usedKB: +(bytes / 1024).toFixed(1),
    usedPercent: +((bytes / cap) * 100).toFixed(1) + '%',
    keyCount: keys,
    remainingKB: +((cap - bytes) / 1024).toFixed(1),
  };
})();
```

### Force-trigger a locale fetch to verify write path
```js
(async () => {
  const before = Object.keys(localStorage).filter(k => k.startsWith('Digit.L1.Locale.')).length;
  await window.Digit?.LocalizationService?.getLocale({
    modules: ['diagnostic-' + Date.now()],
    locale: 'en_IN',
    tenantId: window.Digit?.ULBService?.getStateId?.() || 'pb',
  }).catch(() => {});
  const after = Object.keys(localStorage).filter(k => k.startsWith('Digit.L1.Locale.')).length;
  console.log(`Delta in Digit.L1.Locale.* keys: +${after - before}`);
})();
```

---

## Troubleshooting

### "I still see `Digit.Locale.*` keys after deploy"
- Run the verification script. If `cleanupRan: true` but the keys are
  still there, the keys were created **after** the cleanup ran. Either:
  - The user has another app or older deploy writing to localStorage
  - A nested copy of `digit-ui-libraries` inside `digit-ui-components`
    is registering its own LocalizationService (see *Known cosmetic items*)
- Manual fix: `Object.keys(localStorage).filter(k => k.startsWith('Digit.Locale.')).forEach(k => localStorage.removeItem(k))`

### "localStorage looks too big still"
- Run the snapshot script. If usage is dominated by `Digit.L1.*` keys
  (NEW format), this is the **hot working set** — it's bounded at 1.5 MB
  and serves your synchronous first-paint reads. Working as designed.
- If you want to be more aggressive about localStorage footprint, lower
  the L1 cap: `Digit.HybridStorage.configure({ hotCapBytes: 500 * 1024 })`.

### "How do I roll back?"
- The migration is a 6-commit branch with no feature flag. Revert the
  branch via `git revert <merge-commit>` or `git reset --hard` to before
  the merge. Each phase is also independently revertible. After rollback,
  users will see the legacy `Digit.Locale.*` shape come back on their next
  cache fetch.

---

## Known cosmetic items

- **`window.Digit.PersistantStorage` is still observable at runtime.** The
  `digit-ui-components` npm package bundles a nested older copy of
  `digit-ui-libraries` which registers `PersistantStorage` on boot. Our
  workspace no longer uses it; the global is exposed only because of this
  nested copy. Will self-resolve when `digit-ui-components` is republished
  against a newer `digit-ui-libraries`. No functional impact.

---

## Monitoring recommendations

After rollout these metrics should drop to zero (or near zero):
- `QuotaExceededError` reports in error monitoring (Sentry / Datadog)
- Frontend errors mentioning `localStorage.setItem`
- Repeated cache-miss 5xx behavior on `/localization/_search`

---

## Commits

On branch `feat/locale-store-migration`:

1. `773302fb4c` — Scaffold HybridStorage + LocaleStore (no behavior change)
2. `e39a3627e7` — Sync libraries source to upstream npm 1.9.6 baseline
3. `4b5d9b4fb0` — Migrate Localization to HybridStorage + cleanup legacy
4. `609584873b` — Migrate MDMS to HybridStorage
5. `fe220694af` — Migrate ApiCacheService to HybridStorage
6. `0c135a3c55` — Remove unused PersistantStorage from workspace exports

---

## Future work (not in scope of this migration)

- **Phase 6 — BroadcastChannel multi-tab coherence.** When user switches
  language in tab A, tab B updates instantly without re-fetching. Small
  addition (~15 LOC); deferred until multi-tab use becomes a measurable
  concern.
- **Service Worker + Cache API.** Could replace HybridStorage entirely
  for an even cleaner architecture (browser handles eviction, works
  offline). Bigger lift; revisit if a PWA story emerges.
- **Hot/cold MDMS classification.** Currently all MDMS writes go to both
  L1 and L2. For modules accessed once and rarely again, `setAsync`
  (L2-only) would keep L1 leaner.
