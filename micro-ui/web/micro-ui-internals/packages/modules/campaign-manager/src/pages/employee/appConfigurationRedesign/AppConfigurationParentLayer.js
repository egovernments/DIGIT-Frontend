import React, { useEffect, useReducer, useState, Fragment } from "react";
import { Loader, Tag, TextBlock, Toast } from "@egovernments/digit-ui-components";
import { Header } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ImpelComponentWrapper from "./ImpelComponentWrapper";
import { restructure, reverseRestructure } from "../../../utils/appConfigHelpers";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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
  const [changeLoader, setChangeLoader] = useState(false);

  useEffect(() => {
    if (currentStep === parentState?.currentTemplate?.length) {
      const event = new CustomEvent("lastButtonDisabled", { detail: true });
      window.dispatchEvent(event);
    } else {
      const event = new CustomEvent("lastButtonDisabled", { detail: false });
      window.dispatchEvent(event);
    }
  }, [currentStep, parentState]);

  useEffect(() => {
    const handleResetStep = () => {
      setCurrentStep(1);
    };

    window.addEventListener("resetStep", handleResetStep);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resetStep", handleResetStep);
    };
  }, []);
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
      cacheTime: 0,
      staleTime: 0,
      select: (data) => {
        const filteredCache = data?.mdms?.find((i) => i.data.flow === formData?.data?.name);
        // return filteredCache ? filteredCache : null;
        return { filteredCache: filteredCache || null, mdms: data?.mdms || [] };
      },
    },
  };

  const { isLoading: isCacheLoading, data: cacheData, refetch: refetchCache } = Digit.Hooks.useCustomAPIHook(reqCriteriaForm);

  const { mutate: updateMutate } = Digit.Hooks.campaign.useUpdateAppConfig(tenantId);

  const closeToast = () => {
    setShowToast(null);
  };

  useEffect(() => {
    if (showToast) {
      setTimeout(closeToast, 10000);
    }
  }, [showToast]);

  useEffect(() => {
    if (!isCacheLoading && Array.isArray(cacheData?.filteredCache?.data?.data)) {
      parentDispatch({
        key: "SET",
        data: [...cacheData?.filteredCache?.data?.data],
        template: cacheData?.filteredCache?.data,
        appIdData: cacheData?.filteredCache?.data?.data,
      });
      setCurrentStep((prev) => (prev ? prev : 1));
      return;
    } else if (
      !isCacheLoading &&
      !Array.isArray(cacheData?.filteredCache?.data?.data) &&
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
  }, [isCacheLoading, cacheData?.filteredCache, isLoadingAppConfigMdmsData, AppConfigMdmsData, formData]);

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

  const submit = async (screenData, finalSubmit, tabChange) => {
    if (!tabChange && !finalSubmit && stepper?.find((i) => i.active)?.isLast && !isNextTabAvailable) {
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
    if (finalSubmit) {
      const mergedTemplate = parentState.currentTemplate.map((item) => {
        const updated = screenData.find((d) => d.name === item.name);
        return updated ? updated : item;
      });
      const reverseData = reverseRestructure(mergedTemplate, AppConfigMdmsData?.[fieldTypeMaster]);
      const reverseFormat =
        cacheData && cacheData?.filteredCache?.data?.data
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

      const allUpdatedFormat = tabState?.actualData?.map((i) => {
        if (i?.id === updatedFormData?.id) {
          return {
            ...updatedFormData,
          };
        } else if (cacheData?.mdms?.find((x) => x?.data?.flow === i?.data?.name)?.data?.data) {
          const reverseData = reverseRestructure(
            cacheData?.mdms?.find((x) => x.id === i.id)?.data?.data?.pages,
            AppConfigMdmsData?.[fieldTypeMaster]
          );
          const reverseFormat = {
            ...cacheData?.mdms?.find((x) => x?.data?.flow === i?.data?.name)?.data?.data,
            version: cacheData?.mdms?.find((x) => x?.data?.flow === i?.data?.name)?.data?.data?.version + 1,
            pages: reverseData,
          };

          return {
            ...reverseFormat,
          };
        } else {
          return {
            ...i,
          };
        }
      });

      setChangeLoader(true);

      try {
        for (const updatedObj of allUpdatedFormat) {
          const checkCache = cacheData?.mdms?.find((x) => x?.data?.flow === updatedObj?.data?.name);
          if (checkCache?.data?.data) {
            await updateMutate(
              {
                moduleName: "HCM-ADMIN-CONSOLE",
                masterName: "AppConfigCache",
                data: {
                  ...checkCache,
                  data: {
                    projectType,
                    campaignNumber,
                    flow: checkCache?.data?.flow,
                    data: null,
                  },
                },
              },
              {
                onError: (error) => {
                  throw error;
                },
              }
            );
          }

          await updateMutate(
            {
              moduleName: "HCM-ADMIN-CONSOLE",
              masterName,
              data: updatedObj,
            },
            {
              onError: (error) => {
                throw error;
              },
            }
          );
        }

        // All updates succeeded
        setShowToast({ key: "success", label: "APP_CONFIGURATION_SUCCESS" });
        setChangeLoader(false);
        queryClient.invalidateQueries(`APPCONFIG-${campaignNumber}`);

        navigate(`/${window.contextPath}/employee/campaign/response?isSuccess=true`, {
          state: {
            message: "APP_CONFIGURATION_SUCCESS_RESPONSE",
            preText: "APP_CONFIGURATION_SUCCESS_RESPONSE_PRE_TEXT",
            actionLabel: "APP_CONFIG_RESPONSE_ACTION_BUTTON",
            actionLink: `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}&tenantId=${tenantId}`,
          },
        });
        return;
      } catch (error) {
        setChangeLoader(false);
        setShowToast({
          key: "error",
          label: error?.response?.data?.Errors?.[0]?.code ? t(error?.response?.data?.Errors?.[0]?.code) : error.message || error,
        });
        return;
      }
    } else if (stepper?.find((i) => i.active)?.isLast || tabChange) {
      const mergedTemplate = parentState.currentTemplate.map((item) => {
        const updated = screenData.find((d) => d.name === item.name);
        return updated ? updated : item;
      });
      const reverseData = reverseRestructure(mergedTemplate, AppConfigMdmsData?.[fieldTypeMaster]);
      const reverseFormat =
        cacheData && cacheData?.filteredCache?.data?.data
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

      setChangeLoader(true);

      await updateMutate(
        {
          moduleName: "HCM-ADMIN-CONSOLE",
          masterName: "AppConfigCache",
          data: {
            ...cacheData?.filteredCache,
            data: {
              projectType: projectType,
              campaignNumber: campaignNumber,
              flow: cacheData?.filteredCache?.data?.flow ? cacheData?.filteredCache?.data?.flow : parentState?.actualTemplate?.name,
              data: null,
            },
          },
        },
        {
          onError: (error, variables) => {
            setShowToast({ key: "error", label: error?.response?.data?.Errors?.[0]?.code ? t(error?.response?.data?.Errors?.[0]?.code) : error });
          },
          onSuccess: async (data) => {
            return null;
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
            setChangeLoader(false);
            setShowToast({ key: "error", label: error?.response?.data?.Errors?.[0]?.code ? t(error?.response?.data?.Errors?.[0]?.code) : error });
          },
          onSuccess: async (data) => {
            setShowToast({ key: "success", label: "APP_CONFIGURATION_SUCCESS" });
            setChangeLoader(false);
            if (tabChange) {
              return;
            } else if (isNextTabAvailable && !finalSubmit) {
              tabStateDispatch({ key: "NEXT_TAB", responseDate: data });
              setCurrentStep(1);
              return;
            } else {
              setChangeLoader(false);
              queryClient.invalidateQueries(`APPCONFIG-${campaignNumber}`);
              navigate(`/${window.contextPath}/employee/campaign/response?isSuccess=true`, {
                state: {
                  message: "APP_CONFIGURATION_SUCCESS_RESPONSE",
                  preText: "APP_CONFIGURATION_SUCCESS_RESPONSE_PRE_TEXT",
                  actionLabel: "APP_CONFIG_RESPONSE_ACTION_BUTTON",
                  actionLink: `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}&tenantId=${tenantId}`,
                },
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
            ...cacheData?.filteredCache,
            data: {
              projectType: projectType,
              campaignNumber: campaignNumber,
              flow: cacheData?.filteredCache?.data?.flow ? cacheData?.filteredCache?.data?.flow : parentState?.actualTemplate?.name,
              data: mergedTemplate,
              version: cacheData?.filteredCache?.data?.version ? cacheData?.filteredCache?.data?.version : parentState?.actualTemplate?.version,
              localeModule: localeModule,
              actualTemplate: cacheData?.filteredCache?.data?.actualTemplate
                ? cacheData?.filteredCache?.data?.actualTemplate
                : parentState?.actualTemplate,
            },
          },
        },
        {
          onError: (error, variables) => {
            setShowToast({ key: "error", label: error?.response?.data?.Errors?.[0]?.code ? t(error?.response?.data?.Errors?.[0]?.code) : error });
          },
          onSuccess: async (data) => {
            refetchCache();
          },
        }
      );
      setCurrentStep((prev) => prev + 1);
    }
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
  if (changeLoader) {
    return <Loader className="loader-center" page={true} variant={"Overlayloader"} loaderText={t("HCM_CHANGING_MODULE")} />;
  }

  return (
    <div>
      <Header className="app-config-header">
        <div className="app-config-header-group" style={{ display: "flex", alignItems: "center" }}>
          {t(`APP_CONFIG_HEADING_LABEL`)}
          <Tag
            stroke={true}
            showIcon={false}
            label={`${t("APPCONFIG_VERSION")} - ${parentState?.actualTemplate?.version}`}
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
    </div>
  );
};

export default AppConfigurationParentRedesign;
