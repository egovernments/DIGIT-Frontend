const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1; // Jan = 1, Dec = 12
const financialYearEnd = currentMonth > 3 ? currentYear : currentYear - 1; // FY starts in April

export const PropertyRegistrationConfig = (t, formData, isSubmitting, reassessmentProps = {}) => {
  const { isReassessMode, taxCalculation, existingAssessment, financialYear, assessmentId, importantDates, billingSlabs, isCitizen, termsAccepted, termsError, onTermsChange, allFormData, isUpdateMode, onStepClick } = reassessmentProps;

  return [
    // Step 1: Property Address
    {
      stepCount: 1,
      key: "property-address",
      message: isCitizen ? "PT_FORM1_HEADER_MESSAGE" : "PT_EMP_FORM1_HEADER_MESSAGE",
      body: [
        {
          isMandatory: true,
          key: "tenantId",
          type: "text",
          label: "CORE_COMMON_CITY",
          disable: true,
          populators: {
            name: "tenantId",
            error: "PT_ERR_REQUIRED",
          }
        },
        {
          isMandatory: false,
          key: "doorNo",
          type: "text",
          label: "PT_PROPERTY_DETAILS_DOOR_NUMBER",
          populators: {
            name: "doorNo",
            placeholder: "PT_PROPERTY_DETAILS_DOOR_NUMBER_PLACEHOLDER"
          }
        },
        {
          isMandatory: false,
          key: "buildingName",
          type: "text",
          label: "PT_PROPERTY_DETAILS_BUILDING_COLONY_NAME",
          populators: {
            name: "buildingName",
            placeholder: "PT_PROPERTY_DETAILS_BUILDING_COLONY_NAME_PLACEHOLDER"
          }
        },
        {
          isMandatory: false,
          key: "street",
          type: "text",
          label: "PT_PROPERTY_DETAILS_STREET_NAME",
          populators: {
            name: "street",
            placeholder: "PT_PROPERTY_DETAILS_STREET_NAME_PLACEHOLDER"
          }
        },
        {
          isMandatory: true,
          key: "locality",
          label: "PT_LOCALITY_MOHALLA",
          type: "apidropdown",
          disable: false,
          populators: {
            name: "locality",
            placeholder: "PT_COMMONS_SELECT_PLACEHOLDER",
            validation: { required: true },
            optionsKey: "name",
            allowMultiSelect: false,
            masterName: "commonUiConfig",
            moduleName: "PropertyRegistrationConfig",
            customfn: "populateLocalityOptions",
            style: {
              marginBottom: "0px",
            },
            optionsCustomStyle: {
              maxHeight: "8vmax"
            },
            error: "PT_ERR_REQUIRED",
          },
        },
        {
          isMandatory: false,
          key: "pincode",
          type: "text",
          label: "PT_PROPERTY_ADDRESS_PINCODE",
          populators: {
            name: "pincode",
            placeholder: "PT_PROPERTY_DETAILS_PINCODE_PLACEHOLDER",
            validation: {
              pattern: /[1-9][0-9]{5}/,
              error: "PT_PROPERTY_DETAILS_PINCODE_ERRORMSG"
            }
          }
        },
        // Employee-only field: Existing Property ID
        ...(isCitizen ? [] : [{
          isMandatory: false,
          key: "existingPropertyId",
          type: "text",
          label: "PT_PROPERTY_ADDRESS_EXISTING_PID",
          populators: {
            name: "existingPropertyId",
            placeholder: "PT_PROPERTY_ADDRESS_EXISTING_PID_PLACEHOLDER"
          }
        }]),
        {
          isMandatory: isCitizen ? false : true,
          key: "surveyId",
          type: "search",
          label: "PT_SURVEY_ID",
          populators: {
            name: "surveyId",
            placeholder: "Enter Survey Id/UID",
            validation: isCitizen ? {} : { required: true },
            error: isCitizen ? "" : "PT_ERR_REQUIRED",
            onIconSelection: (e) => {
              if (e?.preventDefault) e.preventDefault();
              e?.stopPropagation?.();
              setTimeout(() => {
                window.open("https://gis.punjab.gov.in/", "_blank", "noopener,noreferrer");
              }, 0);

              return false;
            }
          }
        },
        {
          isMandatory: true,
          key: "yearOfCreation",
          type: "dropdown",
          label: "PT_YEAR_OF_CREATION",
          populators: {
            name: "yearOfCreation",
            placeholder: "Select",
            validation: { required: true },
            optionsKey: "name",
            optionsCustomStyle: {
              maxHeight: "6vmax"
            },
            error: "PT_ERR_REQUIRED",
            options: Array.from(
              { length: financialYearEnd - 2013 + 1 },
              (_, i) => {
                const startYear = 2013 + i;
                const endYear = startYear + 1;
                const label = `${startYear}-${endYear.toString().slice(-2)}`;
                return { code: label, i18nKey: label, name: label };
              }
            )
          }
        }
      ]
    },

    // Step 2: Assessment Info
    {
      stepCount: 2,
      key: "assessment-info",
      name: "PT_ASSESMENT_INFO_SUB_HEADER",
      message: isCitizen ? "PT_FORM2_HEADER_MESSAGE" : "PT_EMP_FORM2_HEADER_MESSAGE",
      body: [
        {
          isMandatory: true,
          key: "propertyType",
          type: "apidropdown",
          label: "PT_ASSESMENT_INFO_TYPE_OF_BUILDING",
          disable: false,
          populators: {
            name: "propertyType",
            optionsKey: "name",
            error: "PT_ERR_REQUIRED",
            placeholder: "PT_COMMONS_SELECT_PLACEHOLDER",
            allowMultiSelect: false,
            masterName: "commonUiConfig",
            moduleName: "PropertyRegistrationConfig",
            customfn: "populatePropertyTypeOptions",
            validation: { required: true }
          }
        },
        {
          isMandatory: true,
          key: "usageCategory",
          type: "apidropdown",
          label: "PT_ASSESMENT_INFO_USAGE_TYPE",
          disable: false,
          populators: {
            name: "usageCategory",
            error: "PT_ERR_REQUIRED",
            optionsKey: "name",
            placeholder: "PT_COMMONS_SELECT_PLACEHOLDER",
            allowMultiSelect: false,
            masterName: "commonUiConfig",
            moduleName: "PropertyRegistrationConfig",
            customfn: "populateUsageCategoryOptions",
            validation: { required: true }
          }
        },
        {
          isMandatory: false,
          key: "vasikaNo",
          type: "text",
          label: "PT_COMMON_VASIKA_NO",
          populators: {
            name: "vasikaNo"
          }
        },
        {
          isMandatory: false,
          key: "vasikaDate",
          type: "date",
          label: "PT_COMMON_VASIKA_DATE",
          populators: {
            name: "vasikaDate"
          }
        },
        {
          isMandatory: false,
          key: "allotmentNo",
          type: "text",
          label: "PT_COMMON_ALLOTMENT_NO",
          populators: {
            name: "allotmentNo"
          }
        },
        {
          isMandatory: false,
          key: "allotmentDate",
          type: "date",
          label: "PT_COMMON_ALLOTMENT_DATE",
          populators: {
            name: "allotmentDate"
          }
        },
        {
          isMandatory: true,
          key: "businessName",
          type: "text",
          label: "PT_COMMON_BUSSINESS_NAME",
          populators: {
            name: "businessName",
            error: "PT_ERR_REQUIRED",
          }
        },
        {
          isMandatory: false,
          key: "remarks",
          type: "textarea",
          label: "PT_COMMON_REMARKS",
          populators: {
            name: "remarks"
          }
        },
        {
          inline: true,
          isMandatory: false,
          key: "inflammableMaterial",
          type: "checkbox",
          disable: false,
          withoutLabel: true,
          populators: {
            isLabelFirst: true,
            name: "inflammableMaterial",
            title: "PT_COMMON_INFLAMMABLE_MATERIAL_PROPERTY"
          }
        },
        {
          inline: true,
          isMandatory: false,
          key: "heightOfProperty",
          type: "checkbox",
          disable: false,
          withoutLabel: true,
          populators: {
            isLabelFirst: true,
            name: "heightOfProperty",
            title: "PT_COMMON_HEIGHT_OF_PROPERTY"
          }
        },
        {
          isMandatory: false,
          key: "conditionalFields",
          type: "component",
          component: "PTAssessmentDetails",
          withoutLabel: true,
          populators: {
            name: "conditionalFields",
            validation: {}
          },
          customProps: {
            isUpdateMode: isUpdateMode
          }
        },
      ]
    },

    // Step 3: Ownership Info
    {
      stepCount: 3,
      key: "ownership-info",
      name: "PT_OWNERSHIP_INFO_SUB_HEADER",
      message: isCitizen ? "PT_FORM3_HEADER_MESSAGE" : "PT_EMP_FORM3_HEADER_MESSAGE",
      body: [
        {
          isMandatory: true,
          key: "ownershipType",
          type: "apidropdown",
          label: "PT_FORM3_OWNERSHIP_TYPE",
          disable: isUpdateMode ? true : false, // Disable in update mode
          populators: {
            name: "ownershipType",
            optionsKey: "name",
            error: "PT_ERR_REQUIRED",
            placeholder: "PT_FORM3_OWNERSHIP_TYPE_PLACEHOLDER",
            allowMultiSelect: false,
            masterName: "commonUiConfig",
            moduleName: "PropertyRegistrationConfig",
            customfn: "populateOwnershipTypeOptions",
            validation: { required: true }
          }
        },
        {
          isMandatory: false,
          key: "ownershipDetails",
          type: "component",
          component: "PTOwnershipDetails",
          withoutLabel: true,
          customProps: {
            allFormData: allFormData || formData, // Pass entire formData to access property address
            isDisabled: isUpdateMode ? true : false // Disable in update mode
          },
          populators: {
            name: "ownershipDetails",
            validation: {}
          }
        }
      ]
    },

    // Step 4: Document Info
    {
      stepCount: 4,
      key: "document-info",
      name: "PT_DOCUMENT_INFO",
      head: "PT_REQUIRED_DOCUMENTS",
      subHead: "PT_REQUIRED_DOC_SUB_HEADING",
      body: [
        {
          isMandatory: false,
          key: "documents",
          type: "component",
          component: "PTDocumentUploadAssessmentForm",
          withoutLabel: true,
          populators: {
            name: "documents",
            validation: {}
          }
        },
      ]
    },

    // Step 5: Summary
    {
      stepCount: 5,
      key: "summary",
      name: "PT_COMMON_SUMMARY",
      head: "PT_APPLICATION_SUMMARY",
      message: isCitizen ? "PT_FORM1_HEADER_MESSAGE" : "PT_EMP_FORM5_HEADER_MESSAGE",
      body: [
        {
          type: "component",
          component: "PropertySummary",
          key: "propertySummary",
          withoutLabel: true,
          populators: {
            name: "summary"
          },
          customProps: {
            sessionData: allFormData || formData, // Use allFormData (all steps) instead of formData (current step only)
            isReassessMode: isReassessMode || false,
            taxCalculation: taxCalculation || null,
            existingAssessment: existingAssessment || null,
            financialYear: financialYear || "",
            assessmentId: assessmentId || "",
            importantDates: importantDates || null,
            billingSlabs: billingSlabs || [],
            onStepClick: onStepClick // Pass onStepClick to PropertySummary
          }
        },
        // Citizen-specific declaration component
        ...(isCitizen ? [{
          type: "component",
          component: "Declaration",
          key: "declaration",
          withoutLabel: true,
          populators: {
            name: "declaration"
          },
          customProps: {
            termsAccepted: termsAccepted || false,
            onTermsChange: onTermsChange,
            error: termsError || null
          }
        }] : [])
      ]
    }
  ];
};
