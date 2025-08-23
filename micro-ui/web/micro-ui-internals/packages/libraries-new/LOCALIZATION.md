# DIGIT UI Localization System

This document explains how to use the centralized localization system in DIGIT UI applications.

## Overview

The localization system provides:
- **Core initialization**: `useInitLocalization` for app startup
- **Module-specific loading**: `useModuleLocalization` for individual modules
- **Centralized repository**: All translations managed by `LocalizationService`
- **i18next integration**: Standard `useTranslation` hook works seamlessly

## Architecture

```
┌─────────────────────────┐
│    Core App (DigitUI)   │
│                         │
│  useInitLocalization    │ ← Loads core modules
│  - rainmaker-common     │
│  - rainmaker-core       │
│  - digit-ui             │
│  - common-masters       │
│  - tenant               │
│  - locale               │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│  LocalizationService    │  ← Centralized repository
│                         │
│  - Translation cache    │
│  - Module tracking      │
│  - i18next integration  │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│   Module Components     │
│                         │
│  useModuleLocalization  │ ← Loads module-specific translations
│  - workbench-masters    │
│  - property-tax         │
│  - trade-license        │
│  - etc.                 │
└─────────────────────────┘
```

## Usage

### 1. Core App Initialization

In your main app component (typically `App.js` or `DigitUI`):

```javascript
import React from 'react';
import { useInitLocalization } from '@egovernments/digit-ui-libraries-new';

const DigitUI = ({ stateCode, enabledModules }) => {
  const {
    isLoading: localizationLoading,
    isReady: localizationReady,
    currentLanguage,
    availableLanguages,
    changeLanguage,
    error: localizationError
  } = useInitLocalization({
    stateCode,
    coreModules: [
      'rainmaker-common',
      'rainmaker-core', 
      'digit-ui',
      'common-masters',
      'tenant',
      'locale',
      'employee',
      'citizen'
    ],
    defaultLanguage: localStorage.getItem('digit-language') || 'en_IN'
  });

  // Expose globally for legacy compatibility
  React.useEffect(() => {
    if (localizationReady && !window.Digit?.LocalizationService) {
      window.Digit = window.Digit || {};
      window.Digit.LocalizationService = {
        changeLanguage,
        getCurrentLanguage: () => currentLanguage,
        getAvailableLanguages: () => availableLanguages
      };
    }
  }, [localizationReady, currentLanguage, availableLanguages, changeLanguage]);

  if (localizationLoading) {
    return <div>Loading localization...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
};
```

### 2. Module-Specific Localization

In individual module components:

```javascript
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useModuleLocalization } from '@egovernments/digit-ui-libraries-new';

const PropertyTaxComponent = () => {
  const { t } = useTranslation();
  
  // Load module-specific translations
  const {
    isLoading: localizationLoading,
    error: localizationError,
    isLoaded: localizationLoaded
  } = useModuleLocalization({
    moduleName: 'property-tax',
    modules: [
      'rainmaker-pt',
      'property-tax',
      'pt-calculator'
    ]
  });

  // Optional: Log localization status
  React.useEffect(() => {
    if (localizationLoaded) {
      console.log('✅ Property Tax translations loaded');
    }
    if (localizationError) {
      console.warn('⚠️ Failed to load Property Tax translations:', localizationError);
    }
  }, [localizationLoaded, localizationError]);

  return (
    <div>
      <h1>{t('PT_PROPERTY_TAX_TITLE')}</h1>
      <p>{t('PT_PROPERTY_TAX_DESCRIPTION')}</p>
      
      {localizationLoading && (
        <div>Loading Property Tax translations...</div>
      )}
    </div>
  );
};
```

### 3. Advanced Usage

#### Preloading Translations

```javascript
import { usePreloadModuleLocalization } from '@egovernments/digit-ui-libraries-new';

const App = () => {
  // Preload translations for frequently used modules
  usePreloadModuleLocalization({
    moduleName: 'common-modules',
    modules: ['pgr', 'tl', 'pt', 'ws']
  });

  return <MainApp />;
};
```

#### Conditional Loading

