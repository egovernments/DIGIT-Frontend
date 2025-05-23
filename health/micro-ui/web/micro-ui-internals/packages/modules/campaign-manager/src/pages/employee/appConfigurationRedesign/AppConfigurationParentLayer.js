import { Loader, Stepper, Toast, Tooltip } from "@egovernments/digit-ui-components";
import { Header } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useMemo, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import ImpelComponentWrapper from "./ImpelComponentWrapper";
import { useHistory } from "react-router-dom";
// import { dummyMaster } from "../../../configs/dummyMaster";

const Tabs = ({ numberTabs, onTabChange }) => {
  const { t } = useTranslation();
  return (
    <div className="configure-app-tabs">
      {numberTabs.map((_, index) => (
        <button
          key={index}
          type="button"
          className={`configure-app-tab-head ${_.active === true ? "active" : ""} hover`}
          onClick={() => onTabChange(_, index)}
        >
          <p style={{ margin: 0, position: "relative", top: "-0 .1rem" }}>{t(_.parent)}</p>
        </button>
      ))}
    </div>
  );
};

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
        // appData: state.appData ? [...state.appData, ...action.data] : [...action.data],
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

// Updated getTypeAndMetaData to use appfieldtype master data from MDMS
const getTypeAndMetaData = (field, fieldTypeMasterData = []) => {
  if (!Array.isArray(fieldTypeMasterData) || fieldTypeMasterData.length === 0) {
    return { type: "textInput" };
  }

  // Try to find a matching field type from master data
  const matched = fieldTypeMasterData.find((item) => {
    // Match both type and format from metadata
    return item?.metadata?.type === field.type && item?.metadata?.format === field.format;
  });

  if (!matched) {
    return { type: "textInput" };
  }

  // Start with the fieldType as type
  let result = { type: matched.fieldType, appType: matched.type };

  // Copy all metadata properties except type/format (already used)
  Object.entries(matched.metadata || {}).forEach(([key, value]) => {
    if (key !== "type" && key !== "format") {
      result[key] = value;
    }
  });

  // Map/rename additional attributes as per attributeToRename
  if (matched.attributeToRename) {
    Object.entries(matched.attributeToRename).forEach(([to, from]) => {
      if (field[from] !== undefined) {
        result[to] = field[from];
      }
    });
  }

  // Special handling for enums to dropdownOptions (for dropdown/select)
  if (matched.fieldType === "dropdown" && field.enums) {
    result.dropDownOptions = [...field.enums];
  }

  // Pass through other common field properties if needed (e.g., min, max, prefix)
  ["min", "max", "prefix", "startDate", "endDate"].forEach((prop) => {
    if (field[prop] !== undefined) {
      result[prop] = field[prop];
    }
  });

  return result;
};

const restructure = (data1, fieldTypeMasterData = [], parent) => {
  return data1
    ?.sort((a, b) => a.order - b.order)
    .map((page) => {
      const cardFields = page.properties
        ?.sort((a, b) => a.order - b.order)
        ?.map((field, index) => ({
          label: field.label || "",
          value: field.value || "",
          active: true,
          jsonPath: field.fieldName || "",
          metaData: {},
          Mandatory: field.required || false,
          hidden: field.hidden || false,
          deleteFlag: field.deleteFlag || false,
          isLocalised: field.isLocalised ? true : false,
          innerLabel: field.innerLabel || "",
          helpText: field.helpText || "",
          errorMessage: field?.errorMessage || "",
          tooltip: field.tooltip || "",
          infoText: field.infoText || "",
          order: field.order,
          ...getTypeAndMetaData(field, fieldTypeMasterData),
        }));

      return {
        name: page.label || page.page || "UNKNOWN",
        cards: [
          {
            header: crypto.randomUUID(),
            fields: cardFields,
            headerFields: [
              {
                type: "text",
                label: "SCREEN_HEADING",
                value: page.label || "",
                active: true,
                jsonPath: "ScreenHeading",
                metaData: {},
                required: true,
                isLocalised: page.label ? true : false,
              },
              {
                type: "textarea",
                label: "SCREEN_DESCRIPTION",
                value: page.description || "",
                active: true,
                jsonPath: "Description",
                metaData: {},
                required: true,
                isLocalised: page.description ? true : false,
              },
            ],
          },
        ],
        actionLabel: page?.actionLabel || "",
        order: page.order,
        config: {
          enableComment: false,
          enableFieldAddition: true,
          allowFieldsAdditionAt: ["body"],
          enableSectionAddition: false,
          allowCommentsAdditionAt: ["body"],
        },
        parent: parent?.name || "",
      };
    });
};

