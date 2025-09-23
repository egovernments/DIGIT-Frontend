import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { initializeConfig } from "./redux/remoteConfigSlice";
import { getFieldMaster } from "./redux/fieldMasterSlice";
import { getFieldPanelMaster } from "./redux/fieldPanelPropertiesSlice";
import { fetchLocalization, fetchAppScreenConfig, setLocalizationData } from "./redux/localizationSlice";
import { Header } from "@egovernments/digit-ui-react-components";
import { Loader, Tag, TextBlock } from "@egovernments/digit-ui-components";
import IntermediateWrapper from "./IntermediateWrapper";

const AppConfigurationWrapper = ({ flow = "REGISTRATION-DELIVERY", localeModule = "hcm-registrationflow-CMP-2025-09-19-006993" }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const fieldMasterName = searchParams.get("fieldType");
  const { t } = useTranslation();
  const mdmsContext = window.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH");
  const MODULE_CONSTANTS = "HCM-ADMIN-CONSOLE";
  const dispatch = useDispatch();
  const enabledModules = Digit?.SessionStorage.get("initData")?.languages || [];
  const currentLocale = Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage;

  // Redux selectors
  const { remoteData: actualState, currentData } = useSelector((state) => state.remoteConfig);
  const { status: localizationStatus, data: localizationData } = useSelector((state) => state.localization);

  console.log("localizationData", localizationData);
  useEffect(() => {
    // Initialize remote config
    dispatch(initializeConfig());

    // Fetch field master if specified
    if (fieldMasterName) {
      dispatch(
        getFieldMaster({
          tenantId,
          moduleName: MODULE_CONSTANTS,
          name: fieldMasterName,
          mdmsContext: mdmsContext,
          limit: 10000,
        })
      );
    }

    // Fetch field panel master
    dispatch(
      getFieldPanelMaster({
        tenantId,
        moduleName: MODULE_CONSTANTS,
        name: "FieldPropertiesPanelConfig",
        mdmsContext: mdmsContext,
        limit: 10000,
      })
    );

    // Fetch localization data if locale module is provided
    if (localeModule) {
      dispatch(
        fetchLocalization({
          tenantId,
          localeModule,
          enabledModules,
        })
      );

      dispatch(fetchAppScreenConfig({ tenantId }));

      // Set localization context data
      dispatch(
        setLocalizationData({
          localisationData: localizationData,
          currentLocale,
          enabledModules,
          localeModule,
        })
      );
    }
  }, [dispatch, fieldMasterName, localeModule, tenantId, mdmsContext, currentLocale]);

  console.log("currentData", currentData, actualState);

  if (!currentData || (localeModule && localizationStatus === "loading")) {
    return <Loader />;
  }

  return (
    <div>
      <Header className="app-config-header">
        <div className="app-config-header-group" style={{ display: "flex", alignItems: "center" }}>
          {t(`APP_CONFIG_HEADING_LABEL`)}
          <Tag
            stroke={true}
            showIcon={false}
            label={`${t("APPCONFIG_VERSION")} - ${currentData?.version}`}
            style={{ background: "#EFF8FF", height: "fit-content" }}
            className={"version-tag"}
          />
        </div>
      </Header>
      <TextBlock body="" caption={t("CMP_DRAWER_WHAT_IS_APP_CONFIG_SCREEN")} header="" captionClassName="camp-drawer-caption" subHeader="" />
      <div style={{ display: "flex" }}>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              marginLeft: "30.5rem",
              gap: "5rem",
            }}
          >
            <IntermediateWrapper />
            {/* <ImpelComponentWrapper
              variant={variant}
              screenConfig={currentScreen}
              submit={submit}
              back={back}
              showBack={true}
              parentDispatch={parentDispatch}
              AppConfigMdmsData={AppConfigMdmsData}
              localeModule={localeModule}
              pageTag={`${t("CMN_PAGE")} ${currentStep} / ${stepper?.length}`}
            /> */}
          </div>
        </div>
      </div>
      {/* {showToast && (
        <Toast
          type={showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : showToast?.key === "warning" ? "warning" : "success"}
          label={t(showToast?.label)}
          transitionTime={showToast.transitionTime}
          onClose={closeToast}
        />
      )} */}
    </div>
  );
};

export default AppConfigurationWrapper;
