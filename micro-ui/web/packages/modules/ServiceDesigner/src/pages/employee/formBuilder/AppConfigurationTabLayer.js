import React, { Fragment, useEffect, useReducer, useState, useCallback, useMemo } from "react";
import { Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import AppConfigurationParentRedesign from "./AppConfigurationParentLayer";

const tabDispatcher = (state, action) => {
  switch (action.key) {
    case "SET_TAB": {
      let firstSelectedFound = false;
      const sortedData = action?.data?.filter((i) => i?.data?.isSelected)?.sort((a, b) => a?.data?.order - b?.data?.order);
      const temp =
        sortedData
          ?.map((i, c) => {
            const isSelected = i?.data?.isSelected;
            let active = false;
            if (isSelected && !firstSelectedFound) {
              active = true;
              firstSelectedFound = true;
            }
            return {
              id: i?.id,
              active: active,
              code: i?.data?.name,
              data: i?.data,
              version: i?.data?.version,
              disabled: !i?.data?.isSelected,
            };
          })
          ?.filter((i) => !i?.disabled) || [];
      return {
        actualData: action.data,
        numberTabs:
          sortedData
            ?.map((i, c) => ({
              id: i?.id,
              active: c === 0 ? true : false,
              code: i?.data?.name,
              data: i?.data,
              version: i?.data?.version,
              disabled: !i?.data?.isSelected,
            }))
            ?.filter((i) => !i?.disabled) || [],
        activeTabConfig: sortedData?.find((i) => i.id === temp?.find((i) => i.active)?.id),
      };
    }
    case "CHANGE_ACTIVE_TAB":
      return {
        ...state,
        numberTabs: state?.numberTabs?.map((i, c) => {
          if (i?.code === action?.tab) {
            return {
              ...i,
              active: true,
            };
          } else {
            return {
              ...i,
              active: false,
            };
          }
        }),
        activeTabConfig: state?.actualData?.find((i) => i?.data?.name === action?.tab),
      };
    case "NEXT_TAB": {
      const currentIndex = state?.numberTabs?.findIndex((tab) => tab.active);
      return {
        ...state,
        numberTabs: state?.numberTabs?.map((i, c) => ({
          ...i,
          active: c === currentIndex + 1,
        })),
        activeTabConfig: state?.actualData?.find((i, c) => c === currentIndex + 1),
      };
    }
    case "PREVIOUS_TAB": {
      const currentIndex = state?.numberTabs?.findIndex((tab) => tab.active);
      return {
        ...state,
        numberTabs: state?.numberTabs?.map((i, c) => ({
          ...i,
          active: c === currentIndex - 1,
        })),
        activeTabConfig: state?.actualData?.find((i, c) => c === currentIndex - 1),
      };
    }
    default:
      return state;
  }
};

const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

const AppConfigurationTabLayer = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const MODULE_CONSTANTS = "Studio";
  const searchParams = new URLSearchParams(location.search);
  const masterName = searchParams.get("masterName");
  const campaignNumber = searchParams.get("campaignNumber");
  const variant = searchParams.get("variant");
  const formId = searchParams.get("formId");
  const [numberTabs, setNumberTabs] = useState([]);
  const [currentScreen, setCurrentScreen] = useState({});
  const [tabState, tabStateDispatch] = useReducer(tabDispatcher, {});
  const [showPopUp, setShowPopUp] = useState(null);

  // State for form name and description
  const [formName, setFormName] = useState(searchParams.get("formName") || "");
  const [formDescription, setFormDescription] = useState(searchParams.get("formDescription") || "");

  // Track if initial data has been set to prevent re-dispatching
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (tabState?.actualData?.length > 0) {
      setNumberTabs(tabState?.numberTabs);
      setCurrentScreen(tabState?.numberTabs?.find((i) => i.active === true));
    }
  }, [tabState]);

  // Memoize the select function to prevent new reference on each render
  const selectCallback = useCallback((data) => {
    return data?.mdms;
  }, []);

  // Memoize the request body to prevent new object reference on each render
  const requestBody = useMemo(() => ({
    MdmsCriteria: {
      tenantId: Digit.ULBService.getCurrentTenantId(),
      schemaCode: `${MODULE_CONSTANTS}.${masterName}`,
      filters: {
        project: campaignNumber,
      },
    },
  }), [masterName, campaignNumber]);

  // Memoize the entire request criteria object
  const reqCriteriaTab = useMemo(() => ({
    url: `/${mdms_context_path}/v2/_search`,
    changeQueryName: `APPCONFIG-${campaignNumber}`,
    body: requestBody,
    config: {
      enabled: formId ? true : false,
      select: selectCallback,
      // Prevent refetching on window focus or mount if data exists
      staleTime: 60000,
      refetchOnWindowFocus: false,
    },
  }), [campaignNumber, requestBody, selectCallback, formId]);

  const { isLoading: isTabLoading, data: tabData } = Digit.Hooks.useCustomAPIHook(reqCriteriaTab);

  // Use effect to dispatch SET_TAB only once when data arrives
  useEffect(() => {
    if (tabData && !isInitialized) {
      tabStateDispatch({
        key: "SET_TAB",
        data: tabData,
      });
      setIsInitialized(true);
    }
  }, [tabData, isInitialized]);

  if (isTabLoading) return <Loader />;

  return (
    <div>
      {variant === "app" && (
        <>
          <AppConfigurationParentRedesign
            tabState={tabState}
            formData={tabState?.activeTabConfig}
            tabStateDispatch={tabStateDispatch}
            isNextTabAvailable={numberTabs.findIndex((tab) => tab.active) < numberTabs?.length - 1}
            isPreviousTabAvailable={numberTabs.findIndex((tab) => tab.active) > 0}
            formName={formName}
            formDescription={formDescription}
            onFormNameChange={setFormName}
            onFormDescriptionChange={setFormDescription}
          />
        </>
      )}
    </div>
  );
};

export default AppConfigurationTabLayer;