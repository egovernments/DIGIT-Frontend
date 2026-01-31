import React, { useEffect, useReducer, useState, Fragment } from "react";
import { Loader, Tag, TextBlock, Toast } from "@egovernments/digit-ui-components";
import { Header } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import ImpelComponentWrapper from "./ImpelComponentWrapper";
import { restructure, reverseRestructure } from "../../../utils/appConfigHelpers";
import { useQueryClient } from "react-query";

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

const AppConfigurationParentRedesign = ({
  formData = null,
  revalidateForm,
  isNextTabAvailable,
  isPreviousTabAvailable,
  tabStateDispatch,
  tabState,
}) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
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
  const [changeLoader, setChangeLoader] = useState(false);

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
    [{ name: fieldTypeMaster, limit: 1000 }],
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

  const currentTabPages = React.useMemo(() => {
    const activeParent = numberTabs.find((j) => j.active)?.parent;
    return (parentState?.currentTemplate || [])
      .filter((i) => i.parent === activeParent)
      .sort((a, b) => Number(a.order) - Number(b.order));
  }, [parentState?.currentTemplate, numberTabs]);

useEffect(() => {
  const last = currentTabPages.length
    ? Number(currentTabPages[currentTabPages.length - 1].order)
    : null;

  const isLast = last != null && Math.abs(Number(currentStep) - last) < 1e-6;
  
  // Check if there's only one page in the current tab - if so, disable Next
  const isSinglePage = currentTabPages.length === 1;

  // Dispatch immediately - this runs synchronously
  window.dispatchEvent(new CustomEvent("lastButtonDisabled", { 
    detail: isLast || isSinglePage 
  }));
}, [currentStep, currentTabPages]);


// ALSO ADD: Dispatch the event immediately when currentTabPages changes
// Add this new useEffect right after the above one:

useEffect(() => {
  // This ensures the button state is set immediately when pages load
  if (currentTabPages.length > 0) {
    const last = Number(currentTabPages[currentTabPages.length - 1].order);
    const isLast = Math.abs(Number(currentStep) - last) < 1e-6;
    const isSinglePage = currentTabPages.length === 1;
    
    window.dispatchEvent(new CustomEvent("lastButtonDisabled", { 
      detail: isLast || isSinglePage 
    }));
  }
}, [currentTabPages]); // Only dep


  // Build the ordered list of valid steps once.
  // 👉 Replace p.step / p.order / p.name with whatever your source-of-truth field is.
  const availableSteps = React.useMemo(() => {
    const raw = (parentState?.steps
      || parentState?.stepOrder
      || (parentState?.currentTemplate || []).map((p) => p?.step || p?.order || p?.name)
    );

    return (raw || [])
      .map((x) => parseFloat(String(x)))
      .filter((n) => Number.isFinite(n))
      .sort((a, b) => a - b);
  }, [parentState]);

  const round1 = (n) => Number(n.toFixed(1));

  const nextStepFrom = (current) => {
    const cur = Number(current);

    // Prefer the next known step from the canonical list
    if (availableSteps.length) {
      const next = availableSteps.find((s) => s > cur + 1e-9);
      if (next != null) return round1(next);
    }

    // Fallbacks if no canonical "next" exists:
    //  - if we're on an integer, try the nearest .1
    //  - otherwise jump to next integer
    const frac10 = Math.round((cur - Math.floor(cur)) * 10);
    if (frac10 === 0) return round1(cur + 0.1);
    return Math.floor(cur) + 1;
  };

  const prevStepFrom = (current) => {
    const cur = Number(current);
    let prev = null;
    for (const s of availableSteps) {
      if (s < cur - 1e-9) prev = s; else break;
    }
    return prev != null ? round1(prev) : cur;
  };

  useEffect(() => {
    setStepper(
      currentTabPages.map((k, j, t) => ({
        name: k.name,
        isLast: j === t.length - 1,
        isFirst: j === 0,
        // active by exact order match (works for 4.1, 4.2, …)
        active: Number(k.order) === Number(currentStep),
      }))
    );
  }, [currentTabPages, currentStep]);

  const mainPagesCount = React.useMemo(() => {
    const ints = new Set();
    for (const p of currentTabPages) {
      const n = parseFloat(String(p?.order || p?.step || p?.name));
      if (Number.isFinite(n)) ints.add(Math.floor(n));
    }
    return ints.size;
  }, [currentTabPages]);

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
    parentDispatch({
      key: "SETBACK",
      data: screenData,
      isSubmit: finalSubmit ? true : false,
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
            cacheData?.mdms?.find((x) => x?.data?.flow === i?.data?.name)?.data?.data,
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

        setShowToast({ key: "success", label: "APP_CONFIGURATION_SUCCESS" });
        setChangeLoader(false);
        history.push(`/${window.contextPath}/employee/campaign/response?isSuccess=true`, {
          message: "APP_CONFIGURATION_SUCCESS_RESPONSE",
          preText: "APP_CONFIGURATION_SUCCESS_RESPONSE_PRE_TEXT",
          actionLabel: "APP_CONFIG_RESPONSE_ACTION_BUTTON",
          actionLink: `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}&tenantId=${tenantId}`,
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
    } else if (tabChange) {
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
            revalidateForm();
          },
        }
      );
      return;
    } else {
      // Check if we're on the last page before proceeding
      const lastPageOrder = currentTabPages.length > 0
        ? Number(currentTabPages[currentTabPages.length - 1].order)
        : null;
      const isOnLastPage = lastPageOrder != null && Math.abs(Number(currentStep) - lastPageOrder) < 1e-6;

      // Also check if this is a single page
      const isSinglePage = currentTabPages.length === 1;

      if (isOnLastPage || isSinglePage) {
        // Already on the last page or only one page exists, don't proceed
        setShowToast({ key: "info", label: "HCM_ALREADY_ON_LAST_PAGE" });
        return;
      }

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
      setCurrentStep((prev) => nextStepFrom(prev));
    }
  };

  const back = () => {
    const activeStep = stepper?.find((i) => i.active);
    if (activeStep?.isFirst && isPreviousTabAvailable) {
      tabStateDispatch({ key: "PREVIOUS_TAB" });
      setCurrentStep(availableSteps[0] || 1);
      return;
    } else if (activeStep?.isFirst && !isPreviousTabAvailable) {
      setShowToast({ key: "error", label: "CANNOT_GO_BACK" });
    } else {
      setCurrentStep((prev) => prevStepFrom(prev));
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
              parentState={parentState}
              pageTag={`${t("CMN_PAGE")} ${currentStep} / ${mainPagesCount}`}
              tabState={tabState}
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