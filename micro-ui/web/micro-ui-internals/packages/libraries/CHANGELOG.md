# Changelog

## [1.9.7]  [26-May-2026]
### Storage migration — PersistantStorage → HybridStorage
- **Eliminates QuotaExceededError cliff** by moving locale + MDMS + API cache from
  localStorage-only (5–10 MB hard cap) to a three-tier cache: in-memory Map +
  localStorage L1 (LRU-bounded at 1.5 MB) + IndexedDB L2 (GB-scale archive)
- Migrated `LocalizationService`, `MdmsService.getDataByCriteria`, and `ApiCacheService`
  to use new `HybridStorage` API (sync first-paint preserved via in-memory Map)
- Added `HybridStorage` and `LocaleStore` exports on `window.Digit`
- One-shot `cleanupLegacy()` migrator removes stale `Digit.Locale.*`,
  `Digit.MDMS.*`, and `Digit.cachingService` entries on first boot post-deploy
- localStorage usage drops 71% on average (1,752 KB → ~500 KB in test deployment)
- Synced workspace source to upstream npm 1.9.6 baseline (18 files)
- Removed unused `PersistantStorage` from workspace exports
- Removed `lz-string` dependency (no remaining importers)
- Added `localforage@^1.10.0` (for IndexedDB access)
- Added `jspdf@2.5.1` (pre-existing transitive requirement, now explicit)
- Verified live with 5 stress tests: cap enforcement, oversize overflow,
  LRU order, data integrity post-eviction, 1000-write performance
- See [STORAGE_MIGRATION.md](./STORAGE_MIGRATION.md) for full architecture
  details, diagnostic scripts, and stress test results

## [1.8.17]  [26-Jun-2025]
- Checking useCustomAPIHook with the new version 

## [1.8.16]  [20-Jun-2025]
- Checking the new version due to corrupted local


## [1.8.15]  [16-Jun-2025]
- provided download of alll data per schema & enable based on flag
- provided download of alll data per schema 'ENABLE_MDMS_BULK_DOWNLOAD'

## [1.8.14]  [10-Jun-2025]
- integrated with updated version

## [1.8.13]  [25-Apr-2025]
- Updated Custom mutation hook and usecutsomAPI hook to handle header and method in request.

## [1.8.11]  [11-Mar-2025]
- Added new function to remove localisation cache

## [1.8.10]  [21-Feb-2025]
- Publishing a new version for more stability & as part of Components Release

## [1.8.9]  [1-Feb-2025]
- FEATURE/HCMPRE-1425 : Added the workbench module patches and Updated localisation search screen, and core module #2181
- Upgraded with new Components in core, workbench screens

## [1.8.8]  [21-Jan-2025]
- Removed support for any new context path to have employee linked in the url.To use this,the new context path should be linked with employee. 

## [1.8.5]  [26-Nov-2024]
- added new field util to generate field id

## [1.8.4] [19-Nov-2024]
- Fixed the module stablity & new components integrated, sandbox enabled 

## [1.8.3]
- 

## [1.8.2-beta.7]
- Added select function support for mdms-v2 in useCustomMDMS hook

## [1.8.2-beta.1]
- Formatted changelog file.

## [1.8.1-beta.4]
- Enhanced to load screen even if mdms is failing

## [1.8.1-beta.3]
- other fixes.

## [1.8.1-beta.2]
- Enhanced `useCustomMdms` hook to support version 2 of MDMS API calls.

## [1.8.1-beta.1]
- Added the README file.

## [1.5.23]
- Base version.
