/**
 * CreateComplaintForm - Form screen for employee to submit a PGR complaint
 *
 * Purpose:
 * Renders the form for entering complaint details and submitting them.
 *
 * Functionalities:
 * - Uses FormComposerV2 to dynamically render the complaint form based on config
 * - Validates form inputs (e.g. complainant name)
 * - Handles form submission, constructs payload, and sends data to create complaint API
 * - Shows toast notifications for success or failure
 * - Navigates to complaint response screen after submission
 */

import { FormComposerV2, Toast } from "@egovernments/digit-ui-components";
import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { formPayloadToCreateComplaint } from "../../../utils";

const CreateComplaintForm = ({
  createComplaintConfig,      // Form configuration for Create Complaint screen
  sessionFormData,            // Cached form data from session (used only for defaultValues)
  tenantId,                   // Current tenant ID
  preProcessData              // Any preprocessing logic for form config or data
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [toast, setToast] = useState({ show: false, label: "", type: "" }); // Toast UI state
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state to prevent multiple clicks
  const [complaintUserCode, setComplaintUserCode] = useState(null); // Track complaint user selection
  const [prevSelectedUser, setPrevSelectedUser] = useState(null); // Track previous user selection

  const user = Digit.UserService.getUser();

  // Get state tenant ID for localization
  const stateTenantId = Digit.ULBService.getStateId();

  // Get current language for localization
  const language = Digit.StoreData.getCurrentLanguage();

  // Get selected hierarchy from session storage
  const [selectedHierarchy, setSelectedHierarchy] = useState(
    Digit.SessionStorage.get("HIERARCHY_TYPE_SELECTED") || null
  );

  // Construct module code for localization fetch
  const moduleCode = selectedHierarchy
    ? [`boundary-${selectedHierarchy?.hierarchyType?.toLowerCase()}`]
    : [];

  // Fetch localization data for the selected hierarchy
  // This loads boundary localizations from the module: hcm-boundary-{hierarchyType}
  const { isLoading: isLocalizationLoading } = Digit.Services.useStore({
    stateCode: stateTenantId,
    moduleCode,
    language,
    modulePrefix: "hcm",
    config: { enabled: !!selectedHierarchy && moduleCode.length > 0 },
  });

  // Hook for creating a complaint
  const { mutate: CreateComplaintMutation } = Digit.Hooks.pgr.useCreateComplaint(tenantId);

  // Fetch the list of service definitions (e.g., complaint types) for current tenant
  const serviceDefs = Digit.Hooks.pgr.useServiceDefs(tenantId, "PGR");
  // Auto-close toast after 3 seconds
  useEffect(() => {
    if (toast?.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, label: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast?.show]);

  // Validate phone number based on config
  const validatePhoneNumber = (value, config) => {
    const { minLength, maxLength, min, max, pattern } = config?.populators?.validation || {};
    const stringValue = String(value || "");

    // Check if value contains invalid characters like 'e', 'E', '+', '-'
    if (/[eE+\-]/.test(stringValue)) {
      return false;
    }

    // Check pattern if provided
    if (pattern && !stringValue.match(new RegExp(pattern))) {
      return false;
    }


    // Check if value contains invalid characters like 'e', 'E', '+', '-'
    if (/[eE+\-]/.test(stringValue)) {
      return false;
    }

    // Check pattern if provided
    if (pattern && !stringValue.match(new RegExp(pattern))) {
      return false;
    }

    if (
      (minLength && stringValue.length < minLength) ||
      (maxLength && stringValue.length > maxLength) ||
      (min && Number(value) < min) ||
      (max && Number(value) > max)
    ) {
      return false;
    }
    return true;
  };

  // Determine which fields should be disabled based on complaintUser code
  const disabledFields = useMemo(() => {
    if (complaintUserCode === "MYSELF") {
      return {
        ComplainantName: true,
        ComplainantContactNumber: true,
      };
    }
    return {
      ComplainantName: false,
      ComplainantContactNumber: false,
    };
  }, [complaintUserCode]);

  const updatedConfig = useMemo(() => {
    const baseConfig = Digit.Utils.preProcessMDMSConfig(
      t,
      createComplaintConfig,
      {
        updateDependent: [
          {
            key: "SelectComplaintType",
            value: [serviceDefs ? serviceDefs : []],
          },
          {
            key: "ComplaintDate",
            value: [new Date().toISOString().split("T")[0]],
          },
        ],
      }
    );

    // Update disable flags dynamically
    const updatedForm = baseConfig?.form?.map(section => {
      return {
        ...section,
        body: section.body.map(field => {
          if (
            field.populators?.name === "ComplainantName" ||
            field.populators?.name === "ComplainantContactNumber"
          ) {
            return {
              ...field,
              disable: disabledFields[field.populators.name],
            };
          }
          return field;
        }),
      };
    });

    return { ...baseConfig, form: updatedForm };
  }, [createComplaintConfig, serviceDefs, t, disabledFields]);

  const onFormValueChange = (setValue, formData, formState, reset, setError, clearErrors) => {
    const ComplainantName = formData?.ComplainantName;
    const selectedUser = formData?.complaintUser?.code;
    const ComplainantContactNumber = formData?.ComplainantContactNumber;

    // Update complaint user code if changed
    if (selectedUser !== complaintUserCode) {
      setComplaintUserCode(selectedUser);
    }

    // Validate name using pattern from config
    const nameFieldConfig = updatedConfig?.form?.flatMap(section => section?.body || [])
      .find(field => field?.populators?.name === "ComplainantName");
    const namePattern = nameFieldConfig?.populators?.validation?.pattern;

    if (ComplainantName && namePattern && !ComplainantName.match(new RegExp(namePattern))) {
      if (!formState.errors.ComplainantName) {
        setError("ComplainantName", {
          type: "custom",
          message: t("CORE_COMMON_APPLICANT_NAME_INVALID")
        }, { shouldFocus: false });
      }
    } else if (ComplainantName && formState.errors.ComplainantName) {
      clearErrors("ComplainantName");
    }

    // Validate mobile number
    const contactFieldConfig = updatedConfig?.form?.flatMap(section => section?.body || [])
      .find(field => field?.populators?.name === "ComplainantContactNumber");

    if (ComplainantContactNumber && !validatePhoneNumber(ComplainantContactNumber, contactFieldConfig)) {
      if (!formState.errors.ComplainantContactNumber) {
        setError("ComplainantContactNumber", {
          type: "custom",
          message: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID")
        }, { shouldFocus: false });
      }
    } else if (ComplainantContactNumber && formState.errors.ComplainantContactNumber) {
      clearErrors("ComplainantContactNumber");
    }

    // Early return if complaintUser hasn't changed
    if (selectedUser === prevSelectedUser) return;

    const updatedData = { ...formData };

    if (selectedUser === "MYSELF") {
      updatedData.ComplainantName = user?.info?.userName || "";
      updatedData.ComplainantContactNumber = user?.info?.mobileNumber || "";
    } else if (selectedUser === "ANOTHER_USER") {
      updatedData.ComplainantName = "";
      updatedData.ComplainantContactNumber = "";
    }

    // Set form values and update previous selected user
    setValue("ComplainantName", updatedData.ComplainantName);
    setValue("ComplainantContactNumber", updatedData.ComplainantContactNumber);
    setPrevSelectedUser(selectedUser);
  };

  const handleToastClose = () => {
    setToast({ show: false, label: "", type: "" });
  };

  /**
   * Handles form submission event
   */
  const onFormSubmit = (_data) => {
    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    const payload = formPayloadToCreateComplaint(_data, tenantId, user?.info);
    handleResponseForCreateComplaint(payload);
  };

  /**
   * Makes API call to create complaint and handles response
   */
  const handleResponseForCreateComplaint = async (payload) => {
    await CreateComplaintMutation(payload, {
      onError: async () => {
        setToast({ show: true, label: t("FAILED_TO_CREATE_COMPLAINT"), type: "error" });
        setIsSubmitting(false);
      },
      onSuccess: async (responseData) => {
        if (responseData?.ResponseInfo?.Errors) {
          setToast({ show: true, label: t("FAILED_TO_CREATE_COMPLAINT"), type: "error" });
          setIsSubmitting(false);
        } else {
          sendDataToResponsePage(
            "CS_COMMON_COMPLAINT_SUBMITTED",
            "CS_COMMON_TRACK_COMPLAINT_TEXT",
            "CS_PGR_COMPLAINT_NUMBER",
            responseData?.ServiceWrappers?.[0]?.service?.serviceRequestId
          );
        }
      },
    });
  };

  /**
   * Navigates user to response page with status of complaint submission
   */
  const sendDataToResponsePage = (message, description, info, responseId) => {
    history.push({
      pathname: `/${window?.contextPath}/employee/pgr/complaint-success`, // Redirect path
      state: {
        message,
        description,
        info,
        responseId,
      }
    });
  };


  return (
    <div className="pgr-create-complaint-form">
      <FormComposerV2
        onSubmit={onFormSubmit}
        defaultValues={sessionFormData}
        heading={t("")}
        config={updatedConfig?.form}
        className="custom-form-complaints"
        onFormValueChange={onFormValueChange}
        isDisabled={isSubmitting}
        label={t("CS_COMMON_SUBMIT")}
      />

      {/* Toast Notification for success/failure messages */}
      {toast?.show && (
        <Toast
          type={toast?.type}
          label={toast?.label}
          isDleteBtn={true}
          onClose={handleToastClose}
        />
      )}
    </div>
  );
};

export default CreateComplaintForm;
