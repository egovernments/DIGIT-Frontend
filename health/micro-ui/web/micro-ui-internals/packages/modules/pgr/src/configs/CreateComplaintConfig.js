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
              inline: true,
              label: "CS_COMPLAINT_DETAILS_COMPLAINT_DATE",
              isMandatory: true,
              key: "ComplaintDate",
              type: "date", // Input type is date picker
              disable: false,
              preProcess : {
                updateDependent : ["populators.validation.max"]
              },
              populators: {
                name: "ComplaintDate",
                required: true,
                validation:{
                  max: "currentDate"
                },
                error: "CORE_COMMON_REQUIRED_ERRMSG"
              },
            },
            {
              type: "component",
              isMandatory: true,
              component: "PGRBoundaryComponent",
              key: "SelectedBoundary",
              label: "Boundary",
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
                  maxWidth : "37.5rem"
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
                error: "CORE_COMMON_REQUIRED_ERRMSG",
                validation: {
                  pattern: /^[A-Za-z]+$/i,
                  error: "CORE_COMMON_REQUIRED_ERRMSG"
                }
              },
            },
            {
              inline: true,
              label: "COMPLAINTS_COMPLAINANT_CONTACT_NUMBER",
              isMandatory: true,
              type: "number",
              disable: false,
              populators: {
                name: "ComplainantContactNumber",
                error: "CORE_COMMON_MOBILE_ERROR",
                componentInFront: "+91",
                validation: {
                  minLength: 10,
                  maxLength: 10,
                  min: 6000000000,
                  max: 9999999999
                }, // 10-digit phone number validation
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
                  pattern: /^[A-Za-z]+$/i,
                  error: "CORE_COMMON_APPLICANT_NAME_INVALID"
                }
              },
            },
            {
              inline: true,
              label: "COMPLAINTS_SUPERVISOR_CONTACT_NUMBER",
              isMandatory: false,
              type: "number",
              disable: false,
              populators: {
                name: "SupervisorContactNumber",
                error: "CORE_COMMON_MOBILE_ERROR",
                componentInFront: "+91",
                validation: {
                  minLength: 0,
                  min: 6000000000,
                  max: 9999999999,
                  error: "CORE_COMMON_MOBILE_ERROR",
                }, // 10-digit phone number validation
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
                  pattern: /^[1-9][0-9]{5}$/i,
                },
              },
            }
          ],
        }
      ],
    }
  ],
}
