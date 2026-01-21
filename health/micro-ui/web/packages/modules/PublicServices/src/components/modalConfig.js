const configModal = (
    t,
    action,
    approvers,
    businessService,
    moduleCode,
    documentConfig = []
  ) => {
    const { action: actionString } = action;
    const prefix = `${moduleCode?.toUpperCase()}_${businessService.toUpperCase()}`;
    const currentModule = `${moduleCode?.toLowerCase()}.${businessService.toLowerCase()}`;
    const docData = documentConfig?.[0]?.actions;
  
    // If specific action not found, fallback to DEFAULT
    let docConfig = docData?.find((item) => item?.action === actionString) || 
                    docData?.find((item) => item?.action === "DEFAULT") || {};
  
    // Fetch whether field is mandatory
    const fetchIsMandatory = (field) => {
      if (!docConfig || Object.keys(docConfig).length === 0) {
        return false;
      }
      return !!docConfig?.[field]?.isMandatory;
    };
  
    // Fetch whether to show field
    const fetchIsShow = (field) => {
      if (!docConfig || Object.keys(docConfig).length === 0) {
        return ["assignee", "comments"].includes(field); // default show if config is missing
      }
      return !!docConfig?.[field]?.show;
    };

    // Create document field configurations
    const documentFields = (docConfig?.documents || []).map((doc, index) => ({
      type: "documentUploadAndDownload",
      label: t(`${doc.code}`),
      localePrefix: prefix,
      populators: {
        name: `document.${doc.name}` || `document_${index}`,
        allowedMaxSizeInMB: doc.maxSizeInMB || 5,
        maxFilesAllowed: doc.maxFilesAllowed || 2,
        allowedFileTypes: doc.allowedFileTypes,
        hintText: t(doc.hintText || "COMMON_DOC_UPLOAD_HINT"),
        showHintBelow: true,
        customClass: "upload-margin-bottom",
        errorMessage: t(doc.errorMessage || "COMMON_FILE_UPLOAD_CUSTOM_ERROR_MSG"),
        hideInForm: false,
        action: actionString,
        flow: "WORKFLOW"
      }
    }));
  
    // Final modal configuration return
    return {
      label: {
        heading: Digit.Utils.locale.getTransformedLocale(`WF_MODAL_HEADER_${businessService}_${action.action}`),
        submit: Digit.Utils.locale.getTransformedLocale(`WF_MODAL_SUBMIT_${businessService}_${action.action}`),
        cancel: "WF_MODAL_CANCEL",
      },
      form: [
        {
          body: [
            {
              label: " ",
              type: "checkbox",
              disable: false,
              isMandatory: false,
              populators: {
                name: "acceptTerms",
                title: "MUSTOR_APPROVAL_CHECKBOX",
                isMandatory: false,
                labelStyles: {},
                customLabelMarkup: true,
                hideInForm: !fetchIsShow("acceptTerms")
              }
            },
            {
              label: t("WF_MODAL_APPROVER"),
              type: "dropdown",
              isMandatory: fetchIsMandatory("assignee"),
              disable: false,
              key: "assignees",
              populators: {
                name: "assignee",
                optionsKey: "nameOfEmp",
                options: approvers,
                hideInForm: !fetchIsShow("assignee"),
                "optionsCustomStyle": {
                  "top": "2.3rem"
                }
              },
            },
            {
              label: t("WF_MODAL_COMMENTS"),
              type: "textarea",
              isMandatory: fetchIsMandatory("comments"),
              populators: {
                name: "comments",
                hideInForm: !fetchIsShow("comments"),
                validation: {
                  maxLength: {
                    value: 1024,
                    message: t("COMMON_COMMENT_LENGTH_EXCEEDED_1024")
                  }
                }
              },
            },
            ...documentFields,
          ]
        }
      ]
    };
  };
  
  export default configModal;
  