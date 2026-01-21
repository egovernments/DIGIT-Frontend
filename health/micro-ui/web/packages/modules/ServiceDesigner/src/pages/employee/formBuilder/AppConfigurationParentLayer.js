import React, { useEffect, useReducer, useState, Fragment, useCallback, useMemo } from "react";
import { CustomSVG, Loader, Tag, TextBlock, Toast } from "@egovernments/digit-ui-components";
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

const AppConfigurationParentRedesign = ({ formData = null, isNextTabAvailable, isPreviousTabAvailable, tabStateDispatch, tabState, formName, formDescription, onFormNameChange, onFormDescriptionChange }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const history = useHistory();
  const MODULE_CONSTANTS = "Studio";
  const searchParams = new URLSearchParams(location.search);
  const masterName = searchParams.get("masterName");
  const fieldTypeMaster = searchParams.get("fieldType");
  const projectType = searchParams.get("projectType");
  const campaignNumber = searchParams.get("campaignNumber");
  const variant = searchParams.get("variant");
  const formId = searchParams.get("formId");
  const isedit = searchParams.get("editMode");
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
      select: (data) => {
        const filteredCache = data?.mdms?.find((i) => i.data.flow === formData?.data?.name);
        return filteredCache ? filteredCache : null;
      },
    },
  };

  const { isLoading: isCacheLoading, data: cacheData, refetch: refetchCache } = Digit.Hooks.useCustomAPIHook(reqCriteriaForm);

 // const { mutate: updateMutate } = useUpdateAppConfig(tenantId);

  const closeToast = () => {
    setShowToast(null);
  };

  useEffect(() => {
    if (showToast) {
      setTimeout(closeToast, 10000);
    }
  }, [showToast]);

  // Function to add applicant section to initial screen config
  const addApplicantSectionToConfig = useCallback((screenConfig) => {
    if (!screenConfig || !Array.isArray(screenConfig)) return screenConfig;

    return screenConfig.map(screen => {
      if (screen.cards && screen.cards.length === 1) {
        // Check if applicant section already exists
        const hasApplicantSection = screen.cards.some(card =>
          card.fields?.some(field => field.jsonPath === "ApplicantName")
        );

        if (!hasApplicantSection) {
          // Add applicant section
          const applicantCard = {
            fields: [
              {
                type: "text",
                appType: "text",
                label: "Name",
                active: true,
                jsonPath: "ApplicantName",
                metaData: {},
                required: true,
                value: "",
                readOnly: false,
                deleteFlag: false,
                isMandatory: true,
                hidden: false,
                order: 1,
              },
              {
                type: "mobileNumber",
                appType: "mobileNumber",
                label: "Mobile Number",
                active: true,
                jsonPath: "ApplicantMobile",
                metaData: {
                  hideSpan: true,
                },
                required: true,
                value: "",
                readOnly: false,
                deleteFlag: false,
                hideSpan: true,
                isMandatory: true,
                hidden: false,
                order: 2,
                populators: {
                  hideSpan: true,
                }
              },
              {
                type: "text",
                appType: "text",
                label: "Email",
                active: true,
                jsonPath: "ApplicantEmail",
                metaData: {},
                required: false,
                value: "",
                readOnly: false,
                deleteFlag: false,
                hidden: false,
                order: 3,
                regex: "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$",
                errorMessage: "invalid email",
              },
              {
                type: "dropdown",
                appType: "dropdown",
                label: "Gender",
                active: true,
                jsonPath: "ApplicantGender",
                metaData: {},
                required: false,
                value: "",
                readOnly: false,
                deleteFlag: false,
                hidden: false,
                order: 4,
                isMdms: true,
                MdmsDropdown: true,
                schemaCode: "common-masters.GenderType",
              },
            ],
            header: "Applicant Details",
            description: "Applicant Information",
            headerFields: [
              {
                type: "text",
                label: "SCREEN_HEADING",
                active: true,
                jsonPath: "ScreenHeading",
                metaData: {},
                required: true,
                value: "Applicant Details",
              },
              {
                type: "text",
                label: "SCREEN_DESCRIPTION",
                active: true,
                jsonPath: "Description",
                metaData: {},
                required: true,
                value: "Please provide your personal information",
              },
            ],
            sectionType: "applicant",
          };
          
          // Replace all existing cards with only the applicant card
          return {
            ...screen,
            cards: [applicantCard] // Only applicant card, original cards removed
          };
        }
      }
      return screen;
    });
  }, []);

  // Memoize the processed data to prevent infinite loops
  const processedCacheData = useMemo(() => {
    if (!isCacheLoading && Array.isArray(cacheData?.data?.data)) {
      // Don't add applicant section in edit mode
      return isedit === "true" ? [...cacheData?.data?.data] : addApplicantSectionToConfig([...cacheData?.data?.data]);
    }
    return null;
  }, [isCacheLoading, cacheData?.data?.data, addApplicantSectionToConfig, isedit]);

