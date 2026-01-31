import { Loader, Stepper, Toast } from "@egovernments/digit-ui-components";
import React, { useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import ImpelComponentWrapper from "./ImpelComponentWrapper";
import { useNavigate } from "react-router-dom";

const Tabs = ({ numberTabs, onTabChange }) => {
  const { t } = useTranslation();
  return (
    <div className="campaign-tabs">
      {numberTabs.map((_, index) => (
        <button
          key={index}
          type="button"
          className={`campaign-tab-head ${_.active === true ? "active" : ""} hover`}
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
      };
    case "SETBACK":
      return {
        ...state,
        appData: state.appData ? [...state.appData, ...action.data] : [...action.data],
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

const AppConfigurationParentLayer = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const MODULE_CONSTANTS = "HCM-ADMIN-CONSOLE";
  const searchParams = new URLSearchParams(location.search);
  const masterName = searchParams.get("masterName");
  const variant = searchParams.get("variant");
  const formId = searchParams.get("formId");
  const [parentState, parentDispatch] = useReducer(dispatcher, {});
  const [numberTabs, setNumberTabs] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepper, setStepper] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const [currentScreen, setCurrentScreen] = useState({});
  const { isLoading: isLoadingAppConfigMdmsData, data: AppConfigMdmsData } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    MODULE_CONSTANTS,
    [{ name: masterName }],
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
    url: `/egov-mdms-service/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId: Digit.ULBService.getCurrentTenantId(),
        moduleDetails: [
          {
            moduleName: "FormBuilderFormComposerConfig",
            masterDetails: MODULE_CONSTANTS,
          },
        ],
      },
    },
    config: {
      enabled: formId ? true : false,
      select: (data) => {
        return data?.mdms.filter((item) => item.id === formId);
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

  function convertDataFormat(inputData, template) {
    const formData = inputData?.[0]?.data;
    if (formData == "undefined") return null;

    return [
      {
        cards: [
          {
            fields: formData?.body.map((field) => ({
              // type: field.type === "textarea" ? "text" : field.type,
              type: correctField(field.type),
              label: field.label,
              active: true,
              jsonPath: field.jsonPath || field.key,
              metaData: {},
              required: field.isMandatory,
              deleteFlag: false,
            })),
            header: formData?.head,
            description: formData?.description,
            headerFields: [
              {
                type: "text",
                label: "SCREEN_HEADING",
                value: formData?.head,
                active: true,
                jsonPath: "ScreenHeading",
                metaData: {},
                required: true,
              },
              {
                type: "text",
                value: formData?.description,
                label: "SCREEN_DESCRIPTION",
                active: true,
                jsonPath: "Description",
                metaData: {},
                required: true,
              },
            ],
          },
        ],
        config: {
          enableComment: false,
          enableFieldAddition: true,
          allowFieldsAdditionAt: ["body"],
          enableSectionAddition: false,
          allowCommentsAdditionAt: ["body"],
        },
      },
    ];
  }

  const { mutate } = Digit.Hooks.campaign.useUpsertFormBuilderConfig(tenantId);
  const { mutate: schemaMutate } = Digit.Hooks.campaign.useUpsertSchemaConfig(tenantId);
  const { mutate: updateMutate } = Digit.Hooks.campaign.useUpdateFormBuilderConfig(tenantId);

  useEffect(() => {
    if (showToast) {
      setTimeout(closeToast, 10000);
    }
  }, [showToast]);

  useEffect(() => {
    if (formData || formId) {
      parentDispatch({
        key: "SETFORM",
        data: convertDataFormat(formData, AppConfigMdmsData?.[masterName]),
      });
    } else if (!isLoadingAppConfigMdmsData && AppConfigMdmsData?.[masterName]) {
      parentDispatch({
        key: "SET",
        data: [...AppConfigMdmsData?.[masterName]],
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
          active: j === 0 ? true : false,
        }))
    );
  }, [parentState?.currentTemplate, numberTabs]);

  useEffect(() => {
    setStepper((prev) => {
      return prev.map((i, c) => {
        if (c === currentStep - 1) {
          return {
            ...i,
            active: true,
          };
        }
        return {
          ...i,
          active: false,
        };
      });
    });
  }, [currentStep]);

  useEffect(() => {
    if (variant === "app" && parentState?.currentTemplate?.length > 0 && currentStep && numberTabs?.length > 0) {
      const findActiveParent = numberTabs?.find((i) => i?.active)?.parent;
      setCurrentScreen(parentState?.currentTemplate.filter((i) => i?.parent === findActiveParent)?.filter((i) => i?.order === currentStep));
    } else {
      setCurrentScreen(parentState?.currentTemplate);
    }
  }, [parentState?.currentTemplate, currentStep, numberTabs]);

  if (isLoadingAppConfigMdmsData || !parentState?.currentTemplate || parentState?.currentTemplate?.length === 0) {
    return <Loader />;
  }
  const submit = async (screenData) => {
    if (variant === "web") {
      if (formId && formData) {
        const updatedFormData = formData[0];

        const newFormContent = screenData?.[0];

        // Update the data property while maintaining the required structure
        updatedFormData.data = {
          head: newFormContent.head,
          description: newFormContent.description,
          body: newFormContent.body,
        };
        await updateMutate(
          {
            moduleName: "HCM-ADMIN-CONSOLE",
            masterName: "FormBuilderFormComposerConfig",
            data: updatedFormData,
          },
          {
            onError: (error, variables) => {
              setShowToast({ key: "error", label: error?.message ? error?.message : error });
            },
            onSuccess: async (data) => {
              setShowToast({ key: "success", label: "APP_CONFIGURATION_SUCCESS" });
              navigate(
                `/${window.contextPath}/employee/campaign/form-builder-configuration?moduleName=HCM-ADMIN-CONSOLE&masterName=FormBuilderFormComposerConfig&formId=${data?.mdms?.[0]?.id}`
              );
            },
          }
        );
      } else {
        await mutate(
          {
            moduleName: "HCM-ADMIN-CONSOLE",
            masterName: "FormBuilderFormComposerConfig",
            data: { ...screenData?.[0] },
          },
          {
            onError: (error, variables) => {
              setShowToast({ key: "error", label: error?.message ? error?.message : error });
            },
            onSuccess: async (data) => {
              setShowToast({ key: "success", label: "APP_CONFIGURATION_SUCCESS" });
              navigate(
                `/${window.contextPath}/employee/campaign/form-builder-configuration?moduleName=HCM-ADMIN-CONSOLE&masterName=FormBuilderFormComposerConfig&formId=${data?.mdms?.[0]?.id}`
              );
            },
          }
        );
      }
    } else if (variant === "schema") {
      await schemaMutate(
        {
          moduleName: "HCM-ADMIN-CONSOLE",
          masterName: "SchemaConfigSubmit",
          data: JSON.parse(screenData),
        },
        {
          onError: (error, variables) => {
            setShowToast({ key: "error", label: error?.message ? error?.message : error });
          },
          onSuccess: async (data) => {
            setShowToast({ key: "success", label: "SCHEMA_CONFIGURATION_SUCCESS" });
            navigate(
              `/${window.contextPath}/employee/campaign/schema-builder-configuration?moduleName=HCM-ADMIN-CONSOLE&masterName=SchemaConfigSubmit&formId=${data?.mdms?.[0]?.id}`
            );
          },
        }
      );
    } else {
      parentDispatch({
        key: "SETBACK",
        data: screenData,
      });
      if (stepper?.find((i) => i.active)?.isLast) {
        const nextTabAvailable = numberTabs.some((tab) => tab.code > currentStep.code && tab.active);
        await mutate(
          {
            moduleName: "HCM-ADMIN-CONSOLE",
            masterName: "DummyAppConfig",
            data: { ...screenData?.[0] },
          },
          {
            onError: (error, variables) => {
              setShowToast({ key: "error", label: error?.message ? error?.message : error });
            },
            onSuccess: async (data) => {
              setShowToast({ key: "success", label: "APP_CONFIGURATION_SUCCESS" });
              navigate(
                `/${window.contextPath}/employee/campaign/form-builder-configuration?moduleName=HCM-ADMIN-CONSOLE&masterName=DummyAppConfig&formId=${data?.mdms?.[0]?.id}`
              );
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
    }
  };
  const closeToast = () => {
    setShowToast(null);
  };
  const back = () => {
    if (stepper?.find((i) => i.active)?.isFirst) {
      setShowToast({ key: "ERROR", label: "CANNOT_GO_BACK" });
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };
  return (
    <div>
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
      {variant === "app" && (
        <Stepper
          customSteps={[...stepper?.map((i) => i.name)]}
          currentStep={currentStep}
          onStepClick={() => {}}
          activeSteps={0}
          className={"appConfig-flow-stepper"}
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

export default AppConfigurationParentLayer;
