import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import MultiTab from "./MultiTabcontext";
import { Loader } from "@egovernments/digit-ui-components";
// import { deliveryConfig } from "../../../configs/deliveryConfig";
import getDeliveryConfig from "../../../utils/getDeliveryConfig";
import { isEqual } from "lodash";

const CycleContext = createContext();

function makeSequential(jsonArray, keyName) {
  return jsonArray.map((item, index) => ({
    ...item,
    [keyName]: index + 1,
  }));
}

function DeliverySetup({ onSelect, config, formData, control, tabCount = 2, subTabCount = 3, ...props }) {
  // Campaign Tab Skeleton function
  const [cycleData, setCycleData] = useState(config?.customProps?.sessionData?.["HCM_CAMPAIGN_CYCLE_CONFIGURE"]?.cycleConfigure);
  const saved = window.Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_FORM_DATA")?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule;
  const selectedProjectType = window.Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_FORM_DATA")?.HCM_CAMPAIGN_TYPE?.projectType?.code;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const activeCycle = searchParams.get("activeCycle");
  const { isLoading: deliveryConfigLoading, data: filteredDeliveryConfig } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "HCM-PROJECT-TYPES",
    [{ name: "projectTypes" }],
    {
      staleTime: 0,
      cacheTime: 0,
      enabled: true,
      select: (data) => {
        const temp = getDeliveryConfig({ data: data?.["HCM-PROJECT-TYPES"], projectType: selectedProjectType });
        return temp;
      },
    },
    { schemaCode: `${"HCM-PROJECT-TYPES"}.projectTypes` }
  );
  useEffect(() => {
     const next = config?.customProps?.sessionData?.["HCM_CAMPAIGN_CYCLE_CONFIGURE"]?.cycleConfigure;
    setCycleData(prev => isEqual(prev, next) ? prev : next);
  }, [config?.customProps?.sessionData?.["HCM_CAMPAIGN_CYCLE_CONFIGURE"]?.cycleConfigure]);

  const generateTabsData = (tabs, subTabs) => {
    const base = saved ? JSON.parse(JSON.stringify(saved)) : null;
    if (!base || base?.length === 0) {
      return [...Array(tabs)].map((_, tabIndex) => ({
        cycleIndex: `${tabIndex + 1}`,
        active: activeCycle == tabIndex + 1 ? true : tabIndex === 0 ? true : false,
        deliveries: [...Array(subTabs || 1)].map((_, subTabIndex) => ({
          deliveryIndex: `${subTabIndex + 1}`,
          active: subTabIndex === 0 ? true : false,
          deliveryRules:
            filteredDeliveryConfig && filteredDeliveryConfig?.deliveryConfig?.[subTabIndex]
              ? filteredDeliveryConfig?.deliveryConfig?.[subTabIndex]?.conditionConfig?.map((item, index) => {
                if (item) {
                  return {
                    ruleKey: index + 1,
                    delivery: {},
                    deliveryType: item?.deliveryType,
                    attributes:
                      Array.isArray(item?.attributeConfig) && item?.attributeConfig.length > 0
                        ? item?.attributeConfig?.map((i, c) => {
                          if (i?.operatorValue === "IN_BETWEEN") {
                            return {
                              key: c + 1,
                              attribute: { code: i?.attrValue },
                              operator: { code: i?.operatorValue },
                              toValue: i?.fromValue,
                              fromValue: i?.toValue,
                            };
                          }
                          return {
                            key: c + 1,
                            attribute: { code: i?.attrValue },
                            operator: { code: i?.operatorValue },
                            value: i?.value,
                          };
                        })
                        : [{ key: 1, attribute: null, operator: null, value: "" }],
                    // products: [],
                    products: item?.productConfig
                      ? item?.productConfig?.map((i, c) => ({
                        ...i,
                      }))
                      : [],
                  };
                } else {
                  return {
                    ruleKey: index + 1,
                    delivery: {},
                    deliveryType: null,
                    attributes: [{ key: 1, attribute: null, operator: null, value: "" }],
                    products: [],
                  };
                }
              })
              : [
                {
                  ruleKey: 1,
                  delivery: {},
                  attributes:
                    filteredDeliveryConfig && filteredDeliveryConfig?.deliveryConfig?.[0]?.attributeConfig
                      ? filteredDeliveryConfig?.deliveryConfig?.[0]?.attributeConfig?.map((i, c) => ({
                        key: c + 1,
                        attribute: { code: i?.attrValue },
                        operator: { code: i?.operatorValue },
                        value: i?.value,
                      }))
                      : [{ key: 1, attribute: null, operator: null, value: "" }],
                  products: [],
                },
              ],
        })),
      }));
    }
    // if no change
    if (base && base?.length == tabs && base?.[0]?.deliveries?.length === subTabs) {
      return base.map((i, n) => {
        return {
          ...i,
          active: activeCycle ? (activeCycle == n + 1 ? true : false) : n === 0 ? true : false,
        };
      });
    }
    // if cycle number decrease
    if (base?.length > tabs) {
      // const temp = saved;
      savbaseed.splice(tabs);
      // return temp;
    }
    // if cycle number increase
    if (tabs > base?.length) {
      // const temp = saved;
      for (let i = base.length + 1; i <= tabs; i++) {
        const newIndex = i.toString();
        base.push({
          cycleIndex: newIndex,
          active: false,
          deliveries: [...Array(subTabs || 1)].map((_, subTabIndex) => ({
            deliveryIndex: `${subTabIndex + 1}`,
            active: subTabIndex === 0,
            deliveryRules:
              filteredDeliveryConfig && filteredDeliveryConfig?.deliveryConfig?.[subTabIndex]?.conditionConfig
                ? filteredDeliveryConfig?.deliveryConfig?.[subTabIndex]?.conditionConfig?.map((item, index) => {
                  if (item) {
                    return {
                      ruleKey: index + 1,
                      delivery: {},
                      deliveryType: item?.deliveryType,
                      attributes:
                        Array.isArray(item?.attributeConfig) && item?.attributeConfig.length > 0
                          ? item?.attributeConfig?.map((i, c) => {
                            if (i?.operatorValue === "IN_BETWEEN") {
                              return {
                                key: c + 1,
                                attribute: { code: i?.attrValue },
                                operator: { code: i?.operatorValue },
                                toValue: i?.fromValue,
                                fromValue: i?.toValue,
                              };
                            }
                            return {
                              key: c + 1,
                              attribute: { code: i?.attrValue },
                              operator: { code: i?.operatorValue },
                              value: i?.value,
                            };
                          })
                          : [{ key: 1, attribute: null, operator: null, value: "" }],
                      // products: [],
                      products: item?.productConfig
                        ? item?.productConfig?.map((i, c) => ({
                          ...i,
                        }))
                        : [],
                    };
                  } else {
                    return {
                      ruleKey: index + 1,
                      delivery: {},
                      deliveryType: null,
                      attributes: [{ key: 1, attribute: null, operator: null, value: "" }],
                      products: [],
                    };
                  }
                })
                : [
                  {
                    ruleKey: 1,
                    delivery: {},
                    deliveryType: null,
                    attributes: [{ key: 1, attribute: null, operator: null, value: "" }],
                    products: [],
                  },
                ],
          })),
        });
      }
    }
    // if delivery number decrease

    base.forEach((cycle) => {
      // Remove deliveries if there are more deliveries than the specified number
      if (cycle?.deliveries?.length > subTabs) {
        cycle?.deliveries.splice(subTabs);
      }

      // Add deliveries if there are fewer deliveries than the specified number
      if (subTabs > cycle?.deliveries?.length) {
        for (let i = cycle?.deliveries.length + 1; i <= subTabs; i++) {
          const newIndex = i.toString();
          cycle.deliveries.push({
            deliveryIndex: newIndex,
            active: false,
            deliveryRules: [
              {
                ruleKey: 1,
                delivery: {},
                attributes: [{ key: 1, attribute: null, operator: null, value: "" }],
                products: [],
              },
            ],
          });
        }
      }
    });

    return base;
    // if delivery number increase

    //if no above case
  };

  // Reducer function
  const campaignDataReducer = (state, action) => {
    switch (action.type) {
      case "GENERATE_CAMPAIGN_DATA":
        return generateTabsData(action.cycle, action.deliveries);
      case "UPDATE_CAMPAIGN_DATA": {
        let changed = false;
        const next = state.map((cycle) => {
          if (!cycle.active) return cycle;
          const activeDelivery = cycle.deliveries.find((d) => d.active);
          if (!activeDelivery) return cycle;

          const deliveries = cycle.deliveries.map((d) => {
            if (!d.active) return d;
            if (isEqual(d.deliveryRules, action.payload.currentDeliveryRules)) return d;
            changed = true;
            return { ...d, deliveryRules: action.payload.currentDeliveryRules };
          });
          if (deliveries === cycle.deliveries) return cycle;
          changed = true;
          return { ...cycle, deliveries };
        });
        return changed ? next : state;
      }

      case "TAB_CHANGE_UPDATE":
        const temp = state.map((i) => ({
          ...i,
          active: i.cycleIndex == action.payload.tabIndex ? true : false,
        }));
        return temp;
      // return action.payload;
      case "SUBTAB_CHANGE_UPDATE":
        const tempSub = state.map((camp, index) => {
          if (camp.active === true) {
            return {
              ...camp,
              deliveries: camp.deliveries.map((deliver) => ({
                ...deliver,
                active: deliver.deliveryIndex == action.payload.subTabIndex ? true : false,
              })),
            };
          }
          return camp;
        });
        return tempSub;
      case "ADD_DELIVERY_RULE":
        const updatedDeliveryRules = [
          ...action.payload.currentDeliveryRules,
          {
            ruleKey: action.payload.currentDeliveryRules.length + 1,
            delivery: {},
            attributes: [{ key: 1, attribute: null, operator: null, value: "" }],
            products: [],
          },
        ];
        const updatedData = state.map((i) => {
          if (i.active) {
            const activeDelivery = i.deliveries.find((j) => j.active);
            if (activeDelivery) {
              return {
                ...i,
                deliveries: i.deliveries.map((j) => ({
                  ...j,
                  deliveryRules: j.active ? updatedDeliveryRules : j.deliveryRules,
                })),
              };
            }
          }
          return i;
        });
        return updatedData;
      case "REMOVE_DELIVERY_RULE":
        const updatedDeleted = state.map((i) => {
          if (i.active) {
            const activeDelivery = i.deliveries.find((j) => j.active);
            const w = makeSequential(
              activeDelivery.deliveryRules.filter((j) => j.ruleKey != action.payload.item.ruleKey),
              "ruleKey"
            );
            if (activeDelivery) {
              return {
                ...i,
                deliveries: i.deliveries.map((j) => ({
                  ...j,
                  deliveryRules: j.active ? w : j.deliveryRules,
                })),
              };
            }
          }
          return i;
        });
        return updatedDeleted;
      case "UPDATE_DELIVERY_RULE":
        return action.payload;
      case "ADD_ATTRIBUTE":
        return action.payload;
      case "REMOVE_ATTRIBUTE":
        return action.payload;
      case "UPDATE_ATTRIBUTE":
        return action.payload;
      case "ADD_PRODUCT":
        const prodTemp = action.payload.productData.map((i) => ({
          ...i,
          value: i?.value?.id,
          name: i?.value?.displayName,
          quantity: i?.quantity,
        }));
        console.log("ADD_PRODUCT after", prodTemp, state);
        const updatedState = state.map((cycle) => {
          if (cycle.active) {
            const updatedDeliveries = cycle.deliveries.map((dd) => {
              if (dd.active) {
                const updatedRules = dd.deliveryRules.map((rule) => {
                  if (rule.ruleKey === action.payload.delivery.ruleKey) {
                    return {
                      ...rule,
                      products: [...prodTemp],
                    };
                  }
                  return rule;
                });
                return {
                  ...dd,
                  deliveryRules: updatedRules,
                };
              }
              return dd;
            });
            return {
              ...cycle,
              deliveries: updatedDeliveries,
            };
          }
          return cycle;
        });
        console.log("ADD_PRODUCT final", updatedState);
        return updatedState;
      case "REMOVE_PRODUCT":
        return action.payload;
      case "UPDATE_PRODUCT":
        return action.payload;
      default:
        return state;
    }
  };

  const [campaignData, dispatchCampaignData] = useReducer(
    campaignDataReducer,
    []
  );
  const [executionCount, setExecutionCount] = useState(0);

  // Generate campaign data when cycleData or filteredDeliveryConfig changes
  const genInputsHash = React.useMemo(
    () => JSON.stringify({
      cycle: cycleData?.cycleConfgureDate?.cycle ?? null,
      deliveries: cycleData?.cycleConfgureDate?.deliveries ?? null,
      sig: filteredDeliveryConfig ? {
        projectType: filteredDeliveryConfig.projectType ?? null,
        deliveryLen: filteredDeliveryConfig.deliveryConfig?.length ?? 0,
        condLens: (filteredDeliveryConfig.deliveryConfig ?? []).map(c => c?.conditionConfig?.length ?? 0),
      } : null,
    }),
    [cycleData?.cycleConfgureDate?.cycle,
    cycleData?.cycleConfgureDate?.deliveries,
      filteredDeliveryConfig]
  );

  const lastGenHashRef = React.useRef(null);
  useEffect(() => {
    const ready = filteredDeliveryConfig && cycleData?.cycleConfgureDate?.cycle && cycleData?.cycleConfgureDate?.deliveries;
    if (!ready) return;
    if (genInputsHash !== lastGenHashRef.current) {
      dispatchCampaignData({
        type: "GENERATE_CAMPAIGN_DATA",
        cycle: cycleData.cycleConfgureDate.cycle,
        deliveries: cycleData.cycleConfgureDate.deliveries,
      });
      lastGenHashRef.current = genInputsHash;
    }
  }, [genInputsHash, filteredDeliveryConfig, cycleData, dispatchCampaignData]);


  const lastSentRef = React.useRef(null);
  useEffect(() => {
    const hash = JSON.stringify(campaignData ?? []);
    if (hash !== lastSentRef.current) {
      onSelect("deliveryRule", campaignData);
      lastSentRef.current = hash;
    }
  }, [campaignData, onSelect]);


  ////OLDER APPROACH - may cause loops
  // useEffect(() => {
  //   onSelect("deliveryRule", campaignData);
  // }, [campaignData]);

  // useEffect(() => {
  //   if (executionCount < 5) {
  //     onSelect("deliveryRule", campaignData);
  //     setExecutionCount((prevCount) => prevCount + 1);
  //   }
  // });

  if (deliveryConfigLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }
  return (
    <CycleContext.Provider
      value={{
        campaignData,
        dispatchCampaignData,
        filteredDeliveryConfig,
      }}
    >
      <MultiTab />
    </CycleContext.Provider>
  );
}

export default DeliverySetup;
export { CycleContext };
