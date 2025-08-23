import apiClient from './api/client';
import { ApiUrls } from './api/urls';

/**
 * Enhanced MDMS Service for fetching master data with centralized caching and module tracking
 */
class MdmsService {
  constructor() {
    this.cache = new Map();
    this.moduleCache = new Map();
    this.loadedModules = new Set();
    this.coreData = new Map();
    this.moduleData = new Map();
  }

  /**
   * Get initialization data including languages and state info
   */
  async getInitData(stateCode) {
    const requestBody = {
      MdmsCriteria: {
        tenantId: stateCode,
        moduleDetails: [
          {
            moduleName: "common-masters",
            masterDetails: [
              { name: "Department" },
              { name: "Designation" }, 
              { name: "StateInfo" },
              { name: "wfSlaConfig" },
              { name: "uiHomePage" }
            ],
          },
          {
            moduleName: "tenant",
            masterDetails: [
              { name: "tenants" },
              { name: "citymodule" },
              { name: "cities" }
            ],
          },
          {
            moduleName: "DIGIT-UI",
            masterDetails: [
              { name: "ApiCachingSettings" }
            ],
          },
        ],
      },
    };

    try {
      const response = await apiClient.post(ApiUrls.MDMS, requestBody);
      return this.processInitData(response.data);
    } catch (error) {
      console.error('Error fetching MDMS init data:', error);
      throw error;
    }
  }

  processInitData(data) {
    const { MdmsRes } = data;
    const stateInfo = MdmsRes["common-masters"]?.StateInfo?.[0] || {};
    const uiHomePage = MdmsRes["common-masters"]?.uiHomePage?.[0] || {};

    // Process languages
    const languages = stateInfo.hasLocalisation 
      ? stateInfo.languages?.map(lang => ({
          label: lang.label || lang,
          value: lang.value || lang
        })) || []
      : [{ label: "ENGLISH", value: "en_IN" }];

    // Process state information  
    const processedStateInfo = {
      code: stateInfo.code,
      name: stateInfo.name,
      logoUrl: stateInfo.logoUrl,
      statelogo: stateInfo.statelogo,
      logoUrlWhite: stateInfo.logoUrlWhite,
      bannerUrl: stateInfo.bannerUrl,
    };

    // Process tenants
    const tenants = MdmsRes?.tenant?.tenants?.map((tenant) => ({
      i18nKey: `TENANT_TENANTS_${tenant.code.replace(".", "_").toUpperCase()}`,
      ...tenant,
    })) || [];

    // Process modules
    const modules = MdmsRes?.tenant?.citymodule
      ?.filter((module) => module?.active)
      ?.sort((x, y) => x?.order - y?.order) || [];

    return {
      languages,
      stateInfo: processedStateInfo,
      localizationModules: stateInfo.localizationModules,
      modules,
      tenants,
      uiHomePage,
    };
  }

  /**
   * Generic MDMS search
   */
  async search(tenantId, moduleDetails) {
    const requestBody = {
      MdmsCriteria: {
        tenantId,
        moduleDetails,
      },
    };

    try {
      const response = await apiClient.post(ApiUrls.MDMS, requestBody);
      return response.data;
    } catch (error) {
      console.error('Error in MDMS search:', error);
      throw error;
    }
  }

  /**
   * Search specific master data
   */
  async getMasterData(tenantId, moduleName, masterName, filter = null) {
    const moduleDetails = [{
      moduleName,
      masterDetails: [{
        name: masterName,
        ...(filter && { filter })
      }]
    }];

    const result = await this.search(tenantId, moduleDetails);
    return result.MdmsRes?.[moduleName]?.[masterName] || [];
  }

  /**
   * Get multiple master data types
   */
  async getMultipleMasterData(tenantId, moduleName, masterNames) {
    const moduleDetails = [{
      moduleName,
      masterDetails: masterNames.map(name => ({ name }))
    }];

    const result = await this.search(tenantId, moduleDetails);
    return result.MdmsRes?.[moduleName] || {};
  }

  /**
   * Common master data getters
   */
  async getDepartments(tenantId) {
    return this.getMasterData(tenantId, "common-masters", "Department", "[?(@.active == true)]");
  }

  async getDesignations(tenantId) {
    return this.getMasterData(tenantId, "common-masters", "Designation", "[?(@.active == true)]");
  }

  async getTenants(tenantId) {
    return this.getMasterData(tenantId, "tenant", "tenants");
  }

  async getCityModules(tenantId) {
    return this.getMasterData(tenantId, "tenant", "citymodule");
  }

  async getStateInfo(tenantId) {
    const data = await this.getMasterData(tenantId, "common-masters", "StateInfo");
    return data[0] || {};
  }

