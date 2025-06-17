import React, { Fragment, useEffect, useMemo, useReducer, useState } from "react";
import { Button, CardText, Loader, PopUp, Stepper, Tag, TextBlock, Toast, Tooltip } from "@egovernments/digit-ui-components";
import { Header } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { AppConfigTab } from "../NewCampaignCreate/AppFeatures";
import AppConfigurationParentRedesign from "./AppConfigurationParentLayer";

const tabDispatcher = (state, action) => {
  switch (action.key) {
    case "SET_TAB":
      return {
        actualData: action.data,
        numberTabs:
          action?.data?.map((i, c) => ({
            id: i?.id,
            active: c === 0 ? true : false,
            code: i?.data?.name,
            data: i?.data,
            version: i?.data?.version,
            disabled : !i?.data?.isSelected
          })) || [],
        activeTabConfig: action?.data?.[0],
      };
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
  const MODULE_CONSTANTS = "HCM-ADMIN-CONSOLE";
  const searchParams = new URLSearchParams(location.search);
  const masterName = searchParams.get("masterName");
  const campaignNumber = searchParams.get("campaignNumber");
  const variant = searchParams.get("variant");
  const formId = searchParams.get("formId");
  const [numberTabs, setNumberTabs] = useState([]);
  const [currentScreen, setCurrentScreen] = useState({});
  const [tabState, tabStateDispatch] = useReducer(tabDispatcher, {});
  const [showPopUp, setShowPopUp] = useState(null);
  useEffect(() => {
    if (tabState?.actualData?.length > 0) {
      setNumberTabs(tabState?.numberTabs);
      setCurrentScreen(tabState?.numberTabs?.find((i) => i.active === true));
    }
  }, [tabState]);
  const reqCriteriaTab = {
    url: `/${mdms_context_path}/v2/_search`,
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

  console.log("tabs" , numberTabs , tabData );

  if (isTabLoading) return <Loader />;
  return (
    <div>
      {variant === "app" && (
        <>
          <AppConfigTab
            wrapperClassName={"app-config-tab"}
            toggleOptions={numberTabs}
            selectedOption={numberTabs?.find((i) => i.active)?.code}
            handleToggleChange={(tab, index) => {
              setShowPopUp(tab);
              // tabStateDispatch({
              //   key: "CHANGE_ACTIVE_TAB",
              //   tab: tab,
              // });
            }}
          />
          <AppConfigurationParentRedesign
            tabState={tabState}
            formData={tabState?.activeTabConfig}
            tabStateDispatch={tabStateDispatch}
            isNextTabAvailable={numberTabs.findIndex((tab) => tab.active) < numberTabs?.length - 1}
            isPreviousTabAvailable={numberTabs.findIndex((tab) => tab.active) > 0}
          />
        </>
      )}
      {showPopUp && (
        <PopUp
          className={"boundaries-pop-module"}
          type={"default"}
          heading={t("APP_CONFIG_NOT_SAVED_WARNING_HEADER")}
          children={[
            <div>
              <CardText style={{ margin: 0 }}>{t("APP_CONFIG_NOT_SAVED_WARNING")}</CardText>
            </div>,
          ]}
          onOverlayClick={() => {
            setShowPopUp(false);
          }}
          onClose={() => {
            setShowPopUp(false);
          }}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("APP_CONFIG_NOT_SAVED_WARNING_MODAL_BACK")}
              onClick={() => {
                showPopUp(null);
              }}
            />,
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("APP_CONFIG_NOT_SAVED_WARNING_MODAL_SUBMIT")}
              onClick={() => {
                tabStateDispatch({
                  key: "CHANGE_ACTIVE_TAB",
                  tab: showPopUp,
                });
                setShowPopUp(null);
              }}
            />,
          ]}
          sortFooterChildren={true}
        ></PopUp>
      )}
    </div>
  );
};

export default AppConfigurationTabLayer;