const processedFormData = useMemo(() => {
  if (!isCacheLoading && 
      !Array.isArray(cacheData?.data?.data) &&
      formData?.data &&
      formId &&
      AppConfigMdmsData?.[fieldTypeMaster]?.length > 0) {
    const fieldTypeMasterData = AppConfigMdmsData?.[fieldTypeMaster] || [];
    const temp = restructure(formData?.data?.pages, fieldTypeMasterData, formData?.data, t);
    // Don't add applicant section in edit mode
    return isedit === "true" ? [...temp] : addApplicantSectionToConfig([...temp]);
  }
  return null;
}, [isCacheLoading, cacheData?.data?.data, formData?.data, formId, AppConfigMdmsData, fieldTypeMaster, addApplicantSectionToConfig, isedit]);

useEffect(() => {
  
  if (processedCacheData) {
    parentDispatch({
      key: "SET",
      data: processedCacheData,
      template: cacheData?.data,
      appIdData: processedCacheData,
    });
    setCurrentStep((prev) => (prev ? prev : 1));
    return;
  } else if (processedFormData) {
    parentDispatch({
      key: "SET",
      data: processedFormData,
      template: formData?.data,
      appIdData: formData?.data,
    });
    setCurrentStep(1);
  }
}, [processedCacheData, processedFormData, cacheData?.data, formData?.data]);

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

  const submit = (screenData, finalSubmit) => {
    //console.log(screenData,finalSubmit,"final data");

  };
  // const submit = async (screenData, finalSubmit) => {
  //   if (!finalSubmit && stepper?.find((i) => i.active)?.isLast && !isNextTabAvailable) {
  //     setShowToast({ key: "error", label: "LAST_PAGE_ERROR" });
  //     return;
  //   }
  //   parentDispatch({
  //     key: "SETBACK",
  //     data: screenData,
  //     isSubmit: stepper?.find((i) => i.active)?.isLast || finalSubmit ? true : false,
  //   });
  //   const mergedTemplate = parentState.currentTemplate.map((item) => {
  //     const updated = screenData.find((d) => d.name === item.name);
  //     return updated ? updated : item;
  //   });
  //   if (stepper?.find((i) => i.active)?.isLast || finalSubmit) {
  //     const mergedTemplate = parentState.currentTemplate.map((item) => {
  //       const updated = screenData.find((d) => d.name === item.name);
  //       return updated ? updated : item;
  //     });
  //     const reverseData = reverseRestructure(mergedTemplate, AppConfigMdmsData?.[fieldTypeMaster]);
  //     const reverseFormat =
  //       cacheData && cacheData?.data?.data
  //         ? {
  //             ...parentState?.actualTemplate?.actualTemplate,
  //             version: parentState?.actualTemplate?.version + 1,
  //             pages: reverseData,
  //           }
  //         : {
  //             ...parentState?.actualTemplate,
  //             version: parentState?.actualTemplate?.version + 1,
  //             pages: reverseData,
  //           };

  //     const updatedFormData = { ...formData, data: reverseFormat };

  //     setChangeLoader(true);

  //     await updateMutate(
  //       {
  //         moduleName: "Studio",
  //         masterName: "AppConfigCache",
  //         data: {
  //           ...cacheData,
  //           data: {
  //             projectType: projectType,
  //             campaignNumber: campaignNumber,
  //             flow: cacheData?.data?.flow ? cacheData?.data?.flow : parentState?.actualTemplate?.name,
  //             data: null,
  //           },
  //         },
  //       },
  //       {
  //         onError: (error, variables) => {
  //           setShowToast({ key: "error", label: error?.response?.data?.Errors?.[0]?.code ? t(error?.response?.data?.Errors?.[0]?.code) : error });
  //         },
  //         onSuccess: async (data) => {
  //           return null;
  //         },
  //       }
  //     );
  //     await updateMutate(
  //       {
  //         moduleName: "Studio",
  //         masterName: masterName,
  //         data: updatedFormData,
  //       },
  //       {
  //         onError: (error, variables) => {
  //           setChangeLoader(false);
  //           setShowToast({ key: "error", label: error?.response?.data?.Errors?.[0]?.code ? t(error?.response?.data?.Errors?.[0]?.code) : error });
  //         },
  //         onSuccess: async (data) => {
  //           setShowToast({ key: "success", label: "APP_CONFIGURATION_SUCCESS" });
  //           setChangeLoader(false);
  //           if (isNextTabAvailable && !finalSubmit) {
  //             tabStateDispatch({ key: "NEXT_TAB", responseDate: data });
  //             setCurrentStep(1);
  //             return;
  //           } else {
  //             setChangeLoader(false);
  //             queryClient.invalidateQueries(`APPCONFIG-${campaignNumber}`);
  //             history.push(`/${window.contextPath}/employee/campaign/response?isSuccess=true`, {
  //               message: "APP_CONFIGURATION_SUCCESS_RESPONSE",
  //               preText: "APP_CONFIGURATION_SUCCESS_RESPONSE_PRE_TEXT",
  //               actionLabel: "APP_CONFIG_RESPONSE_ACTION_BUTTON",
  //               actionLink: `/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}&tenantId=${tenantId}`,
  //             });
  //             return;
  //           }
  //         },
  //       }
  //     );
  //   } else {
  //     await updateMutate(
  //       {
  //         moduleName: "Studio",
  //         masterName: "AppConfigCache",
  //         data: {
  //           ...cacheData,
  //           data: {
  //             projectType: projectType,
  //             campaignNumber: campaignNumber,
  //             flow: cacheData?.data?.flow ? cacheData?.data?.flow : parentState?.actualTemplate?.name,
  //             data: mergedTemplate,
  //             version: cacheData?.data?.version ? cacheData?.data?.version : parentState?.actualTemplate?.version,
  //             localeModule: localeModule,
  //             actualTemplate: cacheData?.data?.actualTemplate ? cacheData?.data?.actualTemplate : parentState?.actualTemplate,
  //           },
  //         },
  //       },
  //       {
  //         onError: (error, variables) => {
  //           setShowToast({ key: "error", label: error?.response?.data?.Errors?.[0]?.code ? t(error?.response?.data?.Errors?.[0]?.code) : error });
  //         },
  //         onSuccess: async (data) => {
  //           refetchCache();
  //         },
  //       }
  //     );
  //     setCurrentStep((prev) => prev + 1);
  //   }
  // };

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
        {/* <TextBlock header={formName || t(`APP_CONFIG_HEADING_LABEL`)} /> */}
        <div style={{ fontSize: "2.5rem",
            fontWeight: 700,
            color: "#0B4B66",
            fontFamily: "Roboto condensed" }}>{formName ||t(`APP_CONFIG_HEADING_LABEL`)}</div> 
        <button
          onClick={() => {
            // Dispatch custom event to open form name popup
            if (window.dispatchEvent) {
              window.dispatchEvent(new CustomEvent('openFormNamePopup'));
            }
          }}
          title={t("EDIT_FORM_NAME")}
          className="node-buttons"
        >
          <CustomSVG.EditIcon />
        </button>
          
        {/* <Tag
          stroke={true}
          showIcon={false}
          label={`${t("APPCONFIG_VERSION")} - ${parentState?.actualTemplate?.version}`}
          style={{ background: "#EFF8FF", height: "fit-content" }}
          className={"version-tag"}
        /> */}
      </Header>
      {formDescription && (
        <TextBlock body="" caption={formDescription} header="" captionClassName="camp-drawer-caption" subHeader="" />
      )}
      <div style={{ display: "flex" }}>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "5rem",
              width: "60vw" ,
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
              formName={formName}
              formDescription={formDescription}
              onFormNameChange={onFormNameChange}
              onFormDescriptionChange={onFormDescriptionChange}
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