import React, { useEffect, useMemo, useRef, useCallback } from "react";
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Loader } from "@egovernments/digit-ui-components";
import deliveryRulesReducer from './deliveryRulesSlice';
import { useDeliveryRules, useDeliveryRuleData } from './useDeliveryRules';
import MultiTab from "./MultiTabcontext";

// Configure Redux store
const store = configureStore({
  reducer: {
    deliveryRules: deliveryRulesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['deliveryRules/initializeCampaignData'],
      },
    }),
});

const DeliverySetupContainer = ({ onSelect, config, formData, control, tabCount = 2, subTabCount = 3, ...props }) => {
  const {
    projectConfig,
    attributeConfig,
    operatorConfig,
    deliveryTypeConfig,
    loading: dataLoading,
    error: dataError,
    sessionData,
    selectedProjectType,
  } = useDeliveryRuleData();


  const {
    campaignData,
    initializeData,
    initialized,
    loading: storeLoading,
    setErrorState,
    resetData,
  } = useDeliveryRules();

  // Track previous project type and campaign ID to detect changes
  const prevProjectTypeRef = useRef(null);
  const prevCampaignIdRef = useRef(null);
  
  // Get current campaign ID from session or URL
  const currentCampaignId = useMemo(() => {
    return sessionData?.HCM_CAMPAIGN_NAME?.id || 
           new URLSearchParams(window.location.search).get("id");
  }, [sessionData]);

  // Get cycle configuration with proper delivery config priority
  const cycleData = useMemo(() => {
    const data = sessionData?.["HCM_CAMPAIGN_CYCLE_CONFIGURE"]?.cycleConfigure || config?.customProps?.sessionData?.["HCM_CAMPAIGN_CYCLE_CONFIGURE"]?.cycleConfigure;
    return data;
  }, [config, sessionData]);

  // Get effective delivery configuration - prioritize cycle data over project config
  const effectiveDeliveryConfig = useMemo(() => {
    const cycleDeliveryConfig = cycleData?.deliveryConfig;

    if (cycleDeliveryConfig) {
      return cycleDeliveryConfig;
    }

    return projectConfig;
  }, [cycleData, projectConfig]);

  // Get saved delivery rules
  const savedDeliveryRules = useMemo(() => {
    const saved = sessionData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule;
    return saved;
  }, [sessionData]);

  // Store attribute and operator config in refs to avoid dependency issues
  const attributeConfigRef = useRef(attributeConfig);
  const operatorConfigRef = useRef(operatorConfig);

  useEffect(() => {
    attributeConfigRef.current = attributeConfig;
  }, [attributeConfig]);

  useEffect(() => {
    operatorConfigRef.current = operatorConfig;
  }, [operatorConfig]);

  // Detect when project type or campaign changes and reset if necessary
  useEffect(() => {
    const hasProjectTypeChanged = prevProjectTypeRef.current !== null && 
                                  prevProjectTypeRef.current !== selectedProjectType;
    const hasCampaignIdChanged = prevCampaignIdRef.current !== null && 
                                  prevCampaignIdRef.current !== currentCampaignId;
    
    if (hasProjectTypeChanged || hasCampaignIdChanged) {
      
      // Reset the Redux state to force re-initialization
      resetData();
    }
    
    // Update refs for next comparison
    prevProjectTypeRef.current = selectedProjectType;
    prevCampaignIdRef.current = currentCampaignId;
  }, [selectedProjectType, currentCampaignId, resetData]);

  // Initialize campaign data when dependencies are ready
  useEffect(() => {
    if (!cycleData?.cycleConfgureDate || !effectiveDeliveryConfig) {
      return;
    }

    if (initialized) {
      return;
    }

    const cycles = cycleData.cycleConfgureDate.cycle;
    const deliveries = cycleData.cycleConfgureDate.deliveries;

    if (!cycles || !deliveries) {
      return;
    }

    try {
      initializeData(cycles, deliveries, effectiveDeliveryConfig, savedDeliveryRules, attributeConfigRef.current, operatorConfigRef.current);
    } catch (error) {
      console.error('Error initializing campaign data:', error);
      setErrorState(error.message);
    }
  }, [cycleData, effectiveDeliveryConfig, initialized, initializeData, savedDeliveryRules, setErrorState]);

  // Wrap onSelect in useCallback to prevent dependency issues
  const handleDataUpdate = useCallback((data) => {
    if (onSelect && typeof onSelect === 'function') {
      onSelect("deliveryRule", data);
    }
  }, [onSelect]);

  // Update parent component when campaign data changes
  useEffect(() => {
    if (initialized && campaignData.length > 0) {
      handleDataUpdate(campaignData);
    }
  }, [campaignData, initialized, handleDataUpdate]);

  // Handle data loading error
  useEffect(() => {
    if (dataError) {
      setErrorState(dataError.message || 'Failed to load configuration data');
    }
  }, [dataError, setErrorState]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  if (dataLoading || storeLoading || !initialized) {
    return <Loader page={true} variant="PageLoader" />;
  }

  if (dataError) {
    return (
      <div className="error-container">
        <p>Error loading delivery configuration: {dataError.message}</p>
      </div>
    );
  }

  return (
    <MultiTab
      projectConfig={projectConfig}
      attributeConfig={attributeConfig}
      operatorConfig={operatorConfig}
      deliveryTypeConfig={deliveryTypeConfig}
    />
  );
};

function DeliverySetup(props) {
  return (
    <Provider store={store}>
      <DeliverySetupContainer {...props} />
    </Provider>
  );
}

export default DeliverySetup;