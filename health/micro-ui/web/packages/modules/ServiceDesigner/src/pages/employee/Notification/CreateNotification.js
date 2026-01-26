import React from "react";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@egovernments/digit-ui-react-components";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader } from "@egovernments/digit-ui-react-components";
import { FieldV1, SVG, CustomSVG, Footer } from "@egovernments/digit-ui-components";
import { Toast } from "@egovernments/digit-ui-components";
import { CardHeader } from "@egovernments/digit-ui-react-components";
import { Button } from "@egovernments/digit-ui-components";
import { LabelFieldPair, HeaderComponent, Chip } from "@egovernments/digit-ui-components";
import generateNotifPayload from "../../../config/NotificationConfig";
import { useNotificationConfigAPI } from "../../../hooks/useNotificationConfigAPI";
import { useServiceConfigAPI } from "../../../hooks/useServiceConfigAPI";

const CreateNotification = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const roleModule = searchParams.get("module") || "Studio";
  const roleService = searchParams.get("service") || "Service";
  const Category = `${roleModule.toUpperCase()}_${roleService.toUpperCase()}`;
  const { type, data, isUpdate } = location.state || {};
  const workflowNodes = localStorage.getItem("canvasElements") !== "undefined" ? JSON.parse(localStorage.getItem("canvasElements")) : [];
  const [showToast, setShowToast] = useState(null);
  const MDMS_CONTEXT_PATH = window?.globalConfigs?.getConfig("MDMS_CONTEXT_PATH") || "egov-mdms-service";
  const navigate = useNavigate();

  // Use the new notification config API hook
  const { searchNotificationConfigs, saveNotificationConfig, updateNotificationConfig } = useNotificationConfigAPI();
  const { data: notificationConfigs, isLoading } = searchNotificationConfigs(roleModule, roleService);

  // Fetch service configuration for dynamic variables
  const { fetchServiceConfig } = useServiceConfigAPI();
  const { data: serviceConfig, isLoading: serviceConfigLoading } = fetchServiceConfig(roleModule, roleService);

  const [stateData, setStateData] = useState(isUpdate ? {
    title: data?.title,
    messageBody: data?.messageBody,
    subject: data?.subject,
    workflow: data?.workflow,
  }:{
    title: "",
    messageBody: "",
    subject: "",
    workflow: data?.workflow || [],
  }
);

  // Get char limit for notification - always use current limits based on type
  const getCharLimit = () => {
    if (type === "email") return 500;
    if (type === "sms") return 160;
    if (type === "push") return 90;
    return 160;
  };

  const charLimit = getCharLimit();

  // State for dynamic personalize variables
  const [selectedForm, setSelectedForm] = useState(null);
  const [showPersonalizeTooltip, setShowPersonalizeTooltip] = useState(false);

  const onDataChange = (e) => {
    if (e?.target) {
      const { name, value } = e.target;
      setStateData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    else {
      setStateData(prev => ({
        ...prev,
        workflow: e
      }));
    }
  }

  const generateNotificationPayload = (notificationData) => {
    return {
      module: roleModule,
      service: roleService,
      title: notificationData.title,
      messageBody: notificationData.messageBody,
      subject: notificationData.subject || "",
      type: type,
      additionalDetails: {
        workflow: notificationData.workflow || [],
        createdDate: Date.now(), // Add current timestamp in milliseconds
        category: Category,
        selectedForm: selectedForm // Save the selected form for future edits
      }
    };
  };

  const updateWorkflowNotificationReferencesInLocalStorage = (oldNotificationTitle, newNotificationTitle) => {
    try {
      let updated = false;
      const canvasElementsStr = localStorage.getItem("canvasElements");
      if (canvasElementsStr && canvasElementsStr !== "undefined") {
        const canvasElements = JSON.parse(canvasElementsStr);
        canvasElements.forEach(element => {
          if (element.sendnotif && Array.isArray(element.sendnotif)) {
            element.sendnotif.forEach(notif => {
              if (notif.code === oldNotificationTitle || notif.name === oldNotificationTitle) {
                notif.code = newNotificationTitle;
                notif.name = newNotificationTitle;
                updated = true;
              }
            });
          }
        });
        if (updated) {
          localStorage.setItem("canvasElements", JSON.stringify(canvasElements));
        }
      }
      return updated;
    } catch (error) {
      console.error("Failed to update workflow notification references in localStorage:", error);
      return false;
    }
  };

  const updateworkflowNodes = () => {
    const updated = workflowNodes?.map((node) => {
      const match = stateData.workflow?.find(w => w.name === node.name);
      if (match) {
        const alreadyExists = node.sendnotif.some(n => n.code === stateData.title && n.name === stateData.title);
        if (!alreadyExists) {
          node.sendnotif.push({ code: stateData.title, name: stateData.title });
        }
      }
      return node;
    });
    localStorage.setItem("canvasElements", JSON.stringify(updated));
  }

  const onSubmit = async (e) => {
    // Validate required fields
    if (stateData.title === "" || stateData.messageBody === "" || (type === "email" && stateData.subject === "")) {
      if (stateData.title === "") {
        setShowToast({ key: true, type: "error", label: t("TITLE_IS_REQUIRED") });
      } else if (stateData.messageBody === "") {
        setShowToast({ key: true, type: "error", label: t("MSG_BODY_IS_REQUIRED") });
      } else if (type === "email" && stateData.subject === "") {
        setShowToast({ key: true, type: "error", label: t("SUBJECT_IS_REQUIRED") });
      }
      return;
    }

    // Validate notification title for forward/backward slashes
    if (stateData.title.includes("/") || stateData.title.includes("\\")) {
      setShowToast({ key: true, type: "error", label: t("TITLE_CANNOT_CONTAIN_SLASHES") });
      return;
    }

    if (stateData.title != "" && stateData.messageBody != "") {
      try {
        if (isUpdate === false || isUpdate === "false") {
          // Check for duplicate title only when creating new notification
          const existingNotification = notificationConfigs?.find(notification => 
            notification.title === stateData.title && 
            notification.additionalDetails?.category?.toLowerCase() === Category?.toLowerCase()
          );
          
          if (existingNotification) {
            setShowToast({ key: true, type: "error", label: t("NOTIF_NAME_EXISTS") });
            return;
          }
          
          const notificationPayload = generateNotificationPayload(stateData);
          const response = await saveNotificationConfig.mutateAsync(notificationPayload);
          
          if (response?.mdms) {
            updateworkflowNodes();
            setShowToast({ key: true, type: "success", label: t("NOTIF_ADDED_SUCCESSFULLY") });
            setTimeout(() => {
              navigate(`/${window.contextPath}/employee/servicedesigner/notifications?module=${roleModule}&service=${roleService}`);
            }, 3000);
            return;
          } else {
            setShowToast({ key: true, type: "error", label: t("ERROR_OCCURED_DURING_NOTIF_CREATION") });
            setTimeout(() => {
              window.history.back();
            }, 3000);
          }
        } else {
          const notificationPayload = {
            ...generateNotificationPayload(stateData),
            originalTitle: data?.title // For update, we need the original title
          };
          const response = await updateNotificationConfig.mutateAsync(notificationPayload);

          if (response?.mdms) {
            // Update workflow notification references if title changed
            if (data?.title && data?.title !== stateData.title) {
              const updated = updateWorkflowNotificationReferencesInLocalStorage(
                data?.title,
                stateData.title
              );
            }

            // Note: updateworkflowNodes() should NOT be called here during update
            // as it would overwrite the localStorage with old data from workflowNodes constant

            setShowToast({ key: true, type: "success", label: t("NOTIFICATION_UPDATED_SUCCESSFULLY") });
            setTimeout(() => {
              window.history.back();
            }, 3000);
          } else {
            setShowToast({ key: true, type: "error", label: t("ERROR_OCCURED_DURING_UPDATION") });
            setTimeout(() => {
              window.history.back();
            }, 3000);
          }
        }
      } catch (error) {
        console.error("Notification operation failed:", error);
        setShowToast({ key: true, type: "error", label: t("ERROR_OCCURED_DURING_NOTIF_CREATION") });
        setTimeout(() => {
          window.history.back();
        }, 3000);
      }
    }
  }

  // Generate variables from uiforms
  const generateVariablesFromUiforms = useMemo(() => {
    if (!serviceConfig?.data?.uiforms) return [];

    const variables = [];
    
    serviceConfig.data.uiforms.forEach(form => {
      if (form.formConfig?.screens) {
        form.formConfig.screens.forEach(screen => {
          if (screen.cards) {
            screen.cards.forEach(card => {
              if (card.fields) {
                card.fields.forEach(field => {
                  // Skip document fields, inactive fields, and Area Selection fields
                  if (field.active &&
                      field.jsonPath &&
                      field.type !== 'documentUpload' &&
                      field.type !== 'documentUploadAndDownload' &&
                      field.label?.toLowerCase() !== 'area selection' &&
                      !field.label?.toLowerCase().includes('area selection')) {
                    
                    let path = "";
                    let sectionName = "";
                    
                    // Get section name from headerFields
                    if (card.headerFields && card.headerFields.length > 0) {
                      // Look for the screen heading field
                      const screenHeadingField = card.headerFields?.find(hf => 
                        hf.label === "SCREEN_HEADING" || hf.jsonPath === "ScreenHeading"
                      );
                      if (screenHeadingField && screenHeadingField.value) {
                        sectionName = screenHeadingField.value.replace(/\s+/g, '');
                      }
                    }
                    
                    // If no headerFields value, fallback to card.header
                    if (!sectionName) {
                      sectionName = card.header ? card.header.replace(/\s+/g, '') : "serviceDetails";
                    }
                    
                    // Determine the path based on field type/location
                    if (field.jsonPath.includes("Address")) {
                      // Address fields
                      path = `PublicService.address.${field.label.replace(/\s+/g, '')}`;
                    } else if (field.jsonPath.includes("Applicant")) {
                      // Applicant fields
                      path = `PublicService.applicants[0].${field.label.replace(/\s+/g, '')}`;
                    } else {
                      // Other service details fields
                      path = `PublicService.serviceDetails.${sectionName}.${field.label.replace(/\s+/g, '')}`;
                    }
                    
                    variables.push({
                      label: field.label || field.jsonPath,
                      path: path,
                      formName: form.formName
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
    
    return variables;
  }, [serviceConfig]);

  // Get form options for dropdown
  const formOptions = useMemo(() => {
    if (!serviceConfig?.data?.uiforms) return [];
    return serviceConfig.data.uiforms.map(form => ({
      code: form.formName,
      name: form.formName
    }));
  }, [serviceConfig]);

  useEffect(() => {
    if (formOptions.length > 0) {
      // If in update mode and we have a saved form, find it in formOptions
      if (isUpdate && data?.additionalDetails?.selectedForm) {
        const savedFormName = data.additionalDetails.selectedForm.name || data.additionalDetails.selectedForm;
        const matchingForm = formOptions.find(f => f.name === savedFormName);
        if (matchingForm) {
          setSelectedForm(matchingForm);
        } else {
          // If saved form not found, default to first form
          setSelectedForm(formOptions[0]);
        }
      } else if (!selectedForm) {
        // If not in update mode and no form selected, default to first form
        setSelectedForm(formOptions[0]);
      }
    }
  }, [formOptions, isUpdate]);

  // Filter variables based on selected form
  const filteredVariables = useMemo(() => {
    // If no form is selected, show all variables
    if (!selectedForm) {
      return generateVariablesFromUiforms;
    }
    // Filter by form name
    const filtered = generateVariablesFromUiforms.filter(variable => variable.formName === selectedForm?.name);
    return filtered;
  }, [selectedForm, generateVariablesFromUiforms]);

  const onTagClick = (e, variablePath) => {
    // Get the active textarea element
    const textarea = document.querySelector('textarea[name="messageBody"]');
    if (!textarea) return;

    // Get cursor position
    const cursorPos = textarea.selectionStart;
    const textBefore = stateData.messageBody.substring(0, cursorPos);
    const textAfter = stateData.messageBody.substring(cursorPos);

    // Insert variable at cursor position
    const variableToInsert = ` {${variablePath}} `;
    const newMessageBody = textBefore + variableToInsert + textAfter;

    // Check if new message body exceeds character limit
    if (newMessageBody.length > charLimit) {
      setShowToast({
        key: true,
        type: "error",
        label: t("CHAR_LIMIT_EXCEEDED") + ` (${charLimit})`
      });
      return;
    }

    setStateData(prev => ({
      ...prev,
      messageBody: newMessageBody
    }));

    // Set cursor position after the inserted variable
    setTimeout(() => {
      const newCursorPos = cursorPos + variableToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  }

  if (isLoading) {
    return <Loader />
  }
  return (
    <div>
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
         <div style={{ fontSize: "2rem",
         padding: "0 0 16px 4px",
            fontWeight: 700,
            color: "#0B4B66",
            fontFamily: "Roboto condensed" }}>{data?.header ? t(data.header) : t("EDIT") + " " + data?.title}</div> 
      </div>
      <FieldV1
        label={t("NOTIFICATION_TITLE")}
        onChange={(e) => onDataChange(e)}
        placeholder={t("ENTER_NOTIFICATION_TITLE")}
        populators={{
          name: "title",
          fieldPairClassName: "workflow-field-pair",
        }}
        props={{
          fieldStyle: { width: "100%" }
        }}
        required
        infoMessage={t("NOTIFICATION_TITLE_INFO")}
        type="text"
        value={stateData.title}
      />
      {type == "email" && <FieldV1
        label={t("NOTIFICATION_SUBJECT")}
        onChange={(e) => onDataChange(e)}
        placeholder={t("ENTER_SUBJECT")}
        populators={{
          name: "subject",
          fieldPairClassName: "workflow-field-pair",
        }}
        props={{
          fieldStyle: { width: "100%" }
        }}
        required
        infoMessage={t("NOTIFICATION_SUBJECT_INFO")}
        type="text"
        value={stateData.subject}
      />
      }
      <FieldV1
        label={t("NOTIFICATION_MSG_BODY")}
        onChange={(e) => onDataChange(e)}
        placeholder={t("ENTER_MESSAGE_BODY")}
        populators={{
          name: "messageBody",
          fieldPairClassName: "workflow-field-pair",
          validation: {
            maxlength: charLimit
          }
        }}
        props={{
          fieldStyle: { width: "100%" }
        }}
        required
        infoMessage={t("NOTIFICATION_MSG_INFO")}
        charCount={true}
        type="textarea"
        value={stateData.messageBody}
      />
      
      {/* Form Selection Dropdown - Using FieldV1 for consistent alignment */}
      {formOptions.length > 0 && (
        <FieldV1
          label={t("PERSONALIZATION_VARIABLES")}
          onChange={(e) => {
            const value = e?.target?.value || e;
            setSelectedForm(value);
          }}
          populators={{
            name: "selectedForm",
            options: formOptions,
            optionsKey: "name",
            fieldPairClassName: "workflow-field-pair",
          }}
          props={{
            fieldStyle: { width: "100%" }
          }}
          type="dropdown"
          infoMessage={t("PERSONALIZE_TITLE_INFO")}
          value={selectedForm}
        />
      )}

      {/* Variable Tags - Aligned with other fields */}
      <div style={{
        display: "flex",
        flexDirection: "row",
        marginBottom: "1.5rem",
        marginLeft: "26.4%",
      }}>
        {/* Empty label space to match FieldV1 alignment */}
        <div style={{ 
          width: "35%",
          minWidth: "35%",
          paddingRight: "16px",
          display: "none"
        }}></div>
        
        {/* Tags container */}
        <div style={{
          display: "flex",
          justifyContent: "flex-start",
          flexWrap: "wrap",
          gap: "0.5rem",
          width: "65%"
        }}>
          {serviceConfigLoading ? (
            <div style={{ fontSize: "12px", color: "#666" }}>{t("LOADING_VARIABLES")}</div>
          ) : filteredVariables.length > 0 ? (
            filteredVariables.map((variable, index) => (
              <Chip
                key={index}
                className="notifications-chip"
                hideClose={false}
                text={variable.label}
                isErrorTag={true}
                onTagClick={(e) => onTagClick(e, variable.path)}
                extraStyles={{
                  tagStyles: {
                    background: "lightgray",
                    padding: "4px 8px",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "1rem",
                    gap: "0.5rem",
                    cursor: "pointer",
                    fontSize: "12px"
                  }
                }}
              />
            ))
          ) : (
            <div style={{ fontSize: "12px", color: "#666" }}>
              {serviceConfig ? t("NO_VARIABLES_FOUND") : t("NO_SERVICE_CONFIG_FOUND")}
            </div>
          )}
        </div>
      </div>

      {showToast && (
        <Toast
          type={showToast?.type}
          label={t(showToast?.label)}
          onClose={() => {
            setShowToast(null);
          }}
          isDleteBtn={showToast?.isDleteBtn}
          style={{ zIndex: 99999 }}
        />
      )}
    </Card>
    <Footer
      actionFields={[<Button
      style={{ width: "18rem"}}
      variation="primary"
            label={t("SAVE")}
            type="button"
            className="primary-button"
      onClick={(e) => onSubmit(e)}
      
      />]}
      setactionFieldsToRight
    />
    </div>
  );
};

export default CreateNotification;