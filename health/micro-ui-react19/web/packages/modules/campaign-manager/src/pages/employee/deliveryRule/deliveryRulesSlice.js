import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  campaignData: [],
  campaignId: null,
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
      const { cycles, deliveries, effectiveDeliveryConfig, savedData, attributeConfig, operatorConfig, campaignId, deliveryMethods } = action.payload;

      // Always reset the state to ensure clean initialization
      state.campaignData = [];
      state.campaignId = campaignId || null;
      state.activeTabIndex = 0;
      state.activeSubTabIndex = 0;
      state.error = null;

      // Whether a code may be applied to a saved delivery by position. Rules saved before delivery
      // strategies existed carry no code of their own; when the number of saved deliveries matches
      // the number of chosen strategies they were authored in the same order, so position is a
      // safe mapping. When the counts differ the mapping is unknown, so they are left alone and
      // rebuilt from the chosen strategies instead. A delivery that already carries a code keeps
      // it either way.
      const stampMethods =
        Array.isArray(deliveryMethods) && deliveryMethods.length > 0 && savedData?.[0]?.deliveries?.length === deliveryMethods.length;

      if (savedData && savedData.length > 0 && savedData[0]?.deliveries?.length > 0) {
        // Process saved data to ensure proper structure
        state.campaignData = savedData.map((cycle, cycleIndex) => ({
          ...cycle,
          active: cycleIndex === 0,
          deliveries: cycle.deliveries?.map((delivery, deliveryIndex) => {
            // A delivery already carrying a code keeps it; a code is applied by position only when
            // stampMethods allows it.
            const methodCode = delivery.deliveryMethod || (stampMethods ? deliveryMethods[deliveryIndex] : undefined);

            return {
              ...delivery,
              active: deliveryIndex === 0,
              // A strategy delivery is always DIRECT - see syncDeliveryMethods for why. Forcing it
              // here also corrects a campaign saved before that was enforced, the next time it is
              // opened and saved.
              ...(methodCode ? { deliveryMethod: methodCode, deliveryType: "DIRECT" } : {}),
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
            };
          }) || []
        }));
      } else {
        state.campaignData = generateInitialCampaignData(cycles, deliveries, effectiveDeliveryConfig, attributeConfig, operatorConfig, deliveryMethods);
      }

      state.initialized = true;
      state.loading = false;
    },
    
    resetCampaignData: (state) => {
      state.campaignData = [];
      state.campaignId = null;
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

    syncCycles: (state, action) => {
      const { newCycleCount, effectiveDeliveryConfig, attributeConfig, operatorConfig } = action.payload;
      const currentCycleCount = state.campaignData.length;
      const observationStrategy = effectiveDeliveryConfig?.observationStrategy || "DOT1";

      if (newCycleCount > currentCycleCount) {
        // Add new cycles
        const deliveriesCount = state.campaignData[0]?.deliveries?.length || 1;
        for (let i = currentCycleCount; i < newCycleCount; i++) {
          state.campaignData.push({
            cycleIndex: (i + 1).toString(),
            active: false,
            deliveries: Array.from({ length: deliveriesCount }, (_, deliveryIndex) => {
              let deliveryStrategy = null;

              if (effectiveDeliveryConfig?.cycles && Array.isArray(effectiveDeliveryConfig.cycles) && effectiveDeliveryConfig.cycles.length > 0) {
                const cycle = effectiveDeliveryConfig.cycles[i];
                if (cycle?.deliveries && Array.isArray(cycle.deliveries)) {
                  const delivery = cycle.deliveries[deliveryIndex];
                  deliveryStrategy = delivery?.deliveryStrategy;
                }
              }

              // If no delivery strategy from config, use observation strategy to determine
              if (!deliveryStrategy) {
                deliveryStrategy = getDeliveryTypeByStrategy(observationStrategy, deliveryIndex);
              }

              return {
                deliveryIndex: (deliveryIndex + 1).toString(),
                active: deliveryIndex === 0,
                deliveryType: deliveryStrategy,
                deliveryRules: generateInitialDeliveryRules(effectiveDeliveryConfig, deliveryIndex, attributeConfig, operatorConfig),
              };
            }),
          });
        }
      } else if (newCycleCount < currentCycleCount) {
        // Remove cycles from the end
        state.campaignData = state.campaignData.slice(0, newCycleCount);

        // Ensure active tab is still valid
        if (state.activeTabIndex >= newCycleCount) {
          state.activeTabIndex = newCycleCount - 1;
          state.campaignData.forEach((cycle, index) => {
            cycle.active = index === state.activeTabIndex;
          });
        }
      }
    },

    syncDeliveries: (state, action) => {
      const { newDeliveryCount, effectiveDeliveryConfig, attributeConfig, operatorConfig } = action.payload;
      const observationStrategy = effectiveDeliveryConfig?.observationStrategy || "DOT1";

      state.campaignData.forEach((cycle, cycleIndex) => {
        const currentDeliveryCount = cycle.deliveries?.length || 0;

        if (newDeliveryCount > currentDeliveryCount) {
          // Add new deliveries
          for (let i = currentDeliveryCount; i < newDeliveryCount; i++) {
            let deliveryStrategy = null;

            if (effectiveDeliveryConfig?.cycles && Array.isArray(effectiveDeliveryConfig.cycles) && effectiveDeliveryConfig.cycles.length > 0) {
              const configCycle = effectiveDeliveryConfig.cycles[cycleIndex];
              if (configCycle?.deliveries && Array.isArray(configCycle.deliveries)) {
                const delivery = configCycle.deliveries[i];
                deliveryStrategy = delivery?.deliveryStrategy;
              }
            }

            // If no delivery strategy from config, use observation strategy to determine
            if (!deliveryStrategy) {
              deliveryStrategy = getDeliveryTypeByStrategy(observationStrategy, i);
            }

            cycle.deliveries.push({
              deliveryIndex: (i + 1).toString(),
              active: false,
              deliveryType: deliveryStrategy,
              deliveryRules: generateInitialDeliveryRules(effectiveDeliveryConfig, i, attributeConfig, operatorConfig),
            });
          }
        } else if (newDeliveryCount < currentDeliveryCount) {
          // Remove deliveries from the end
          cycle.deliveries = cycle.deliveries.slice(0, newDeliveryCount);

          // Ensure active sub-tab is still valid for the active cycle
          if (cycle.active && state.activeSubTabIndex >= newDeliveryCount) {
            state.activeSubTabIndex = newDeliveryCount - 1;
            cycle.deliveries.forEach((delivery, index) => {
              delivery.active = index === state.activeSubTabIndex;
            });
          }
        }
      });
    },

    // Rebuild the deliveries from the chosen delivery strategies.
    //
    // Deliveries are matched by strategy code, never by position. The user can select any subset
    // of the strategies on offer, so adding or removing by count alone would move one strategy's
    // configured rules onto another.
    syncDeliveryMethods: (state, action) => {
      const { deliveryMethods, effectiveDeliveryConfig, attributeConfig, operatorConfig } = action.payload;
      if (!Array.isArray(deliveryMethods)) return;

      state.campaignData.forEach((cycle) => {
        const existing = cycle.deliveries || [];
        cycle.deliveries = deliveryMethods.map((code, index) => {
          const kept = existing.find((d) => d?.deliveryMethod === code);
          if (kept) {
            return { ...kept, deliveryIndex: (index + 1).toString(), active: index === 0 };
          }
          return {
            deliveryIndex: (index + 1).toString(),
            active: index === 0,
            deliveryMethod: code,
            // Always DIRECT. The DIRECT / INDIRECT value is the observation strategy, which
            // describes a position within a sequence of deliveries. Here the position identifies
            // a delivery strategy instead, so that sequence does not exist and DIRECT applies to
            // every one of them.
            deliveryType: "DIRECT",
            deliveryRules: generateInitialDeliveryRules(effectiveDeliveryConfig, index, attributeConfig, operatorConfig, code),
          };
        });
      });

      if (state.activeSubTabIndex >= deliveryMethods.length) {
        state.activeSubTabIndex = Math.max(0, deliveryMethods.length - 1);
      }
      state.campaignData.forEach((cycle) => {
        cycle.deliveries?.forEach((delivery, index) => {
          delivery.active = index === state.activeSubTabIndex;
        });
      });
    },

    updateObservationStrategy: (state, action) => {
      const { observationStrategy } = action.payload;


      // Update delivery types for all deliveries in all cycles based on new observation strategy
      state.campaignData = state.campaignData.map((cycle, cycleIdx) => ({
        ...cycle,
        deliveries: cycle.deliveries?.map((delivery, deliveryIndex) => {
          // A delivery that carries a strategy code is left alone. The observation strategy derives
          // its value from the delivery's position in a sequence of doses; when the position
          // identifies a delivery strategy instead there is no sequence, and every one of them is
          // DIRECT. Enforced here rather than only at the call sites so the value cannot be
          // overwritten by whatever order the effects happen to run in.
          if (delivery?.deliveryMethod) return delivery;

          const newDeliveryType = getDeliveryTypeByStrategy(observationStrategy, deliveryIndex);
          return {
            ...delivery,
            deliveryType: newDeliveryType,
          };
        }),
      }));

    },
  },
});

