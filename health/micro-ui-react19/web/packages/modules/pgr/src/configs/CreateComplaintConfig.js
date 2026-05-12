export const CreateComplaintConfig = {
  tenantId: Digit.ULBService.getCurrentTenantId(),
  moduleName: "RAINMAKER-PGR",
  CreateComplaintConfig : [
    {
      form: [
        {
          head: "CS_COMPLAINT_DETAILS_COMPLAINT_DETAILS",
          body: [
            {
              isMandatory: true,
              key: "SelectComplaintType",
              type: "dropdown",
              label: "CS_COMPLAINT_DETAILS_COMPLAINT_TYPE",
              disable: false,
              preProcess : {
                updateDependent : ["populators.options"]
              },
              populators: {
                name: "SelectComplaintType",
                optionsKey: "i18nKey",
                error: "CORE_COMMON_REQUIRED_ERRMSG",
              },
            },
            {
              type: "component",
              component: "DatePickerComponent",
              key: "ComplaintDate",
              label: "CS_COMPLAINT_DETAILS_COMPLAINT_DATE",
              isMandatory: true,
              disable: false,
              // withoutLabel: true,
              populators: {
                name: "ComplaintDate",
                validation: {
                  max: "currentDate"
                },
                error: "CORE_COMMON_REQUIRED_ERRMSG"
              },
            }
          ],
        },
        {
          head: "CS_COMPLAINT_BOUNDARY_DETAILS",
          body: [
            {
              type: "component",
              isMandatory: true,
              component: "BoundaryComponentWithCard",
              key: "SelectedBoundary",
              withoutLabel: true,
              populators: {
                name: "SelectedBoundary",
              },
            }
          ],
        },
        {
          head: "ES_CREATECOMPLAINT_PROVIDE_COMPLAINANT_DETAILS",
          body: [
            {
              isMandatory: true,
              type: "radio",
              key: "complaintUser",
              label: "ES_CREATECOMPLAINT_FOR",
              disable: false,
              populators: {
                name: "complaintUser",
                optionsKey: "name",
                styles : {
                  maxWidth : "18.5rem",
                  gap: "2.5rem",
                  flexDirection: "row"
                  },
                innerStyles: {
                  display: "flex",
                  gap: "2.5rem"
                },
                validation: {
                  required: true,
                },
                error: "CORE_COMMON_REQUIRED_ERRMSG",
                required: true,
                options: [
                  {
                    name: "MYSELF",
                    code: "MYSELF",
                  },
                  {
                    name: "ANOTHER_USER",
                    code: "ANOTHER_USER",
                  }
                ]
              },
            },
            {
              inline: true,
              label: "COMPLAINTS_COMPLAINANT_NAME",
              isMandatory: true,
              type: "text",
              key: "ComplainantName",
              disable: false,
              populators: {
                name: "ComplainantName",
                error: "CORE_COMMON_APPLICANT_NAME_INVALID",
                validation: {
                  required: true,
                  pattern: /^[\p{L}\p{M}](?:[\p{L}\p{M}\p{Nd}'’\-.\s,]{0,98}[\p{L}\p{M}\p{Nd}])?$/u,
                  error: "CORE_COMMON_APPLICANT_NAME_INVALID"
                }
              },
            },
            {
              inline: true,
              label: "COMPLAINTS_COMPLAINANT_CONTACT_NUMBER",
              isMandatory: true,
              type: "mobileNumber",
              disable: false,
              populators: {
                name: "ComplainantContactNumber",
                error: "CORE_COMMON_MOBILE_ERROR",
                hideSpan: true,
                maxLength: 10,
                validation: {
                  required: true,
                  pattern: /^[0-9]{10}$/,
                  validate: (value) => {
                    if (!value || value === "") return false; // Required field
                    return /^[0-9]{10}$/.test(value); // Must be exactly 10 digits
                  }
                }
              },
            },
            {
              inline: true,
              label: "COMPLAINTS_SUPERVISOR_NAME",
              isMandatory: false,
              type: "text",
              disable: false,
              populators: {
                name: "SupervisorName",
                error: "CORE_COMMON_APPLICANT_NAME_INVALID",
                validation: {
                  pattern: "^[A-Za-z ]+$",
                  error: "CORE_COMMON_APPLICANT_NAME_INVALID"
                }
              },
            },
            {
              inline: true,
              label: "COMPLAINTS_SUPERVISOR_CONTACT_NUMBER",
              isMandatory: false,
              type: "mobileNumber",
              disable: false,
              populators: {
                name: "SupervisorContactNumber",
                error: "CORE_COMMON_MOBILE_ERROR",
                hideSpan: true,
                maxLength: 10,
                validation: {
                  pattern: /^[0-9]{10}$/,
                  validate: (value) => {
                    if (!value || value === "") return true; // Allow empty since not mandatory
                    return /^[0-9]{10}$/.test(value); // Must be exactly 10 digits if provided
                  }
                }
              },
            }
          ],
        },
        {
          head: "CS_COMPLAINT_DETAILS_ADDITIONAL_DETAILS",
          body: [
            {
              label: "CS_COMPLAINT_DETAILS_ADDITIONAL_DETAILS_DESCRIPTION",
              isMandatory: true,
              type: "textarea",
              key: "ComplaintDescription",
              populators: {
                name: "description",
                maxLength: 1000,
                validation: {
                  required: true,
                },
                error: "CORE_COMMON_REQUIRED_ERRMSG",
              },
            },
            {
              type: "component",
              isMandatory: false,
              component: "UploadFileComponent",
              key: "complaintFile",
              label: "CS_COMMON_COMPLAINT_FILE",
              populators: { name: "complaintFile" },
            },
          ],
        },
        {
          head: "CS_COMPLAINT_LOCATION_DETAILS",
          body: [
            {
              inline: true,
              label: "CS_COMPLAINT_DETAILS_ADDRESS_1_DETAILS",
              isMandatory: false,
              type: "text",
              key: "AddressOne",
              disable: false,
              populators: {
                name: "AddressOne",
                maxlength: 64,
              },
            },
            {
              inline: true,
              label: "CS_COMPLAINT_DETAILS_ADDRESS_2_DETAILS",
              isMandatory: false,
              type: "text",
              key: "AddressTwo",
              disable: false,
              populators: {
                name: "AddressTwo",
                maxlength: 64,
              },
            },
            {
              inline: true,
              label: "CS_COMPLAINT_LANDMARK__DETAILS",
              isMandatory: false,
              type: "text",
              disable: false,
              populators: {
                name: "landmark",
                maxlength: 64,
              },
            },
            {
              inline: true,
              label: "CS_COMPLAINT_POSTALCODE__DETAILS",
              isMandatory: false,
              type: "number",
              disable: false,
              populators: {
                name: "postalCode",
                maxlength: 6,
                validation: {
                  pattern: "^[1-9][0-9]{5}$",
                },
              },
            }
          ],
        }
      ],
    }
  ],
}
