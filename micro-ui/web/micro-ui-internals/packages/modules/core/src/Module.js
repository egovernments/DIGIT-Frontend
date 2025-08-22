import { BodyContainer } from "@egovernments/digit-ui-components";
import { Loader } from "@egovernments/digit-ui-components";
import React from "react";
import { getI18n } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { DigitApp, DigitAppWrapper } from "./App";
import { useState, useMemo, useCallback } from "react";
import ErrorBoundary from "./components/ErrorBoundaries";
import getStore from "./redux/store";

// Keep critical landing page components in main bundle for faster initial load
import ChangeLanguage from "./components/ChangeLanguage";
import PrivacyComponent from "./components/PrivacyComponent";

// Lazy load less frequently used components 
const SelectOtp = React.lazy(() => import("./pages/citizen/Login/SelectOtp"));
const ChangeCity = React.lazy(() => import("./components/ChangeCity"));
const OtpComponent = React.lazy(() => import("./pages/employee/Otp/OtpCustomComponent"));

// Optimized QueryClient configuration for core wrapper performance
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - reduced for better data freshness
      gcTime: 30 * 60 * 1000, // 30 minutes - reduced memory footprint
      retry: 2, // Enable smart retry with limit
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Exponential backoff
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
      refetchOnMount: 'always', // Ensure fresh data on mount
      networkMode: 'online', // Only run queries when online
    },
    mutations: {
      retry: 1, // Limited retry for mutations
      networkMode: 'online',
    },
  },
});

const DigitUIWrapper = React.memo(({ stateCode, enabledModules, defaultLanding, allowedUserTypes }) => {
  const { isLoading, data: initData = {} } = Digit.Hooks.useInitStore(stateCode, enabledModules);
  
  // Memoize store creation to prevent unnecessary re-creation
  const store = useMemo(() => getStore(initData) || {}, [initData]);
  
  // Memoize component registration to prevent re-registration
  useMemo(() => {
    if (!Digit.ComponentRegistryService.getComponent("PrivacyComponent")) {
      Digit.ComponentRegistryService.setComponent("PrivacyComponent", PrivacyComponent);
    }
  }, []);

  if (isLoading) {
    return <Loader page={true} variant="PageLoader" />;
  }
  return (
    <Provider store={store}>
      <Router>
        <BodyContainer>
          {Digit.Utils.getMultiRootTenant() ? (
            <DigitAppWrapper
              initData={initData}
              stateCode={stateCode}
              modules={initData?.modules}
              appTenants={initData.tenants}
              logoUrl={initData?.stateInfo?.logoUrl}
              logoUrlWhite={initData?.stateInfo?.logoUrlWhite}
              defaultLanding={defaultLanding}
              allowedUserTypes={allowedUserTypes}
            />
          ) : (
            <DigitApp
              initData={initData}
              stateCode={stateCode}
              modules={initData?.modules}
              appTenants={initData.tenants}
              logoUrl={initData?.stateInfo?.logoUrl}
              defaultLanding={defaultLanding}
              allowedUserTypes={allowedUserTypes}
            />
          )}
        </BodyContainer>
      </Router>
    </Provider>
  );
});

/**
 * DigitUI Component - The main entry point for the UI.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.stateCode - The state code for the application.
 * @param {Object} props.registry - The registry object containing components registrations.
 * @param {Array<string>} props.enabledModules - A list of enabled modules, if any modules to be disabled due to some condition.
 * @param {Object} props.moduleReducers - Reducers associated with enabled modules.
 * @param {string} props.defaultLanding - The default landing page (e.g., "employee", "citizen"), default is citizen.
 * @param {Array<string>} props.allowedUserTypes - A list of allowed user types (e.g., ["employee", "citizen"]) if any restriction to be applied, and default is both employee & citizen.
 * 
 * @author jagankumar-egov
 *
 * @example
 * <DigitUI
 *   stateCode="pg"
 *   registry={registry}
 *   enabledModules={["Workbench", "PGR"]}
 *   defaultLanding="employee"
 *   allowedUserTypes={["employee", "citizen"]}
 *   moduleReducers={moduleReducers}
 * />
 */
export const DigitUI = ({ stateCode, registry, enabledModules, defaultLanding,allowedUserTypes }) => {
  // Memoize initial privacy state to prevent unnecessary re-renders
  const initialPrivacy = useMemo(() => Digit.Utils.getPrivacyObject() || {}, []);
  const [privacy, setPrivacy] = useState(initialPrivacy);
  
  const userType = Digit.UserService.getType();
  
  // Use memoized QueryClient to prevent recreation on every render
  const queryClient = useMemo(() => createQueryClient(), []);

  const ComponentProvider = Digit.Contexts.ComponentProvider;
  const PrivacyProvider = Digit.Contexts.PrivacyProvider;

  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]);

  // Memoize privacy context methods to prevent unnecessary re-renders
  const resetPrivacy = useCallback((_data) => {
    Digit.Utils.setPrivacyObject({});
    setPrivacy({});
  }, []);

  const getPrivacy = useCallback(() => {
    const privacyObj = Digit.Utils.getPrivacyObject();
    setPrivacy(privacyObj);
    return privacyObj;
  }, []);

  const updatePrivacyDescoped = useCallback((_data) => {
    const privacyObj = Digit.Utils.getAllPrivacyObject();
    // Safely access pathname with fallback
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const newObj = { ...privacyObj, [pathname]: _data };
    Digit.Utils.setPrivacyObject({ ...newObj });
    setPrivacy(privacyObj?.[pathname] || {});
  }, []);

  const updatePrivacy = useCallback((uuid, fieldName) => {
    setPrivacy(Digit.Utils.updatePrivacy(uuid, fieldName) || {});
  }, []);

  // Memoize privacy context value to prevent unnecessary re-renders
  const privacyContextValue = useMemo(() => ({
    privacy: typeof window !== 'undefined' ? privacy?.[window.location.pathname] : privacy,
    resetPrivacy,
    getPrivacy,
    updatePrivacyDescoped,
    updatePrivacy,
  }), [privacy, resetPrivacy, getPrivacy, updatePrivacyDescoped, updatePrivacy]);

  return (
    <div>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ComponentProvider.Provider value={registry}>
            <PrivacyProvider.Provider value={privacyContextValue}>
              <DigitUIWrapper stateCode={stateCode} enabledModules={enabledModules} defaultLanding={defaultLanding}  allowedUserTypes={allowedUserTypes} />
            </PrivacyProvider.Provider>
          </ComponentProvider.Provider>
        </QueryClientProvider>
      </ErrorBoundary>
    </div>
  );
};

// Optimized lazy registration to prevent unnecessary bundle bloat
const componentsToRegister = {
  // Keep critical components for immediate registration
  ChangeLanguage,
  PrivacyComponent,
  // Lazy components registered on-demand
  SelectOtp,
  ChangeCity, 
  OtpComponent,
};

// Memoized registration to prevent duplicate calls
const registeredComponents = new Set();

export const initCoreComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    if (!registeredComponents.has(key)) {
      Digit.ComponentRegistryService.setComponent(key, value);
      registeredComponents.add(key);
    }
  });
};

// Register critical components immediately, lazy ones on-demand
export const initCriticalComponents = () => {
  const criticalComponents = { ChangeLanguage, PrivacyComponent };
  Object.entries(criticalComponents).forEach(([key, value]) => {
    if (!registeredComponents.has(key)) {
      Digit.ComponentRegistryService.setComponent(key, value);
      registeredComponents.add(key);
    }
  });
};