// Helper function to determine delivery type based on observation strategy
function getDeliveryTypeByStrategy(observationStrategy, deliveryIndex) {
  const isDOT1 = observationStrategy === "DOT1";
  const isFirstDelivery = deliveryIndex === 0;

  if (isDOT1) {
    // DOT1: First delivery = DIRECT, rest = INDIRECT
    return isFirstDelivery ? "DIRECT" : "INDIRECT";
  } else {
    // DOTN or any other: All deliveries = DIRECT
    return "DIRECT";
  }
}

// Helper function to generate initial campaign data
function generateInitialCampaignData(cycles, deliveries, effectiveDeliveryConfig, attributeConfig = [], operatorConfig = [], deliveryMethods = null) {
  const observationStrategy = effectiveDeliveryConfig?.observationStrategy || "DOT1";

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
          deliveryStrategy = delivery?.deliveryStrategy;
        }
      }

      // If no delivery strategy from config, use observation strategy to determine
      if (!deliveryStrategy) {
        deliveryStrategy = getDeliveryTypeByStrategy(observationStrategy, deliveryIndex);
      }

      // When strategies are in use a delivery represents one strategy rather than one step in a
      // sequence, so it carries the strategy code and is always DIRECT.
      const methodCode = Array.isArray(deliveryMethods) ? deliveryMethods[deliveryIndex] : null;

      return {
        deliveryIndex: (deliveryIndex + 1).toString(),
        active: deliveryIndex === 0,
        ...(methodCode ? { deliveryMethod: methodCode } : {}),
        deliveryType: methodCode ? "DIRECT" : deliveryStrategy,
        deliveryRules: generateInitialDeliveryRules(effectiveDeliveryConfig, deliveryIndex, attributeConfig, operatorConfig, methodCode),
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
  const processedIndices = new Set();

  for (let i = 0; i < conditions.length; i++) {
    if (processedIndices.has(i)) continue;
    const condition = conditions[i].trim();
    if (!condition) continue;

    // Check for single-expression range: "60<=age<=180" or "60<=age<180"
    const rangeMatch = condition.match(/(\d+(?:\.\d+)?)\s*<=?\s*(\w+)\s*<?=?\s*(\d+(?:\.\d+)?)/);

    if (rangeMatch) {
      const [, fromValue, attrValue, toValue] = rangeMatch;

      parsedAttributes.push({
        key: parsedAttributes.length + 1,
        label: "Custom",
        attrType: attrValue,
        attrValue: attrValue,
        operatorValue: 'IN_BETWEEN',
        fromValue: parseFloat(fromValue),
        toValue: parseFloat(toValue)
      });
      continue;
    }

    // Check consecutive pair IN_BETWEEN: "3<=age" + "age<=11"
    if (i + 1 < conditions.length) {
      const nextCondition = conditions[i + 1].trim();
      const lowerMatch = condition.match(/^(\d+(?:\.\d+)?)\s*(<=|<)\s*(.+)$/);
      const upperMatch = nextCondition.match(/^(.+?)\s*(<=|<)\s*(\d+(?:\.\d+)?)$/);

      if (lowerMatch && upperMatch && lowerMatch[3].trim().toLowerCase() === upperMatch[1].trim().toLowerCase()) {
        const attrValue = lowerMatch[3].trim();
        parsedAttributes.push({
          key: parsedAttributes.length + 1,
          label: "Custom",
          attrType: attrValue,
          attrValue: attrValue,
          operatorValue: 'IN_BETWEEN',
          fromValue: parseFloat(lowerMatch[1]),
          toValue: parseFloat(upperMatch[3])
        });
        processedIndices.add(i + 1);
        continue;
      }
    }

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
        key: parsedAttributes.length + 1,
        label: "Custom",
        attrType: attrValue,
        attrValue: attrValue,
        operatorValue: operatorValue,
        value: value, // Keep the value as-is for dropdown matching
        fromValue: !isNaN(parseFloat(value)) ? parseFloat(value) : undefined
      });
    }
  }

  return parsedAttributes;
}

