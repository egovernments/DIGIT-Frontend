# Migration Findings - Trade License Module

## Common Issues & Fixes

### 1. `MultiSelectDropdown` Type Error
**Issue:** `Uncaught TypeError: e.map is not a function` in `MultiSelectDropdown`.
**Cause:** In `InboxConfig.js` (or similar form configurations), fields with `allowMultiSelect: true` (using `MultiSelectDropdown`) were initialized with `""` (empty string) in `defaultValues`. The component expects an array.
**Fix:** Initialize such fields with `[]` (empty array) in `defaultValues`.

**Example:**
*Incorrect:*
```javascript
defaultValues: {
    locality: "",
    state: ""
}
```
*Correct:*
```javascript
defaultValues: {
    locality: [],
    state: []
}
```

### 2. Circular Dependency in Hooks/Utils
**Issue:** Circular dependency between `hooks/index.js` and `utils/index.js` causing "default is not exported" or "undefined" errors.
**Fix:** 
- Avoid default exports if potential circular imports exist. Use `import * as utils` or named imports.
- Move interdependent functions (like `overrideHooks` and `setupLibraries`) to the files where they are primarily used (e.g., `hooks/index.js`) to break the cycle.
- Ensure `Digit.Hooks.[module]` keys match the case expected (`tl` vs `TL`), as registry keys are case-sensitive and must match what the application code attempts to access (e.g., `Digit.Hooks.tl.useInbox`).

### 3. Inbox Layout & Filter Position
**Issue:** The Filter component appears in the wrong position (e.g., top right instead of left sidebar) in the Inbox.
**Cause:** The `InboxSearchComposer` components (Search, Filter, Results) rely on each other for proper CSS grid/flex layout. If the `search` section is disabled (`show: false`), the remaining components (Filter) may not be positioned correctly by the layout engine.
**Fix:** Ensure the `search` section is enabled (`show: true`) in `InboxConfig.js`. Even if not needed, it ensures the grid layout structure remains intact.

**Example:**
*Incorrect:*
```javascript
search: {
    // ...
    show: false
}

### 4. Missing TLService Registration
**Issue:** `TypeError: Cannot read properties of undefined (reading 'TLsearch')` on the Homepage or when using `useInbox`.
**Cause:** The `TLService` (which handles API calls like `TLsearch`) was not defined or registered in `initTLComponents`, so `Digit.TLService` was undefined.
**Fix:** 
- Create `src/services/TLService.js` implementing the required API methods (e.g., `TLsearch` using `Digit.Request`).
- Create `src/services/index.js` to export it.
- Import and assign `Digit.TLService = TLService;` inside `initTLComponents` in `Module.js`.

**Example:**
```javascript
// Module.js
import { TLService } from "./services";

export const initTLComponents = () => {
    // ...
    Digit.TLService = TLService;
}
```

### 5. Missing Hooks (`useTenants`)
**Issue:** `Uncaught TypeError: Digit.Hooks.tl.useTenants is not a function`.
**Cause:** The `useTenants` hook was accessed via `Digit.Hooks.tl` but was not defined or registered in `hooks/index.js`.
**Fix:** 
- Create `src/hooks/useTenants.js` (basic implementation using `Digit.SessionStorage`).
- Export it in `src/hooks/index.js` and add it to the `tl` object.

### 6. Legacy `Digit.Request` Usage
**Issue:** `TypeError: Digit.Request is not a function`.
**Cause:** The global `Digit.Request` method might not be available or exposed in the same way in newer versions.
**Fix:** Import `Request` directly from `@egovernments/digit-ui-libraries` in your services.

**Example:**
```javascript
import { Request } from "@egovernments/digit-ui-libraries";

export const TLService = {
  TLsearch: async (...) => {
    return await Request({ ... });
  },
};

### 7. Missing Node.js Polyfills (`process is not defined`)
**Issue:** `Uncaught ReferenceError: process is not defined` or `global is not defined` in the browser console.
**Cause:** Newer build tools (like `react-scripts` v5 or Vite) do not polyfill Node.js globals by default, but some libraries (or legacy code) still expect them.
**Fix:** Manually define `window.process` and `window.global` in `index.html` (or `entry` file).

**Example in `index.html`:**
```html
<script>
  window.global = window;
  window.process = { env: { NODE_ENV: "development" } };
</script>
```
