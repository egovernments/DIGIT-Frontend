// Import and re-export services
import mdmsService from './services/mdms';
import localizationService from './services/localization';
import userService from './services/user';
import apiClient from './services/api/client';
import { ApiUrls } from './services/api/urls';
export { default as mdmsService } from './services/mdms';
export { default as localizationService } from './services/localization';
export { default as userService } from './services/user';
export { default as apiClient } from './services/api/client';
export { ApiUrls } from './services/api/urls';

// Import and re-export hooks
import { useStore, useGetInitData } from './hooks/useStore';
import { 
  useMdmsSearch, 
  useMasterData, 
  useMultipleMasterData,
  useDepartments,
  useDesignations,
  useTenants,
  useCityModules,
  useStateInfo 
} from './hooks/useMdms';
import { useLocalization, usePreloadTranslations } from './hooks/useLocalization';
import useCommonMDMS from './hooks/useCommonMDMS';
import useInitLocalization from './hooks/useInitLocalization';
import useModuleLocalization, { usePreloadModuleLocalization, useConditionalModuleLocalization } from './hooks/useModuleLocalization';
import useInitMDMS from './hooks/useInitMDMS';
import useModuleMDMS, { usePreloadModuleMDMS, useConditionalModuleMDMS } from './hooks/useModuleMDMS';
import useCustomMDMS, { useMasterData as useCustomMasterData, useMultipleMasters } from './hooks/useCustomMDMS';

export { useStore, useGetInitData, default as useStoreDefault } from './hooks/useStore';
export { 
  useMdmsSearch, 
  useMasterData, 
  useMultipleMasterData,
  useDepartments,
  useDesignations,
  useTenants,
  useCityModules,
  useStateInfo 
} from './hooks/useMdms';
export { useLocalization, usePreloadTranslations } from './hooks/useLocalization';
export { default as useCommonMDMS } from './hooks/useCommonMDMS';
export { default as useInitLocalization } from './hooks/useInitLocalization';
export { default as useModuleLocalization, usePreloadModuleLocalization, useConditionalModuleLocalization } from './hooks/useModuleLocalization';
export { default as useInitMDMS } from './hooks/useInitMDMS';
export { default as useModuleMDMS, usePreloadModuleMDMS, useConditionalModuleMDMS } from './hooks/useModuleMDMS';
export { default as useCustomMDMS, useMasterData as useCustomMasterData, useMultipleMasters } from './hooks/useCustomMDMS';

// Import and re-export utils
import {
  getDefaultLanguage,
  getMultiRootTenant,
  stringReplaceAll,
  Storage,
  PersistentStorage,
  SessionStorage,
  formatDate,
  formatCurrency,
  isValidEmail,
  isValidPhone,
  debounce,
  deepClone,
  getGlobalConfig
} from './utils/common';
import {
  getConfigModuleName,
  getCurrentLanguage,
  setCurrentLanguage,
  getStateLevelTenant
} from './utils';

export {
  getDefaultLanguage,
  getMultiRootTenant,
  stringReplaceAll,
  Storage,
  PersistentStorage,
  SessionStorage,
  formatDate,
  formatCurrency,
  isValidEmail,
  isValidPhone,
  debounce,
  deepClone,
  getGlobalConfig
} from './utils/common';
export {
  getConfigModuleName,
  getCurrentLanguage,
  setCurrentLanguage,
  getStateLevelTenant
} from './utils';

// Create namespace-like export for backward compatibility
const Hooks = {
  useStore,
  useMdmsSearch,
  useMasterData,
  useMultipleMasterData,
  useDepartments,
  useDesignations,
  useTenants,
  useCityModules,
  useStateInfo,
  useLocalization,
  usePreloadTranslations,
  useCommonMDMS,
  useInitLocalization,
  useModuleLocalization,
  usePreloadModuleLocalization,
  useConditionalModuleLocalization,
  useInitMDMS,
  useModuleMDMS,
  usePreloadModuleMDMS,
  useConditionalModuleMDMS,
  useCustomMDMS,
  useCustomMasterData,
  useMultipleMasters
};

const Services = {
  mdms: mdmsService,
  localization: localizationService,
  user: userService,
  api: apiClient
};

const Utils = {
  getDefaultLanguage,
  getMultiRootTenant,
  stringReplaceAll,
  Storage,
  PersistentStorage,
  SessionStorage,
  formatDate,
  formatCurrency,
  isValidEmail,
  isValidPhone,
  debounce,
  deepClone,
  getGlobalConfig,
  getConfigModuleName,
  getCurrentLanguage,
  setCurrentLanguage,
  getStateLevelTenant
};

export { Hooks, Services, Utils };

// Default export
export default {
  Hooks,
  Services,
  Utils,
  ApiUrls
};