  /**
   * Get default master names for common DIGIT modules
   */
  getDefaultMastersForModule(moduleName) {
    const moduleDefaults = {
      'common-masters': ['Department', 'Designation', 'StateInfo', 'uiHomePage'],
      'tenant': ['tenants', 'citymodule'],
      'egov-location': ['boundary-data', 'TenantBoundary', 'cityhierarchy'],
      'ACCESSCONTROL-ROLES': ['roles'],
      'ACCESSCONTROL-ACTIONS-TEST': ['actions-test'],
      'workflow': ['BusinessService', 'ProcessInstances'],
      'BillingService': ['BusinessService', 'TaxHeadMaster', 'TaxPeriod'],
      'pgr-services': ['ServiceDefs'],
      'tl-services': ['TradeType', 'LicenseType', 'ApplicationType'],
      'pt-services': ['PropertyType', 'OwnerType', 'PropertyUsage', 'ConstructionType'],
      'ws-services': ['ConnectionCategory', 'WaterSource', 'PipeSize'],
      'sw-services': ['ConnectionCategory', 'SewerageSource', 'PipeSize'],
      'egov-hrms': ['Designation', 'Department', 'Grade'],
      'fsm': ['FSTPPlantInfo', 'ApplicationChannel', 'Config'],
      'noc-services': ['Documents', 'NOCType'],
      'bpa-services': ['CheckList', 'DocTypeMapping', 'RiskTypeComputation'],
      'egov-idgen': ['IdFormat'],
      'billing-service': ['BusinessService', 'TaxHeadMaster'],
      'collection-services': ['BusinessDetails']
    };

    return moduleDefaults[moduleName] || [];
  }

  // ==================== Enhanced Methods for Hook Support ====================

  /**
   * Parse schema codes like "ACCESSCONTROL-ROLES.roles" into module details
   */
  parseSchemas(schemas) {
    const moduleMap = new Map();
    
    schemas.forEach(schema => {
      if (typeof schema === 'string' && schema.includes('.')) {
        const [moduleName, masterName] = schema.split('.');
        if (!moduleMap.has(moduleName)) {
          moduleMap.set(moduleName, []);
        }
        moduleMap.get(moduleName).push({ name: masterName });
      } else if (typeof schema === 'object') {
        // Handle object format: { module: 'ACCESSCONTROL-ROLES', master: 'roles', filter: '...' }
        const { module, master, filter } = schema;
        if (!moduleMap.has(module)) {
          moduleMap.set(module, []);
        }
        const masterDetail = { name: master };
        if (filter) {
          masterDetail.filter = filter;
        }
        moduleMap.get(module).push(masterDetail);
      } else if (typeof schema === 'string') {
        // Handle simple module name (load all masters)
        if (!moduleMap.has(schema)) {
          moduleMap.set(schema, []);
        }
      }
    });

    return Array.from(moduleMap.entries()).map(([moduleName, masterDetails]) => ({
      moduleName,
      masterDetails
    }));
  }

