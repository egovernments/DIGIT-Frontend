import React, { useEffect, useMemo, useReducer, useState, Fragment } from "react";
import { Button, Footer, Loader, Stepper, Tag, TextBlock, Toast } from "@egovernments/digit-ui-components";
import { Header } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import ImpelComponentWrapper from "./ImpelComponentWrapper";
import { restructure, reverseRestructure } from "../../../utils/appConfigHelpers";
import { AppConfigTab } from "../NewCampaignCreate/AppFeatures";

const dispatcher = (state, action) => {
  switch (action.key) {
    case "SET":
      return {
        appTemplate: action.data,
        currentTemplate: action.data,
        actualTemplate: action.template,
      };
    case "SETBACK":
      return {
        ...state,
        currentTemplate: state.currentTemplate.map((i) => {
          if (i?.name === action?.data?.[0]?.name) {
            return action?.data?.[0];
          }
          return i;
        }),
      };
    case "SETFORM":
      return {
        appTemplate: action.data,
        currentTemplate: action.data,
      };
    default:
      return state;
  }
};

const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

const AppConfigurationParentRedesign = ({ formData = null, isNextTabAvailable, isPreviousTabAvailable, tabStateDispatch, tabState }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  const MODULE_CONSTANTS = "HCM-ADMIN-CONSOLE";
  const searchParams = new URLSearchParams(location.search);
  const masterName = searchParams.get("masterName");
  const fieldTypeMaster = searchParams.get("fieldType");
  const projectType = searchParams.get("projectType");
  const campaignNumber = searchParams.get("campaignNumber");
  const variant = searchParams.get("variant");
  const formId = searchParams.get("formId");
  const [parentState, parentDispatch] = useReducer(dispatcher, {});
  const [numberTabs, setNumberTabs] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepper, setStepper] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const [currentScreen, setCurrentScreen] = useState({});
  const [localeModule, setLocaleModule] = useState(null);

  // const localeModule = useMemo(() => {
  //   if (parentState?.actualTemplate?.name && parentState?.actualTemplate?.project) {
  //     return `hcm-${parentState.actualTemplate.name.toLowerCase()}-${parentState.actualTemplate.project}`;
  //   }
  //   return null;
  // }, [parentState?.actualTemplate?.name, parentState?.actualTemplate?.project]);

  useEffect(() => {
    const template = parentState?.actualTemplate;
    if (parentState?.actualTemplate?.localeModule) {
      setLocaleModule(parentState?.actualTemplate?.localeModule);
    } else if (template?.name && template?.project) {
      setLocaleModule(`hcm-${template.name.toLowerCase()}-${template.project}`);
    }
  }, [parentState?.actualTemplate?.name, parentState?.actualTemplate?.project, parentState?.actualTemplate?.localeModule]);

  const { isLoading: isLoadingAppConfigMdmsData, data: AppConfigMdmsData } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    MODULE_CONSTANTS,
    [{ name: fieldTypeMaster, limit: 100 }],
    {
      cacheTime: Infinity,
      staleTime: Infinity,
      select: (data) => {
        return data?.[MODULE_CONSTANTS];
      },
    },
    { schemaCode: "BASE_APP_MASTER_DATA3" } //mdmsv2
  );

  const reqCriteriaForm = {
    url: `/${mdms_context_path}/v2/_search`,
    changeQueryName: `APP_CONFIG_CACHE_${formData?.id}`,
    body: {
      MdmsCriteria: {
        tenantId: Digit.ULBService.getCurrentTenantId(),
        schemaCode: `${MODULE_CONSTANTS}.AppConfigCache`,
        isActive: true,
        filters: {
          campaignNumber: campaignNumber,
        },
      },
    },
    config: {
      enabled: formId ? true : false,
      select: (data) => {
        const filteredCache = data?.mdms?.find((i) => i.data.flow === formData?.data?.name);
        return filteredCache ? filteredCache : null;
      },
    },
  };

  const { isLoading: isCacheLoading, data: cacheData, refetch: refetchCache } = Digit.Hooks.useCustomAPIHook(reqCriteriaForm);
  // const { mutate: updateCache } = Digit.Hooks.campaign.useUpdateCache(tenantId);

  const { mutate: updateMutate } = Digit.Hooks.campaign.useUpdateAppConfig(tenantId);

  useEffect(() => {
    if (showToast) {
      setTimeout(closeToast, 10000);
    }
  }, [showToast]);

  //TODO CHECK FOR AUTO SAVE
  // MDMS CALL WITH PROJECT TYPE AND CAMPAIGN NUMBER AND FLOW NAME
  //CHECK IF DATA THERE THEN SAVE PARENT STATE AS THAT OR COMING FORMDATA

  useEffect(() => {
    if (!isCacheLoading && Array.isArray(cacheData?.data?.data)) {
      parentDispatch({
        key: "SET",
        data: [...cacheData?.data?.data],
        template: cacheData?.data,
        appIdData: cacheData?.data?.data,
      });
      setCurrentStep((prev) => (prev ? prev : 1));
      return;
    } else if (
      !isCacheLoading &&
      !Array.isArray(cacheData?.data?.data) &&
      formData?.data &&
      formId &&
      AppConfigMdmsData?.[fieldTypeMaster]?.length > 0
    ) {
      const fieldTypeMasterData = AppConfigMdmsData?.[fieldTypeMaster] || [];
      const temp = restructure(formData?.data?.pages, fieldTypeMasterData, formData?.data);
      parentDispatch({
        key: "SET",
        data: [...temp],
        template: formData?.data,
        appIdData: formData?.data,
      });
      setCurrentStep(1);
    }
  }, [isCacheLoading, cacheData, isLoadingAppConfigMdmsData, AppConfigMdmsData, formData]);

  useEffect(() => {
    setNumberTabs(
      [...new Set((parentState?.currentTemplate || [])?.map((i) => i?.parent))].map((i, index) => {
        return { parent: i, active: index === 0 ? true : false, code: index + 1 };
      })
    );
  }, [parentState?.currentTemplate]);

  useEffect(() => {
    setStepper(
      (parentState?.currentTemplate || [])
        ?.filter((i) => i.parent === numberTabs.find((j) => j.active)?.parent)
        .sort((a, b) => a.order - b.order)
        ?.map((k, j, t) => ({
          name: k.name,
          isLast: j === t.length - 1 ? true : false,
          isFirst: j === 0 ? true : false,
          active: j === currentStep - 1 ? true : false,
        }))
    );
  }, [parentState?.currentTemplate, numberTabs, currentStep]);

  useEffect(() => {
    if (variant === "app" && parentState?.currentTemplate?.length > 0 && currentStep && numberTabs?.length > 0) {
      const findActiveParent = numberTabs?.find((i) => i?.active)?.parent;
      setCurrentScreen(parentState?.currentTemplate.filter((i) => i?.parent === findActiveParent)?.filter((i) => i?.order === currentStep));
    } else {
      setCurrentScreen(parentState?.currentTemplate);
    }
  }, [parentState?.currentTemplate, currentStep, numberTabs]);

  if (isCacheLoading || isLoadingAppConfigMdmsData || !parentState?.currentTemplate || parentState?.currentTemplate?.length === 0) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  const submit = async (screenData, finalSubmit) => {
    if (!finalSubmit && stepper?.find((i) => i.active)?.isLast && !isNextTabAvailable) {
      setShowToast({ key: "error", label: "LAST_PAGE_ERROR" });
      return;
    }
    parentDispatch({
      key: "SETBACK",
      data: screenData,
      isSubmit: stepper?.find((i) => i.active)?.isLast || finalSubmit ? true : false,
    });
    const mergedTemplate = parentState.currentTemplate.map((item) => {
      const updated = screenData.find((d) => d.name === item.name);
      return updated ? updated : item;
    });
    if (stepper?.find((i) => i.active)?.isLast || finalSubmit) {
      //TODO LAST UPDATE WE WILL CLEAR SAVE MDMS AND SAVE TO FINAL MDMS
      const mergedTemplate = parentState.currentTemplate.map((item) => {
        const updated = screenData.find((d) => d.name === item.name);
        return updated ? updated : item;
      });
      const reverseData = reverseRestructure(mergedTemplate, AppConfigMdmsData?.[fieldTypeMaster]);
      // const nextTabAvailable = numberTabs.some((tab) => tab.code > currentStep.code && tab.active);
      const reverseFormat = cacheData
        ? {
            ...parentState?.actualTemplate?.actualTemplate,
            version: parentState?.actualTemplate?.version + 1,
            pages: reverseData,
          }
        : {
            ...parentState?.actualTemplate,
            version: parentState?.actualTemplate?.version + 1,
            pages: reverseData,
          };

      const updatedFormData = { ...formData, data: reverseFormat };

      await updateMutate(
        {
          moduleName: "HCM-ADMIN-CONSOLE",
          masterName: "AppConfigCache",
          data: {
            ...cacheData,
            data: {
              projectType: projectType,
              campaignNumber: campaignNumber,
              flow: cacheData?.data?.flow ? cacheData?.data?.flow : parentState?.actualTemplate?.name,
              data: null,
            },
          },
        },
        {
          onError: (error, variables) => {
            setShowToast({ key: "error", label: error?.response?.data?.Errors?.[0]?.code ? error?.response?.data?.Errors?.[0]?.code : error });
          },
          onSuccess: async (data) => {
            // setShowToast({ key: "success", label: "CACHE_CLEAR" });
          },
        }
      );
      await updateMutate(
        {
          moduleName: "HCM-ADMIN-CONSOLE",
          masterName: masterName,
          data: updatedFormData,
        },
        {
          onError: (error, variables) => {
            setShowToast({ key: "error", label: error?.response?.data?.Errors?.[0]?.code ? error?.response?.data?.Errors?.[0]?.code : error });
          },
          onSuccess: async (data) => {
            setShowToast({ key: "success", label: "APP_CONFIGURATION_SUCCESS" });
            if (isNextTabAvailable && !finalSubmit) {
              tabStateDispatch({ key: "NEXT_TAB", responseDate: data });
              setCurrentStep(1);
              return;
            } else {
              history.push(`/${window.contextPath}/employee/campaign/response?isSuccess=true`, {
                message: "APP_CONFIGURATION_SUCCESS_RESPONSE",
                preText: "APP_CONFIGURATION_SUCCESS_RESPONSE_PRE_TEXT",
                actionLabel: "APP_CONFIG_RESPONSE_ACTION_BUTTON",
                actionLink: `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}&tenantId=${tenantId}`,
              });
              return;
            }
          },
        }
      );
    } else {
      await updateMutate(
        {
          moduleName: "HCM-ADMIN-CONSOLE",
          masterName: "AppConfigCache",
          data: {
            ...cacheData,
            data: {
              projectType: projectType,
              campaignNumber: campaignNumber,
              flow: cacheData?.data?.flow ? cacheData?.data?.flow : parentState?.actualTemplate?.name,
              data: mergedTemplate,
              version: cacheData?.data?.version ? cacheData?.data?.version : parentState?.actualTemplate?.version,
              localeModule: localeModule,
              actualTemplate: cacheData?.data?.actualTemplate ? cacheData?.data?.actualTemplate : parentState?.actualTemplate,
            },
          },
        },
        {
          onError: (error, variables) => {
            setShowToast({ key: "error", label: error?.response?.data?.Errors?.[0]?.code ? error?.response?.data?.Errors?.[0]?.code : error });
          },
          onSuccess: async (data) => {
            // setShowToast({ key: "success", label: "CACHE_DONE" });
            refetchCache();
          },
        }
      );
      setCurrentStep((prev) => prev + 1);
    }
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const back = () => {
    if (stepper?.find((i) => i.active)?.isFirst && isPreviousTabAvailable) {
      tabStateDispatch({ key: "PREVIOUS_TAB" });
      setCurrentStep(1);
      return;
    } else if (stepper?.find((i) => i.active)?.isFirst && !isPreviousTabAvailable) {
      setShowToast({ key: "error", label: "CANNOT_GO_BACK" });
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div>
      <Header className="app-config-header">
        <div className="app-config-header-group" style={{ display: "flex", alignItems: "center" }}>
          {t(`APP_CONFIG_HEADING_LABEL`)}
          {/* {t(`${currentScreen?.[0]?.name}`)} */}
          <Tag
            stroke={true}
            showIcon={false}
            label={`${t("APPCONFIG_VERSION")} - ${parentState?.actualTemplate?.version}`}
            style={{ background: "#EFF8FF", height: "fit-content" }}
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
            <ImpelComponentWrapper
              variant={variant}
              screenConfig={currentScreen}
              submit={submit}
              back={back}
              showBack={true}
              parentDispatch={parentDispatch}
              AppConfigMdmsData={AppConfigMdmsData}
              localeModule={localeModule}
              pageTag={`${t("CMN_PAGE")} ${currentStep} / ${stepper?.length}`}
            />
          </div>
          {/* <span className="app-config-tag-page-fixed"> {`${t("CMN_PAGE")} ${currentStep} / ${stepper?.length}`}</span> */}
        </div>
      </div>
      {showToast && (
        <Toast
          type={showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : showToast?.key === "warning" ? "warning" : "success"}
          label={t(showToast?.label)}
          transitionTime={showToast.transitionTime}
          onClose={closeToast}
        />
      )}
      {/* <Footer
        actionFields={[
          <Button
            type={"button"}
            style={{ marginLeft: "2.5rem", width: "14rem" }}
            label={t("HCM_BACK")}
            variation={"secondary"}
            t={t}
            onClick={() => {}}
          ></Button>,
          <Button type={"button"} label={t("PROCEED_TO_PREVIEW")} variation={"primary"} onClick={() => {}} style={{ width: "14rem" }} t={t}></Button>,
        ]}
        className={"new-actionbar"}
      /> */}
    </div>
  );
};

export default AppConfigurationParentRedesign;
