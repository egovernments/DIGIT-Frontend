import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';
import {
  selectCampaignData,
  selectCampaignId,
  selectActiveTabIndex,
  selectActiveSubTabIndex,
  selectActiveCycle,
  selectActiveDelivery,
  selectActiveDeliveryRules,
  selectLoading,
  selectError,
  selectInitialized,
  initializeCampaignData,
  resetCampaignData,
  setActiveTab,
  setActiveSubTab,
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
} from './deliveryRulesSlice';
import { CONSOLE_MDMS_MODULENAME } from '../../../Module';
import useCampaignStore from "../../../hooks/useCampaignStore";
import useCampaignTemplate from "../../../hooks/useCampaignTemplate";
import { getTemplateId, mergeTemplateProjectType } from "../../../utils/campaignTemplate";

export const useDeliveryRules = () => {
  const dispatch = useDispatch();

  const campaignData = useSelector(selectCampaignData);
  const storedCampaignId = useSelector(selectCampaignId);
  const activeTabIndex = useSelector(selectActiveTabIndex);
  const activeSubTabIndex = useSelector(selectActiveSubTabIndex);
  const activeCycle = useSelector(selectActiveCycle);
  const activeDelivery = useSelector(selectActiveDelivery);
  const activeDeliveryRules = useSelector(selectActiveDeliveryRules);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const initialized = useSelector(selectInitialized);


  const initializeData = useCallback((cycles, deliveries, effectiveDeliveryConfig, savedData, attributeConfig, operatorConfig, campaignId, deliveryMethods) => {
    dispatch(initializeCampaignData({ cycles, deliveries, effectiveDeliveryConfig, savedData, attributeConfig, operatorConfig, campaignId, deliveryMethods }));
  }, [dispatch]);

  const changeTab = useCallback((tabIndex) => {
    dispatch(setActiveTab(tabIndex));
  }, [dispatch]);

  const changeSubTab = useCallback((subTabIndex) => {
    dispatch(setActiveSubTab(subTabIndex));
  }, [dispatch]);

  const addRule = useCallback(() => {
    dispatch(addDeliveryRule({
      cycleIndex: activeTabIndex,
      deliveryIndex: activeSubTabIndex,
    }));
  }, [dispatch, activeTabIndex, activeSubTabIndex]);

  const removeRule = useCallback((ruleKey) => {
    dispatch(removeDeliveryRule({
      cycleIndex: activeTabIndex,
      deliveryIndex: activeSubTabIndex,
      ruleKey,
    }));
  }, [dispatch, activeTabIndex, activeSubTabIndex]);

  const updateAttributeField = useCallback((ruleKey, attributeKey, field, value) => {
    dispatch(updateAttribute({
      cycleIndex: activeTabIndex,
      deliveryIndex: activeSubTabIndex,
      ruleKey,
      attributeKey,
      field,
      value,
    }));
  }, [dispatch, activeTabIndex, activeSubTabIndex]);

  const addAttributeToRule = useCallback((ruleKey) => {
    dispatch(addAttribute({
      cycleIndex: activeTabIndex,
      deliveryIndex: activeSubTabIndex,
      ruleKey,
    }));
  }, [dispatch, activeTabIndex, activeSubTabIndex]);

  const removeAttributeFromRule = useCallback((ruleKey, attributeKey) => {
    dispatch(removeAttribute({
      cycleIndex: activeTabIndex,
      deliveryIndex: activeSubTabIndex,
      ruleKey,
      attributeKey,
    }));
  }, [dispatch, activeTabIndex, activeSubTabIndex]);

  const updateRuleProducts = useCallback((ruleKey, products) => {
    dispatch(updateProducts({
      cycleIndex: activeTabIndex,
      deliveryIndex: activeSubTabIndex,
      ruleKey,
      products,
    }));
  }, [dispatch, activeTabIndex, activeSubTabIndex]);

  const updateRuleDeliveryType = useCallback((ruleKey, deliveryType) => {
    dispatch(updateDeliveryType({
      cycleIndex: activeTabIndex,
      deliveryIndex: activeSubTabIndex,
      ruleKey,
      deliveryType,
    }));
  }, [dispatch, activeTabIndex, activeSubTabIndex]);

  const updateDeliveryTypeForEachDelivery = useCallback((deliveryType) => {
    dispatch(updateDeliveryTypeForDelivery({
      cycleIndex: activeTabIndex,
      deliveryIndex: activeSubTabIndex,
      deliveryType,
    }));
  }, [dispatch, activeTabIndex, activeSubTabIndex]);


  const setLoadingState = useCallback((isLoading) => {
    dispatch(setLoading(isLoading));
  }, [dispatch]);

  const resetData = useCallback(() => {
    dispatch(resetCampaignData());
  }, [dispatch]);

  const setErrorState = useCallback((errorMessage) => {
    dispatch(setError(errorMessage));
  }, [dispatch]);

  const syncCycleCount = useCallback((newCycleCount, effectiveDeliveryConfig, attributeConfig, operatorConfig) => {
    dispatch(syncCycles({ newCycleCount, effectiveDeliveryConfig, attributeConfig, operatorConfig }));
  }, [dispatch]);

  const syncDeliveryCount = useCallback((newDeliveryCount, effectiveDeliveryConfig, attributeConfig, operatorConfig) => {
    dispatch(syncDeliveries({ newDeliveryCount, effectiveDeliveryConfig, attributeConfig, operatorConfig }));
  }, [dispatch]);

  const syncDeliveryMethodsAction = useCallback((deliveryMethods, effectiveDeliveryConfig, attributeConfig, operatorConfig) => {
    dispatch(syncDeliveryMethods({ deliveryMethods, effectiveDeliveryConfig, attributeConfig, operatorConfig }));
  }, [dispatch]);

  const updateObservationStrategyAction = useCallback((observationStrategy) => {
    dispatch(updateObservationStrategy({ observationStrategy }));
  }, [dispatch]);

  return {
    // State
    campaignData,
    storedCampaignId,
    activeTabIndex,
    activeSubTabIndex,
    activeCycle,
    activeDelivery,
    activeDeliveryRules,
    loading,
    error,
    initialized,

    // Actions
    initializeData,
    resetData,
    changeTab,
    changeSubTab,
    addRule,
    removeRule,
    updateAttributeField,
    addAttributeToRule,
    removeAttributeFromRule,
    updateRuleProducts,
    updateRuleDeliveryType,
    setLoadingState,
    setErrorState,
    updateDeliveryTypeForEachDelivery,
    syncCycleCount,
    syncDeliveryCount,
    syncDeliveryMethodsAction,
    updateObservationStrategyAction,
  };
};