```javascript
import { useConditionalModuleLocalization } from '@egovernments/digit-ui-libraries-new';

const TradeLicenseModule = ({ isEnabled }) => {
  const { isLoaded } = useConditionalModuleLocalization(
    isEnabled, // Only load when enabled
    {
      moduleName: 'trade-license',
      modules: ['rainmaker-tl', 'tl-services']
    }
  );

  if (!isEnabled) return null;

  return <TradeLicenseComponent />;
};
```

### 4. Language Switching

The system provides multiple ways to change language:

#### From Core App

```javascript
const LanguageSelector = () => {
  const { changeLanguage, availableLanguages, currentLanguage } = useInitLocalization();

  return (
    <select 
      value={currentLanguage} 
      onChange={(e) => changeLanguage(e.target.value)}
    >
      {availableLanguages.map(lang => (
        <option key={lang.value} value={lang.value}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};
```

#### Legacy Compatibility

```javascript
// Still works for backward compatibility
if (window.Digit?.LocalizationService?.changeLanguage) {
  window.Digit.LocalizationService.changeLanguage('hi_IN', stateCode);
}
```

## API Reference

### useInitLocalization(config)

**Parameters:**
- `stateCode` (string): State/tenant code
- `coreModules` (array): Core modules to load initially
- `defaultLanguage` (string): Default language code
- `enableDetection` (boolean): Enable browser language detection

**Returns:**
- `isLoading` (boolean): Loading state
- `isReady` (boolean): Ready state
- `currentLanguage` (string): Current language
- `availableLanguages` (array): Available languages
- `changeLanguage` (function): Language change function
- `error` (Error): Error state
- `t` (function): Translation function
- `i18n` (object): i18next instance

### useModuleLocalization(config)

**Parameters:**
- `moduleName` (string, required): Module identifier
- `modules` (array): Module codes to load
- `stateCode` (string): Override state code
- `language` (string): Override language
- `enabled` (boolean): Enable/disable loading
- `background` (boolean): Background loading

**Returns:**
- `isLoading` (boolean): Loading state
- `error` (Error): Error state
- `translations` (object): Loaded translations
- `isLoaded` (boolean): Loaded state
- `isCached` (boolean): Cache status
- `reload` (function): Reload function
- `getTranslation` (function): Get translation function

## Best Practices

### 1. Module Organization

```
modules/
├── core/
│   └── translations loaded by useInitLocalization
├── property-tax/
│   └── uses useModuleLocalization with 'property-tax'
├── trade-license/
│   └── uses useModuleLocalization with 'trade-license'
└── workbench/
    └── uses useModuleLocalization with 'workbench'
```

### 2. Translation Keys

Use consistent prefixing for translation keys:
- Core: `CORE_*`, `ES_*`, `CS_*`
- Property Tax: `PT_*`
- Trade License: `TL_*`
- Workbench: `WB_*`

### 3. Error Handling

```javascript
const { error, isLoaded } = useModuleLocalization({
  moduleName: 'my-module',
  modules: ['my-module-translations']
});

if (error) {
  console.warn('Translation loading failed, using fallbacks');
}
```

### 4. Performance

- Use `background: true` for non-critical translations
- Preload frequently used modules
- Cache translations automatically handled

## Migration from Legacy System

### Old Way
```javascript
// Legacy approach
Digit.LocalizationService.changeLanguage(language, stateCode);
const { data: store } = Digit.Services.useStore({
  stateCode,
  moduleCode,
  language,
  modulePrefix
});
```

### New Way
```javascript
// Modern approach
const { changeLanguage } = useInitLocalization({ stateCode });
const { isLoaded } = useModuleLocalization({
  moduleName: 'my-module',
  modules: ['my-module-code']
});

// Legacy compatibility maintained
window.Digit.LocalizationService.changeLanguage(language, stateCode);
```

## Troubleshooting

### Common Issues

1. **Translations not loading**: Check module names and network connectivity
2. **i18next not initialized**: Ensure `useInitLocalization` runs first
3. **Language change not working**: Verify stateCode is correct

### Debug Mode

```javascript
const { getLoadedModules } = localizationService;
console.log('Loaded modules:', getLoadedModules());
```

## Example Implementation

See the working implementation in:
- `/packages/modules/core-new/src/App.js` - Core initialization
- `/packages/modules/workbench-new/src/pages/employee/MasterSelection/index.js` - Module usage

This system ensures all modules can use the standard `t()` function from `react-i18next` while automatically loading their specific translations as needed.