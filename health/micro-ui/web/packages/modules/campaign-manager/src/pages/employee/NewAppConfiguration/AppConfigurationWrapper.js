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
import { useFieldDataLabel } from "./hooks/useCustomT";
import fullParentConfig from "./configs/fullParentConfig.json";
import { getPageFromConfig } from "./utils/configUtils";
import { getFieldTypeFromMasterData2 } from "./helpers";

// Helper function to check if a value is empty (null, undefined, empty string, or empty array)
const isValueEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
};

const AppConfigurationWrapper = ({ flow = "REGISTRATION-DELIVERY", flowName, pageName = "beneficiaryLocation", campaignNumber }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const mdmsContext = window.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
  const MODULE_CONSTANTS = "HCM-ADMIN-CONSOLE";
  const dispatch = useDispatch();
  const currentLocale = Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage;
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
  const { status: localizationStatus, data: localizationData } = useSelector((state) => state.localization);
  const { byName: fieldTypeMaster } = useSelector((state) => state.fieldTypeMaster);
  const { byName: panelProperties } = useSelector((state) => state.fieldPanelMaster);

  // Get panel configuration for validation
  const panelConfig = panelProperties?.drawerPanelConfig || {};

  // Validation function to check ALL fields for mandatory conditional field errors
  const checkAllFieldsValidation = useCallback(() => {
    const errors = [];
    const fieldTypeMasterData = fieldTypeMaster?.fieldTypeMappingConfig || [];

    // Get all fields from currentData
    const allFields = [];
    if (currentData?.body) {
      currentData.body.forEach((card) => {
        if (card?.fields) {
          card.fields.forEach((field) => {
            allFields.push(field);
          });
        }
      });
    }
    if (currentData?.footer) {
      currentData.footer.forEach((field) => {
        allFields.push(field);
      });
    }

    // Check each field against panel config
    allFields.forEach((field) => {
      // Get the field type for this field
      const fieldType = getFieldTypeFromMasterData2(field, fieldTypeMasterData);

      // Check all tabs in panel config
      Object.keys(panelConfig).forEach((tabKey) => {
        const tabProperties = panelConfig[tabKey] || [];

        tabProperties.forEach((panelItem) => {
          // Check if this panel item is visible for this field type
          const isVisible =
            !panelItem?.visibilityEnabledFor ||
            panelItem.visibilityEnabledFor.length === 0 ||
            panelItem.visibilityEnabledFor.includes(fieldType);

          if (!isVisible) return;

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
                  message: "VALIDATION_MANDATORY_CONDITIONAL_FIELD_REQUIRED",
                  messageParams: { fields: fieldLabels },
                  tab: tabKey,
                });
              }
            }
          }
        });
      });
    });

    return errors;
  }, [currentData, panelConfig, fieldTypeMaster]);

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
      const transformedLocalizationData = localizationData
        .filter((item) => {
          const code = item?.code;
          const message = item?.[currentLocale];
          // Only accept string values for code and message
          return typeof code === "string" && code.trim() !== "" && typeof message === "string" && message !== "";
        })
        .map((item) => ({
          code: item.code,
          message: item[currentLocale],
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
          currentLocale,
        })
      );

      // Set localization context data
      dispatch(
        setLocalizationData({
          localisationData: localizationData,
          currentLocale,
          localeModule,
        })
      );
    }
  }, [dispatch, flow, pageName, campaignNumber, localeModule, tenantId, mdmsContext, currentLocale]);

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
                optionCardStyles={{maxHeight:"20vh"}}
              />
            </LabelFieldPair>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1rem" }}>
              <Button
                type="button"
                size="medium"
                variation="secondary"
                label={t("CANCEL")}
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
                isDisabled={!newFieldType?.label || !newFieldType?.field}
                onClick={handleAddNewField}
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
