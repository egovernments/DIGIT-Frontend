import { FormComposerV2, Stepper, Toast } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { serviceConfigPGR } from "../../../configs/serviceConfigurationPGR";
import { serviceConfig } from "../../../configs/serviceConfiguration";
import { generateFormConfig } from "../../../utils/generateFormConfigFromSchemaUtil";
import { transformToApplicationPayload } from "../../../utils";
import { Loader } from "@egovernments/digit-ui-react-components";
import useCustomAPIMutationHook from "../../../components/useCustomAPIMutationHook";

const DigitDemoComponent = ({editdata}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { module, service } = useParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const queryStrings = Digit.Hooks.useQueryParams();

  const serviceCode = `${module.toUpperCase()}_${service.toUpperCase()}`;
  const enableSaveAsDraftStep = 15; //Step number where I want to enable save as draft button

  // Create unique storage keys for this service
  const storageKeys = {
    currentStep: `${module}_${service}_currentStep`,
    formData: `${module}_${service}_formData`
  };

  // Get persisted state from localStorage using service-specific keys
  const savedStep = parseInt(localStorage.getItem(storageKeys.currentStep), 10) || 1;
  const initialFormData = window.location.href.includes("Edit") && editdata
  ? editdata
  : JSON.parse(localStorage.getItem(storageKeys.formData) || "{}");
  const savedFormData = JSON.parse(localStorage.getItem(storageKeys.formData) || "{}");

  const [currentStep, setCurrentStep] = useState(savedStep);
  const [formData, setFormData] = useState(initialFormData);
  const [sessionData, setSessionData] = useState(initialFormData);
  const [showToast, setShowToast] = useState(null);

  // Store the original city value to use for preservation
  const originalCityRef = React.useRef(initialFormData?.address?.city || editdata?.address?.city);

  const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

  // Disable scroll-to-change on number inputs
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.target.type === "number") {
        e.target.blur();
      }
    };
    document.addEventListener("wheel", handleWheel, { passive: true });
    return () => document.removeEventListener("wheel", handleWheel);
  }, []);

  // Clear localStorage when component unmounts (user navigates away)
  useEffect(() => {
    return () => {
      localStorage.removeItem(storageKeys.formData);
      localStorage.removeItem(storageKeys.currentStep);
      sessionStorage.removeItem(storageKeys.formData);
    };
  }, [storageKeys.formData, storageKeys.currentStep]);


  //Fetch service configuration from MDMS
  const requestCriteria = {
    url: `/${mdms_context_path}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        schemaCode: "Studio.ServiceConfiguration",
        filters:{
          module:module
        }
      },
    },
  };
  const { isLoading: moduleListLoading, data } = Digit.Hooks.useCustomAPIHook(requestCriteria);

  // Fetch service configuration drafts for UI ordering
  const requestCriteriaDrafts = {
    url: `/${mdms_context_path}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        schemaCode: "Studio.ServiceConfigurationDrafts",
        filters: {
          module: module,
          service: service,
        }
      },
    },
  };
  const { isLoading: draftsLoading, data: draftsData } = Digit.Hooks.useCustomAPIHook(requestCriteriaDrafts);

  const config = data?.mdms?.find((item) =>
    item?.uniqueIdentifier.toLowerCase() === `${module}.${service}`.toLowerCase()
  );

  // Get draft config for UI ordering
  const draftConfig = draftsData?.mdms?.[0];

  //To run service config locally
  // const config = serviceConfig;

  // Fetch workflow details if available
  const workflowrequestCriteria = {
    url: "/egov-workflow-v2/egov-wf/businessservice/_search",
    params: {
      tenantId: tenantId,
      businessServices: config?.data?.workflow?.businessService,
    },
    config: {
      enabled: Boolean(config?.data?.workflow?.businessService),
    },
  };
  const { isLoading: workflowDetailsLoading, data: workflowDetails } = Digit.Hooks.useCustomAPIHook(workflowrequestCriteria);

  const Updatedconfig = {
    ServiceConfiguration: [config?.data],
    ServiceConfigurationDrafts: draftConfig?.data,
    tenantId,
    module,
  };

  //logic to handle steps in apply screen flow
  let rawConfig = generateFormConfig(Updatedconfig, module.toUpperCase(), service?.toUpperCase());
  rawConfig = rawConfig.filter((ob) => Object.keys(ob)?.length > 0)
  const steps = rawConfig.map((config) => config.head || config.label || "Untitled Section");
  
  // Validate and adjust currentStep based on available steps
  useEffect(() => {
    if (currentStep > rawConfig.length && rawConfig.length > 0) {
      setCurrentStep(1);
      localStorage.setItem(storageKeys.currentStep, "1");
    }
  }, [rawConfig.length, currentStep, storageKeys.currentStep]);
  
  const currentFormConfig = rawConfig[currentStep - 1];
  const schemaCode = queryStrings?.serviceCode;

  const mutation = useCustomAPIMutationHook({
    url: `/public-service/v1/application/${schemaCode}`,
    method: queryStrings?.applicationNumber ? "PUT" : "POST",
    headers: queryStrings?.applicationNumber ? {
      "X-Tenant-Id" : tenantId,
      "auth-token" : window?.localStorage?.getItem("Employee.token") || window?.localStorage?.getItem("token"),
    } : {"X-Tenant-Id" : tenantId},
    config: { enable: false },
  });

  //this to maintain the current state of the application entered by user
  const persistData = (updatedFormData, updatedStep) => {
    localStorage.setItem(storageKeys.formData, JSON.stringify(updatedFormData));
    localStorage.setItem(storageKeys.currentStep, updatedStep.toString());
    sessionStorage.setItem(storageKeys.formData, JSON.stringify(updatedFormData));
    setSessionData(updatedFormData);
  };

  // Helper function to validate mobile number minLength
  const validateMobileNumberFields = (data, formConfig) => {
    const errors = [];

    // Find all mobileNumber fields in the current form config
    const mobileFields = formConfig?.body?.filter(
      field => field.type === "mobileNumber" || field.format === "mobileNumber"
    ) || [];

    for (const field of mobileFields) {
      const fieldName = field.populators?.name || field.name;
      const fieldValue = data?.[fieldName];
      const minLength = field.populators?.minLength || field.minLength;

      if (minLength && fieldValue) {
        const valueLength = String(fieldValue).length;
        if (valueLength < minLength) {
          errors.push({
            field: fieldName,
            message: `${t("ERR_MIN_LENGTH_VALIDATION")} ${t(field.populators?.label || field.label)}`,
          });
        }
      }
    }

    return errors;
  };

  // Helper function to validate hierarchy dropdown fields
  const validateHierarchyDropdowns = (data, formConfig) => {
    const errors = [];

    // Check if current form config has hierarchy dropdown fields
    const hierarchyFields = formConfig?.body?.filter(
      field => field.component === "HierarchyDropdown" && field.isMandatory
    ) || [];

    for (const field of hierarchyFields) {
      const fieldName = field.populators?.name || field.name;
      const fieldData = data?.[fieldName];
      const lowestHierarchy = field.populators?.lowestHierarchy;

      // If field is required, check that all selected values are complete
      // fieldData is an object like { "Country": {...}, "State": {...}, "City": {...} }
      if (!fieldData || typeof fieldData !== 'object') {
        errors.push({ field: fieldName, message: "SELECT_ALL_HIERARCHY_LEVELS" });
        continue;
      }

      // Check if the lowest level (lowestHierarchy) has been selected
      // This ensures all levels up to the required lowest level are filled
      const selectedLevels = Object.keys(fieldData);

      if (selectedLevels.length === 0) {
        errors.push({ field: fieldName, message: "SELECT_ALL_HIERARCHY_LEVELS" });
        continue;
      }

      // Check if lowest hierarchy level is selected
      if (lowestHierarchy && !fieldData[lowestHierarchy]) {
        errors.push({ field: fieldName, message: "SELECT_ALL_HIERARCHY_LEVELS" });
      }
    }

    return errors;
  };

  const onSubmit = async (data) => {
    const sectionName = currentFormConfig?.name || `section_${currentStep}`;

    // Validate mobile number fields for minLength
    const mobileErrors = validateMobileNumberFields(data, currentFormConfig);
    if (mobileErrors.length > 0) {
      setShowToast({ message: mobileErrors[0].message, error: true });
      return;
    }

    // Validate hierarchy dropdowns before proceeding
    const hierarchyErrors = validateHierarchyDropdowns(data, currentFormConfig);
    if (hierarchyErrors.length > 0) {
     return;
    }

    const updatedFormData = ["multiChildForm", "documents"].includes(currentFormConfig?.type)
      ? { ...formData, ...data }
      : { ...formData, [sectionName]: data }

    const isLastStep = currentStep === rawConfig.length;

    setFormData(updatedFormData);
    persistData(updatedFormData, currentStep);

    if (!isLastStep) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      persistData(updatedFormData, nextStep);
    } else {
      // Disable button by triggering the mutation
      await mutation.mutate(
        {
          url: `/public-service/v1/application/${schemaCode}`,
          headers: queryStrings?.applicationNumber ? {
            "X-Tenant-Id" : tenantId,
            "auth-token" : window?.localStorage?.getItem("Employee.token") || window?.localStorage?.getItem("token"),
          } : { "X-Tenant-Id" : tenantId },
          method: queryStrings?.applicationNumber ? "PUT" : "POST",
          body: transformToApplicationPayload(updatedFormData, Updatedconfig, service, tenantId, config, workflowDetails, queryStrings?.applicationNumber, schemaCode, queryStrings?.action),
          config: { enable: true },
        },
        {
          onSuccess: (data) => {
            // Clear service-specific storage
            localStorage.removeItem(storageKeys.formData);
            localStorage.removeItem(storageKeys.currentStep);
            sessionStorage.removeItem(storageKeys.formData);
            const lastUpdatedTime = Date.now();
            history.push({
              pathname: window.location.href.includes("digit-studio/citizen")? `/${window.contextPath}/citizen/publicservices/${module}/${service}/response` : `/${window.contextPath}/employee/publicservices/${module}/${service}/response`,
              search: `?isSuccess=true&applicationNumber=${data?.Application?.applicationNumber}&serviceCode=${schemaCode}`,
              state: {
                message: queryStrings?.applicationNumber ? t("APP_UPDATED_SICCESSFULLY") : t("APP_CREATED_SICCESSFULLY"),
                showID: true,
                applicationNumber: data?.Application?.applicationNumber,
                config : config,
                workflowStatus: data?.Application?.workflowStatus,
                redirectionUrl: window.location.href.includes("digit-studio/citizen")? `/${window.contextPath}/citizen/publicservices/${module}/${service}/ViewScreen?applicationNumber=${data?.Application?.applicationNumber}&serviceCode=${schemaCode}&lastUpdatedTime=${lastUpdatedTime}` : `/${window.contextPath}/employee/publicservices/${module}/${service}/ViewScreen?applicationNumber=${data?.Application?.applicationNumber}&serviceCode=${schemaCode}&lastUpdatedTime=${lastUpdatedTime}`,
              },
            });
          },
          onError: () => {
            // Clear service-specific storage on failure
            localStorage.removeItem(storageKeys.formData);
            localStorage.removeItem(storageKeys.currentStep);
            sessionStorage.removeItem(storageKeys.formData);
            history.push({
              pathname: window.location.href.includes("digit-studio/citizen")? `/${window.contextPath}/citizen/publicservices/${module}/${service}/response` : `/${window.contextPath}/employee/publicservices/${module}/${service}/response`,
              search: "?isSuccess=false",
              state: {
                message: "Application Creation Failed",
                showID: false,
              },
            });
          },
        }
      );
    }
  };

  const onStepperClick = (stepIndex) => {
    const clickedStepIndex = stepIndex + 1;
    // Only allow clicking on steps that are less than or equal to current step (no forward navigation)
    if (clickedStepIndex <= currentStep) {
      setCurrentStep(clickedStepIndex);
      localStorage.setItem(storageKeys.currentStep, clickedStepIndex.toString());
    }
  };

  const onFormValueChange = (_, updatedData) => {
    const sectionName = currentFormConfig?.name || `section_${currentStep}`;
    const updatedSectionData = updatedData[sectionName] || updatedData;
    const sessionSectionData = sessionData?.[sectionName];


    // Handle city field for single-select behavior
    let finalUpdatedData = { ...updatedSectionData };

    // Case 1: Currently on address section
    if(sectionName === 'address') {
      // If city is empty/undefined - use originalCityRef
      if(originalCityRef.current && (!finalUpdatedData?.city || (Array.isArray(finalUpdatedData?.city) && finalUpdatedData?.city?.length === 0)))
      {
        finalUpdatedData.city = originalCityRef.current;
      }
      // If city has multiple values (array with >1 element), keep only the last one (single-select behavior)
      else if(Array.isArray(finalUpdatedData?.city) && finalUpdatedData?.city?.length > 1)
      {
        finalUpdatedData.city = [finalUpdatedData.city[finalUpdatedData.city.length - 1]];
        // Update originalCityRef to the new single value
        originalCityRef.current = finalUpdatedData.city;
      }
      // If city is updated to a new single value, update originalCityRef
      else if(Array.isArray(finalUpdatedData?.city) && finalUpdatedData?.city?.length === 1)
      {
        originalCityRef.current = finalUpdatedData.city;
      }
    }

    // Case 2: Not on address section but updatedData has address with city
    if(sectionName !== 'address' && finalUpdatedData?.address) {
      // If city is empty - use originalCityRef
      if(originalCityRef.current && (!finalUpdatedData?.address?.city || (Array.isArray(finalUpdatedData?.address?.city) && finalUpdatedData?.address?.city?.length === 0)))
      {
        finalUpdatedData = {
          ...finalUpdatedData,
          address: {
            ...finalUpdatedData.address,
            city: originalCityRef.current
          }
        };
      }
      // If city has multiple values, keep only the last one (single-select behavior)
      else if(Array.isArray(finalUpdatedData?.address?.city) && finalUpdatedData?.address?.city?.length > 1)
      {
        finalUpdatedData = {
          ...finalUpdatedData,
          address: {
            ...finalUpdatedData.address,
            city: [finalUpdatedData.address.city[finalUpdatedData.address.city.length - 1]]
          }
        };
        // Update originalCityRef to the new single value
        originalCityRef.current = finalUpdatedData.address.city;
      }
    }

    const hasChanged = JSON.stringify(sessionSectionData) !== JSON.stringify(finalUpdatedData);

    if (hasChanged) {
      let updatedFormData = { ...formData, [sectionName]: finalUpdatedData };
      setFormData(updatedFormData);
      persistData(updatedFormData, currentStep);
    }
  };

  const closeToast = () => setShowToast(false);

  //on click of draft button
  const onDraftLabelClick = async (data) => {
    const sectionName = currentFormConfig?.name || `section_${currentStep}`;

    const updatedFormData = ["multiChildForm", "documents"].includes(currentFormConfig?.type)
      ? { ...formData, ...data }
      : { ...formData, [sectionName]: data };

    setFormData(updatedFormData);
    persistData(updatedFormData, currentStep);

    await mutation.mutate(
      {
        url: `/public-service/v1/application/${schemaCode}`,
        headers: { "x-tenant-id": tenantId },
        method: queryStrings?.applicationNumber ? "PUT" : "POST",
        body: transformToApplicationPayload(updatedFormData, Updatedconfig, service, tenantId, config, workflowDetails, queryStrings?.applicationNumber, schemaCode?.queryStrings?.action),
        config: { enable: true },
      },
      {
        onSuccess: (data) => {
          setShowToast({message:"Application Drafted successfully", error: false});
          setFormData({...formData, response : data?.Application});
          const url = new URL(window.location.href);
          url.searchParams.set('applicationNumber', data?.Application?.applicationNumber);
          window.history.replaceState({}, '', url);
          setCurrentStep(currentStep + 1)
        },
        onError: () => {
          setShowToast({message:"Application Drafted is failed", error: false});
        },
      }
    );
  }

  if (moduleListLoading || workflowDetailsLoading || draftsLoading) return <Loader />;

  return (
    <React.Fragment>
      { steps && steps?.length > 1 && <Stepper
        customSteps={steps}
        currentStep={currentStep}
        onStepClick={onStepperClick}
        activeSteps={currentStep}
      />}
      
      <FormComposerV2
        key={`${currentStep}-${currentFormConfig?.name}`}
        heading={t(`${serviceCode}_HEADING`)}
        draftLabel={enableSaveAsDraftStep === currentStep && currentStep!== rawConfig?.length ? t(`${serviceCode}_SAVE`) : ""}
        onDraftLabelClick={onDraftLabelClick}
        label={currentStep === steps.length ? t(`${serviceCode}_SUBMIT`) : t(`${serviceCode}_NEXT`)}
        cardSubHeaderClassName="citizen-sub-header-style"
        config={[
          {
            ...currentFormConfig,
            body: currentFormConfig?.body?.filter((a) => !a.hideInEmployee),
          },
        ]}
        defaultValues={
          currentFormConfig?.type === "multiChildForm"
            ? { ...formData }
            : { ...formData[currentFormConfig?.name || `section_${currentStep}`] || {} }
        }
        onSubmit={onSubmit}
        fieldStyle={{ marginRight: 0 }}
        onFormValueChange={onFormValueChange}
        isDisabled={mutation.isLoading}
      />
      {showToast && (
        <Toast
          style={{ zIndex: "10000" }}
          type={showToast?.error ? "error" : "success"}
          label={t(showToast?.message)}
          onClose={closeToast}
          isDleteBtn={true}
        />
      )}
    </React.Fragment>
  );
};

export default DigitDemoComponent;