function generateInitialDeliveryRules(effectiveDeliveryConfig, deliveryIndex, attributeConfig = [], operatorConfig = [], methodCode = null) {
  
  // Priority 1: Check for deliveryConfig (from cycle configuration)
  if (effectiveDeliveryConfig?.deliveryConfig && Array.isArray(effectiveDeliveryConfig.deliveryConfig)) {
    const deliveryConfigArray = effectiveDeliveryConfig.deliveryConfig;

    // Every strategy starts from the same default conditions and resources, because a strategy
    // changes where delivery happens rather than what is delivered. A campaign type that needs
    // one strategy to start differently can declare a delivery carrying that strategy code,
    // which is then matched by code and takes precedence.
    //
    // The fallback to the first entry matters because a campaign type usually declares a single
    // delivery. Without it, every tab after the first would open empty.
    const deliveryConfig = methodCode
      ? deliveryConfigArray.find((d) => d?.deliveryMethod === methodCode) || deliveryConfigArray[deliveryIndex] || deliveryConfigArray[0]
      : deliveryConfigArray[deliveryIndex];

    if (deliveryConfig) {
      
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
export const selectCampaignId = (state) => state.deliveryRules.campaignId;
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
  syncCycles,
  syncDeliveries,
  syncDeliveryMethods,
  updateObservationStrategy,
} = deliveryRulesSlice.actions;

export default deliveryRulesSlice.reducer;