const guessPageName = (label) => {
  const map = {
    BENE_LOCATION: "beneficiaryLocation",
    BENE_HOUSE: "HouseDetails",
    // Add more mappings as needed
  };
  return map[label] || label;
};

// Helper to get type/format and handle attribute renaming from appType using fieldTypeMasterData
const getTypeAndFormatFromAppType = (field, fieldTypeMasterData = []) => {
  if (!field.appType) return {};
  const matched = fieldTypeMasterData.find((item) => item.type === field.appType);
  if (!matched) return {};
  const result = {
    type: matched.metadata?.type,
    format: matched.metadata?.format,
  };
  // Handle attributeToRename: { targetKey: sourceKey }
  if (matched.attributeToRename) {
    Object.entries(matched.attributeToRename).forEach(([targetKey, sourceKey]) => {
      result[sourceKey] = field[targetKey];
    });
  }
  return result;
};

// Update reverseRestructure to use getTypeAndFormatFromAppType
const reverseRestructure = (updatedData, fieldTypeMasterData = []) => {
  return updatedData.map((section, index) => {
    const properties = section.cards?.[0]?.fields.map((field, fieldIndex) => {
      const typeAndFormat = getTypeAndFormatFromAppType(field, fieldTypeMasterData);
      return {
        label: field.label || "",
        order: fieldIndex + 1,
        value: field.value || "",
        hidden: false, // can't be derived from updatedData unless explicitly added
        required: field.Mandatory || false,
        hidden: field.hidden || false,
        fieldName: field.jsonPath || "",
        helpText: field.helpText || "",
        tooltip: field.tooltip || "",
        infoText: field.infoText || "",
        innerLabel: field.innerLabel || "",
        errorMessage: field.errorMessage || "",
        deleteFlag: field.deleteFlag || false,
        ...typeAndFormat,
      };
    });

    return {
      page: guessPageName(section.name),
      type: "object",
      label: section.cards?.[0]?.headerFields?.find((i) => i.jsonPath === "ScreenHeading")?.value,
      description: section.cards?.[0]?.headerFields?.find((i) => i.jsonPath === "Description")?.value,
      actionLabel: section?.actionLabel || "",
      order: index + 1,
      properties,
    };
  });
};

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
    [
      {
        name: masterName,
        filter: `[?(@.project=='${campaignNumber}')]`,
      },
      { name: fieldTypeMaster },
    ],
    {
      cacheTime: Infinity,
      staleTime: Infinity,
      select: (data) => {
        return data?.[MODULE_CONSTANTS];
      },
    },
    { schemaCode: "BASE_APP_MASTER_DATA3" } //mdmsv2
  );

  const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
  const reqCriteriaForm = {
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
        return data?.mdms?.[0];
      },
    },
  };

  const correctField = (key) => {
    switch (key) {
      case "text":
        return "textInput";
      case "date":
        return "datePicker";
      default:
        return key;
    }
  };

  const { isLoading, data: formData } = Digit.Hooks.useCustomAPIHook(reqCriteriaForm);

  // const { mutate: updateMutate } = Digit.Hooks.campaign.useUpdateFormBuilderConfig(tenantId);
  const { mutate: updateMutate } = Digit.Hooks.campaign.useUpdateAppConfig(tenantId);

  useEffect(() => {
    if (showToast) {
      setTimeout(closeToast, 10000);
    }
  }, [showToast]);

  // useEffect(() => {
  //   if (!NewisLoadingAppConfigMdmsData && NewAppConfigMdmsData) {
  //     const temp = restructure(NewAppConfigMdmsData?.SimplifiedAppConfig?.[0]?.pages);
  //   }
  // }, [NewAppConfigMdmsData, NewisLoadingAppConfigMdmsData]);

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
    // } else if (!isLoadingAppConfigMdmsData && AppConfigMdmsData?.[masterName]) {
    //   const temp = restructure(AppConfigMdmsData?.[masterName]?.[0]?.pages);
    //   parentDispatch({
    //     key: "SET",
    //     data: [...temp],
    //     template: AppConfigMdmsData?.[masterName],
    //   });
    // }
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
      const reverseData = reverseRestructure(parentState?.currentTemplate, AppConfigMdmsData?.[fieldTypeMaster]);
      // const nextTabAvailable = numberTabs.some((tab) => tab.code > currentStep.code && tab.active);
      const reverseFormat = {
        ...parentState?.actualTemplate,
        pages: reverseData,
      };

      const updatedFormData = formData;

      // Update the data property while maintaining the required structure
      updatedFormData.data = reverseFormat;

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
              actionLabel: "CS_HOME",
              actionLink: `/${window.contextPath}/employee`,
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
      <Header className="app-config-header">{t(`${currentScreen?.[0]?.name}`)}</Header>
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
    </div>
  );
};

export default AppConfigurationParentRedesign;
