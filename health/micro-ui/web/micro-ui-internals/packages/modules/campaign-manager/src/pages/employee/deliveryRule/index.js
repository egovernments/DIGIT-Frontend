import React, { useEffect, useMemo } from "react";
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
  } = useDeliveryRuleData();

  const {
    campaignData,
    initializeData,
    initialized,
    loading: storeLoading,
    setErrorState,
  } = useDeliveryRules();

  // Get cycle configuration with proper delivery config priority
  const cycleData = useMemo(() => {
    const data = config?.customProps?.sessionData?.["HCM_CAMPAIGN_CYCLE_CONFIGURE"]?.cycleConfigure ||
      sessionData?.["HCM_CAMPAIGN_CYCLE_CONFIGURE"]?.cycleConfigure;
    console.log('Cycle configuration data:', data);
    return data;
  }, [config, sessionData]);

  // Get effective delivery configuration - prioritize cycle data over project config
  const effectiveDeliveryConfig = useMemo(() => {
    const cycleDeliveryConfig = cycleData?.deliveryConfig;
    
    if (cycleDeliveryConfig) {
      console.log('Using cycle delivery config:', cycleDeliveryConfig);
      return cycleDeliveryConfig;
    }
    
    console.log('Using project config as fallback:', projectConfig);
    return projectConfig;
  }, [cycleData, projectConfig]);

  // Get saved delivery rules
  const savedDeliveryRules = useMemo(() => {
    const saved = sessionData?.HCM_CAMPAIGN_DELIVERY_DATA?.deliveryRule;
    console.log('Saved delivery rules:', saved);
    return saved;
  }, [sessionData]);

  // Initialize campaign data when dependencies are ready
  useEffect(() => {
    console.log('Initialization check:', {
      effectiveDeliveryConfig: !!effectiveDeliveryConfig,
      cycleData: !!cycleData?.cycleConfgureDate,
      initialized,
      savedDeliveryRules: !!savedDeliveryRules,
      attributeConfigCount: attributeConfig?.length || 0,
      operatorConfigCount: operatorConfig?.length || 0,
      configSource: cycleData?.deliveryConfig ? 'cycle' : 'project'
    });

    if (effectiveDeliveryConfig && cycleData?.cycleConfgureDate && !initialized) {
      const cycles = cycleData.cycleConfgureDate.cycle || tabCount;
      const deliveries = cycleData.cycleConfgureDate.deliveries || subTabCount;
      
      console.log('Initializing with:', {
        cycles,
        deliveries,
        effectiveDeliveryConfig,
        savedDeliveryRules,
        attributeConfig,
        operatorConfig,
        configSource: cycleData?.deliveryConfig ? 'cycle deliveryConfig' : 'project config fallback'
      });
      
      try {
        initializeData(cycles, deliveries, effectiveDeliveryConfig, savedDeliveryRules, attributeConfig, operatorConfig);
      } catch (error) {
        console.error('Error initializing campaign data:', error);
        setErrorState(error.message);
      }
    }
  }, [cycleData, effectiveDeliveryConfig, initialized, initializeData, savedDeliveryRules, tabCount, subTabCount, setErrorState, attributeConfig, operatorConfig]);

  // Update parent component when campaign data changes
  useEffect(() => {
    if (initialized && campaignData.length > 0) {
      console.log('Updating parent with campaign data:', campaignData);
      onSelect("deliveryRule", campaignData);
    }
  }, [campaignData, initialized, onSelect]);

  // Handle data loading error
  useEffect(() => {
    if (dataError) {
      setErrorState(dataError.message || 'Failed to load configuration data');
    }
  }, [dataError, setErrorState]);

  console.log('DeliverySetupContainer render state:', {
    dataLoading,
    storeLoading,
    initialized,
    campaignDataLength: campaignData.length,
    attributeConfigLength: attributeConfig?.length,
    operatorConfigLength: operatorConfig?.length
  });

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