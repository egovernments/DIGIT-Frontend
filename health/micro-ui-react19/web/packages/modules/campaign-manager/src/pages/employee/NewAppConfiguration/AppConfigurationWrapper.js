import React, { Fragment, useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { handleShowAddFieldPopup, initializeConfig, addField } from "./redux/remoteConfigSlice";
import { getFieldMaster } from "./redux/fieldMasterSlice";
import { getFieldPanelMaster } from "./redux/fieldPanelPropertiesSlice";
import { fetchLocalization, setLocalizationData, updateLocalizationEntry } from "./redux/localizationSlice";
import { Header } from "@egovernments/digit-ui-react-components";
import { Button, Dropdown, LabelFieldPair, Loader, PopUp, Tag, TextBlock, TextInput, Toast } from "@egovernments/digit-ui-components";
import IntermediateWrapper from "./IntermediateWrapper";
import { useCustomT, useCustomTranslate, useFieldDataLabel } from "./hooks/useCustomT";
import fullParentConfig from "./configs/fullParentConfig.json";
import { getPageFromConfig } from "./utils/configUtils";
import { getFieldTypeFromMasterData, getFieldTypeFromMasterData2, getFieldTypeOptionFromMasterData } from "./helpers";

// Helper function to check if a value is empty (null, undefined, empty string, or empty array)
const isValueEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
};

// Helper function to get localized value from localization data
const getLocalizedValue = (code, localizationData, currentLocale) => {
  if (!code || !localizationData || !Array.isArray(localizationData)) return "";
  const entry = localizationData.find((item) => item.code === code);
  if (!entry) return "";
  const locale = currentLocale || "en_IN";
  return entry[locale] || "";
};

// Helper function to check if localized value is empty
// Returns true if: code is missing/empty, entry doesn't exist, or localized value is empty
const isLocalizedValueEmpty = (code, localizationData, currentLocale) => {
  // If code itself is empty/missing, consider it as empty localization
  if (!code || (typeof code === "string" && !(code !== ""))) {
    return true;
  }
  const value = getLocalizedValue(code, localizationData, currentLocale);
  const isEmpty = isValueEmpty(value);
  return isEmpty;
};

