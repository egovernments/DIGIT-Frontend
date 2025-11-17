import { BodyContainer } from "@egovernments/digit-ui-components";
import { Loader } from "@egovernments/digit-ui-components";
import React from "react";
import { getI18n } from "react-i18next";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { DigitApp, DigitAppWrapper } from "./App";
import SelectOtp from "./pages/citizen/Login/SelectOtp";
import ChangeCity from "./components/ChangeCity";
import ChangeLanguage from "./components/ChangeLanguage";
import { useState } from "react";
import ErrorBoundary from "./components/ErrorBoundaries";
import getStore from "./redux/store";
import PrivacyComponent from "./components/PrivacyComponent";
import LoginSignupSelector from "./components/LoginSignupSelector";
import ForgotOrganizationTooltip from "./components/ForgotOrganizationTooltip";
import OtpComponent from "./pages/employee/Otp/OtpCustomComponent";
import EmailWithLinkComponent from "./pages/employee/SignUp-v2/EmailWithLinkComponent";
import AccountNameWithLinkComponent from "./pages/employee/Login-v2/AccountNameWithLinkComponent";
import EmailWithSignUpLinkComponent from "./pages/employee/Login-v2/EmailWithSignUpLinkComponent";

const DigitUIWrapper = ({ stateCode, enabledModules, moduleReducers, defaultLanding,allowedUserTypes }) => {
  const { isLoading, data: initData={} } = Digit.Hooks.useInitStore(stateCode, enabledModules);
  const [processedInitData, setProcessedInitData] = React.useState(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const hasProcessedRef = React.useRef(false); // Prevent multiple processing

  React.useEffect(() => {
    const fetchSignedUrls = async () => {
      // Safety checks
      if (!initData || !initData.stateInfo) {
        setProcessedInitData(initData);
        setIsProcessing(false);
        return;
      }

      // Only process once
      if (hasProcessedRef.current) {
        return;
      }

      // Only run for multi-root tenant setup
      const isMultiRootTenant = Digit.Utils.getMultiRootTenant();
      if (!isMultiRootTenant) {
        console.log("Not multi-root tenant, skipping URL signing check");
        setProcessedInitData(initData);
        setIsProcessing(false);
        return;
      }

      console.log("=== Module.js - Checking URLs for signing (Multi-root tenant) ===");
      const logoUrl = initData?.stateInfo?.logoUrl;
      const logoUrlWhite = initData?.stateInfo?.logoUrlWhite;
      const bannerUrl = initData?.stateInfo?.bannerUrl;

      console.log("Original logoUrl:", logoUrl);
      console.log("Original logoUrlWhite:", logoUrlWhite);
      console.log("Original bannerUrl:", bannerUrl);

      // Check if URLs need to be re-fetched with signing
      const needsRefetch = (url) => {
        return url && url.includes(".s3.ap-south-1.amazonaws.com/") && !url.includes("X-Amz-");
      };

      // Check if any URL needs refetching
      const anyNeedsRefetch = needsRefetch(logoUrl) || needsRefetch(logoUrlWhite) || needsRefetch(bannerUrl);

      if (!anyNeedsRefetch) {
        console.log("All URLs already have signed parameters or are not S3 URLs, no refetch needed");
        setProcessedInitData(initData);
        setIsProcessing(false);
        return;
      }

      setIsProcessing(true);
      hasProcessedRef.current = true; // Mark as processed

      let newLogoUrl = logoUrl;
      let newLogoUrlWhite = logoUrlWhite;
      let newBannerUrl = bannerUrl;

      // Extract fileStoreId from S3 URL
      const extractFileStoreId = (url) => {
        if (!url) return null;
        // URL format: https://bucket.s3.region.amazonaws.com/tenant/path/fileStoreId.ext
        const match = url.match(/\/([^\/]+)\.[^.]+$/);
        if (match && match[1]) {
          return match[1];
        }
        return null;
      };

      try {
        // Refetch logoUrl if needed
        if (needsRefetch(logoUrl)) {
          const fileStoreId = extractFileStoreId(logoUrl);
          console.log("Refetching logoUrl with fileStoreId:", fileStoreId);
          if (fileStoreId) {
            const response = await Digit.UploadServices.Filefetch([fileStoreId], stateCode);
            newLogoUrl = response?.data?.fileStoreIds?.[0]?.url || logoUrl;
            console.log("New signed logoUrl:", newLogoUrl);
          }
        }

        // Refetch logoUrlWhite if needed
        if (needsRefetch(logoUrlWhite)) {
          const fileStoreId = extractFileStoreId(logoUrlWhite);
          console.log("Refetching logoUrlWhite with fileStoreId:", fileStoreId);
          if (fileStoreId) {
            const response = await Digit.UploadServices.Filefetch([fileStoreId], stateCode);
            newLogoUrlWhite = response?.data?.fileStoreIds?.[0]?.url || logoUrlWhite;
            console.log("New signed logoUrlWhite:", newLogoUrlWhite);
          }
        }

        // Refetch bannerUrl if needed
        if (needsRefetch(bannerUrl)) {
          const fileStoreId = extractFileStoreId(bannerUrl);
          console.log("Refetching bannerUrl with fileStoreId:", fileStoreId);
          if (fileStoreId) {
            const response = await Digit.UploadServices.Filefetch([fileStoreId], stateCode);
            newBannerUrl = response?.data?.fileStoreIds?.[0]?.url || bannerUrl;
            console.log("New signed bannerUrl:", newBannerUrl);
          }
        }

        console.log("=== Module.js - Final URLs ===");
        console.log("Final logoUrl:", newLogoUrl);
        console.log("Final logoUrlWhite:", newLogoUrlWhite);
        console.log("Final bannerUrl:", newBannerUrl);

        // Update initData with new URLs
        const updatedInitData = {
          ...initData,
          stateInfo: {
            ...initData.stateInfo,
            logoUrl: newLogoUrl,
            logoUrlWhite: newLogoUrlWhite,
            bannerUrl: newBannerUrl,
          }
        };

        setProcessedInitData(updatedInitData);
      } catch (error) {
        console.error("Error fetching signed URLs:", error);
        setProcessedInitData(initData); // Use original data on error
      } finally {
        setIsProcessing(false);
      }
    };

    if (initData && !isLoading && !hasProcessedRef.current) {
      fetchSignedUrls();
    } else if (initData && !isLoading && hasProcessedRef.current) {
      // Already processed, just use initData
      if (!processedInitData) {
        setProcessedInitData(initData);
      }
    }
  }, [initData, isLoading, stateCode]);

  if (isLoading || (isProcessing && !processedInitData)) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  // Use processedInitData if available, otherwise fall back to initData
  const dataToUse = processedInitData || initData;

  const data=getStore(dataToUse, moduleReducers(dataToUse)) || {};
  const i18n = getI18n();
  if(!Digit.ComponentRegistryService.getComponent("PrivacyComponent")){
    Digit.ComponentRegistryService.setComponent("PrivacyComponent", PrivacyComponent);
  }
  return (
    <Provider store={data}>
      <Router>
        <BodyContainer>
          {Digit.Utils.getMultiRootTenant() ? (
            <DigitAppWrapper
              initData={dataToUse}
              stateCode={stateCode}
              modules={dataToUse?.modules}
              appTenants={dataToUse.tenants}
              logoUrl={dataToUse?.stateInfo?.logoUrl}
              logoUrlWhite={dataToUse?.stateInfo?.logoUrlWhite}
              defaultLanding={defaultLanding}
              allowedUserTypes={allowedUserTypes}
            />
          ) : (
            <DigitApp
              initData={dataToUse}
              stateCode={stateCode}
              modules={dataToUse?.modules}
              appTenants={dataToUse.tenants}
              logoUrl={dataToUse?.stateInfo?.logoUrl}
              defaultLanding={defaultLanding}
              allowedUserTypes={allowedUserTypes}
            />
          )}
        </BodyContainer>
      </Router>
    </Provider>
  );
};

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
export const DigitUI = ({ stateCode, registry, enabledModules, moduleReducers, defaultLanding,allowedUserTypes }) => {
  const [privacy, setPrivacy] = useState(Digit.Utils.getPrivacyObject() || {});
  const userType = Digit.UserService.getType();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 15 * 60 * 1000,
        cacheTime: 50 * 60 * 1000,
        retry: false,
        retryDelay: (attemptIndex) => Infinity,
        /*
          enable this to have auto retry incase of failure
          retryDelay: attemptIndex => Math.min(1000 * 3 ** attemptIndex, 60000)
         */
      },
    },
  });

  const ComponentProvider = Digit.Contexts.ComponentProvider;
  const PrivacyProvider = Digit.Contexts.PrivacyProvider;

  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]);

  return (
    <div>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ComponentProvider.Provider value={registry}>
            <PrivacyProvider.Provider
              value={{
                privacy: privacy?.[window.location.pathname],
                resetPrivacy: (_data) => {
                  Digit.Utils.setPrivacyObject({});
                  setPrivacy({});
                },
                getPrivacy: () => {
                  const privacyObj = Digit.Utils.getPrivacyObject();
                  setPrivacy(privacyObj);
                  return privacyObj;
                },
                /*  Descoped method to update privacy object  */
                updatePrivacyDescoped: (_data) => {
                  const privacyObj = Digit.Utils.getAllPrivacyObject();
                  const newObj = { ...privacyObj, [window.location.pathname]: _data };
                  Digit.Utils.setPrivacyObject({ ...newObj });
                  setPrivacy(privacyObj?.[window.location.pathname] || {});
                },
                /**
                 * Main Method to update the privacy object anywhere in the application
                 *
                 * @author jagankumar-egov
                 *
                 * Feature :: Privacy
                 *
                 * @example
                 *    const { privacy , updatePrivacy } = Digit.Hooks.usePrivacyContext();
                 */
                updatePrivacy: (uuid, fieldName) => {
                  setPrivacy(Digit.Utils.updatePrivacy(uuid, fieldName) || {});
                },
              }}
            >
              <DigitUIWrapper stateCode={stateCode} enabledModules={enabledModules} moduleReducers={moduleReducers} defaultLanding={defaultLanding}  allowedUserTypes={allowedUserTypes} />
            </PrivacyProvider.Provider>
          </ComponentProvider.Provider>
        </QueryClientProvider>
      </ErrorBoundary>
    </div>
  );
};

const componentsToRegister = {
  SelectOtp,
  ChangeCity,
  ChangeLanguage,
  LoginSignupSelector,
  ForgotOrganizationTooltip,
  PrivacyComponent,
  OtpComponent,
  EmailWithLinkComponent,
  AccountNameWithLinkComponent,
  EmailWithSignUpLinkComponent,
};

export const initCoreComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
