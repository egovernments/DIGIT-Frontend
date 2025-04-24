import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { FormComposerV2, HeaderComponent, Toast } from "@egovernments/digit-ui-components";
import { newConfig } from "../../../configs/HRMSCreateConfig";
import { transformHRMSCreateData } from "../../../utils/createUtils";

const HRMSCreate = () => {
  // Get the current tenant ID from DIGIT's ULB Service
  const tenantId = Digit.ULBService.getCurrentTenantId();
  
  // State to manage toast notifications
  const [showToast, setShowToast] = useState(null);
  
  // Hook for handling translations
  const { t } = useTranslation();
  
  // React Router history for navigation
  const history = useHistory();
  
  // API request configuration for employee creation
  const reqCreate = {
    url: `/egov-hrms/employees/_create`, // API endpoint for creating an individual
    params: {},
    body: {},
    config: {
      enable: true, // Enables the API call
    },
  };

  // Custom hook for handling API mutation requests
  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);

  // Function to handle form submission
  const onSubmit = async (data) => {
    console.log(data, "data"); // Debug log of submitted form data

    await mutation.mutate(
      {
        url: `/egov-hrms/employees/_create`,
        params: { tenantId }, // Include tenant ID in API request
        body: transformHRMSCreateData(data), // Transform data before sending to API
        config: {
          enable: true,
        },
      },
      {
        // Handle success response
        onSuccess: (data) => {
          setShowToast({ key: "success", label: "Individual Created Successfully" });
        },
        // Handle error response
        onError: (error) => {
          setShowToast({ key: "error", label: "Individual Creation Failed" });
        },
      }
    );
  };

  return (
    <div>
      {/* Header component with translation support */}
      {/* <HeaderComponent className="digit-inbox-search-composer-header" styles={{ marginBottom: "1.5rem" }}>
          {t("CREATE_INDIVIDUAL")}
        </HeaderComponent> */}
      {/* Form component to create an individual */}
      <FormComposerV2
        label={t("SUBMIT_BUTTON")}
        config={newConfig.map((config) => ({
          ...config,
        }))}
        defaultValues={{}} // Default values for form fields
        onFormValueChange={(setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
          console.log(formData, "formData"); // Debug log when form values change
        }}
        onSubmit={(data) => onSubmit(data)} // Handle form submission
        fieldStyle={{ marginRight: 0 }}
      />

      {/* Display a toast notification for success or error messages */}
      {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          label={showToast.label}
          type={showToast.key}
          error={showToast.key === "error"}
          onClose={() => setShowToast(null)}
        />
      )}
    </div>
  );
};

export default HRMSCreate;