const AppConfigurationWrapper = ({ flow = "REGISTRATION-DELIVERY", flowName, pageName = "beneficiaryLocation", campaignNumber }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const customTranslate = useCustomTranslate();
  const mdmsContext = window.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
  const MODULE_CONSTANTS = "HCM-ADMIN-CONSOLE";
  const dispatch = useDispatch();
  const sessionLocale = Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage;
  const searchParams = new URLSearchParams(location.search);
  const currentModule = searchParams.get("flow");

  // Generate unique localeModule based on flow, pageName, and campaignNumber
  // Format: hcm-{flow}-{pageName}-{campaignNumber}
  const localeModule = `hcm-${currentModule?.toLowerCase()?.replace(/_/g, "")}-${campaignNumber}`;
  const [newFieldType, setNewFieldType] = useState(null);
  const [isLoadingPageConfig, setIsLoadingPageConfig] = useState(true);
  const [pageConfigError, setPageConfigError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const previousLocaleModuleRef = useRef(null);

  // Redux selectors
  const { currentData, showAddFieldPopup, responseData, pageType } = useSelector((state) => state.remoteConfig);
  const { status: localizationStatus, data: localizationData, currentLocale } = useSelector((state) => state.localization);
  const { byName: fieldTypeMaster } = useSelector((state) => state.fieldTypeMaster);
  const { byName: panelProperties } = useSelector((state) => state.fieldPanelMaster);

  // Get panel configuration for validation
  const panelConfig = panelProperties?.drawerPanelConfig || {};

  // Validation function to check ALL fields for mandatory conditional field errors
  const checkAllFieldsValidation = useCallback(() => {
    const errors = [];
    const fieldTypeMasterData = fieldTypeMaster?.fieldTypeMappingConfig || [];

    // Helper function to recursively collect all fields from nested template structures
    const collectAllFields = (node, collectedFields = []) => {
      if (!node) return collectedFields;

      // Handle arrays
      if (Array.isArray(node)) {
        node.forEach((item) => collectAllFields(item, collectedFields));
        return collectedFields;
      }

      // Handle objects
      if (typeof node === "object") {
        // If this node looks like a field (has fieldName or format), add it
        if (node.fieldName || node.format) {
          collectedFields.push(node);
        }

        // Recursively search in child, children, primaryAction, secondaryAction
        if (node.child) collectAllFields(node.child, collectedFields);
        if (node.children) collectAllFields(node.children, collectedFields);
        if (node.primaryAction) collectAllFields(node.primaryAction, collectedFields);
        if (node.secondaryAction) collectAllFields(node.secondaryAction, collectedFields);

        // Also search in fields array (for cards)
        if (node.fields && Array.isArray(node.fields)) {
          node.fields.forEach((field) => collectAllFields(field, collectedFields));
        }
      }

      return collectedFields;
    };

    // Get all fields from currentData (including nested fields for templates)
    const allFields = [];
    const isTemplate = currentData?.type === "template";

    if (currentData?.body) {
      if (isTemplate) {
        // For templates, recursively collect all nested fields
        collectAllFields(currentData.body, allFields);
      } else {
        // For non-templates, use simple collection
        currentData.body.forEach((card) => {
          if (card?.fields) {
            card.fields.forEach((field) => {
              allFields.push(field);
            });
          }
        });
      }
    }
    if (currentData?.footer) {
      if (isTemplate) {
        collectAllFields(currentData.footer, allFields);
      } else {
        currentData.footer.forEach((field) => {
          allFields.push(field);
        });
      }
    }

    // Check each field against panel config
    allFields.forEach((field) => {

         // Skip validation for hidden fields
      if (field.hidden === true) {
        return; // Skip to next field in allFields.forEach
      }
      // Get the field type for this field
      const fieldType = getFieldTypeOptionFromMasterData(field, fieldTypeMasterData)?.type;

      // Check all tabs in panel config
      Object.keys(panelConfig).forEach((tabKey) => {
        const tabProperties = panelConfig[tabKey] || [];

        tabProperties.forEach((panelItem) => {
          // Check if this panel item is visible for this field type
          // First check if field type is in visibilityEnabledFor (or if no restrictions)
          const isFieldTypeVisible =
            !panelItem?.visibilityEnabledFor ||
            panelItem.visibilityEnabledFor.length === 0 ||
            panelItem.visibilityEnabledFor.includes(fieldType);

          // Field must be visible for this field type AND field must not be hidden
          const isVisible = isFieldTypeVisible && field.hidden !== true;
          if (!isVisible) {
            return;
          }          // Validation for mandatory localisable fields
          // Check if field has isMandatory: true and localized value is empty
          else {
            if (
              panelItem.isMandatory === true &&
              panelItem.fieldType === "text" &&
              panelItem.isLocalisable !== false
            ) {
              const bindTo = panelItem.bindTo;
              const fieldValue = field?.[bindTo];

              // Check if localized value is empty
              if (isLocalizedValueEmpty(fieldValue, localizationData, currentLocale)) {
                errors.push({
                  fieldLabel: field?.label || field?.fieldName || "Unknown Field",
                  panelLabel: panelItem.label,
                  message: `VALIDATION_MANDATORY_FIELD_LOCALIZED_EMPTY`,
                  messageParams: {
                    fieldName: customTranslate(field?.label || field?.fieldName || "Unknown Field"),
                    propertyName: t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem?.label}`))
                  },
                  tab: tabKey,
                });
              }
            }

            // Check toggle fields with isMandatory: true and conditionalField
            if (
              panelItem.fieldType === "toggle" &&
              panelItem.isMandatory === true &&
              Array.isArray(panelItem.conditionalField) &&
              panelItem.conditionalField.length > 0
            ) {
              const bindTo = panelItem.bindTo;
              const isHiddenField = bindTo === "hidden" || bindTo.includes(".hidden");

              // Get the current toggle value from the field
              let currentToggleValue = field?.[bindTo];
              // For hidden fields, the toggle value is inverted
              if (isHiddenField) {
                currentToggleValue = !currentToggleValue;
              }
              currentToggleValue = Boolean(currentToggleValue);

              // Get conditional fields that match the current toggle state
              const activeConditionalFields = panelItem.conditionalField.filter(
                (cField) => cField.condition === currentToggleValue
              );

              // If there are active conditional fields, check if at least one has a value
              if (activeConditionalFields.length > 0) {
                const hasAtLeastOneValue = activeConditionalFields.some((cField) => {
                  if (!cField.bindTo) return false;
                  const value = field?.[cField.bindTo];
                  return !isValueEmpty(value);
                });

                if (!hasAtLeastOneValue) {
                  // Get field labels for error message
                  const fieldLabels = activeConditionalFields
                    .map((cField) => cField.label || cField.bindTo)
                    .filter(Boolean)
                    .join(", ");

                  errors.push({
                    fieldLabel: field?.label || field?.fieldName || "Unknown Field",
                    panelLabel: panelItem.label,
                    message: `VALIDATION_MANDATORY_CONDITIONAL_FIELD_REQUIRED_${panelItem.label}`,
                    messageParams: { fields: fieldLabels },
                    tab: tabKey,
                  });
                }
              }
            }

            // Validation for toggle fields with showFieldOnToggle: true
            // Validates that when toggle is ON, conditional fields have proper values
            if (
              panelItem.fieldType === "toggle" &&
              panelItem.showFieldOnToggle === true &&
              Array.isArray(panelItem.conditionalField) &&
              panelItem.conditionalField.length > 0
            ) {
              const toggleBindTo = panelItem.bindTo;
              const fieldValue = field?.[toggleBindTo];

              // Determine if toggle is ON:
              // - Value is exactly true (boolean)
              // - Value is a truthy string
              // - Value is a truthy number (for cases like scanLimit where value might be a number)
              const isToggleOn = fieldValue === true ||
                (typeof fieldValue === "string" && fieldValue.trim() !== "") ||
                (typeof fieldValue === "number" && !isNaN(fieldValue));

              // Skip validation if toggle is OFF (false, undefined, null, empty string, 0)
              if (!isToggleOn && fieldValue !== 0) {
                // Toggle is OFF, no validation needed
              } else {
                // Toggle is ON - validate all conditional fields

                // Get conditional fields that appear when toggle is ON (condition: true or no condition specified)
                const activeConditionalFields = panelItem.conditionalField.filter(
                  (cField) => cField.condition === true || cField.condition === undefined
                );

                // Group conditional fields by their bindTo property
                const fieldsByBindTo = {};
                activeConditionalFields.forEach((cField) => {
                  if (!cField.bindTo) return;
                  if (!fieldsByBindTo[cField.bindTo]) {
                    fieldsByBindTo[cField.bindTo] = [];
                  }
                  fieldsByBindTo[cField.bindTo].push(cField);
                });

                // Validate each group of fields with the same bindTo
                Object.entries(fieldsByBindTo).forEach(([bindTo, fieldsGroup]) => {
                  const conditionalValue = field?.[bindTo];
                  const isMatchingBindTo = bindTo === toggleBindTo;

                  if (isMatchingBindTo) {
                    // Same bindTo as parent toggle - value should NOT be just boolean true
                    if (fieldValue === true) {
                      errors.push({
                        fieldLabel: field?.label || field?.fieldName || "Unknown Field",
                        panelLabel: panelItem.label,
                        message: `VALIDATION_TOGGLE_VALUE_REQUIRED`,
                        messageParams: {
                          fieldName: t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem.label}`)) || panelItem.label
                        },
                        tab: tabKey,
                      });
                    } else if (typeof fieldValue === "string" && fieldValue.trim() !== "") {
                      // Value exists - check if ANY field in the group allows non-localized values
                      const hasNonLocalisableField = fieldsGroup.some((f) => f.isLocalisable === false);

                      // If any field in the group is non-localisable, skip localization check
                      if (!hasNonLocalisableField) {
                        // All fields require localization - check if localized value exists
                        if (isLocalizedValueEmpty(fieldValue, localizationData, currentLocale)) {
                          errors.push({
                            fieldLabel: field?.label || field?.fieldName || "Unknown Field",
                            panelLabel: panelItem.label,
                            message: `VALIDATION_TOGGLE_LOCALIZED_VALUE_EMPTY`,
                            messageParams: {
                              fieldName: t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem.label}`)) || panelItem.label
                            },
                            tab: tabKey,
                          });
                        }
                      }
                    }
                  } else {
                    // Different bindTo than parent toggle - validate conditional field has value
                    if (isValueEmpty(conditionalValue)) {
                      errors.push({
                        fieldLabel: field?.label || field?.fieldName || "Unknown Field",
                        panelLabel: panelItem.label,
                        message: `VALIDATION_CONDITIONAL_FIELD_REQUIRED`,
                        messageParams: {
                          toggleName: t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem.label}`)) || panelItem.label,
                          fieldName: fieldsGroup.map((f) => t(f.label) || f.bindTo).join(" / ")
                        },
                        tab: tabKey,
                      });
                    } else if (typeof conditionalValue === "string" && conditionalValue.trim() !== "" && panelItem.label !== "isMdms") {
                      // Value exists - check if ANY field in the group allows non-localized values
                      const hasNonLocalisableField = fieldsGroup.some((f) => f.isLocalisable === false);

                      // If any field in the group is non-localisable, skip localization check
                      if (!hasNonLocalisableField) {
                        // All fields require localization - check if localized value exists
                        if (isLocalizedValueEmpty(conditionalValue, localizationData, currentLocale)) {
                          errors.push({
                            fieldLabel: field?.label || field?.fieldName || "Unknown Field",
                            panelLabel: panelItem.label,
                            message: `VALIDATION_CONDITIONAL_FIELD_LOCALIZED_EMPTY`,
                            messageParams: {
                              toggleName: t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem.label}`)) || panelItem.label,
                              fieldName: fieldsGroup.map((f) => t(f.label) || f.bindTo).join(" / ")
                            },
                            tab: tabKey,
                          });
                        }
                      }
                    }
                  }
                });
              }
            }

            // Validation for labelPairList fields - at least one field must be selected
            if (panelItem.fieldType === "labelPairList") {
              const labelPairData = field?.data;

              // Check if data is empty, undefined, null, or an empty array
              if (!labelPairData || !Array.isArray(labelPairData) || labelPairData.length === 0 && !field.hidden) {
                errors.push({
                  fieldLabel: field?.label || field?.fieldName || "Unknown Field",
                  panelLabel: panelItem.label,
                  message: "AT_LEAST_ONE_FIELD_MUST_BE_SELECTED",
                  tab: tabKey,
                });
              }
            }

            // Validation for group fields with validationExpression (min/max, minLength/maxLength range checks)
            if (panelItem.fieldType === "group" && panelItem.validationExpression && panelItem.validationMessage) {
              // Parse the validation expression to get the field paths
              // Examples: "lengthRange.minLength <= lengthRange.maxLength", "range.min <= range.max"
              // Supports various spacing: "a<=b", "a <= b", "a  <=  b"
              const expression = panelItem.validationExpression;
              const match = expression.match(/^([\w.]+)\s*(<=|>=|<|>|==|!=)\s*([\w.]+)$/);

              if (match) {
                const [, leftPath, operator, rightPath] = match;

                // Get values from field using the paths
                const getNestedValue = (obj, path) => {
                  return path.split('.').reduce((current, key) => current?.[key], obj);
                };

                const leftValue = getNestedValue(field, leftPath);
                const rightValue = getNestedValue(field, rightPath);

                // Only validate if both values are defined (not null/undefined)
                // This allows users to leave fields empty
                if (leftValue !== null && leftValue !== undefined && leftValue !== "" &&
                    rightValue !== null && rightValue !== undefined && rightValue !== "") {
                  const leftNum = Number(leftValue);
                  const rightNum = Number(rightValue);

                  // Check if both are valid numbers
                  if (!isNaN(leftNum) && !isNaN(rightNum)) {
                    let isValid = false;

                    switch (operator) {
                      case "<=":
                        isValid = leftNum <= rightNum;
                        break;
                      case ">=":
                        isValid = leftNum >= rightNum;
                        break;
                      case "<":
                        isValid = leftNum < rightNum;
                        break;
                      case ">":
                        isValid = leftNum > rightNum;
                        break;
                      default:
                        isValid = true;
                    }

                    if (!isValid) {
                      errors.push({
                        fieldLabel: field?.label || field?.fieldName || "Unknown Field",
                        panelLabel: panelItem.label,
                        message: panelItem.validationMessage,
                        messageParams: {
                          fieldName: customTranslate(field?.label || field?.fieldName || "Unknown Field"),
                          propertyName: t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem?.label}`))
                        },
                        tab: tabKey,
                      });
                    }
                  }
                }
              }
            }

            // Special validation for isMdms toggle field
            // Check if isMdms is enabled and validate schemaCode or dropDownOptions accordingly
            if (panelItem.bindTo === "isMdms" && panelItem.fieldType === "toggle") {
              const isMdmsEnabled = field?.isMdms === true;

              if (isMdmsEnabled) {
                // When isMdms is ON, schemaCode must be selected
                if (isValueEmpty(field?.schemaCode)) {
                  errors.push({
                    fieldLabel: field?.label || field?.fieldName || "Unknown Field",
                    panelLabel: panelItem.label,
                    message: "VALIDATION_SCHEMA_CODE_REQUIRED",
                    messageParams: {
                      fieldName: customTranslate(field?.label || field?.fieldName)
                    },
                    tab: tabKey,
                  });
                }
              } else {
                // When isMdms is OFF, dropDownOptions must be present and valid
                const dropDownOptions = field?.dropDownOptions;

                if (isValueEmpty(dropDownOptions)) {
                  // dropDownOptions is null, undefined, or empty array
                  errors.push({
                    fieldLabel: field?.label || field?.fieldName || "Unknown Field",
                    panelLabel: panelItem.label,
                    message: "VALIDATION_DROPDOWN_OPTIONS_REQUIRED",
                    messageParams: {
                      fieldName: customTranslate(field?.label || field?.fieldName)
                    },
                    tab: tabKey,
                  });
                } else if (Array.isArray(dropDownOptions)) {
                  // Check if any option has empty name (localization code)
                  const hasEmptyName = dropDownOptions.some(
                    (option) => !option?.name || (typeof option.name === "string" && option.name.trim() === "")
                  );

                  if (hasEmptyName) {
                    errors.push({
                      fieldLabel: field?.label || field?.fieldName || "Unknown Field",
                      panelLabel: panelItem.label,
                      message: "VALIDATION_DROPDOWN_OPTION_NAME_REQUIRED",
                      messageParams: {
                        fieldName: customTranslate(field?.label || field?.fieldName)
                      },
                      tab: tabKey,
                    });
                  } else {
                    // Check if any option has empty/missing name code or empty localized value
                    const hasEmptyLocalizedName = dropDownOptions.some(
                      (option) => isLocalizedValueEmpty(option?.name, localizationData, currentLocale)
                    );

                    if (hasEmptyLocalizedName) {
                      errors.push({
                        fieldLabel: field?.label || field?.fieldName || "Unknown Field",
                        panelLabel: panelItem.label,
                        message: "VALIDATION_DROPDOWN_OPTION_LABEL_EMPTY",
                        messageParams: {
                          fieldName: customTranslate(field?.label || field?.fieldName)
                        },
                        tab: tabKey,
                      });
                    }
                  }
                }
              }
            }

            // Validation for prefixText - max 5 characters
            if (panelItem.bindTo === "prefixText") {
              const maxPrefixLength = 5;
              if (field?.prefixText && typeof field.prefixText === "string" && field.prefixText.length > maxPrefixLength) {
                errors.push({
                  fieldLabel: field?.label || field?.fieldName || "Unknown Field",
                  panelLabel: panelItem.label,
                  message: "VALIDATION_PREFIX_TEXT_MAX_LENGTH",
                  messageParams: {
                    fieldName: customTranslate(field?.label || field?.fieldName),
                    maxLength: maxPrefixLength
                  },
                  tab: tabKey,
                });
              }
            }

            // Validation for suffixText - max 5 characters
            if (panelItem.bindTo === "suffixText") {
              const maxSuffixLength = 5;
              if (field?.suffixText && typeof field.suffixText === "string" && field.suffixText.length > maxSuffixLength) {
                errors.push({
                  fieldLabel: field?.label || field?.fieldName || "Unknown Field",
                  panelLabel: panelItem.label,
                  message: "VALIDATION_SUFFIX_TEXT_MAX_LENGTH",
                  messageParams: {
                    fieldName: customTranslate(field?.label || field?.fieldName),
                    maxLength: maxSuffixLength
                  },
                  tab: tabKey,
                });
              }
            }
          }
        });
      });

      // Validation for popup config fields
      const popupConfig = field?.properties?.popupConfig;
      if (popupConfig) {
        const fieldLabel = customTranslate(field?.label || field?.fieldName);

        // Validate popup title - check if localized value is empty
        if (popupConfig.title) {
          if (isLocalizedValueEmpty(popupConfig.title, localizationData, currentLocale)) {
            errors.push({
              fieldLabel: fieldLabel,
              message: "VALIDATION_POPUP_TITLE_EMPTY",
              messageParams: {
                fieldName: fieldLabel
              },
            });
          }
        }

        // Validate footer action labels - check if localized value is empty
        if (Array.isArray(popupConfig.footerActions)) {
          popupConfig.footerActions.forEach((footerAction, footerIndex) => {
            if (footerAction.label && isLocalizedValueEmpty(footerAction.label, localizationData, currentLocale)) {
              errors.push({
                fieldLabel: fieldLabel,
                message: "VALIDATION_POPUP_FOOTER_LABEL_EMPTY",
                messageParams: {
                  fieldName: fieldLabel,
                  index: footerIndex + 1
                },
              });
            }
          });
        }

        // Validate popup body fields
        const popupConfigBody = popupConfig.body;
        if (Array.isArray(popupConfigBody)) {
          const configurableFormats = ["dropdown", "dropdownTemplate", "select", "selectionCard", "radioList", "table", "labelPairList"];

          popupConfigBody.forEach((popupField, popupIndex) => {
            const popupFieldLabel = popupField?.label || popupField?.fieldName || `Popup Field ${popupIndex + 1}`;

            // Check if body item label localized value is empty
            if (popupField.label && isLocalizedValueEmpty(popupField.label, localizationData, currentLocale)) {
              errors.push({
                fieldLabel: fieldLabel,
                popupFieldLabel: popupFieldLabel,
                message: "VALIDATION_POPUP_BODY_LABEL_EMPTY",
                messageParams: {
                  fieldName: fieldLabel,
                  popupField: popupFieldLabel
                },
              });
            }

            // Only validate configurable formats for options/data
            if (!popupField?.format || !configurableFormats.includes(popupField.format)) {
              return;
            }

            const isMdmsEnabled = popupField?.isMdms === true;

            if (isMdmsEnabled) {
              // When isMdms is ON, schemaCode must be selected
              if (isValueEmpty(popupField?.schemaCode)) {
                errors.push({
                  fieldLabel: fieldLabel,
                  popupFieldLabel: popupFieldLabel,
                  message: "VALIDATION_POPUP_SCHEMA_CODE_REQUIRED",
                  messageParams: {
                    fieldName: fieldLabel,
                    popupField: popupFieldLabel
                  },
                });
              }
            } else {
              // When isMdms is OFF, check for valid static options
              // For dropdown/dropdownTemplate/select/selectionCard - check enums or dropDownOptions
              if (["dropdown", "dropdownTemplate", "select", "selectionCard"].includes(popupField.format)) {
                // Check if enums is a dynamic function string (e.g., "{{fn:getUniqueComplaintTypes(contextData)}}")
                // If so, skip validation as options are populated at runtime
                const isDynamicEnums = popupField?.enums && typeof popupField.enums === "string";

                if (!isDynamicEnums) {
                  const hasValidEnums = popupField?.enums && Array.isArray(popupField.enums) && popupField.enums.length > 0;
                  const hasValidDropdownOptions = popupField?.dropDownOptions && Array.isArray(popupField.dropDownOptions) && popupField.dropDownOptions.length > 0;
                  const hasValidSchemaCode = popupField?.schemaCode && typeof popupField.schemaCode === "string" && popupField.schemaCode.trim().length > 0;

                  if (!hasValidEnums && !hasValidDropdownOptions && !hasValidSchemaCode) {
                    errors.push({
                      fieldLabel: fieldLabel,
                      popupFieldLabel: popupFieldLabel,
                      message: "VALIDATION_POPUP_DROPDOWN_OPTIONS_REQUIRED",
                      messageParams: {
                        fieldName: fieldLabel,
                        popupField: popupFieldLabel
                      },
                    });
                  } else if (hasValidEnums) {
                    // Check if any active enum has empty/missing name code or empty localized value
                    const hasEmptyLocalizedName = popupField.enums.some(
                      (option) => option?.isActive !== false && isLocalizedValueEmpty(option?.name, localizationData, currentLocale)
                    );

                    if (hasEmptyLocalizedName) {
                      errors.push({
                        fieldLabel: fieldLabel,
                        popupFieldLabel: popupFieldLabel,
                        message: "VALIDATION_POPUP_OPTION_LOCALIZED_VALUE_EMPTY",
                        messageParams: {
                          fieldName: fieldLabel,
                          popupField: popupFieldLabel
                        },
                      });
                    }
                  }
                }
              }

              // For radioList - check data array
              if (popupField.format === "radioList") {
                const hasValidData = popupField?.data && Array.isArray(popupField.data) && popupField.data.length > 0;

                if (!hasValidData) {
                  errors.push({
                    fieldLabel: fieldLabel,
                    popupFieldLabel: popupFieldLabel,
                    message: "VALIDATION_POPUP_RADIO_OPTIONS_REQUIRED",
                    messageParams: {
                      fieldName: fieldLabel,
                      popupField: popupFieldLabel
                    },
                  });
                } else {
                  // Check if any active radio option has empty/missing name code or empty localized value
                  const hasEmptyLocalizedName = popupField.data.some(
                    (option) => option?.isActive !== false && isLocalizedValueEmpty(option?.name, localizationData, currentLocale)
                  );

                  if (hasEmptyLocalizedName) {
                    errors.push({
                      fieldLabel: fieldLabel,
                      popupFieldLabel: popupFieldLabel,
                      message: "VALIDATION_POPUP_OPTION_LOCALIZED_VALUE_EMPTY",
                      messageParams: {
                        fieldName: fieldLabel,
                        popupField: popupFieldLabel
                      },
                    });
                  }
                }
              }

              // For table - check columns array and localized headers
              if (popupField.format === "table") {
                const columns = popupField?.data?.columns;
                const hasValidColumns = columns && Array.isArray(columns) && columns.length > 0;

                if (!hasValidColumns) {
                  errors.push({
                    fieldLabel: fieldLabel,
                    popupFieldLabel: popupFieldLabel,
                    message: "VALIDATION_POPUP_TABLE_COLUMNS_REQUIRED",
                    messageParams: {
                      fieldName: fieldLabel,
                      popupField: popupFieldLabel
                    },
                  });
                } else {
                  // Check if any active column has empty/missing header code or empty localized header value
                  const hasEmptyLocalizedHeader = columns.some(
                    (column) => column?.isActive !== false && isLocalizedValueEmpty(column.header, localizationData, currentLocale)
                  );

                  if (hasEmptyLocalizedHeader) {
                    errors.push({
                      fieldLabel: fieldLabel,
                      popupFieldLabel: popupFieldLabel,
                      message: "VALIDATION_POPUP_TABLE_COLUMN_HEADER_EMPTY",
                      messageParams: {
                        fieldName: fieldLabel,
                        popupField: popupFieldLabel
                      },
                    });
                  }
                }
              }

              // For labelPairList - check if localized labels are empty
              if (popupField.format === "labelPairList") {
                const data = popupField?.data;

                if (Array.isArray(data) && data.length > 0) {
                  // Check if any active item has empty/missing key code or empty localized label value
                  const hasEmptyLocalizedLabel = data.some(
                    (item) => item?.isActive !== false && isLocalizedValueEmpty(item.key, localizationData, currentLocale)
                  );

                  if (hasEmptyLocalizedLabel) {
                    errors.push({
                      fieldLabel: fieldLabel,
                      popupFieldLabel: popupFieldLabel,
                      message: "VALIDATION_POPUP_LABEL_PAIR_VALUE_EMPTY",
                      messageParams: {
                        fieldName: fieldLabel,
                        popupField: popupFieldLabel
                      },
                    });
                  }
                }
              }
            }
          });
        }
      }

      // Additional validation for fields with direct table/labelPairList data structures
      // These are edited via drawer panel items with fieldType "table" or "labelPairList"
      const fieldLabel = field?.label || field?.fieldName || "Unknown Field";

      // Validate table columns (field.data.columns) - for fields that directly have table structure
      if (field?.data?.columns && Array.isArray(field.data.columns) && field.data.columns.length > 0) {
        const hasEmptyLocalizedHeader = field.data.columns.some(
          (column) => column?.isActive !== false && isLocalizedValueEmpty(column.header, localizationData, currentLocale)
        );

        if (hasEmptyLocalizedHeader) {
          errors.push({
            fieldLabel: fieldLabel,
            message: "VALIDATION_TABLE_COLUMN_HEADER_EMPTY",
            messageParams: {
              fieldName: fieldLabel
            },
          });
        }
      }

      // Validate labelPairList data (field.data with key property) - for fields that directly have labelPairList structure
      if (field?.data && Array.isArray(field.data) && field.data.length > 0) {
        // Check if this is a labelPairList structure (items have key property)
        const hasKeyProperty = field.data.some((item) => item?.key !== undefined);
        if (hasKeyProperty) {
          const hasEmptyLocalizedLabel = field.data.some(
            (item) => item?.isActive !== false && isLocalizedValueEmpty(item.key, localizationData, currentLocale)
          );

          if (hasEmptyLocalizedLabel) {
            errors.push({
              fieldLabel: fieldLabel,
              message: "VALIDATION_LABEL_PAIR_VALUE_EMPTY",
              messageParams: {
                fieldName: fieldLabel
              },
            });
          }
        }
      }
    });

    return errors;
  }, [currentData, panelConfig, fieldTypeMaster, localizationData, currentLocale]);

  // Expose validation function via window object (always available)
  useEffect(() => {
    window.__appConfig_hasValidationErrors = () => {
      const errors = checkAllFieldsValidation();
      return errors.length > 0 ? errors : null;
    };

    return () => {
      delete window.__appConfig_hasValidationErrors;
    };
  }, [checkAllFieldsValidation]);

  // Call hook at top level - always called, never conditionally
  const fieldDataLabel = useFieldDataLabel(newFieldType?.label);

  // Handle MDMS update when next button is clicked
  const handleUpdateMDMS = async () => {
    if (!responseData || !currentData) {
      console.error("Missing responseData or currentData for MDMS update");
      return;
    }

    try {
      setIsUpdating(true);

      // Transform and filter localization data to match API format
      // Allow empty string messages to be upserted (for cleared values)
      const transformedLocalizationData = localizationData
        .filter((item) => {
          const code = item?.code;
          const message = item?.[currentLocale];
          // Only require valid code; allow empty string messages
          return typeof code === "string" && code.trim() !== "" && typeof message === "string";
        })
        .map((item) => ({
          code: item.code,
          // Replace empty string messages with a space character (API may not accept empty strings)
          message: item[currentLocale] === "" ? " " : item[currentLocale],
          module: localeModule,
          locale: currentLocale,
        }));

      // Upsert localization data if there are valid entries
      if (transformedLocalizationData.length > 0) {
        try {
          await Digit.CustomService.getResponse({
            url: "/localization/messages/v1/_upsert",
            body: {
              tenantId: tenantId,
              messages: transformedLocalizationData,
            },
          });
        } catch (locError) {
          console.error("Error upserting localization:", locError);
          // Continue with MDMS update even if localization fails
        }
      }

      // Prepare the payload - use responseData structure but replace data with currentData
      const updatePayload = {
        Mdms: {
          id: responseData.id,
          tenantId: responseData.tenantId,
          schemaCode: responseData.schemaCode,
          uniqueIdentifier: responseData.uniqueIdentifier,
          data: currentData, // Replace with updated config
          isActive: responseData.isActive,
          auditDetails: responseData.auditDetails,
        },
      };

      // Make the update call
      const response = await Digit.CustomService.getResponse({
        url: `/${mdmsContext}/v2/_update/${MODULE_CONSTANTS}.TransformedFormConfig`,
        body: updatePayload,
      });

      // if (response) {
      // Show success message
      // setShowToast({ key: "success", label: "CONFIGURATION_UPDATED_SUCCESSFULLY" });
      // }
    } catch (error) {
      console.error("Error updating MDMS:", error);
      setShowToast({ key: "error", label: "CONFIGURATION_UPDATE_FAILED" });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle adding new field
  const handleAddNewField = () => {
    if (!newFieldType?.label || !newFieldType?.field) {
      return; // Validation: ensure required fields are present
    }

    // Create the new field object based on the selected field type - using fixed key 'fieldTypeMappingConfig'
    const selectedFieldType = fieldTypeMaster?.fieldTypeMappingConfig?.find((field) => field.type === newFieldType.field.type);

    const newFieldData = {
      type: newFieldType.field.type,
      format: newFieldType.field.format,
      label: newFieldType.label, // This should be the localization code
      required: false,
      active: true,
      order: (currentData?.body?.[0]?.fields?.length || 0) + 1,
      jsonPath: `field_${Date.now()}`,
      fieldName: `${newFieldType.fieldName}_${(currentData?.body?.[0]?.fields?.length || 0) + 1}`, // Generate a unique fieldName
      ...selectedFieldType?.metadata, // Include any metadata from field type
    };

    // Dispatch the addField action - using cardIndex 0 since there's only one card
    dispatch(
      addField({
        cardIndex: 0,
        fieldData: newFieldData,
      })
    );

    // Close the popup and reset state
    dispatch(handleShowAddFieldPopup(null));
    setNewFieldType(null);
  };
  useEffect(() => {
    const fetchPageConfig = async () => {
      try {
        setIsLoadingPageConfig(true);
        setPageConfigError(null);

        // Clean up page name - if it contains a dot, take only the part after the dot
        // e.g., "HOUSEHOLD.beneficiaryLocation" -> "beneficiaryLocation"
        const cleanedPageName = pageName?.includes(".") ? pageName.split(".").pop() : pageName;

        // Fetch page configuration from MDMS
        const response = await Digit.CustomService.getResponse({
          url: `/${mdmsContext}/v2/_search`,
          body: {
            MdmsCriteria: {
              tenantId: tenantId,
              schemaCode: `${MODULE_CONSTANTS}.TransformedFormConfig`,
              filters: {
                flow: flow,
                project: campaignNumber,
                page: cleanedPageName,
                module: currentModule,
              },
              limit: 1000,
              isActive: true,
            },
          },
        });

        if (response?.mdms && response.mdms.length > 0) {
          const pageConfig = response.mdms[0].data;
          const responseData = response.mdms[0]; // Store full MDMS response for updates
          // Initialize config with the fetched data
          dispatch(initializeConfig({ pageConfig, responseData }));
        } else {
          setPageConfigError(t("APP_CONFIG_NO_PAGE_CONFIG_FOUND"));
          console.error("No page configuration found for:", { flow, pageName, campaignNumber });
        }
      } catch (err) {
        console.error("Error fetching page config:", err);
        setPageConfigError(t("APP_CONFIG_FAILED_TO_FETCH_PAGE_CONFIG"));
      } finally {
        setIsLoadingPageConfig(false);
      }
    };

    if (flow && pageName && campaignNumber) {
      fetchPageConfig();
    }

    // Fetch field master if specified
    dispatch(
      getFieldMaster({
        tenantId,
        moduleName: MODULE_CONSTANTS,
        name: "FieldTypeMappingConfig",
        mdmsContext: mdmsContext,
        limit: 10000,
      })
    );

    // Fetch field panel master
    dispatch(
      getFieldPanelMaster({
        tenantId,
        moduleName: MODULE_CONSTANTS,
        name: "FieldPropertiesPanelConfig",
        mdmsContext: mdmsContext,
        limit: 10000,
      })
    );

    // Fetch localization data when localeModule changes
    if (localeModule && previousLocaleModuleRef.current !== localeModule) {
      previousLocaleModuleRef.current = localeModule;

      dispatch(
        fetchLocalization({
          tenantId,
          localeModule,
          currentLocale: sessionLocale,
        })
      );

      // Set localization context data
      dispatch(
        setLocalizationData({
          localisationData: localizationData,
          currentLocale: sessionLocale,
          localeModule,
        })
      );
    }
  }, [dispatch, flow, pageName, campaignNumber, localeModule, tenantId, mdmsContext, sessionLocale]);

  // Auto-close toast after 10 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Expose showToast function via window object for child components
  useEffect(() => {
    window.__appConfig_showToast = (toastData) => {
      setShowToast(toastData);
    };

    return () => {
      delete window.__appConfig_showToast;
    };
  }, []);

  if (isLoadingPageConfig || !currentData || (localeModule && localizationStatus === "loading") || isUpdating) {
    return <Loader />;
  }

  if (pageConfigError) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh", flexDirection: "column" }}>
        <h3 style={{ color: "#d32f2f" }}>{t("APP_CONFIG_ERROR_LOADING_CONFIGURATION")}</h3>
        <p>{pageConfigError}</p>
      </div>
    );
  }

  const handleFieldChange = (value) => {
    // Generate unique localization code: campaignNumber_flow_pageName_uuid
    const locVal = newFieldType?.label ? newFieldType?.label : `${campaignNumber}_${flow}_${pageName}_${crypto.randomUUID()}`.toUpperCase();

    dispatch(
      updateLocalizationEntry({
        code: locVal,
        locale: currentLocale || "en_IN",
        message: value,
      })
    );
    // Replace spaces with underscores and convert to lowercase
    const sanitizedValue = value?.replace(/\s+/g, '_')?.toLowerCase();
    const fieldName = `${sanitizedValue}_${campaignNumber}_${pageName}`.replaceAll(".", "_").toLowerCase();
    setNewFieldType((prev) => ({
      ...prev,
      label: locVal,
      fieldName: fieldName,
    }));
  };
  return (
    <React.Fragment>
      <IntermediateWrapper onNext={handleUpdateMDMS} isUpdating={isUpdating} pageType={currentData?.type} />
      {showAddFieldPopup && (
        <PopUp
          className="app-config-add-field-popup"
          type={"default"}
          heading={t("ADD_FIELD")}
          onOverlayClick={() => {
            dispatch(handleShowAddFieldPopup(null));
            setNewFieldType(null);
          }}
          onClose={() => {
            dispatch(handleShowAddFieldPopup(null));
            setNewFieldType(null);
          }}
          style={{
            height: "auto",
            width: "32rem",
          }}
        >
          <>
            <LabelFieldPair removeMargin={true}>
              <span style={{ fontWeight: "600", width: "33%" }}>
                {t("FIELD_LABEL")} <span style={{ color: "red" }}>*</span>
              </span>
              <TextInput
                name="fieldLabel"
                value={fieldDataLabel}
                placeholder={t("ENTER_FIELD_LABEL")}
                onChange={(event) => handleFieldChange(event.target.value)}
              />
            </LabelFieldPair>

            <LabelFieldPair removeMargin={true}>
              <span style={{ fontWeight: "600", width: "33%" }}>
                {t("FIELD_TYPE")} <span style={{ color: "red" }}>*</span>
              </span>
              <Dropdown
                className="app-config-pop-dropdown"
                option={(() => {
                  const filteredOptions = fieldTypeMaster?.fieldTypeMappingConfig?.filter((item) => {
                    // Always filter out dynamic types
                    if (item?.metadata?.type === "dynamic") return false;
                    // Filter out template types only for forms (pageType === "object")
                    if (pageType === "object" && item?.metadata?.type === "template") return false;
                    return true;
                  }) || [];

                  const basicOptions = filteredOptions.filter((item) => item?.category === "basic");
                  const advancedOptions = filteredOptions.filter((item) => item?.category === "advanced");

                  return [
                    {
                      name: t("FIELD_CATEGORY_BASIC"),
                      code: "basic",
                      options: basicOptions.map((item) => ({ ...item, name: item.type, code: t(`${item.category}.${item.type}`) })),
                    },
                    {
                      name: t("FIELD_CATEGORY_ADVANCED"),
                      code: "advanced",
                      options: advancedOptions.map((item) => ({ ...item, name: item.type, code: t(`${item.category}.${item.type}`) })),
                    },
                  ].filter((group) => group.options.length > 0);
                })()}
                optionKey="name"
                variant="nesteddropdown"
                selected={newFieldType?.field || null}
                select={(value) => {
                  // Update the newdata state with the selected value from the dropdown
                  const updatedData = { ...newFieldType, field: value };
                  setNewFieldType(updatedData);
                }}
                placeholder={t("SELECT_FIELD_TYPE")}
                t={t}
                isSearchable={true}
                optionCardStyles={{ maxHeight: "20vh" }}
              />
            </LabelFieldPair>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1rem" }}>
              <Button
                type="button"
                size="medium"
                variation="secondary"
                label={t("CANCEL")}
                title={t("CANCEL")}
                onClick={() => {
                  dispatch(handleShowAddFieldPopup(null));
                  setNewFieldType(null);
                }}
              />
              <Button
                type="button"
                size="medium"
                variation="primary"
                label={t("ADD")}
                title={t("ADD")}
                isDisabled={!newFieldType?.label || !newFieldType?.field}
                onClick={handleAddNewField}
                id={"save-add-field-popup"}
              />
            </div>
          </>
        </PopUp>
      )}
      {showToast && (
        <Toast type={showToast?.key === "error" ? "error" : "success"} label={t(showToast?.label)} onClose={() => setShowToast(null)} />
      )}
    </React.Fragment>
  );
};

export default AppConfigurationWrapper;