import React, { Fragment, useEffect, useReducer, useState } from "react";
import { Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
// import { AppConfigTab } from "../NewCampaignCreate/AppFeatures";
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
  const history = useHistory();
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

  const data =
    useEffect(() => {
      if (tabState?.actualData?.length > 0) {
        setNumberTabs(tabState?.numberTabs);
        setCurrentScreen(tabState?.numberTabs?.find((i) => i.active === true));
      }
    }, [tabState]);
  const reqCriteriaTab = {
    url: `/${mdms_context_path}/v2/_search`,
    changeQueryName: `APPCONFIG-${campaignNumber}`,
    body: {
      MdmsCriteria: {
        tenantId: Digit.ULBService.getCurrentTenantId(),
        schemaCode: `${MODULE_CONSTANTS}.${masterName}`,
        filters: {
          project: campaignNumber,
        },
      },
    },
    config: {
      enabled: formId ? true : false,
      select: (data) => {
        tabStateDispatch({
          key: "SET_TAB",
          data: data?.mdms,
        });
        return data?.mdms;
      },
    },
  };

  const { isLoading: isTabLoading, data: tabData } = Digit.Hooks.useCustomAPIHook(reqCriteriaTab);

  if (isTabLoading) return <Loader />;
  return (
    <div>
      {variant === "app" && (
        <>
          {/* <AppConfigTab
            wrapperClassName={"app-config-tab"}
            toggleOptions={numberTabs}
            selectedOption={numberTabs?.find((i) => i.active)?.code}
            handleToggleChange={(tab, index) => {
              // setShowPopUp(tab);
              window.dispatchEvent(new Event("resetStep"));

              tabStateDispatch({
                key: "CHANGE_ACTIVE_TAB",
                tab: tab,
              });
            }}
          /> */}
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
