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
    syncCycleCount,
    syncDeliveryCount,
    updateObservationStrategyAction,
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
    const observationStrategy = cycleData?.cycleConfgureDate?.observationStrategy || "DOT1";

    let config;
    if (cycleDeliveryConfig) {
      config = cycleDeliveryConfig;
    } else {
      config = projectConfig;
    }

    // Add observation strategy to the config
    if (config) {
      return {
        ...config,
        observationStrategy: observationStrategy
      };
    }

    return config;
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

  // Track previous cycle and delivery counts to detect changes
  const prevCycleCountRef = useRef(null);
  const prevDeliveryCountRef = useRef(null);
  const hasInitialSyncRef = useRef(false);
  const prevObservationStrategyRef = useRef(null);

  // Detect when project type or campaign changes and reset if necessary
  useEffect(() => {
    const hasProjectTypeChanged = prevProjectTypeRef.current !== null &&
                                  prevProjectTypeRef.current !== selectedProjectType;
    const hasCampaignIdChanged = prevCampaignIdRef.current !== null &&
                                  prevCampaignIdRef.current !== currentCampaignId;

    if (hasProjectTypeChanged || hasCampaignIdChanged) {

      // Reset the Redux state to force re-initialization
      resetData();
      // Reset sync flags
      hasInitialSyncRef.current = false;
      prevCycleCountRef.current = null;
      prevDeliveryCountRef.current = null;
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

  // Perform initial sync after initialization to handle saved data with different counts
  useEffect(() => {
    if (!initialized || hasInitialSyncRef.current || !cycleData?.cycleConfgureDate || !effectiveDeliveryConfig || !campaignData.length) {
      return;
    }

    const currentCycles = cycleData.cycleConfgureDate.cycle;
    const currentDeliveries = cycleData.cycleConfgureDate.deliveries;
    const currentObservationStrategy = cycleData.cycleConfgureDate.observationStrategy || "DOT1";
    const savedCycles = campaignData.length;
    const savedDeliveries = campaignData[0]?.deliveries?.length || 0;

    // Sync if saved data has different structure than current configuration
    if (savedCycles !== currentCycles) {
      try {
        syncCycleCount(currentCycles, effectiveDeliveryConfig, attributeConfigRef.current, operatorConfigRef.current);
      } catch (error) {
        console.error('Error performing initial cycle sync:', error);
        setErrorState(error.message);
      }
    }

    if (savedDeliveries !== currentDeliveries) {
      try {
        syncDeliveryCount(currentDeliveries, effectiveDeliveryConfig, attributeConfigRef.current, operatorConfigRef.current);
      } catch (error) {
        console.error('Error performing initial delivery sync:', error);
        setErrorState(error.message);
      }
    }

    // Check if saved delivery types match the observation strategy
    // If not, force update to match the observation strategy
    const needsObservationStrategySync = campaignData.some((cycle) =>
      cycle.deliveries?.some((delivery, deliveryIndex) => {
        const expectedDeliveryType = currentObservationStrategy === "DOT1"
          ? (deliveryIndex === 0 ? "DIRECT" : "INDIRECT")
          : "DIRECT";
        return delivery.deliveryType !== expectedDeliveryType;
      })
    );

    if (needsObservationStrategySync) {
      try {
        updateObservationStrategyAction(currentObservationStrategy);
      } catch (error) {
        console.error('Error syncing observation strategy on initial load:', error);
        setErrorState(error.message);
      }
    }

    // Set initial refs
    prevCycleCountRef.current = currentCycles;
    prevDeliveryCountRef.current = currentDeliveries;
    prevObservationStrategyRef.current = currentObservationStrategy;
    hasInitialSyncRef.current = true;
  }, [initialized, campaignData, cycleData?.cycleConfgureDate, effectiveDeliveryConfig, syncCycleCount, syncDeliveryCount, updateObservationStrategyAction, setErrorState]);

  // Sync observation strategy when it changes
  useEffect(() => {
    if (!initialized || !cycleData?.cycleConfgureDate) {
      return;
    }

    const currentObservationStrategy = cycleData.cycleConfgureDate.observationStrategy || "DOT1";

    // Check if observation strategy has changed after initial sync
    if (hasInitialSyncRef.current && prevObservationStrategyRef.current !== null && prevObservationStrategyRef.current !== currentObservationStrategy) {
      try {
        updateObservationStrategyAction(currentObservationStrategy);
      } catch (error) {
        console.error('Error updating observation strategy:', error);
        setErrorState(error.message);
      }
    }

    // Update ref for next comparison (do this after hasInitialSyncRef check to allow initial setting)
    prevObservationStrategyRef.current = currentObservationStrategy;
  }, [cycleData?.cycleConfgureDate?.observationStrategy, initialized, updateObservationStrategyAction, setErrorState]);

  // Sync cycles and deliveries when their counts change after initialization
  useEffect(() => {
    if (!initialized || !hasInitialSyncRef.current || !cycleData?.cycleConfgureDate || !effectiveDeliveryConfig) {
      return;
    }

    const currentCycles = cycleData.cycleConfgureDate.cycle;
    const currentDeliveries = cycleData.cycleConfgureDate.deliveries;

    // Check if cycle count has changed
    if (prevCycleCountRef.current !== null && prevCycleCountRef.current !== currentCycles) {
      try {
        syncCycleCount(currentCycles, effectiveDeliveryConfig, attributeConfigRef.current, operatorConfigRef.current);
      } catch (error) {
        console.error('Error syncing cycle count:', error);
        setErrorState(error.message);
      }
    }

    // Check if delivery count has changed
    if (prevDeliveryCountRef.current !== null && prevDeliveryCountRef.current !== currentDeliveries) {
      try {
        syncDeliveryCount(currentDeliveries, effectiveDeliveryConfig, attributeConfigRef.current, operatorConfigRef.current);
      } catch (error) {
        console.error('Error syncing delivery count:', error);
        setErrorState(error.message);
      }
    }

    // Update refs for next comparison
    prevCycleCountRef.current = currentCycles;
    prevDeliveryCountRef.current = currentDeliveries;
  }, [cycleData?.cycleConfgureDate?.cycle, cycleData?.cycleConfgureDate?.deliveries, initialized, effectiveDeliveryConfig, syncCycleCount, syncDeliveryCount, setErrorState]);

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

  // Scroll to top after initialization to counteract Dropdown components'
  // built-in scrollIntoView({behavior:"smooth"}) that fires on mount when below viewport.
  // Need to wait for the smooth scroll animation to be cancellable, then force instant scroll.
  useEffect(() => {
    if (initialized) {
      const raf = requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      });
      // Also schedule a delayed scroll in case the smooth scroll animation hasn't started yet
      const timer = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }, 400);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
      };
    }
  }, [initialized]);

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
      projectConfig={effectiveDeliveryConfig}
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