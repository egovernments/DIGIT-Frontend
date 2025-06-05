import React, { useEffect, useMemo, useReducer, useState } from "react";
import { Button, Footer, Loader, Stepper, Toast, Tooltip } from "@egovernments/digit-ui-components";
import { Header } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import ImpelComponentWrapper from "./ImpelComponentWrapper";
import { restructure, reverseRestructure } from "../../../utils/appConfigHelpers";
import Tabs from "./Tabs";

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

const AppConfigurationParentRedesign = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  const MODULE_CONSTANTS = "HCM-ADMIN-CONSOLE";
  const searchParams = new URLSearchParams(location.search);
  const masterName = searchParams.get("masterName");
  const fieldTypeMaster = searchParams.get("fieldType");
  const campaignNumber = searchParams.get("campaignNumber");
  const variant = searchParams.get("variant");
  const formId = searchParams.get("formId");
  const [parentState, parentDispatch] = useReducer(dispatcher, {});
  const [numberTabs, setNumberTabs] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepper, setStepper] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const [currentScreen, setCurrentScreen] = useState({});
  const localeModule = useMemo(() => {
    if (parentState?.actualTemplate?.name && parentState?.actualTemplate?.project) {
      return `hcm-${parentState.actualTemplate.name.toLowerCase()}-${parentState.actualTemplate.project}`;
    }
    return null;
  }, [parentState?.actualTemplate?.name, parentState?.actualTemplate?.project]);

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
    body: {
      MdmsCriteria: {
        tenantId: Digit.ULBService.getCurrentTenantId(),
        schemaCode: `${MODULE_CONSTANTS}.${masterName}`,
        isActive: true,
        filters: {
          project: campaignNumber,
        },
      },
    },
    config: {
      enabled: formId ? true : false,
      select: (data) => {
        return data?.mdms?.[0];
      },
    },
  };

  const { isLoading, data: formData } = Digit.Hooks.useCustomAPIHook(reqCriteriaForm);

  const { mutate: updateMutate } = Digit.Hooks.campaign.useUpdateAppConfig(tenantId);

  useEffect(() => {
    if (showToast) {
      setTimeout(closeToast, 10000);
    }
  }, [showToast]);

  useEffect(() => {
    if (!isLoading && formData && formId && AppConfigMdmsData?.[fieldTypeMaster]?.length > 0) {
      const fieldTypeMasterData = AppConfigMdmsData?.[fieldTypeMaster] || [];
      const temp = restructure(formData?.data?.pages, fieldTypeMasterData, formData?.data);
      parentDispatch({
        key: "SET",
        data: [...temp],
        template: formData?.data,
        appIdData: formData?.data,
      });
    }
  }, [isLoadingAppConfigMdmsData, AppConfigMdmsData, formData]);

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

  if (isLoadingAppConfigMdmsData || !parentState?.currentTemplate || parentState?.currentTemplate?.length === 0) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  const submit = async (screenData) => {
    parentDispatch({
      key: "SETBACK",
      data: screenData,
      isSubmit: stepper?.find((i) => i.active)?.isLast ? true : false,
    });
    if (stepper?.find((i) => i.active)?.isLast) {
      const mergedTemplate = parentState.currentTemplate.map((item) => {
        const updated = screenData.find((d) => d.name === item.name);
        return updated ? updated : item;
      });
      const reverseData = reverseRestructure(mergedTemplate, AppConfigMdmsData?.[fieldTypeMaster]);
      // const nextTabAvailable = numberTabs.some((tab) => tab.code > currentStep.code && tab.active);
      const reverseFormat = {
        ...parentState?.actualTemplate,
        version: parentState?.actualTemplate?.version + 1,
        pages: reverseData,
      };

      const updatedFormData = { ...formData, data: reverseFormat };

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
            history.push(`/${window.contextPath}/employee/campaign/response?isSuccess=true`, {
              message: "APP_CONFIGURATION_SUCCESS_RESPONSE",
              preText: "APP_CONFIGURATION_SUCCESS_RESPONSE_PRE_TEXT",
              actionLabel: "APP_CONFIG_RESPONSE_ACTION_BUTTON",
              actionLink: `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}&tenantId=${tenantId}`,
            });
          },
        }
      );
      // if (nextTabAvailable) {
      //   setNumberTabs((prev) => {
      //     return prev.map((tab) => {
      //       // Activate only the next tab (currentStep.code + 1)
      //       if (tab.code === prev.find((j) => j.active).code + 1) {
      //         return { ...tab, active: true }; // Activate the next tab
      //       }
      //       return { ...tab, active: false }; // Deactivate all others
      //     });
      //   });
      //   return;
      // } else {
      //   setShowToast({ key: "success", label: "APP_CONFIGURATION_SUCCESS" });
      //   return;
      // }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const back = () => {
    if (stepper?.find((i) => i.active)?.isFirst) {
      setShowToast({ key: "error", label: "CANNOT_GO_BACK" });
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div>
      <Header className="app-config-header">
        <div>{t(`${currentScreen?.[0]?.name}`)}</div>
        <div style={{ fontSize: "1rem" }}>{`(${t(`APPCONFIG_VERSION`)} - ${parentState?.actualTemplate?.version})`}</div>
      </Header>
      {variant === "app" && (
        <Tabs
          numberTabs={numberTabs}
          onTabChange={(tab, index) => {
            setNumberTabs((prev) => {
              return prev.map((j) => {
                if (j.parent === tab.parent) {
                  return {
                    ...j,
                    active: true,
                  };
                }
                return {
                  ...j,
                  active: false,
                };
              });
            });
            setCurrentStep(1);
          }}
        />
      )}
      <ImpelComponentWrapper
        variant={variant}
        screenConfig={currentScreen}
        submit={submit}
        back={back}
        showBack={true}
        parentDispatch={parentDispatch}
        AppConfigMdmsData={AppConfigMdmsData}
        localeModule={localeModule}
      />
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
