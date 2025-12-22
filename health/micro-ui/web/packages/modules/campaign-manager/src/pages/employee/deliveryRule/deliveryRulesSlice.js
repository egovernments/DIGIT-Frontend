import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  campaignData: [],
  activeTabIndex: 0,
  activeSubTabIndex: 0,
  loading: false,
  error: null,
  initialized: false,
};

const deliveryRulesSlice = createSlice({
  name: 'deliveryRules',
  initialState,
  reducers: {
    initializeCampaignData: (state, action) => {
      const { cycles, deliveries, effectiveDeliveryConfig, savedData, attributeConfig, operatorConfig } = action.payload;

      // Always reset the state to ensure clean initialization
      state.campaignData = [];
      state.activeTabIndex = 0;
      state.activeSubTabIndex = 0;
      state.error = null;

      if (savedData && savedData.length > 0 && savedData[0]?.cycles?.length > 0) {
        // Process saved data to ensure proper structure
        state.campaignData = savedData.map((cycle, cycleIndex) => ({
          ...cycle,
          active: cycleIndex === 0,
          deliveries: cycle.deliveries?.map((delivery, deliveryIndex) => ({
            ...delivery,
            active: deliveryIndex === 0,
            deliveryRules: delivery.deliveryRules?.map(rule => ({
              ...rule,
              attributes: rule.attributes?.map(attr => ({
                ...attr,
                // Ensure attribute and operator objects have proper structure
                attribute: attr.attribute && typeof attr.attribute === 'object' ? attr.attribute :
                          attr.attribute ? { code: attr.attribute, name: attr.attribute } : null,
                operator: attr.operator && typeof attr.operator === 'object' ? attr.operator :
                         attr.operator ? { code: attr.operator, name: attr.operator } : null,
              })) || [{ key: 1, attribute: null, operator: null, value: "" }]
            })) || []
          })) || []
        }));
      } else {
        state.campaignData = generateInitialCampaignData(cycles, deliveries, effectiveDeliveryConfig, attributeConfig, operatorConfig);
      }

      state.initialized = true;
      state.loading = false;
    },
    
    resetCampaignData: (state) => {
      state.campaignData = [];
      state.activeTabIndex = 0;
      state.activeSubTabIndex = 0;
      state.initialized = false;
      state.loading = false;
      state.error = null;
    },
    
    setActiveTab: (state, action) => {
      const tabIndex = action.payload;
      state.activeTabIndex = tabIndex;
      state.campaignData.forEach((cycle, index) => {
        cycle.active = index === tabIndex;
      });
      state.activeSubTabIndex = 0;
      if (state.campaignData[tabIndex]?.deliveries) {
        state.campaignData[tabIndex].deliveries.forEach((delivery, index) => {
          delivery.active = index === 0;
        });
      }
    },
    
    setActiveSubTab: (state, action) => {
      const subTabIndex = action.payload;
      state.activeSubTabIndex = subTabIndex;
      const activeCycle = state.campaignData[state.activeTabIndex];
      if (activeCycle?.deliveries) {
        activeCycle.deliveries.forEach((delivery, index) => {
          delivery.active = index === subTabIndex;
        });
      }
    },
    
    updateDeliveryRules: (state, action) => {
      const { cycleIndex, deliveryIndex, deliveryRules } = action.payload;
      const cycle = state.campaignData[cycleIndex];
      if (cycle?.deliveries?.[deliveryIndex]) {
        cycle.deliveries[deliveryIndex].deliveryRules = deliveryRules;
      }
    },
    
    addDeliveryRule: (state, action) => {
      const { cycleIndex, deliveryIndex } = action.payload;
      const cycle = state.campaignData[cycleIndex];
      const delivery = cycle?.deliveries?.[deliveryIndex];
      
      if (delivery) {
        const newRuleKey = delivery.deliveryRules.length + 1;
        delivery.deliveryRules.push({
          ruleKey: newRuleKey,
          delivery: {},
          deliveryType: null,
          attributes: [{ key: 1, attribute: null, operator: null, value: "" }],
          products: [],
        });
      }
    },
    
    removeDeliveryRule: (state, action) => {
      const { cycleIndex, deliveryIndex, ruleKey } = action.payload;
      const cycle = state.campaignData[cycleIndex];
      const delivery = cycle?.deliveries?.[deliveryIndex];
      
      if (delivery) {
        delivery.deliveryRules = delivery.deliveryRules
          .filter(rule => rule.ruleKey !== ruleKey)
          .map((rule, index) => ({ ...rule, ruleKey: index + 1 }));
      }
    },
    
    updateAttribute: (state, action) => {
      const { cycleIndex, deliveryIndex, ruleKey, attributeKey, field, value } = action.payload;
      const rule = state.campaignData[cycleIndex]?.deliveries?.[deliveryIndex]?.deliveryRules?.find(r => r.ruleKey === ruleKey);
      const attribute = rule?.attributes?.find(attr => attr.key === attributeKey);
      
      if (attribute) {
        attribute[field] = value;
        
        // Clear values when attribute or operator changes
        if (field === 'attribute') {
          attribute.value = "";
          delete attribute.toValue;
          delete attribute.fromValue;
          attribute.operator = null;
          // Set default operator if available
          const defaultOperator = value?.allowedOperators?.[0];
          if (defaultOperator) {
            attribute.operator = { code: defaultOperator, name: defaultOperator.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, s => s.toUpperCase()) };
          }
        } else if (field === 'operator') {
          attribute.value = "";
          delete attribute.toValue;
          delete attribute.fromValue;
        }
      }
    },
    
    addAttribute: (state, action) => {
      const { cycleIndex, deliveryIndex, ruleKey } = action.payload;
      const rule = state.campaignData[cycleIndex]?.deliveries?.[deliveryIndex]?.deliveryRules?.find(r => r.ruleKey === ruleKey);
      
      if (rule) {
        const newKey = rule.attributes.length + 1;
        rule.attributes.push({
          key: newKey,
          attribute: null,
          operator: null,
          value: ""
        });
      }
    },
    
    removeAttribute: (state, action) => {
      const { cycleIndex, deliveryIndex, ruleKey, attributeKey } = action.payload;
      const rule = state.campaignData[cycleIndex]?.deliveries?.[deliveryIndex]?.deliveryRules?.find(r => r.ruleKey === ruleKey);
      
      if (rule) {
        rule.attributes = rule.attributes
          .filter(attr => attr.key !== attributeKey)
          .map((attr, index) => ({ ...attr, key: index + 1 }));
      }
    },
    
    updateProducts: (state, action) => {
      const { cycleIndex, deliveryIndex, ruleKey, products } = action.payload;
      const rule = state.campaignData[cycleIndex]?.deliveries?.[deliveryIndex]?.deliveryRules?.find(r => r.ruleKey === ruleKey);
      
      if (rule) {
        rule.products = products.map(product => ({
          ...product,
          value: product?.value?.id || product?.value,
          name: product?.value?.displayName || product?.name,
        }));
      }
    },

        // Add a new reducer for updating delivery type at delivery level
    updateDeliveryTypeForDelivery: (state, action) => {
      const { cycleIndex, deliveryIndex, deliveryType } = action.payload;
      const delivery = state.campaignData[cycleIndex]?.deliveries?.[deliveryIndex];
      
      if (delivery) {
        delivery.deliveryType = deliveryType;
      }
    },
    
    updateDeliveryType: (state, action) => {
      const { cycleIndex, deliveryIndex, ruleKey, deliveryType } = action.payload;
      const rule = state.campaignData[cycleIndex]?.deliveries?.[deliveryIndex]?.deliveryRules?.find(r => r.ruleKey === ruleKey);
      if (rule) {
        rule.deliveryType = deliveryType;
      }
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Helper function to generate initial campaign data
function generateInitialCampaignData(cycles, deliveries, effectiveDeliveryConfig, attributeConfig = [], operatorConfig = []) {
  
  return Array.from({ length: cycles }, (_, cycleIndex) => ({
    cycleIndex: (cycleIndex + 1).toString(),
    active: cycleIndex === 0,
    deliveries: Array.from({ length: deliveries }, (_, deliveryIndex) => {
      // Extract delivery strategy from the effectiveDeliveryConfig
      let deliveryStrategy = null;
      
      // Check if we have cycles data in effectiveDeliveryConfig
      if (effectiveDeliveryConfig?.cycles && Array.isArray(effectiveDeliveryConfig.cycles) && effectiveDeliveryConfig.cycles.length > 0) {
        const cycle = effectiveDeliveryConfig.cycles[cycleIndex];
        if (cycle?.deliveries && Array.isArray(cycle.deliveries)) {
          const delivery = cycle.deliveries[deliveryIndex];
          deliveryStrategy = delivery?.deliveryStrategy || "DIRECT";
        }
      }
      
      return {
        deliveryIndex: (deliveryIndex + 1).toString(),
        active: deliveryIndex === 0,
        deliveryType: deliveryStrategy || "DIRECT", // Default to "DIRECT" if not found
        deliveryRules: generateInitialDeliveryRules(effectiveDeliveryConfig, deliveryIndex, attributeConfig, operatorConfig),
      };
    }),
  }));
}

// Helper function to parse condition string like "memberCount>=1andmaxCount<=3"
function parseConditionString(conditionString) {
  if (!conditionString) return [];
  
  // Split by 'and' to get individual conditions
  const conditions = conditionString.split(/and/i);
  const parsedAttributes = [];
  
  conditions.forEach((condition, index) => {
    // Check for range conditions first (e.g., 60<=age<180)
    const rangeMatch = condition.match(/(\d+(?:\.\d+)?)\s*<=?\s*(\w+)\s*<?=?\s*(\d+(?:\.\d+)?)/);
    
    if (rangeMatch) {
      const [, fromValue, attrValue, toValue] = rangeMatch;
      
      parsedAttributes.push({
        key: index + 1,
        label: "Custom",
        attrType: attrValue,
        attrValue: attrValue,
        operatorValue: 'IN_BETWEEN',
        fromValue: parseFloat(fromValue),
        toValue: parseFloat(toValue)
      });
    } else {
      // Handle single comparisons
      const match = condition.match(/(\w+)(==|>=|<=|>|<|=)(.+)/);
      
      if (match) {
        let [, attrValue, operator, value] = match;
        value = value.trim();
        
        // Map operators
        let operatorValue = '';
        switch (operator) {
          case '==':
          case '=':
            operatorValue = 'EQUAL_TO';
            break;
          case '>=':
            operatorValue = 'GREATER_THAN_EQUAL_TO';
            break;
          case '<=':
            operatorValue = 'LESS_THAN_EQUAL_TO';
            break;
          case '>':
            operatorValue = 'GREATER_THAN';
            break;
          case '<':
            operatorValue = 'LESS_THAN';
            break;
          default:
            operatorValue = 'EQUAL_TO';
        }
        
        // Convert boolean strings to proper case for matching
        if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
          value = value.toLowerCase();
        }
        
        parsedAttributes.push({
          key: index + 1,
          label: "Custom",
          attrType: attrValue,
          attrValue: attrValue,
          operatorValue: operatorValue,
          value: value, // Keep the value as-is for dropdown matching
          fromValue: !isNaN(parseFloat(value)) ? parseFloat(value) : undefined
        });
      }
    }
  });
  
  return parsedAttributes;
}

function generateInitialDeliveryRules(effectiveDeliveryConfig, deliveryIndex, attributeConfig = [], operatorConfig = []) {
  
  // Priority 1: Check for deliveryConfig (from cycle configuration)
  if (effectiveDeliveryConfig?.deliveryConfig && Array.isArray(effectiveDeliveryConfig.deliveryConfig)) {
    const deliveryConfigArray = effectiveDeliveryConfig.deliveryConfig;
    
    if (deliveryConfigArray.length > deliveryIndex) {
      const deliveryConfig = deliveryConfigArray[deliveryIndex];
      
      if (deliveryConfig?.conditionConfig && deliveryConfig.conditionConfig.length > 0) {
        const rules = deliveryConfig.conditionConfig.map((condition, index) => {
          return {
            ruleKey: index + 1,
            delivery: {},
            // deliveryType: condition?.deliveryType || null,
            attributes: generateInitialAttributes(condition?.attributeConfig, attributeConfig, operatorConfig),
            products: condition?.productConfig || [],
          };
        });
        return rules;
      }
    }
  }
  
  // Priority 2: Check for cycles structure (from project configuration)
  if (effectiveDeliveryConfig?.cycles && Array.isArray(effectiveDeliveryConfig.cycles)) {
    
    // For now, use the first cycle (we can make this dynamic later)
    const cycle = effectiveDeliveryConfig.cycles[0];
    if (cycle?.deliveries && Array.isArray(cycle.deliveries)) {
      if (cycle.deliveries.length > deliveryIndex) {
        const delivery = cycle.deliveries[deliveryIndex];
        
        if (delivery?.doseCriteria && Array.isArray(delivery.doseCriteria)) {
          // Create one rule per doseCriteria
          const rules = delivery.doseCriteria.map((criteria, index) => {
            
            // Parse the condition string
            const parsedAttributes = parseConditionString(criteria.condition);
            
            // Map ProductVariants to our product structure
            const products = criteria.ProductVariants?.map((variant, variantIndex) => ({
              key: variantIndex + 1,
              name: variant.name,
              quantity: variant.quantity,
              value: variant.productVariantId
            })) || [];
            return {
              ruleKey: index + 1,
              delivery: {},
              deliveryType: delivery.deliveryStrategy || "DIRECT",
              attributes: generateInitialAttributes(parsedAttributes, attributeConfig, operatorConfig),
              products: products,
            };
          });
          
          return rules;
        }
      }
    }
  }
  
  // Fallback to single delivery rule if no specific config found
  return [{
    ruleKey: 1,
    delivery: {},
    deliveryType: null,
    attributes: [{ key: 1, attribute: null, operator: null, value: "" }],
    products: [],
  }];
}

function generateInitialAttributes(attributeConfigFromProject, globalAttributeConfig = [], globalOperatorConfig = []) {
  if (Array.isArray(attributeConfigFromProject) && attributeConfigFromProject.length > 0) {
    return attributeConfigFromProject.map((attr, index) => {
      // Create attribute object
      const attributeCode = attr?.attrValue;
      let attributeObj = null;
      
      if (attributeCode) {
        // Try to find in global config first
        const globalAttr = globalAttributeConfig.find(ga => ga.code === attributeCode);
        if (globalAttr) {
          attributeObj = globalAttr;
        } else {
          // Create basic structure from project config
          attributeObj = {
            code: attributeCode,
            name: attr?.label || attributeCode,
            dataType: attr?.attrType || "string",
            i18nKey: `CAMPAIGN_ATTRIBUTE_${attributeCode.toUpperCase()}`,
            allowedOperators: attr?.allowedOperators || [],
            valuesSchema: attr?.valuesSchema // Include valuesSchema if present
          };
        }
      }
      
      // Create operator object
      const operatorCode = attr?.operatorValue;
      let operatorObj = null;
      
      if (operatorCode) {
        // Try to find in global config first
        const globalOp = globalOperatorConfig.find(go => go.code === operatorCode);
        if (globalOp) {
          operatorObj = globalOp;
        } else {
          // Create basic structure
          operatorObj = {
            code: operatorCode,
            name: operatorCode.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, s => s.toUpperCase())
          };
        }
      }
      
      const baseAttr = {
        key: index + 1,
        attribute: attributeObj,
        operator: operatorObj,
      };
      
      if (attr?.operatorValue === "IN_BETWEEN") {
        return {
          ...baseAttr,
          fromValue: attr?.fromValue?.toString() || "",
          toValue: attr?.toValue?.toString() || "",
        };
      }
      
      // For dropdown values (when valuesSchema exists or value is non-numeric)
      // Store the value as a string that will be matched against dropdown options later
      const value = attr?.value?.toString() || "";
      
      return {
        ...baseAttr,
        value: value, // Keep as string, will be handled by the component
      };
    });
  }
  
  return [{ key: 1, attribute: null, operator: null, value: "" }];
}
// Selectors
export const selectCampaignData = (state) => state.deliveryRules.campaignData;
export const selectActiveTabIndex = (state) => state.deliveryRules.activeTabIndex;
export const selectActiveSubTabIndex = (state) => state.deliveryRules.activeSubTabIndex;
export const selectLoading = (state) => state.deliveryRules.loading;
export const selectError = (state) => state.deliveryRules.error;
export const selectInitialized = (state) => state.deliveryRules.initialized;

export const selectActiveCycle = createSelector(
  [selectCampaignData, selectActiveTabIndex],
  (campaignData, activeTabIndex) => campaignData[activeTabIndex]
);

export const selectActiveDelivery = createSelector(
  [selectActiveCycle, selectActiveSubTabIndex],
  (activeCycle, activeSubTabIndex) => activeCycle?.deliveries?.[activeSubTabIndex]
);

export const selectActiveDeliveryRules = createSelector(
  [selectActiveDelivery],
  (activeDelivery) => activeDelivery?.deliveryRules || []
);

export const {
  initializeCampaignData,
  resetCampaignData,
  setActiveTab,
  setActiveSubTab,
  updateDeliveryRules,
  addDeliveryRule,
  removeDeliveryRule,
  updateAttribute,
  addAttribute,
  removeAttribute,
  updateProducts,
  updateDeliveryType,
  updateDeliveryTypeForDelivery,
  setLoading,
  setError,
} = deliveryRulesSlice.actions;

export default deliveryRulesSlice.reducer;