  /**
   * Enhanced search method with schema support and better error handling
   */
  async search({ tenantId, modules = [], schemas = [], filter = null }) {
    // Support both old modules array and new schemas array
    const allSchemas = [...modules, ...schemas];
    const cacheKey = `${tenantId}_${allSchemas.sort().join(',')}_${JSON.stringify(filter)}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let moduleDetails = [];

    // Parse schemas if provided
    if (schemas.length > 0) {
      moduleDetails = this.parseSchemas(schemas);
    }

    // Handle legacy modules array
    if (modules.length > 0) {
      const legacyModuleDetails = modules.map(module => {
        const moduleDetail = { moduleName: module };
        
        // Add filter if provided
        if (filter && filter[module]) {
          moduleDetail.masterDetails = Object.entries(filter[module]).map(([name, filterExpr]) => ({
            name,
            filter: filterExpr
          }));
        } else {
          // For legacy modules without specific masters, provide default masters
          // based on common DIGIT module patterns
          const defaultMasters = this.getDefaultMastersForModule(module);
          if (defaultMasters.length > 0) {
            moduleDetail.masterDetails = defaultMasters.map(name => ({ name }));
          } else {
            // If no default masters known, try some common ones
            moduleDetail.masterDetails = [
              { name: module.split('-').pop() }, // e.g., 'egov-location' -> 'location'
              { name: 'masters' },
              { name: 'config' }
            ];
          }
        }
        
        return moduleDetail;
      });
      
      moduleDetails = [...moduleDetails, ...legacyModuleDetails];
    }

    const requestBody = {
      MdmsCriteria: {
        tenantId,
        moduleDetails
      }
    };

    try {
      console.log('🔄 MDMS Request:', JSON.stringify(requestBody, null, 2));
      
      const response = await apiClient.post(ApiUrls.MDMS, requestBody);
      const result = response.data?.MdmsRes || {};
      
      // Cache the result
      this.cache.set(cacheKey, result);
      
      console.log('✅ MDMS Response keys:', Object.keys(result));
      return result;
    } catch (error) {
      console.error('Error in enhanced MDMS search:', error);
      throw error;
    }
  }

  /**
   * Set core data for quick access
   */
  setCoreData(stateCode, data) {
    this.coreData.set(stateCode, data);
    console.log(`📦 Core MDMS data cached for: ${stateCode}`);
  }

  /**
   * Get core data
   */
  getCoreData(stateCode) {
    return this.coreData.get(stateCode) || null;
  }

  /**
   * Set module-specific data
   */
  setModuleData(moduleName, stateCode, data) {
    const key = `${moduleName}_${stateCode}`;
    this.moduleData.set(key, data);
    console.log(`📦 Module MDMS data cached for: ${moduleName} (${stateCode})`);
  }

  /**
   * Get module-specific data
   */
  getModuleData(moduleName, stateCode) {
    const key = `${moduleName}_${stateCode}`;
    return this.moduleData.get(key) || null;
  }

  /**
   * Clear module data
   */
  clearModuleData(moduleName, stateCode) {
    const key = `${moduleName}_${stateCode}`;
    this.moduleData.delete(key);
    
    // Also clear related loaded module entries
    const moduleKeys = Array.from(this.loadedModules).filter(loadedKey => 
      loadedKey.startsWith(`${moduleName}_`) && loadedKey.includes(stateCode)
    );
    moduleKeys.forEach(moduleKey => this.loadedModules.delete(moduleKey));
    
    console.log(`🗑️ Module MDMS data cleared for: ${moduleName} (${stateCode})`);
  }

  /**
   * Mark modules as loaded
   */
  markModuleLoaded(moduleName, stateCode, modules) {
    modules.forEach(module => {
      const key = `${moduleName}_${module}_${stateCode}`;
      this.loadedModules.add(key);
    });
    console.log(`✅ Marked modules as loaded for ${moduleName}:`, modules);
  }

  /**
   * Check if a module is loaded
   */
  isModuleLoaded(moduleName, stateCode) {
    const pattern = `${moduleName}_${stateCode}`;
    return Array.from(this.loadedModules).some(key => key.includes(pattern));
  }

  /**
   * Get all loaded modules
   */
  getLoadedModules() {
    return Array.from(this.loadedModules);
  }

  /**
   * Get specific master data with fallback support
   */
  getMasterWithFallback(data, moduleName, masterName, fallback = null) {
    if (!data) return fallback;
    
    // Try direct access first
    if (data[moduleName]?.[masterName]) {
      return data[moduleName][masterName];
    }
    
    // Try case-insensitive search
    const moduleKey = Object.keys(data).find(key => 
      key.toLowerCase() === moduleName.toLowerCase()
    );
    
    if (moduleKey && data[moduleKey]) {
      const masterKey = Object.keys(data[moduleKey]).find(key => 
        key.toLowerCase() === masterName.toLowerCase()
      );
      
      if (masterKey) {
        return data[moduleKey][masterKey];
      }
    }
    
    return fallback;
  }

  /**
   * Search within master data
   */
  searchInMasters(masters, searchCriteria = {}) {
    if (!masters || !Array.isArray(masters)) return [];

    if (Object.keys(searchCriteria).length === 0) {
      return masters;
    }

    return masters.filter(item => {
      return Object.entries(searchCriteria).every(([key, value]) => {
        if (typeof value === 'string') {
          return String(item[key]).toLowerCase().includes(value.toLowerCase());
        }
        return item[key] === value;
      });
    });
  }

  /**
   * Clear all caches
   */
  clearAllCaches() {
    this.cache.clear();
    this.moduleCache.clear();
    this.coreData.clear();
    this.moduleData.clear();
    this.loadedModules.clear();
    console.log('🗑️ All MDMS caches cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      totalCacheEntries: this.cache.size,
      moduleCacheEntries: this.moduleCache.size,
      coreDataStates: this.coreData.size,
      moduleDataEntries: this.moduleData.size,
      loadedModulesCount: this.loadedModules.size,
      loadedModules: Array.from(this.loadedModules)
    };
  }

  /**
   * Warm up cache with commonly used data
   */
  async warmupCache(stateCode, commonModules = ['common-masters', 'tenant']) {
    try {
      console.log('🔥 Warming up MDMS cache for:', stateCode);
      
      const result = await this.search({
        tenantId: stateCode,
        modules: commonModules
      });
      
      this.setCoreData(`${stateCode}_warmup`, result);
      
      console.log('✅ MDMS cache warmed up successfully');
      return result;
    } catch (error) {
      console.error('❌ Failed to warm up MDMS cache:', error);
      throw error;
    }
  }
}

export default new MdmsService();