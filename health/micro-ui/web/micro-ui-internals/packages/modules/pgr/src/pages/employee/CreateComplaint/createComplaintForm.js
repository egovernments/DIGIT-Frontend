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
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import { formPayloadToCreateComplaint } from "../../../utils";
import debounce from 'lodash/debounce';

const CreateComplaintForm = ({
  createComplaintConfig,      // Form configuration for Create Complaint screen
  sessionFormData,            // Cached form data from session (used for persistence)
  setSessionFormData,         // Setter for session form data
  clearSessionFormData,       // Clears form session data
  tenantId,                   // Current tenant ID
  preProcessData              // Any preprocessing logic for form config or data
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [toast, setToast] = useState({ show: false, label: "", type: "" }); // Toast UI state
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);          // Submit button state
  const [inputFormdata, setInputFormData] = useState([]);                   // Store submitted form data

  const user = Digit.UserService.getUser();

  // Hook for creating a complaint
  const { mutate: CreateWOMutation } = Digit.Hooks.pgr.useCreateComplaint(tenantId);

  // Auto-close toast after 3 seconds
  useEffect(() => {
    if (toast?.show) {
      setTimeout(() => {
        setToast({ show: false, label: "", type: "" });
      }, 3000);
    }
  }, [toast?.show]);

  /**
   * Handles input changes and validation in form fields
   */
  const onFormValueChange = (setValue, formData, formState, reset, setError, clearErrors) => {
    if (!_.isEqual(sessionFormData, formData)) {
      const ComplainantName = formData?.ComplainantName;

      // Validate ComplainantName field against name pattern
      if (ComplainantName && !ComplainantName.match(Digit.Utils.getPattern("Name"))) {
        if (!formState.errors.ComplainantName) {
          setError("ComplainantName", {
            type: "custom",
            message: t("CORE_COMMON_APPLICANT_NAME_INVALID")
          }, { shouldFocus: false });
        }
      } else if (formState.errors.ComplainantName) {
        clearErrors("ComplainantName");
      }

      // Save updated form data in session
      setSessionFormData({ ...sessionFormData, ...formData });
    }
  };

  const handleToastClose = () => {
    setToast({ show: false, label: "", type: "" });
  };

  /**
   * Handles form submission event
   */
  const onFormSubmit = (_data) => {
    console.log("onFormSubmit", _data);
    setInputFormData(_data);

    const payload = formPayloadToCreateComplaint(_data, tenantId, user?.info);
    handleResponseForCreateWO(payload);
  };

  /**
   * Makes API call to create complaint and handles response
   */
  const handleResponseForCreateWO = async (payload) => {
    setIsButtonDisabled(true);

    await CreateWOMutation(payload, {
      onError: async () => {
        setIsButtonDisabled(false);
        setToast({ show: true, label: t("FAILED_TO_CREATE_COMPLAINT"), type: "error" });
      },
      onSuccess: async (responseData) => {
        if (responseData?.ResponseInfo?.Errors) {
          setIsButtonDisabled(false);
          setToast({ show: true, label: t("FAILED_TO_CREATE_COMPLAINT"), type: "error" });
        } else {
          setIsButtonDisabled(false);
          sendDataToResponsePage(
            "CS_COMMON_COMPLAINT_SUBMITTED",
            "CS_COMMON_TRACK_COMPLAINT_TEXT",
            "CS_PGR_COMPLAINT_NUMBER",
            responseData?.ServiceWrappers?.[0]?.service?.serviceRequestId
          );
          clearSessionFormData();
        }
      },
    });
  };

  /**
   * Navigates user to response page with status of complaint submission
   */
  const sendDataToResponsePage = (message, description, info, responseId) => {
    history.push({
      pathname: `/${window?.contextPath}/employee/pgr/complaint-failed`, // Redirect path
      state: {
        message,
        description,
        info,
        responseId,
      }
    });
  };

  return (
    <React.Fragment>
      <FormComposerV2
        onSubmit={onFormSubmit}
        defaultValues={sessionFormData}
        heading={t("")}
        config={createComplaintConfig}
        className="custom-form"
        onFormValueChange={onFormValueChange}
        isDisabled={false}
        label={t("CORE_COMMON_SUBMIT")}
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
    </React.Fragment>
  );
};

export default CreateComplaintForm;