export const useDeliveryRuleData = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);

  const [formStorageData] = useCampaignStore("HCM_CAMPAIGN_MANAGER_FORM_DATA", null);
  const sessionData = formStorageData;
  const selectedProjectType = sessionData?.HCM_CAMPAIGN_TYPE?.projectType?.code || searchParams.get("projectType");

  const campaignNumber = searchParams.get("campaignNumber");

  // Read for one thing only: which template this campaign was created from, if any. The campaign
  // is the only place that still knows, since the wizard's session is cleared before this screen
  // is reached.
  const { data: campaignRecord, isLoading: campaignLoading } = Digit.Hooks.useCustomAPIHook({
    url: `/project-factory/v1/project-type/search`,
    body: { CampaignDetails: { tenantId, campaignNumber } },
    config: {
      enabled: !!campaignNumber,
      cacheTime: 0,
      staleTime: 0,
      select: (response) => response?.CampaignDetails?.[0],
    },
  });

  const { templateProjectType, isTemplateLoading } = useCampaignTemplate(getTemplateId(campaignRecord));

  // Fetch project configuration from MDMS
  const { isLoading: configLoading, data: mdmsProjectConfig, error: configError } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "HCM-PROJECT-TYPES",
    [{ name: "projectTypes" }],
    {
      staleTime: 0,
      cacheTime: 0,
      enabled: !!selectedProjectType,
      select: (data) => {
        const projectTypes = data?.["HCM-PROJECT-TYPES"]?.projectTypes;
        return projectTypes.find(type => type.code === selectedProjectType);
      },
    },
    { schemaCode: "HCM-PROJECT-TYPES.projectTypes" }
  );


  // Fetch attribute configuration
  const { isLoading: attributesLoading, data: attributeConfig } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [{ name: "allAttributes" }],
    {
      enabled: !!selectedProjectType,
      select: (data) => {
        const attributes = data?.[CONSOLE_MDMS_MODULENAME]?.allAttributes || [];
        return attributes.filter(attr => attr?.projectTypes?.includes(selectedProjectType));
      },
    },
    { schemaCode: `${CONSOLE_MDMS_MODULENAME}.allAttributes` }
  );

  // Fetch operator configuration
  const { isLoading: operatorsLoading, data: operatorConfig } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [{ name: "operatorConfig" }],
    {
      select: (data) => data?.[CONSOLE_MDMS_MODULENAME]?.operatorConfig || [],
    },
    { schemaCode: `${CONSOLE_MDMS_MODULENAME}.operatorConfig` }
  );

  // Fetch delivery type configuration
  const { isLoading: deliveryTypesLoading, data: deliveryTypeConfig } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [{ name: "deliveryTypeConfig" }],
    {
      select: (data) => data?.[CONSOLE_MDMS_MODULENAME]?.deliveryTypeConfig || [],
    },
    { schemaCode: `${CONSOLE_MDMS_MODULENAME}.deliveryTypeConfig` }
  );

  // A campaign created from a template is configured from the campaign type that template carries;
  // anything the template leaves out still comes from the campaign type's own record.
  //
  // Nothing is handed over until the template has been looked up. The screen builds its rules from
  // the first configuration it receives and then guards against doing it again, so giving it the
  // campaign type's defaults a moment too early would mean the wrong defaults for good.
  const waitingOnTemplate = !!campaignNumber && (campaignLoading || isTemplateLoading);
  const projectConfig = useMemo(
    () => (waitingOnTemplate ? undefined : mergeTemplateProjectType(mdmsProjectConfig, templateProjectType)),
    [waitingOnTemplate, mdmsProjectConfig, templateProjectType]
  );

  const loading = configLoading || attributesLoading || operatorsLoading || deliveryTypesLoading || waitingOnTemplate;
  const error = configError;

  return {
    projectConfig,
    attributeConfig,
    operatorConfig,
    deliveryTypeConfig,
    loading,
    error,
    selectedProjectType,
    sessionData,
  };
};